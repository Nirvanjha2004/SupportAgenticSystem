import { useConnectors } from '../../hooks/useConnectors'
import ConnectorCard from '../../components/sources/ConnectorCard'

export default function SourcesPage() {
  const { data: connectors } = useConnectors()

  return (
    <div className="space-y-4">
      <h2 className="font-display text-lg font-medium text-text-primary">All sources</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {connectors?.map((c) => (
          <ConnectorCard key={c.type} conn={c} />
        ))}
      </div>
    </div>
  )
}
