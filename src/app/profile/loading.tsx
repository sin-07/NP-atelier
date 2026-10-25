import AtelierGlobalLoader from '../../components/AtelierGlobalLoader'

export default function ProfileLoading() {
  return (
    <AtelierGlobalLoader
      mode="page_switch"
      title="Patron Atelier Lounge"
      subtitle="Loading your Bespoke Orders & Delivery Passport..."
      durationMs={800}
    />
  )
}
