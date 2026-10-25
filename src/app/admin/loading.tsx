import AtelierGlobalLoader from '../../components/AtelierGlobalLoader'

export default function AdminLoading() {
  return (
    <AtelierGlobalLoader
      mode="admin_signin"
      title="Executive Access Terminal"
      subtitle="NP Atelier Administrative Terminal & Real-Time Analytics"
      durationMs={850}
    />
  )
}
