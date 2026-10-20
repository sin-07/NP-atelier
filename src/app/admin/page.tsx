"use client"

import { useState, useMemo, useEffect, useRef } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Copy,
  Edit,
  Eye,
  Fish,
  Globe,
  Image as ImageIcon,
  IndianRupee,
  Layers,
  LayoutDashboard,
  LogOut,
  Package,
  PackageCheck,
  Palette,
  Phone,
  Plus,
  RefreshCw,
  Save,
  Search,
  ShieldCheck,
  Sparkles,
  Tag,
  Trash2,
  TrendingUp,
  Upload,
  Users,
  Waves,
  X,
} from 'lucide-react'
import { useMarketplace, BrandingSettings, DEFAULT_BRANDING } from '../../context/MarketplaceContext'
import {
  categories,
  craftCategories,
  aquariumCategories,
  Product,
  AquaticSpecs,
} from '../../data/products'
import { fallbackCraftImage } from '../../utils/fallbackImage'
import AdminLoginForm from '../../components/AdminLoginForm'

const PRESET_IMAGES = [
  // Crafts
  { label: 'Resin Floral', department: 'crafts', url: 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&w=800&q=80' },
  { label: 'Silk Bangles', department: 'crafts', url: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=800&q=80' },
  { label: 'Soy Candle', department: 'crafts', url: 'https://images.unsplash.com/photo-1543257580-7269da773bf5?auto=format&fit=crop&w=800&q=80' },
  { label: 'Botanical Soap', department: 'crafts', url: 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?auto=format&fit=crop&w=800&q=80' },
  { label: 'Ceramic Decor', department: 'crafts', url: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=800&q=80' },
  // Aquatic
  { label: 'Discus Fish', department: 'aquarium', url: 'https://images.unsplash.com/photo-1544943910-4c1dc44a0b38?auto=format&fit=crop&w=800&q=80' },
  { label: 'Show Betta', department: 'aquarium', url: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=800&q=80' },
  { label: 'Clownfish', department: 'aquarium', url: 'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&w=800&q=80' },
  { label: 'Planted Tank', department: 'aquarium', url: 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?auto=format&fit=crop&w=800&q=80' },
  { label: 'Nano Aquarium', department: 'aquarium', url: 'https://images.unsplash.com/photo-1535591273668-578e31182c4f?auto=format&fit=crop&w=800&q=80' },
  { label: 'External Filter', department: 'aquarium', url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80' },
  { label: 'Fish Nutrition', department: 'aquarium', url: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=800&q=80' },
]

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const auth = window.localStorage.getItem('ateliernp-admin-authenticated') === 'true'
      setIsAuthenticated(auth)
      setAuthChecked(true)
    }
  }, [])

  const handleAdminLogout = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('ateliernp-admin-authenticated')
      window.localStorage.removeItem('ateliernp-admin-user')
    }
    setIsAuthenticated(false)
  }

  const {
    branding,
    updateBranding,
    resetBranding,
    products,
    addProduct,
    editProduct,
    deleteProduct,
    orders,
    updateOrderStatus,
    availableCoupons,
    addCoupon,
    deleteCoupon,
    showToast,
  } = useMarketplace()

  // Tabs: 'overview' | 'products' | 'branding' | 'orders' | 'coupons' | 'artisans'
  const [activeTab, setActiveTab] = useState('overview')

  // Product Table Filters
  const [productSearch, setProductSearch] = useState('')
  const [productDepartment, setProductDepartment] = useState('All') // 'All' | 'crafts' | 'aquarium'
  const [productCategory, setProductCategory] = useState('All')

  // Product Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const productFileInputRef = useRef<HTMLInputElement>(null)

  interface ProductFormState {
    title: string
    department: string
    category: string
    subCategory: string
    price: string
    description: string
    image: string
    stock: number
    badges: string[]
    aquaticSpecs?: AquaticSpecs
  }

  const [productForm, setProductForm] = useState<ProductFormState>({
    title: '',
    department: 'aquarium',
    category: aquariumCategories[0],
    subCategory: '',
    price: '899',
    description: '',
    image: PRESET_IMAGES[5].url,
    stock: 20,
    badges: ['Live Arrival Guarantee', 'In Stock'],
    aquaticSpecs: {
      careLevel: 'Easy',
      waterType: 'Freshwater',
      temperament: 'Peaceful',
      tankSize: '30 Liters+',
      diet: 'High-protein pellets & flakes',
      liveArrivalGuarantee: true,
      dimensions: '',
    },
  })

  // BRANDING SETTINGS FORM STATE
  const [brandingForm, setBrandingForm] = useState<BrandingSettings>({
    siteName: branding?.siteName || DEFAULT_BRANDING.siteName,
    tagline: branding?.tagline || DEFAULT_BRANDING.tagline,
    logoType: branding?.logoType || DEFAULT_BRANDING.logoType,
    logoText: branding?.logoText || DEFAULT_BRANDING.logoText,
    logoImageUrl: branding?.logoImageUrl || DEFAULT_BRANDING.logoImageUrl,
    announcementText: branding?.announcementText || DEFAULT_BRANDING.announcementText,
    contactEmail: branding?.contactEmail || DEFAULT_BRANDING.contactEmail,
    contactPhone: branding?.contactPhone || DEFAULT_BRANDING.contactPhone,
    currency: branding?.currency || DEFAULT_BRANDING.currency,
  })

  // Keep form in sync with context when branding changes
  useEffect(() => {
    if (branding) {
      setBrandingForm({
        siteName: branding.siteName || DEFAULT_BRANDING.siteName,
        tagline: branding.tagline || DEFAULT_BRANDING.tagline,
        logoType: branding.logoType || DEFAULT_BRANDING.logoType,
        logoText: branding.logoText || DEFAULT_BRANDING.logoText,
        logoImageUrl: branding.logoImageUrl || DEFAULT_BRANDING.logoImageUrl,
        announcementText: branding.announcementText || DEFAULT_BRANDING.announcementText,
        contactEmail: branding.contactEmail || DEFAULT_BRANDING.contactEmail,
        contactPhone: branding.contactPhone || DEFAULT_BRANDING.contactPhone,
        currency: branding.currency || DEFAULT_BRANDING.currency,
      })
    }
  }, [branding])

  const [isSavingBranding, setIsSavingBranding] = useState(false)
  const [isUploadingLogo, setIsUploadingLogo] = useState(false)
  const logoFileInputRef = useRef<HTMLInputElement>(null)

  // Order Details Modal State
  const [selectedOrder, setSelectedOrder] = useState<any>(null)

  // New Coupon Form State
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    type: 'percent',
    value: 15,
    label: '15% Off Spring Festival',
  })

  // Filtered Products for Admin Table
  const filteredProducts = useMemo(() => {
    const query = productSearch.trim().toLowerCase()
    return products.filter((p: Product) => {
      // Department match
      let matchDept = true
      if (productDepartment === 'crafts') {
        matchDept = p.department === 'crafts' || craftCategories.includes(p.category)
      } else if (productDepartment === 'aquarium') {
        matchDept = p.department === 'aquarium' || aquariumCategories.includes(p.category)
      }

      // Category match
      const matchCat = productCategory === 'All' || p.category === productCategory

      // Search match
      const matchQuery =
        !query ||
        [p.title, p.category, p.description, ...(p.badges || [])].some((field) =>
          field?.toLowerCase().includes(query)
        )

      return matchDept && matchCat && matchQuery
    })
  }, [products, productDepartment, productCategory, productSearch])

  // Analytics Metrics
  const metrics = useMemo(() => {
    const totalSales = orders.reduce((sum: number, o: any) => sum + (o.total || 0), 0)
    const totalOrdersCount = orders.length
    const totalProductsCount = products.length

    const craftCount = products.filter(
      (p: Product) => p.department === 'crafts' || craftCategories.includes(p.category)
    ).length
    const aquaticCount = products.filter(
      (p: Product) => p.department === 'aquarium' || aquariumCategories.includes(p.category)
    ).length

    const avgOrderVal = totalOrdersCount > 0 ? totalSales / totalOrdersCount : 0
    return {
      totalSales,
      totalOrdersCount,
      totalProductsCount,
      craftCount,
      aquaticCount,
      avgOrderVal,
    }
  }, [orders, products])

  // Handlers for Products
  const openAddProductModal = (initialDept: string = 'aquarium') => {
    setEditingProduct(null)
    const isAquarium = initialDept === 'aquarium'
    setProductForm({
      title: '',
      department: isAquarium ? 'aquarium' : 'crafts',
      category: isAquarium ? aquariumCategories[0] : craftCategories[0],
      subCategory: '',
      price: isAquarium ? '899' : '499',
      description: '',
      image: isAquarium ? PRESET_IMAGES[5].url : PRESET_IMAGES[0].url,
      stock: 25,
      badges: isAquarium ? ['Live Arrival Guarantee', 'In Stock'] : ['Handmade', 'New'],
      aquaticSpecs: {
        careLevel: 'Easy',
        waterType: 'Freshwater',
        temperament: 'Peaceful',
        tankSize: '30 Liters+',
        diet: 'High-protein pellets & flakes',
        liveArrivalGuarantee: true,
        dimensions: '',
      },
    })
    setIsProductModalOpen(true)
  }

  const openEditProductModal = (product: Product) => {
    setEditingProduct(product)
    const isAquarium =
      product.department === 'aquarium' || aquariumCategories.includes(product.category)

    setProductForm({
      title: product.title,
      department: isAquarium ? 'aquarium' : 'crafts',
      category: product.category,
      subCategory: product.subCategory || '',
      price: String(product.price).replace(/[^0-9.]/g, ''),
      description: product.description || '',
      image: product.image,
      stock: product.stock !== undefined ? product.stock : 20,
      badges: product.badges || ['In Stock'],
      aquaticSpecs: product.aquaticSpecs || {
        careLevel: 'Easy',
        waterType: 'Freshwater',
        temperament: 'Peaceful',
        tankSize: '30 Liters+',
        diet: 'High-protein pellets',
        liveArrivalGuarantee: true,
        dimensions: '',
      },
    })
    setIsProductModalOpen(true)
  }

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editingProduct) {
      await editProduct(editingProduct.id, productForm)
    } else {
      await addProduct(productForm)
    }
    setIsProductModalOpen(false)
  }

  const handleProductImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploadingImage(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (data.success && data.url) {
        setProductForm((prev) => ({ ...prev, image: data.url }))
        showToast({
          title: 'Image Uploaded! 📷',
          message: 'Product image successfully uploaded and linked.',
          type: 'success',
        })
      } else {
        throw new Error(data.error || 'Upload failed')
      }
    } catch (err: any) {
      showToast({
        title: 'Upload Failed',
        message: err.message || 'Could not upload image file.',
        type: 'error',
      })
    } finally {
      setIsUploadingImage(false)
    }
  }

  // Handlers for Branding Settings
  const handleSaveBranding = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSavingBranding(true)
    try {
      await updateBranding(brandingForm)
    } finally {
      setIsSavingBranding(false)
    }
  }

  const handleResetBranding = async () => {
    if (confirm('Are you sure you want to restore default branding settings?')) {
      await resetBranding()
      setBrandingForm(DEFAULT_BRANDING)
    }
  }

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploadingLogo(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (data.success && data.url) {
        setBrandingForm((prev) => ({
          ...prev,
          logoImageUrl: data.url,
          logoType: prev.logoType === 'icon' ? 'image' : prev.logoType,
        }))
        showToast({
          title: 'Logo Uploaded! 🎨',
          message: 'New website logo uploaded. Click "Save Branding Settings" to commit.',
          type: 'success',
        })
      } else {
        throw new Error(data.error || 'Upload failed')
      }
    } catch (err: any) {
      showToast({
        title: 'Logo Upload Error',
        message: err.message || 'Could not upload logo image.',
        type: 'error',
      })
    } finally {
      setIsUploadingLogo(false)
    }
  }

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCoupon.code.trim()) return
    addCoupon(newCoupon)
    setNewCoupon({ code: '', type: 'percent', value: 15, label: '' })
  }

  if (!isAuthenticated && authChecked) {
    return <AdminLoginForm onLoginSuccess={() => setIsAuthenticated(true)} />
  }

  return (
    <div className="min-h-screen bg-[#F6F3EE] text-[#141414]">
      {/* Top Admin Header with Dynamic Branding */}
      <header className="sticky top-0 z-30 border-b border-[#E5E0D8] bg-white/95 shadow-sm backdrop-blur-md">
        <div className="section-shell flex h-20 items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-[#d4a338]/30 bg-white/80 px-4 py-2 text-xs font-bold text-[#5e4318] shadow-sm transition hover:bg-[#faeed1] hover:text-[#17120a]"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Storefront</span>
            </Link>

            <div className="hidden h-6 w-px bg-[#d4a338]/30 sm:block" />

            {/* Dynamic Branding Display in Admin Header */}
            <div className="flex items-center gap-2.5">
              {branding?.logoImageUrl && (branding.logoType === 'image' || branding.logoType === 'both') ? (
                <img
                  src={branding.logoImageUrl}
                  alt={branding.siteName}
                  className="h-10 w-auto max-w-[120px] rounded-xl object-contain border border-[#d4a338]/30 bg-white p-0.5 shadow-sm"
                />
              ) : (
                <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-[#fff3cf] via-[#e8bc57] to-[#b38320] text-sm font-black text-[#17120a] shadow-soft border border-[#fbf3d5]">
                  {branding?.logoText || 'NP'}
                </span>
              )}
              <div>
                <h1 className="font-serif text-xl sm:text-2xl font-bold leading-tight text-[#241705]">
                  {branding?.siteName || 'NP Atelier'} Admin
                </h1>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#8c5f0b]">
                  Crafts, Aquatics &amp; Store Management
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden rounded-2xl border border-[#d4a338]/30 bg-white/80 px-4 py-2 text-right md:block">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#73562a]">Gross Store Sales</p>
              <p className="text-sm font-extrabold text-[#855a10]">₹{metrics.totalSales.toFixed(0)}</p>
            </div>

            <button
              type="button"
              onClick={() => openAddProductModal('aquarium')}
              className="inline-flex items-center gap-1.5 rounded-full bg-cyan-700 px-3.5 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-cyan-800"
            >
              <Fish className="h-3.5 w-3.5 text-cyan-200" />
              <span className="hidden sm:inline">Add Aquatic</span>
            </button>

            <button
              type="button"
              onClick={() => openAddProductModal('crafts')}
              className="btn-primary text-xs py-2 px-3.5 shadow-sm"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add Craft</span>
            </button>

            <button
              type="button"
              onClick={handleAdminLogout}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#d4a338]/30 bg-white/80 px-3 py-2 text-xs font-bold text-rose-600 shadow-sm transition hover:bg-rose-50 hover:border-rose-300"
              title="Sign out of admin session"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Content */}
      <div className="section-shell py-8">
        {/* Navigation Tabs */}
        <div className="mb-8 flex flex-wrap items-center gap-2 border-b border-[#d4a338]/30 pb-4">
          {[
            { id: 'overview', label: 'Executive Analytics', icon: LayoutDashboard },
            { id: 'products', label: `Catalog (${products.length})`, icon: Package },
            { id: 'branding', label: '🎨 Branding Settings', icon: Palette },
            { id: 'orders', label: `Orders (${orders.length})`, icon: PackageCheck },
            { id: 'coupons', label: 'Promos & Coupons', icon: Tag },
            { id: 'artisans', label: 'Makers & Aquarists', icon: Users },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold transition duration-200 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-[#faeed1] to-[#e8bc57] text-[#241705] shadow-sm border border-[#d4a338]'
                  : 'border border-[#d4a338]/30 bg-white/70 text-[#5e4318] hover:bg-[#faeed1] hover:text-[#241705]'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: OVERVIEW & ANALYTICS */}
        {/* ========================================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* 4 Metric Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="glass-card p-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#8C827A]">Gross Revenue</span>
                  <div className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-100 text-emerald-800">
                    <IndianRupee className="h-4 w-4" />
                  </div>
                </div>
                <p className="mt-3 font-serif text-3xl font-bold text-[#141414]">₹{metrics.totalSales.toFixed(0)}</p>
                <p className="mt-1 text-[11px] font-semibold text-emerald-700">↗ Across Crafts &amp; Living Aquatics</p>
              </div>

              <div className="glass-card p-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#8C827A]">Total Orders</span>
                  <div className="grid h-8 w-8 place-items-center rounded-xl bg-amber-100 text-[#855A10]">
                    <PackageCheck className="h-4 w-4" />
                  </div>
                </div>
                <p className="mt-3 font-serif text-3xl font-bold text-[#141414]">{metrics.totalOrdersCount}</p>
                <p className="mt-1 text-[11px] font-semibold text-[#855A10]">Direct fulfillment tracked</p>
              </div>

              <div className="glass-card p-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#8C827A]">Crafts Catalog</span>
                  <div className="grid h-8 w-8 place-items-center rounded-xl bg-rose-100 text-rose-700">
                    <Palette className="h-4 w-4" />
                  </div>
                </div>
                <p className="mt-3 font-serif text-3xl font-bold text-[#141414]">{metrics.craftCount} Crafts</p>
                <p className="mt-1 text-[11px] font-semibold text-[#8C827A]">Jewelry, Decor, Resins &amp; Wax</p>
              </div>

              <div className="glass-card p-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#8C827A]">Fish &amp; Aquariums</span>
                  <div className="grid h-8 w-8 place-items-center rounded-xl bg-cyan-100 text-cyan-800">
                    <Fish className="h-4 w-4" />
                  </div>
                </div>
                <p className="mt-3 font-serif text-3xl font-bold text-[#141414]">{metrics.aquaticCount} Aquatics</p>
                <p className="mt-1 text-[11px] font-semibold text-cyan-700">Live fish, tanks &amp; equipment</p>
              </div>
            </div>

            {/* Category Breakdown & Recent Orders Grid */}
            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              {/* Category Distribution */}
              <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-serif text-xl font-bold text-[#241705]">Catalog Distribution by Category</h3>
                  <span className="text-xs font-bold text-[#8C827A]">Total: {products.length} Items</span>
                </div>

                <div className="space-y-3.5">
                  <p className="text-xs font-extrabold uppercase tracking-wider text-cyan-900 border-b pb-1">
                    🐠 Fish &amp; Aquarium Categories
                  </p>
                  {aquariumCategories.map((cat) => {
                    const count = products.filter((p: Product) => p.category === cat).length
                    const pct = Math.round((count / products.length) * 100) || 0
                    return (
                      <div key={cat}>
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-[#241705]">{cat}</span>
                          <span className="text-cyan-800 font-bold">{count} items ({pct}%)</span>
                        </div>
                        <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-cyan-100">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-teal-500 to-cyan-600"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}

                  <p className="text-xs font-extrabold uppercase tracking-wider text-[#855A10] border-b pb-1 pt-3">
                    🎨 Crafts Categories
                  </p>
                  {craftCategories.map((cat) => {
                    const count = products.filter((p: Product) => p.category === cat).length
                    const pct = Math.round((count / products.length) * 100) || 0
                    return (
                      <div key={cat}>
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-[#241705]">{cat}</span>
                          <span className="text-[#855A10] font-bold">{count} items ({pct}%)</span>
                        </div>
                        <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-amber-100">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-amber-400 to-[#D4AF37]"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Recent Orders List */}
              <div className="glass-card p-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-xl font-bold text-[#241705]">Recent Customer Orders</h3>
                  <button
                    type="button"
                    onClick={() => setActiveTab('orders')}
                    className="text-xs font-bold text-[#855A10] hover:underline"
                  >
                    View All ({orders.length})
                  </button>
                </div>

                <div className="mt-4 space-y-3">
                  {orders.slice(0, 5).map((order: any) => (
                    <div
                      key={order.orderId}
                      onClick={() => setSelectedOrder(order)}
                      className="flex cursor-pointer items-center justify-between rounded-2xl border border-[#d4a338]/25 bg-white/80 p-3 transition hover:bg-[#faeed1]"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#241705]">{order.orderId}</span>
                          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-bold text-emerald-800">
                            {order.status}
                          </span>
                        </div>
                        <p className="mt-0.5 text-xs text-[#5e4318]">
                          {order.customer?.fullName || 'Customer'} • {order.items?.length || 1} item(s)
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-extrabold text-[#855a10]">₹{order.total?.toFixed(0)}</span>
                        <p className="text-[10px] text-[#73562a]">{order.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: PRODUCTS CATALOG (FULL CRUD FOR CRAFTS & AQUARIUM) */}
        {/* ========================================================================= */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            {/* Filter Toolbar */}
            <div className="glass-card flex flex-col gap-4 p-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative flex-1 lg:max-w-md">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8c5f0b]" />
                <input
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Search products by title, category, or specs..."
                  className="h-10 w-full rounded-xl border border-[#d4a338]/35 bg-white pl-10 pr-4 text-xs font-semibold text-[#241705] outline-none focus:border-[#c59325] shadow-sm"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Department Filter */}
                <select
                  value={productDepartment}
                  onChange={(e) => {
                    setProductDepartment(e.target.value)
                    setProductCategory('All')
                  }}
                  className="h-10 rounded-xl border border-[#d4a338]/35 bg-white px-3 text-xs font-bold text-[#241705] outline-none shadow-sm"
                >
                  <option value="All">All Departments</option>
                  <option value="aquarium">🐠 Fish &amp; Aquarium</option>
                  <option value="crafts">🎨 Handmade Crafts</option>
                </select>

                {/* Subcategory Filter */}
                <select
                  value={productCategory}
                  onChange={(e) => setProductCategory(e.target.value)}
                  className="h-10 rounded-xl border border-[#d4a338]/35 bg-white px-3 text-xs font-bold text-[#241705] outline-none shadow-sm"
                >
                  <option value="All">All Subcategories</option>
                  {productDepartment !== 'crafts' &&
                    aquariumCategories.map((c) => (
                      <option key={c} value={c}>
                        🐠 {c}
                      </option>
                    ))}
                  {productDepartment !== 'aquarium' &&
                    craftCategories.map((c) => (
                      <option key={c} value={c}>
                        🎨 {c}
                      </option>
                    ))}
                </select>

                <button
                  type="button"
                  onClick={() => openAddProductModal(productDepartment === 'crafts' ? 'crafts' : 'aquarium')}
                  className="btn-primary text-xs py-2 px-4 whitespace-nowrap"
                >
                  <Plus className="h-4 w-4" />
                  New Product
                </button>
              </div>
            </div>

            {/* Products Table */}
            <div className="glass-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-[#d4a338]/20 bg-[#faeed1]/50 font-bold uppercase tracking-wider text-[#73562a]">
                    <tr>
                      <th className="p-4">Product</th>
                      <th className="p-4">Department</th>
                      <th className="p-4">Subcategory</th>
                      <th className="p-4">Price</th>
                      <th className="p-4">Stock</th>
                      <th className="p-4">Rating</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#d4a338]/15">
                    {filteredProducts.map((p: Product) => {
                      const isAqua = p.department === 'aquarium' || aquariumCategories.includes(p.category)
                      return (
                        <tr key={p.id} className="transition hover:bg-white/60">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={p.image}
                                alt={p.title}
                                onError={(e) => {
                                  e.currentTarget.src = fallbackCraftImage
                                }}
                                className="h-12 w-12 rounded-xl object-cover border border-[#d4a338]/25 shrink-0"
                              />
                              <div>
                                <p className="font-bold text-[#241705]">{p.title}</p>
                                <p className="line-clamp-1 max-w-xs text-[11px] text-[#5e4318]">
                                  {p.description}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <span
                              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                                isAqua
                                  ? 'bg-cyan-100 text-cyan-900 border border-cyan-300'
                                  : 'bg-amber-100 text-amber-900 border border-amber-300'
                              }`}
                            >
                              {isAqua ? '🐠 Aquarium' : '🎨 Craft'}
                            </span>
                          </td>
                          <td className="p-4 font-semibold text-[#5E4318]">{p.category}</td>
                          <td className="p-4 text-sm font-extrabold text-[#855a10]">{p.price}</td>
                          <td className="p-4">
                            <span
                              className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                                (p.stock ?? 20) > 0
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {p.stock ?? 25} in stock
                            </span>
                          </td>
                          <td className="p-4 font-bold text-[#241705]">
                            ⭐ {p.rating ?? 4.9} ({p.reviews ?? 12})
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => openEditProductModal(p)}
                                title="Edit product"
                                className="grid h-8 w-8 place-items-center rounded-lg border border-[#d4a338]/30 bg-white text-[#241705] transition hover:bg-[#faeed1] shadow-sm"
                              >
                                <Edit className="h-3.5 w-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  if (confirm(`Delete "${p.title}"?`)) {
                                    deleteProduct(p.id)
                                  }
                                }}
                                title="Delete product"
                                className="grid h-8 w-8 place-items-center rounded-lg border border-rose-200 bg-rose-50 text-rose-600 transition hover:bg-rose-500 hover:text-white shadow-sm"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: ADMIN BRANDING SETTINGS (DYNAMIC NAME, LOGO UPLOAD & PERMANENCE) */}
        {/* ========================================================================= */}
        {activeTab === 'branding' && (
          <div className="space-y-8">
            <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
              {/* Branding Configuration Form */}
              <div className="glass-card p-6 sm:p-8 space-y-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-[#D4AF37]/50 bg-gradient-to-r from-[#FFFDF8] to-[#FAF3DE] px-3.5 py-1 text-xs font-bold text-[#855A10] shadow-xs">
                    <Palette className="h-3.5 w-3.5 text-[#B8860B]" />
                    <span>Real-Time Brand System</span>
                  </div>
                  <h3 className="mt-2 font-serif text-2xl font-bold text-[#141414]">
                    Store Branding &amp; Visual Identity Settings
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-[#5A554E]">
                    Dynamically change your website name and upload or change your logo. Changes are saved to the backend database and reflected instantly and permanently across the entire site (header, navigation, footer, admin console, and browser tab).
                  </p>
                </div>

                <form onSubmit={handleSaveBranding} className="space-y-5">
                  {/* Website Name */}
                  <div>
                    <label className="block text-xs font-bold text-[#141414] mb-1">
                      Website Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      value={brandingForm.siteName}
                      onChange={(e) => setBrandingForm({ ...brandingForm, siteName: e.target.value })}
                      placeholder="e.g. Atelier NP & AquaCraft"
                      className="h-11 w-full rounded-xl border border-[#d4a338]/40 bg-white px-3.5 text-sm font-bold text-[#141414] outline-none focus:border-[#c59325] shadow-sm"
                    />
                    <p className="mt-1 text-[11px] text-[#8C827A]">
                      Appears on the header, brand watermark, invoice, emails, and browser tab.
                    </p>
                  </div>

                  {/* Tagline / Subtitle */}
                  <div>
                    <label className="block text-xs font-bold text-[#141414] mb-1">
                      Website Tagline / Subtitle
                    </label>
                    <input
                      type="text"
                      value={brandingForm.tagline}
                      onChange={(e) => setBrandingForm({ ...brandingForm, tagline: e.target.value })}
                      placeholder="e.g. Luxury Crafts & Exotic Aquatics"
                      className="h-11 w-full rounded-xl border border-[#d4a338]/40 bg-white px-3.5 text-sm text-[#141414] outline-none focus:border-[#c59325] shadow-sm"
                    />
                  </div>

                  {/* Logo Display Mode */}
                  <div>
                    <label className="block text-xs font-bold text-[#141414] mb-2">
                      Logo Display Format
                    </label>
                    <div className="grid grid-cols-3 gap-2.5">
                      {[
                        { id: 'icon', label: 'Badge / Icon Only' },
                        { id: 'image', label: 'Uploaded Image Logo' },
                        { id: 'both', label: 'Both Icon + Image' },
                      ].map((mode) => (
                        <button
                          key={mode.id}
                          type="button"
                          onClick={() => setBrandingForm({ ...brandingForm, logoType: mode.id as any })}
                          className={`rounded-xl border p-2.5 text-center text-xs font-bold transition ${
                            brandingForm.logoType === mode.id
                              ? 'border-[#D4AF37] bg-gradient-to-b from-[#FFFDF9] to-[#FAF4E5] text-[#855A10] ring-1 ring-[#D4AF37]/50 shadow-sm'
                              : 'border-[#DFCFA6]/60 bg-white text-[#5A554E] hover:border-[#D4AF37]'
                          }`}
                        >
                          {mode.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Logo Symbol / Icon Text */}
                  {(brandingForm.logoType === 'icon' || brandingForm.logoType === 'both') && (
                    <div>
                      <label className="block text-xs font-bold text-[#141414] mb-1">
                        Logo Icon Symbol / Badge Text
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          maxLength={4}
                          value={brandingForm.logoText}
                          onChange={(e) => setBrandingForm({ ...brandingForm, logoText: e.target.value })}
                          placeholder="✦ or 🐠"
                          className="h-11 w-24 rounded-xl border border-[#d4a338]/40 bg-white px-3.5 text-center text-lg font-bold text-[#141414] outline-none focus:border-[#c59325] shadow-sm"
                        />
                        <div className="flex flex-wrap items-center gap-1.5">
                          {['✦', '🐠', '🌊', '✿', '🌿', '💎'].map((sym) => (
                            <button
                              key={sym}
                              type="button"
                              onClick={() => setBrandingForm({ ...brandingForm, logoText: sym })}
                              className="h-11 w-11 rounded-xl border border-[#d4a338]/30 bg-white hover:bg-[#faeed1] text-base transition shadow-sm"
                            >
                              {sym}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Logo Image Upload & URL */}
                  {(brandingForm.logoType === 'image' || brandingForm.logoType === 'both') && (
                    <div className="space-y-3 rounded-2xl border border-[#d4a338]/30 bg-white/60 p-4">
                      <label className="block text-xs font-bold text-[#141414]">
                        Website Logo Image (File Upload or URL)
                      </label>

                      {/* File Upload Button */}
                      <div className="flex items-center gap-3">
                        <input
                          type="file"
                          ref={logoFileInputRef}
                          onChange={handleLogoUpload}
                          accept="image/*"
                          className="hidden"
                        />
                        <button
                          type="button"
                          disabled={isUploadingLogo}
                          onClick={() => logoFileInputRef.current?.click()}
                          className="btn-gold text-xs py-2.5 px-4 shadow-sm"
                        >
                          <Upload className="h-4 w-4" />
                          <span>{isUploadingLogo ? 'Uploading Logo...' : 'Upload Logo File'}</span>
                        </button>
                        <span className="text-xs text-[#8C827A]">
                          Supports PNG, JPG, SVG, WebP with transparent background
                        </span>
                      </div>

                      {/* Direct Logo Image URL Input */}
                      <div>
                        <span className="text-[11px] font-bold text-[#8C827A] block mb-1">
                          Or enter direct image URL:
                        </span>
                        <input
                          type="url"
                          value={brandingForm.logoImageUrl}
                          onChange={(e) => setBrandingForm({ ...brandingForm, logoImageUrl: e.target.value })}
                          placeholder="https://example.com/logo.png"
                          className="h-10 w-full rounded-xl border border-[#d4a338]/35 bg-white px-3 text-xs text-[#141414] outline-none focus:border-[#c59325]"
                        />
                      </div>
                    </div>
                  )}

                  {/* Announcement Bar Text */}
                  <div>
                    <label className="block text-xs font-bold text-[#141414] mb-1">
                      Storefront Top Announcement Bar Message
                    </label>
                    <input
                      type="text"
                      value={brandingForm.announcementText}
                      onChange={(e) => setBrandingForm({ ...brandingForm, announcementText: e.target.value })}
                      placeholder="e.g. Artisan Drops & Aquarium Specials Live • Use code ATELIER10 for 10% off"
                      className="h-11 w-full rounded-xl border border-[#d4a338]/40 bg-white px-3.5 text-xs text-[#141414] outline-none focus:border-[#c59325] shadow-sm"
                    />
                  </div>

                  {/* Contact Info (Email & Phone) */}
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-bold text-[#141414] mb-1">Support Email</label>
                      <input
                        type="email"
                        value={brandingForm.contactEmail}
                        onChange={(e) => setBrandingForm({ ...brandingForm, contactEmail: e.target.value })}
                        placeholder="npatelierindia@gmail.com"
                        className="h-10 w-full rounded-xl border border-[#d4a338]/40 bg-white px-3 text-xs text-[#141414] outline-none focus:border-[#c59325]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#141414] mb-1">WhatsApp / Phone</label>
                      <input
                        type="text"
                        value={brandingForm.contactPhone}
                        onChange={(e) => setBrandingForm({ ...brandingForm, contactPhone: e.target.value })}
                        placeholder="+91 93412 97124"
                        className="h-10 w-full rounded-xl border border-[#d4a338]/40 bg-white px-3 text-xs text-[#141414] outline-none focus:border-[#c59325]"
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-[#d4a338]/20">
                    <button
                      type="submit"
                      disabled={isSavingBranding}
                      className="btn-gold flex-1 py-3.5 text-xs justify-center shadow-[0_6px_20px_rgba(212,175,55,0.35)]"
                    >
                      <Save className="h-4 w-4" />
                      <span>{isSavingBranding ? 'Saving Permanently...' : 'Save Branding Settings'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleResetBranding}
                      className="inline-flex items-center gap-1.5 rounded-full border border-[#d4a338]/30 bg-white px-4 py-3 text-xs font-bold text-[#8C827A] hover:bg-[#faeed1] hover:text-[#241705] transition"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      <span>Reset to Default</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Real-Time Live Preview Pane */}
              <div className="space-y-6">
                <div className="glass-card p-6">
                  <div className="flex items-center justify-between pb-3 border-b border-[#d4a338]/20">
                    <h4 className="font-serif text-lg font-bold text-[#241705] flex items-center gap-2">
                      <Eye className="h-4 w-4 text-[#855a10]" />
                      <span>Live Navbar Preview</span>
                    </h4>
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-bold text-emerald-800">
                      Live
                    </span>
                  </div>

                  <p className="mt-2 text-xs text-[#5e4318]">
                    This is how your branding appears to every visitor right now:
                  </p>

                  {/* Simulated Mini Announcement Bar */}
                  <div className="mt-4 rounded-t-xl bg-gradient-to-r from-[#FAF4E4] via-[#F6EAC9] to-[#FAF4E4] border border-[#E8D6A7] p-2 text-center text-[10px] font-semibold text-[#4A380A] truncate">
                    ★ {brandingForm.announcementText || 'Artisan Drops & Living Aquatics Live'}
                  </div>

                  {/* Simulated Mini Header */}
                  <div className="rounded-b-xl border border-t-0 border-[#EEDBBA] bg-[#FDFBF7] p-4 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      {brandingForm.logoImageUrl && (brandingForm.logoType === 'image' || brandingForm.logoType === 'both') ? (
                        <img
                          src={brandingForm.logoImageUrl}
                          alt="Logo Preview"
                          className="h-10 w-auto max-w-[120px] rounded-xl object-contain border border-[#d4a338]/40 bg-white p-0.5 shadow-xs"
                        />
                      ) : null}

                      {(!brandingForm.logoImageUrl || brandingForm.logoType === 'icon' || brandingForm.logoType === 'both') && (
                        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-[#241A06] to-[#382705] text-[#ECC872] border border-[#D4AF37]/50 font-bold text-lg shadow-sm">
                          {brandingForm.logoText || '✦'}
                        </span>
                      )}

                      <div>
                        <p className="font-serif text-lg font-bold text-[#141414] leading-tight">
                          {brandingForm.siteName || 'Atelier NP'}
                        </p>
                        <p className="text-[8px] font-bold uppercase tracking-wider text-[#9E7A2E]">
                          {brandingForm.tagline || 'Luxury Crafts & Exotic Aquatics'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] font-bold text-[#8C827A]">
                      <span className="rounded-full bg-[#141414] text-white px-2.5 py-1">Bag (0)</span>
                    </div>
                  </div>

                  {/* Live Footer Preview */}
                  <div className="mt-6 rounded-2xl bg-[#0E0E0E] text-white p-5 border border-[#D4AF37]/30 space-y-2">
                    <p className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold">
                      Footer Display
                    </p>
                    <p className="font-serif text-xl font-bold bg-gradient-to-r from-white via-[#F2D785] to-[#D4AF37] bg-clip-text text-transparent">
                      {brandingForm.siteName || 'Atelier NP'}
                    </p>
                    <p className="text-xs text-[#999999]">
                      {brandingForm.tagline}
                    </p>
                    <div className="pt-2 border-t border-white/10 text-[11px] text-[#E8C566] space-y-0.5">
                      <p>📧 {brandingForm.contactEmail}</p>
                      <p>📱 {brandingForm.contactPhone}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: ORDERS & FULFILLMENT */}
        {/* ========================================================================= */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="glass-card overflow-hidden">
              <div className="border-b border-[#d4a338]/20 bg-[#faeed1]/50 p-4">
                <h3 className="font-serif text-xl font-bold text-[#241705]">
                  All Customer Orders ({orders.length})
                </h3>
                <p className="text-xs text-[#5e4318]">
                  Manage craft packing, oxygenated aquatic bagging, and shipment tracking
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-[#d4a338]/20 font-bold uppercase tracking-wider text-[#73562a]">
                    <tr>
                      <th className="p-4">Order ID</th>
                      <th className="p-4">Date</th>
                      <th className="p-4">Customer</th>
                      <th className="p-4">Items Summary</th>
                      <th className="p-4">Total</th>
                      <th className="p-4">Fulfillment Status</th>
                      <th className="p-4 text-right">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#d4a338]/15">
                    {orders.map((order: any) => {
                      const hasAquatics = order.items?.some(
                        (i: any) => i.department === 'aquarium' || aquariumCategories.includes(i.category)
                      )
                      return (
                        <tr key={order.orderId} className="transition hover:bg-white/60">
                          <td className="p-4 font-mono font-bold text-[#241705]">{order.orderId}</td>
                          <td className="p-4 text-[#5e4318]">{order.date}</td>
                          <td className="p-4">
                            <p className="font-bold text-[#241705]">{order.customer?.fullName || 'Customer'}</p>
                            <p className="text-[10px] text-[#73562a]">{order.customer?.city}</p>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-1.5">
                              <span className="font-semibold text-[#241705]">
                                {order.items?.length || 1} item(s)
                              </span>
                              {hasAquatics && (
                                <span className="rounded-full bg-cyan-100 px-1.5 py-0.5 text-[8px] font-bold text-cyan-800">
                                  🐠 Aquatic
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="p-4 text-sm font-extrabold text-[#855a10]">₹{order.total?.toFixed(0)}</td>
                          <td className="p-4">
                            <select
                              value={order.status}
                              onChange={(e) => updateOrderStatus(order.orderId, e.target.value)}
                              className="rounded-xl border border-[#d4a338]/35 bg-white px-2.5 py-1 text-xs font-bold text-[#241705] outline-none shadow-sm"
                            >
                              <option value="Aquatic Packing & Oxygenation">Aquatic Packing & Oxygenation</option>
                              <option value="Handcrafting & Packing">Handcrafting & Packing</option>
                              <option value="Shipped (Express Courier)">Shipped (Express Courier)</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="p-4 text-right">
                            <button
                              type="button"
                              onClick={() => setSelectedOrder(order)}
                              className="inline-flex items-center gap-1 rounded-lg border border-[#d4a338]/30 bg-white px-2.5 py-1 text-xs font-bold text-[#241705] transition hover:bg-[#faeed1] shadow-sm"
                            >
                              <Eye className="h-3.5 w-3.5" /> View
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: PROMOS & COUPONS */}
        {/* ========================================================================= */}
        {activeTab === 'coupons' && (
          <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
            {/* Create Coupon Form */}
            <div className="glass-card p-6">
              <h3 className="font-serif text-xl font-bold text-[#241705]">Create Promotional Coupon</h3>
              <p className="mt-1 text-xs text-[#5e4318]">
                New codes will be immediately valid for customers in the storefront checkout.
              </p>

              <form onSubmit={handleCreateCoupon} className="mt-5 space-y-4">
                <div>
                  <label className="mb-1 block text-xs font-bold text-[#241705]">Coupon Code</label>
                  <input
                    required
                    value={newCoupon.code}
                    onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })}
                    placeholder="e.g. AQUASPRING25"
                    className="h-10 w-full rounded-xl border border-[#d4a338]/35 bg-white px-3.5 font-mono text-xs font-bold uppercase text-[#241705] outline-none focus:border-[#c59325] shadow-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-xs font-bold text-[#241705]">Discount Type</label>
                    <select
                      value={newCoupon.type}
                      onChange={(e) => setNewCoupon({ ...newCoupon, type: e.target.value })}
                      className="h-10 w-full rounded-xl border border-[#d4a338]/35 bg-white px-3 text-xs font-bold text-[#241705] outline-none shadow-sm"
                    >
                      <option value="percent">Percentage (%)</option>
                      <option value="fixed">Fixed Amount (₹)</option>
                      <option value="shipping">Free Shipping</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-bold text-[#241705]">Discount Value</label>
                    <input
                      type="number"
                      value={newCoupon.value}
                      onChange={(e) => setNewCoupon({ ...newCoupon, value: Number(e.target.value) })}
                      placeholder="15"
                      className="h-10 w-full rounded-xl border border-[#d4a338]/35 bg-white px-3.5 text-xs font-bold text-[#241705] outline-none shadow-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-[#241705]">Promotion Description / Label</label>
                  <input
                    value={newCoupon.label}
                    onChange={(e) => setNewCoupon({ ...newCoupon, label: e.target.value })}
                    placeholder="e.g. 15% Off Spring Aquatics & Crafts"
                    className="h-10 w-full rounded-xl border border-[#d4a338]/35 bg-white px-3.5 text-xs text-[#241705] outline-none shadow-sm"
                  />
                </div>

                <button type="submit" className="btn-primary w-full py-3 text-xs">
                  <Tag className="h-4 w-4" /> Activate Coupon Code
                </button>
              </form>
            </div>

            {/* Active Coupons List */}
            <div className="glass-card p-6">
              <h3 className="font-serif text-xl font-bold text-[#241705]">Active Coupon Codes</h3>
              <p className="mt-1 text-xs text-[#5e4318]">Active codes applicable by store shoppers</p>

              <div className="mt-5 space-y-3">
                {Object.values(availableCoupons as Record<string, any>).map((c: any) => (
                  <div
                    key={c.code}
                    className="flex items-center justify-between rounded-2xl border border-[#d4a338]/25 bg-white p-3.5 shadow-sm"
                  >
                    <div>
                      <span className="rounded-lg border border-dashed border-[#855a10] bg-[#faeed1] px-2.5 py-1 font-mono text-xs font-bold text-[#855a10]">
                        {c.code}
                      </span>
                      <p className="mt-1 text-xs font-bold text-[#241705]">{c.label}</p>
                      <p className="text-[10px] text-emerald-700 font-semibold">
                        {c.type === 'percent'
                          ? `${c.value}% discount`
                          : c.type === 'fixed'
                          ? `₹${c.value} discount`
                          : 'Free Delivery Across India'}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => deleteCoupon(c.code)}
                      className="grid h-8 w-8 place-items-center rounded-lg border border-rose-200 bg-rose-50 text-rose-600 transition hover:bg-rose-500 hover:text-white"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 6: MAKERS & AQUARISTS COLLECTIVE */}
        {/* ========================================================================= */}
        {activeTab === 'artisans' && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { name: 'Dr. Vikram Aqua Studio', specialty: 'Captive Discus & Planted Tanks', items: 8, location: 'Kochi & Bengaluru', status: 'Master Aquarist' },
              { name: 'Ananya & Maya', specialty: 'Silk Thread & Kundan Jewelry', items: 8, location: 'Jaipur / CA', status: 'Master Maker' },
              { name: 'Reef Wonders Lab', specialty: 'Marine Clownfish & Zoanthid Corals', items: 4, location: 'Goa Coast', status: 'Reef Certified' },
              { name: 'Clara & Fern', specialty: 'UV Pressed Florals & Resins', items: 6, location: 'Portland / Mumbai', status: 'Top Rated' },
              { name: 'AquaScape Hardscape Co', specialty: 'Ohko Stone & Bonsai Driftwood', items: 5, location: 'Hyderabad', status: 'Hardscape Guild' },
              { name: 'Aiden Apothecary', specialty: 'Botanical Soy Wax Candles', items: 5, location: 'Shimla Studios', status: 'Clean Certified' },
            ].map((artisan, idx) => (
              <div key={idx} className="glass-card p-6">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                    {artisan.status}
                  </span>
                  <span className="text-xs font-bold text-[#855a10]">{artisan.items} Offerings</span>
                </div>
                <h4 className="mt-3 font-serif text-xl font-bold text-[#241705]">{artisan.name}</h4>
                <p className="text-xs font-semibold text-[#5e4318]">{artisan.specialty}</p>
                <p className="mt-2 text-xs text-[#8C827A]">📍 {artisan.location}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* ADD / EDIT PRODUCT MODAL (COMPLETE WITH FISH & AQUARIUM & CRAFTS SUPPORT) */}
      {/* ========================================================================= */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#17120a]/60 p-4 backdrop-blur-md">
          <div className="relative my-8 w-full max-w-2xl overflow-hidden rounded-[2.2rem] bg-gradient-to-br from-[#fffdf9] via-[#faeed1] to-[#f6e1b3] border border-[#d4a338]/40 shadow-[0_25px_60px_rgba(133,90,16,0.25)]">
            <button
              type="button"
              onClick={() => setIsProductModalOpen(false)}
              className="absolute right-5 top-5 grid h-9 w-9 place-items-center rounded-full border border-[#d4a338]/30 bg-white/80 text-[#241705] hover:bg-white"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="border-b border-[#d4a338]/20 bg-[#faeed1]/50 p-6">
              <span className="section-eyebrow">Catalog Product Management</span>
              <h3 className="mt-2 font-serif text-2xl font-bold text-[#241705]">
                {editingProduct ? 'Edit Product Details' : 'Add New Offering'}
              </h3>
            </div>

            <form onSubmit={handleProductSubmit} className="space-y-4 p-6 max-h-[75vh] overflow-y-auto">
              {/* Department Selector */}
              <div>
                <label className="mb-1.5 block text-xs font-bold text-[#241705]">Department</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setProductForm({
                        ...productForm,
                        department: 'aquarium',
                        category: aquariumCategories[0],
                      })
                    }}
                    className={`flex items-center justify-center gap-2 rounded-xl border p-2.5 text-xs font-bold transition ${
                      productForm.department === 'aquarium'
                        ? 'border-cyan-600 bg-cyan-700 text-white shadow-sm'
                        : 'border-[#d4a338]/40 bg-white text-[#241705] hover:bg-[#faeed1]'
                    }`}
                  >
                    <Fish className="h-4 w-4" />
                    <span>🐠 Fish &amp; Aquarium</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setProductForm({
                        ...productForm,
                        department: 'crafts',
                        category: craftCategories[0],
                      })
                    }}
                    className={`flex items-center justify-center gap-2 rounded-xl border p-2.5 text-xs font-bold transition ${
                      productForm.department === 'crafts'
                        ? 'border-[#855a10] bg-[#855a10] text-white shadow-sm'
                        : 'border-[#d4a338]/40 bg-white text-[#241705] hover:bg-[#faeed1]'
                    }`}
                  >
                    <Palette className="h-4 w-4" />
                    <span>🎨 Handmade Crafts</span>
                  </button>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="mb-1 block text-xs font-bold text-[#241705]">Product Title</label>
                <input
                  required
                  value={productForm.title}
                  onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                  placeholder={
                    productForm.department === 'aquarium'
                      ? 'e.g. Royal Blue Diamond Discus Pair'
                      : 'e.g. Scalloped Floral Resin Serving Tray'
                  }
                  className="h-10 w-full rounded-xl border border-[#d4a338]/35 bg-white px-3 text-xs font-semibold text-[#241705] outline-none focus:border-[#c59325] shadow-sm"
                />
              </div>

              {/* Category & Price */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-bold text-[#241705]">Subcategory</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="h-10 w-full rounded-xl border border-[#d4a338]/35 bg-white px-3 text-xs font-bold text-[#241705] outline-none shadow-sm"
                  >
                    {productForm.department === 'aquarium'
                      ? aquariumCategories.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))
                      : craftCategories.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-[#241705]">Price (₹ INR)</label>
                  <input
                    required
                    type="number"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    placeholder="899"
                    className="h-10 w-full rounded-xl border border-[#d4a338]/35 bg-white px-3 text-xs font-bold text-[#241705] outline-none shadow-sm"
                  />
                </div>
              </div>

              {/* Stock and Badges */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-bold text-[#241705]">Stock Inventory</label>
                  <input
                    required
                    type="number"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })}
                    placeholder="25"
                    className="h-10 w-full rounded-xl border border-[#d4a338]/35 bg-white px-3 text-xs font-bold text-[#241705] outline-none shadow-sm"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-[#241705]">Badges (comma-separated)</label>
                  <input
                    value={(productForm.badges || []).join(', ')}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        badges: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                      })
                    }
                    placeholder="Live Arrival Guarantee, Captive Bred"
                    className="h-10 w-full rounded-xl border border-[#d4a338]/35 bg-white px-3 text-xs font-bold text-[#241705] outline-none shadow-sm"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="mb-1 block text-xs font-bold text-[#241705]">Description</label>
                <textarea
                  rows={2}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="Materials, origin, care specifications, or styling notes..."
                  className="w-full rounded-xl border border-[#d4a338]/35 bg-white p-3 text-xs font-medium text-[#241705] outline-none shadow-sm"
                />
              </div>

              {/* Aquatic Parameters Section (Only shown if department === 'aquarium') */}
              {productForm.department === 'aquarium' && (
                <div className="rounded-2xl border border-cyan-400/50 bg-cyan-50/70 p-4 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-cyan-900">
                    <Fish className="h-4 w-4 text-cyan-700" />
                    <span>Aquatic Parameters &amp; Transit Specs</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-[11px] font-bold text-cyan-900 mb-1">Water Type</label>
                      <select
                        value={productForm.aquaticSpecs?.waterType || 'Freshwater'}
                        onChange={(e) =>
                          setProductForm({
                            ...productForm,
                            aquaticSpecs: {
                              ...productForm.aquaticSpecs,
                              waterType: e.target.value as any,
                            },
                          })
                        }
                        className="h-9 w-full rounded-lg border border-cyan-300 bg-white px-2.5 text-xs text-[#141414]"
                      >
                        <option value="Freshwater">Freshwater</option>
                        <option value="Saltwater / Marine">Saltwater / Marine</option>
                        <option value="Brackish">Brackish</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-cyan-900 mb-1">Care Level</label>
                      <select
                        value={productForm.aquaticSpecs?.careLevel || 'Easy'}
                        onChange={(e) =>
                          setProductForm({
                            ...productForm,
                            aquaticSpecs: {
                              ...productForm.aquaticSpecs,
                              careLevel: e.target.value as any,
                            },
                          })
                        }
                        className="h-9 w-full rounded-lg border border-cyan-300 bg-white px-2.5 text-xs text-[#141414]"
                      >
                        <option value="Easy">Easy</option>
                        <option value="Moderate">Moderate</option>
                        <option value="Expert">Expert</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-cyan-900 mb-1">Min Tank Size / Volume</label>
                      <input
                        value={productForm.aquaticSpecs?.tankSize || ''}
                        onChange={(e) =>
                          setProductForm({
                            ...productForm,
                            aquaticSpecs: {
                              ...productForm.aquaticSpecs,
                              tankSize: e.target.value,
                            },
                          })
                        }
                        placeholder="e.g. 50 Liters+"
                        className="h-9 w-full rounded-lg border border-cyan-300 bg-white px-2.5 text-xs text-[#141414]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-cyan-900 mb-1">Dimensions / Specs</label>
                      <input
                        value={productForm.aquaticSpecs?.dimensions || ''}
                        onChange={(e) =>
                          setProductForm({
                            ...productForm,
                            aquaticSpecs: {
                              ...productForm.aquaticSpecs,
                              dimensions: e.target.value,
                            },
                          })
                        }
                        placeholder="e.g. 60x30x36cm or 1200L/H"
                        className="h-9 w-full rounded-lg border border-cyan-300 bg-white px-2.5 text-xs text-[#141414]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Product Image Selection & Upload */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-[#241705]">Product Image</label>
                  <input
                    type="file"
                    ref={productFileInputRef}
                    onChange={handleProductImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    disabled={isUploadingImage}
                    onClick={() => productFileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#855A10] hover:underline"
                  >
                    <Upload className="h-3.5 w-3.5" />
                    <span>{isUploadingImage ? 'Uploading...' : 'Upload Image File'}</span>
                  </button>
                </div>

                {/* Presets */}
                <div className="flex flex-wrap gap-1.5">
                  {PRESET_IMAGES.filter(
                    (img) => productForm.department === 'all' || img.department === productForm.department
                  ).map((img) => (
                    <button
                      key={img.label}
                      type="button"
                      onClick={() => setProductForm({ ...productForm, image: img.url })}
                      className="rounded-full border border-[#d4a338]/30 bg-white/80 px-2.5 py-1 text-[10px] font-bold text-[#241705] hover:bg-[#faeed1] shadow-sm"
                    >
                      {img.label}
                    </button>
                  ))}
                </div>

                {/* Image URL Input with Preview */}
                <div className="flex items-center gap-3">
                  <input
                    required
                    value={productForm.image}
                    onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="h-10 flex-1 rounded-xl border border-[#d4a338]/35 bg-white px-3 text-xs text-[#241705] outline-none shadow-sm"
                  />
                  {productForm.image && (
                    <img
                      src={productForm.image}
                      alt="Preview"
                      onError={(e) => {
                        e.currentTarget.src = fallbackCraftImage
                      }}
                      className="h-10 w-10 rounded-xl object-cover border border-[#d4a338]/30"
                    />
                  )}
                </div>
              </div>

              <div className="flex gap-2 pt-3">
                <button type="submit" className="btn-primary flex-1 py-3 text-xs shadow-glow">
                  {editingProduct ? 'Save Product Changes' : 'Publish Product to Live Store'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ORDER DETAILS MODAL */}
      {/* ========================================================================= */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#17120a]/60 p-4 backdrop-blur-md">
          <div className="relative my-8 w-full max-w-xl overflow-hidden rounded-[2.2rem] bg-gradient-to-br from-[#fffdf9] via-[#faeed1] to-[#f6e1b3] border border-[#d4a338]/40 shadow-[0_25px_60px_rgba(133,90,16,0.25)]">
            <button
              type="button"
              onClick={() => setSelectedOrder(null)}
              className="absolute right-5 top-5 grid h-9 w-9 place-items-center rounded-full border border-[#d4a338]/30 bg-white/80 text-[#241705] hover:bg-white"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="border-b border-[#d4a338]/20 bg-[#faeed1]/50 p-6">
              <span className="section-eyebrow">Order Inspection &amp; Tracking</span>
              <h3 className="mt-2 font-serif text-2xl font-bold text-[#241705]">
                Order #{selectedOrder.orderId}
              </h3>
              <p className="text-xs text-[#5e4318]">Placed on {selectedOrder.date}</p>
            </div>

            <div className="space-y-4 p-6 text-xs">
              {/* Customer Info */}
              <div className="rounded-2xl border border-[#d4a338]/30 bg-white/80 p-4 shadow-sm">
                <h4 className="font-bold text-[#241705]">Customer &amp; Shipping Destination</h4>
                <p className="mt-1 text-[#241705] font-semibold">{selectedOrder.customer?.fullName}</p>
                <p className="text-[#5e4318]">{selectedOrder.customer?.email}</p>
                <p className="text-[#5e4318]">{selectedOrder.customer?.phone}</p>
                <p className="text-[#5e4318]">{selectedOrder.customer?.address}</p>
                <p className="text-[#5e4318]">{selectedOrder.customer?.city}</p>
              </div>

              {/* Items */}
              <div className="rounded-2xl border border-[#d4a338]/30 bg-white/80 p-4 shadow-sm">
                <h4 className="font-bold text-[#241705]">Ordered Items ({selectedOrder.items?.length || 1})</h4>
                <div className="mt-3 space-y-2">
                  {selectedOrder.items?.map((item: any, i: number) => {
                    const isAqua = item.department === 'aquarium' || aquariumCategories.includes(item.category)
                    return (
                      <div key={i} className="flex items-center justify-between border-b border-[#d4a338]/15 pb-2">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="h-10 w-10 rounded-lg object-cover border border-[#d4a338]/25"
                          />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <p className="font-bold text-[#241705]">{item.title}</p>
                              {isAqua && (
                                <span className="rounded-full bg-cyan-100 px-1.5 py-0.2 text-[8px] font-bold text-cyan-800">
                                  🐠 Aquatic
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-emerald-700 font-semibold">
                              {item.quantity}x @ {item.price}
                            </p>
                          </div>
                        </div>
                        <span className="font-bold text-[#855a10]">{item.price}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Total & Status */}
              <div className="flex items-center justify-between rounded-xl border border-[#d4a338]/30 bg-white/80 p-3 text-sm font-bold text-[#241705] shadow-sm">
                <span>Total Amount</span>
                <span className="text-[#855a10]">₹{selectedOrder.total?.toFixed(0)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
