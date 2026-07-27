from typing import List, Dict, Any
import requests
import time
from ingestion.models import RawDocument
from ingestion.connectors.google_docs.mappers import map_file_to_document


class GoogleDocsBackfill:
    def __init__(self, access_token: str):
        self.token = access_token
        self.base = "https://www.googleapis.com"

    def _api(self, endpoint: str, params: Dict[str, Any] = None) -> Dict[str, Any]:
        headers = {"Authorization": f"Bearer {self.token}"}
        url = endpoint if endpoint.startswith("http://") or endpoint.startswith("https://") else f"{self.base}{endpoint}"
        resp = requests.get(url, headers=headers, params=params, timeout=30)
        if resp.status_code == 429:
            retry = int(resp.headers.get("Retry-After", 1))
            time.sleep(retry)
            return self._api(endpoint, params)
        resp.raise_for_status()
        return resp.json()

    def list_documents(self) -> List[Dict[str, Any]]:
        files = []
        page_token = None
        while True:
            params = {
                "q": "mimeType='application/vnd.google-apps.document' and trashed=false",
                "pageSize": 100,
                "fields": "nextPageToken,files(id,name,createdTime,modifiedTime,webViewLink,owners,mimeType)",
            }
            if page_token:
                params["pageToken"] = page_token

            resp = self._api("/drive/v3/files", params)
            files.extend(resp.get("files", []))
            page_token = resp.get("nextPageToken")
            if not page_token:
                break
        return files

    def fetch_document_text(self, doc_id: str) -> str:
        """Extract plain text from Google Docs API structured content."""
        doc = self._api(f"https://docs.googleapis.com/v1/documents/{doc_id}")
        body = doc.get("body", {}).get("content", [])
        paragraphs = []

        for elem in body:
            if "paragraph" in elem:
                para = elem["paragraph"]
                text = "".join(
                    e["textRun"].get("content", "")
                    for e in para.get("elements", [])
                    if "textRun" in e
                )
                if text.strip():
                    paragraphs.append(text.strip())
            elif "table" in elem:
                for row in elem["table"].get("tableRows", []):
                    for cell in row.get("tableCells", []):
                        for c in cell.get("content", []):
                            if "paragraph" in c:
                                txt = "".join(
                                    e["textRun"].get("content", "")
                                    for e in c["paragraph"].get("elements", [])
                                    if "textRun" in e
                                )
                                if txt.strip():
                                    paragraphs.append(txt.strip())

        return "\n".join(paragraphs)

    def backfill_workspace(self, workspace_id: str) -> List[RawDocument]:
        docs = []
        for f in self.list_documents():
            try:
                text = self.fetch_document_text(f["id"])
                doc = map_file_to_document(f, text, workspace_id)
                if doc:
                    docs.append(doc)
            except Exception as e:
                # Skip files we can't read (permissions, etc.)
                print(f"Skipping gdoc {f.get('id')}: {e}")
                continue
        return docs