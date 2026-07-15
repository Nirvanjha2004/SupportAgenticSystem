from typing import List, Dict, Any
import requests
import time
from ingestion.models import RawDocument
from ingestion.connectors.notion.mappers import map_page_to_document, map_database_to_document


class NotionBackfill:
    def __init__(self, access_token: str):
        self.token = access_token
        self.headers = {
            "Authorization": f"Bearer {access_token}",
            "Notion-Version": "2022-06-28",
            "Content-Type": "application/json",
        }

    def _api(self, method: str, endpoint: str, json_data=None, params=None) -> Dict[str, Any]:
        url = f"https://api.notion.com/v1{endpoint}"
        if method == "GET":
            resp = requests.get(url, headers=self.headers, params=params)
        else:
            resp = requests.post(url, headers=self.headers, json=json_data)

        if resp.status_code == 429:
            retry = int(resp.headers.get("Retry-After", 1))
            time.sleep(retry)
            return self._api(method, endpoint, json_data, params)

        resp.raise_for_status()
        return resp.json()

    def search_all(self) -> List[Dict[str, Any]]:
        items = []
        cursor = None
        while True:
            payload = {"page_size": 100}
            if cursor:
                payload["start_cursor"] = cursor

            resp = self._api("POST", "/search", json_data=payload)
            items.extend(resp.get("results", []))
            if not resp.get("has_more"):
                break
            cursor = resp.get("next_cursor")
        return items

    def fetch_blocks(self, block_id: str) -> List[Dict[str, Any]]:
        blocks = []
        cursor = None
        while True:
            params = {"start_cursor": cursor} if cursor else None
            resp = self._api("GET", f"/blocks/{block_id}/children", params=params)
            batch = resp.get("results", [])
            blocks.extend(batch)
            if not resp.get("has_more"):
                break
            cursor = resp.get("next_cursor")

        # Recursively fetch nested blocks
        all_blocks = []
        for b in blocks:
            all_blocks.append(b)
            if b.get("has_children"):
                all_blocks.extend(self.fetch_blocks(b["id"]))
        return all_blocks

    def blocks_to_text(self, blocks: List[Dict[str, Any]]) -> str:
        out = []
        for b in blocks:
            t = b.get("type", "")
            val = b.get(t, {})
            if "rich_text" in val:
                line = "".join(rt.get("plain_text", "") for rt in val["rich_text"])
                if t.startswith("heading"):
                    level = int(t[-1]) if t[-1].isdigit() else 1
                    out.append(f"{'#' * level} {line}")
                elif t == "bulleted_list_item":
                    out.append(f"- {line}")
                elif t == "numbered_list_item":
                    out.append(f"1. {line}")
                elif t == "to_do":
                    checked = "x" if val.get("checked") else " "
                    out.append(f"- [{checked}] {line}")
                elif t == "code":
                    lang = val.get("language", "")
                    out.append(f"```{lang}\n{line}\n```")
                elif t == "quote":
                    out.append(f"> {line}")
                else:
                    out.append(line)
            elif t == "divider":
                out.append("---")
            elif t == "equation":
                out.append(f"$$ {val.get('expression', '')} $$")
        return "\n".join(out)

    def backfill_workspace(self, workspace_id: str) -> List[RawDocument]:
        docs = []
        for item in self.search_all():
            obj = item.get("object")
            iid = item.get("id")

            if obj == "page":
                blocks = self.fetch_blocks(iid)
                text = self.blocks_to_text(blocks)
                doc = map_page_to_document(item, text, workspace_id)
                if doc:
                    docs.append(doc)

            elif obj == "database":
                # Index DB schema as a document; skip rows to avoid heavy pagination
                doc = map_database_to_document(item, workspace_id)
                if doc:
                    docs.append(doc)

        return docs