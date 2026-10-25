import AtelierGlobalLoader from '../components/AtelierGlobalLoader'

export default function Loading() {
  return (
    <AtelierGlobalLoader
      mode="page_switch"
      title="Entering NP Atelier"
      subtitle="Curated Artisan Marketplace & Living Waters"
      durationMs={800}
    />
  )
}
