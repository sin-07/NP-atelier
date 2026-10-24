"use client"

import { useState, useMemo, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Copy,
  Edit,
  ExternalLink,
  Eye,
  FileText,
  Fish,
  Globe,
  Image as ImageIcon,
  IndianRupee,
  Layers,
  LayoutDashboard,
  LogOut,
  Mail,
  MessageCircle,
  Monitor,
  Package,
  PackageCheck,
  Palette,
  Phone,
  Plus,
  Receipt,
  RefreshCw,
  Save,
  Search,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
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
import AdminDashboardLoader from '../../components/AdminDashboardLoader'

const PRESET_IMAGES = [
  // Crafts
  { label: 'Resin Floral', department: 'crafts', url: 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&w=800&q=80' },
  { label: 'Silk Bangles', department: 'crafts', url: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=800&q=80' },
  { label: 'Soy Candle', department: 'crafts', url: 'https://images.unsplash.com/photo-1543257580-7269da773bf5?auto=format&fit=crop&w=800&q=80' },
  { label: 'Botanical Soap', department: 'crafts', url: 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?auto=format&fit=crop&w=800&q=80' },
  { label: 'Ceramic Decor', department: 'crafts', url: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=800&q=80' },
  // Aquatic
  { label: 'Discus Fish', department: 'aquarium', url: '/products/royal-discus-aquarium.jpg' },
  { label: 'Show Betta', department: 'aquarium', url: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=800&q=80' },
  { label: 'Clownfish', department: 'aquarium', url: 'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&w=800&q=80' },
  { label: 'Planted Tank', department: 'aquarium', url: 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?auto=format&fit=crop&w=800&q=80' },
  { label: 'Nano Aquarium', department: 'aquarium', url: 'https://images.unsplash.com/photo-1535591273668-578e31182c4f?auto=format&fit=crop&w=800&q=80' },
  { label: 'External Filter', department: 'aquarium', url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80' },
  { label: 'Fish Nutrition', department: 'aquarium', url: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=800&q=80' },
]

export default function AdminPage() {
  const {
    user,
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

  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const auth = window.localStorage.getItem('ateliernp-admin-authenticated') === 'true'
      // A customer session must not automatically enter admin without verified admin role
      const isRegularCustomer = user && user.role === 'customer'
      if (isRegularCustomer) {
        setIsAuthenticated(false)
      } else {
        setIsAuthenticated(auth)
      }
      setAuthChecked(true)
    }
  }, [user])

  const handleAdminLogout = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('ateliernp-admin-authenticated')
      window.localStorage.removeItem('ateliernp-admin-user')
    }
    setIsAuthenticated(false)
  }

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
  const [isCustomCategory, setIsCustomCategory] = useState(false)
  const [customCategoryInput, setCustomCategoryInput] = useState('')
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
  const [brandingSubTab, setBrandingSubTab] = useState<'identity' | 'logo' | 'announcement' | 'contact'>('identity')
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop')

  // Order Details Modal State
  const [selectedOrder, setSelectedOrder] = useState<any>(null)

  // Prevent background page double-scrolling when modal is open
  useEffect(() => {
    if (isProductModalOpen || selectedOrder) {
      const prevOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = prevOverflow
      }
    }
  }, [isProductModalOpen, selectedOrder])

  // New Coupon Form State
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    type: 'percent',
    value: 15,
    label: '15% Off Spring Festival',
  })

  // Dynamic Categories from seed list + all user-created products
  const allCraftCategories = useMemo(() => {
    const fromProducts = products
      .filter((p: Product) => p.department === 'crafts' || (!p.department && !aquariumCategories.includes(p.category)))
      .map((p: Product) => p.category)
      .filter(Boolean)
    return Array.from(new Set([...craftCategories, ...fromProducts]))
  }, [products])

  const allAquariumCategories = useMemo(() => {
    const fromProducts = products
      .filter((p: Product) => p.department === 'aquarium' || aquariumCategories.includes(p.category))
      .map((p: Product) => p.category)
      .filter(Boolean)
    return Array.from(new Set([...aquariumCategories, ...fromProducts]))
  }, [products])

  const activeDepartmentCategories = useMemo(() => {
    return productForm.department === 'aquarium' ? allAquariumCategories : allCraftCategories
  }, [productForm.department, allAquariumCategories, allCraftCategories])

  // Filtered Products for Admin Table
  const filteredProducts = useMemo(() => {
    const query = productSearch.trim().toLowerCase()
    return products.filter((p: Product) => {
      // Department match
      let matchDept = true
      if (productDepartment === 'crafts') {
        matchDept = p.department === 'crafts' || allCraftCategories.includes(p.category) || (!p.department && !allAquariumCategories.includes(p.category))
      } else if (productDepartment === 'aquarium') {
        matchDept = p.department === 'aquarium' || allAquariumCategories.includes(p.category)
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
  }, [products, productDepartment, productCategory, productSearch, allCraftCategories, allAquariumCategories])

  // Analytics Metrics
  const metrics = useMemo(() => {
    const totalSales = orders.reduce((sum: number, o: any) => sum + (o.total || 0), 0)
    const totalOrdersCount = orders.length
    const totalProductsCount = products.length

    const craftCount = products.filter(
      (p: Product) => p.department === 'crafts' || allCraftCategories.includes(p.category) || (!p.department && !allAquariumCategories.includes(p.category))
    ).length
    const aquaticCount = products.filter(
      (p: Product) => p.department === 'aquarium' || allAquariumCategories.includes(p.category)
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
  }, [orders, products, allCraftCategories, allAquariumCategories])

  // Handlers for Products
  const openAddProductModal = (initialDept: string = 'aquarium', initialCat?: string) => {
    setEditingProduct(null)
    const isAquarium = initialDept === 'aquarium'
    const deptCats = isAquarium ? allAquariumCategories : allCraftCategories
    const chosenCat =
      initialCat && initialCat !== 'All'
        ? initialCat
        : deptCats[0] || (isAquarium ? aquariumCategories[0] : craftCategories[0])

    setIsCustomCategory(false)
    setCustomCategoryInput('')
    setProductForm({
      title: '',
      department: isAquarium ? 'aquarium' : 'crafts',
      category: chosenCat,
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
    const deptCats = isAquarium ? allAquariumCategories : allCraftCategories
    const isCustom = !deptCats.includes(product.category)

    setIsCustomCategory(isCustom)
    setCustomCategoryInput(isCustom ? product.category : '')

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
    const resolvedCat = isCustomCategory
      ? (customCategoryInput.trim() || productForm.category.trim() || 'General')
      : productForm.category.trim()

    const finalProduct = {
      ...productForm,
      category: resolvedCat,
      subCategory: productForm.subCategory.trim() || resolvedCat,
    }

    if (editingProduct) {
      await editProduct(editingProduct.id, finalProduct)
    } else {
      await addProduct(finalProduct)
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
          title: 'Image Uploaded',
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
          title: 'Logo Uploaded',
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

  if (!authChecked) {
    return (
      <AdminDashboardLoader
        mode="checking"
        title="Verifying Session"
        subtitle="Checking administrator security credentials..."
        durationMs={450}
      />
    )
  }

  if (!isAuthenticated) {
    return <AdminLoginForm onLoginSuccess={() => setIsAuthenticated(true)} />
  }

  return (
    <div className="min-h-screen bg-[#F6F3EE] text-[#141414]">
      {/* Top Admin Header with Dynamic Branding */}
      <header className="sticky top-0 z-30 border-b border-[#E5E0D8] bg-white/95 shadow-xs backdrop-blur-md">
        <div className="section-shell flex h-16 sm:h-20 items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3.5 min-w-0 flex-1">
            <Link
              href="/"
              title="Return to Public Storefront"
              className="inline-flex items-center justify-center gap-1.5 rounded-full border border-[#d4a338]/30 bg-white/90 p-2 sm:px-3.5 sm:py-2 text-xs font-bold text-[#5e4318] shadow-xs transition hover:bg-[#faeed1] hover:text-[#17120a] shrink-0 active:scale-95"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden md:inline">Storefront</span>
            </Link>

            <div className="hidden h-5 w-px bg-[#d4a338]/30 sm:block shrink-0" />

            {/* Dynamic Branding Display in Admin Header */}
            <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
              {branding?.logoImageUrl && (branding.logoType === 'image' || branding.logoType === 'both') ? (
                <img
                  src={branding.logoImageUrl}
                  alt={branding.siteName}
                  className="h-8 w-auto max-w-[80px] sm:h-10 sm:max-w-[120px] rounded-xl object-contain border border-[#d4a338]/30 bg-white p-0.5 shadow-xs shrink-0"
                />
              ) : (
                <span className="grid h-8 w-8 sm:h-10 sm:w-10 place-items-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#fff3cf] via-[#e8bc57] to-[#b38320] text-xs sm:text-sm font-black text-[#17120a] shadow-soft border border-[#fbf3d5] shrink-0">
                  {branding?.logoText || 'NP'}
                </span>
              )}
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h1 className="font-serif text-sm sm:text-lg lg:text-xl font-bold leading-tight text-[#241705] truncate">
                    {branding?.siteName || 'NP Atelier'}
                  </h1>
                  <span className="rounded-md border border-[#D4AF37]/50 bg-[#FAF3E3] px-1.5 py-0.5 text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider text-[#7A5408] shrink-0">
                    Admin
                  </span>
                </div>
                <p className="hidden sm:block text-[10px] font-bold uppercase tracking-wider text-[#8c5f0b] truncate mt-0.5">
                  Crafts, Aquatics &amp; Store Management
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            <div className="hidden rounded-2xl border border-[#d4a338]/30 bg-white/80 px-3.5 py-1.5 text-right xl:block">
              <p className="text-[9px] font-bold uppercase tracking-wider text-[#73562a]">Gross Store Sales</p>
              <p className="text-xs sm:text-sm font-extrabold text-[#855a10]">₹{metrics.totalSales.toFixed(0)}</p>
            </div>

            <button
              type="button"
              onClick={() => openAddProductModal('aquarium')}
              className="inline-flex h-8 sm:h-9 items-center justify-center gap-1.5 rounded-full bg-cyan-700 px-2.5 sm:px-3.5 text-xs font-bold text-white shadow-xs transition hover:bg-cyan-800 active:scale-95 shrink-0 cursor-pointer"
              title="Add Aquatic Specimen"
            >
              <Fish className="h-3.5 w-3.5 text-cyan-200" />
              <span className="hidden sm:inline">Add Aquatic</span>
            </button>

            <button
              type="button"
              onClick={() => openAddProductModal('crafts')}
              className="inline-flex h-8 sm:h-9 items-center justify-center gap-1.5 rounded-full bg-[#17120A] px-2.5 sm:px-3.5 text-xs font-bold text-[#F3D789] border border-[#d4a338]/60 shadow-xs transition hover:bg-[#251D0B] active:scale-95 shrink-0 cursor-pointer"
              title="Add Artisan Craft"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add Craft</span>
            </button>

            <button
              type="button"
              onClick={handleAdminLogout}
              className="inline-flex h-8 sm:h-9 items-center justify-center gap-1.5 rounded-full border border-rose-200 bg-white/90 px-2.5 sm:px-3 text-xs font-bold text-rose-600 shadow-xs transition hover:bg-rose-50 hover:border-rose-300 active:scale-95 shrink-0 cursor-pointer"
              title="Sign out of admin session"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Content */}
      <div className="section-shell py-6 sm:py-8">
        {/* Navigation Tabs - Smooth Horizontal Rail */}
        <div className="mb-6 sm:mb-8 flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth pb-2 pt-1 -mx-2 px-2 sm:mx-0 sm:px-0 border-b border-[#d4a338]/30">
          {[
            { id: 'overview', label: 'Executive Analytics', icon: LayoutDashboard },
            { id: 'products', label: `Catalog (${products.length})`, icon: Package },
            { id: 'branding', label: 'Branding Settings', icon: Palette },
            { id: 'orders', label: `Orders (${orders.length})`, icon: PackageCheck },
            { id: 'coupons', label: 'Promos & Coupons', icon: Tag },
            { id: 'artisans', label: 'Makers & Aquarists', icon: Users },
          ].map((tab) => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 rounded-full px-4 sm:px-5 py-2 sm:py-2.5 text-xs font-bold transition-colors duration-200 shrink-0 cursor-pointer ${
                  isActive
                    ? 'text-[#241705]'
                    : 'border border-[#d4a338]/30 bg-white/80 text-[#5e4318] hover:bg-[#faeed1] hover:text-[#241705]'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="adminNavRailActivePill"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-[#faeed1] to-[#e8bc57] border border-[#d4a338] shadow-xs"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </span>
              </button>
            )
          })}
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: OVERVIEW & ANALYTICS */}
        {/* ========================================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-6 sm:space-y-8">
            {/* 4 Metric Cards */}
            <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
              <div className="glass-card p-3.5 sm:p-5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#8C827A] truncate">Gross Revenue</span>
                  <div className="grid h-7 w-7 sm:h-8 sm:w-8 place-items-center rounded-xl bg-emerald-100 text-emerald-800 shrink-0">
                    <IndianRupee className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </div>
                </div>
                <p className="mt-2 sm:mt-3 font-serif text-xl sm:text-3xl font-bold text-[#141414]">₹{metrics.totalSales.toFixed(0)}</p>
                <p className="mt-0.5 sm:mt-1 text-[10px] sm:text-[11px] font-semibold text-emerald-700 truncate">Crafts &amp; Aquatics</p>
              </div>

              <div className="glass-card p-3.5 sm:p-5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#8C827A] truncate">Total Orders</span>
                  <div className="grid h-7 w-7 sm:h-8 sm:w-8 place-items-center rounded-xl bg-amber-100 text-[#855A10] shrink-0">
                    <PackageCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </div>
                </div>
                <p className="mt-2 sm:mt-3 font-serif text-xl sm:text-3xl font-bold text-[#141414]">{metrics.totalOrdersCount}</p>
                <p className="mt-0.5 sm:mt-1 text-[10px] sm:text-[11px] font-semibold text-[#855A10] truncate">Direct fulfillment</p>
              </div>

              <div className="glass-card p-3.5 sm:p-5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#8C827A] truncate">Crafts Catalog</span>
                  <div className="grid h-7 w-7 sm:h-8 sm:w-8 place-items-center rounded-xl bg-rose-100 text-rose-700 shrink-0">
                    <Palette className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </div>
                </div>
                <p className="mt-2 sm:mt-3 font-serif text-xl sm:text-3xl font-bold text-[#141414]">{metrics.craftCount} Crafts</p>
                <p className="mt-0.5 sm:mt-1 text-[10px] sm:text-[11px] font-semibold text-[#8C827A] truncate">Jewelry &amp; Decor</p>
              </div>

              <div className="glass-card p-3.5 sm:p-5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#8C827A] truncate">Aquatics</span>
                  <div className="grid h-7 w-7 sm:h-8 sm:w-8 place-items-center rounded-xl bg-cyan-100 text-cyan-800 shrink-0">
                    <Fish className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </div>
                </div>
                <p className="mt-2 sm:mt-3 font-serif text-xl sm:text-3xl font-bold text-[#141414]">{metrics.aquaticCount} Aquatics</p>
                <p className="mt-0.5 sm:mt-1 text-[10px] sm:text-[11px] font-semibold text-cyan-700 truncate">Live fish &amp; tanks</p>
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
                    Living Aquatics Categories ({allAquariumCategories.length})
                  </p>
                  {allAquariumCategories.map((cat) => {
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
                    Artisan Crafts Categories ({allCraftCategories.length})
                  </p>
                  {allCraftCategories.map((cat) => {
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
                  {orders.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-[#d4a338]/30 bg-white/40 p-6 text-center text-xs text-[#73562a]">
                      <Package className="mx-auto h-7 w-7 text-[#d4a338]/60 mb-2" />
                      <p className="font-semibold text-[#241705]">No customer orders yet</p>
                      <p className="text-[11px] text-[#73562a] mt-0.5">When buyers place orders, they will appear here in real-time.</p>
                    </div>
                  ) : (
                    orders.slice(0, 5).map((order: any) => (
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
                    ))
                  )}
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

              <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 sm:gap-3">
                {/* Department Filter */}
                <select
                  value={productDepartment}
                  onChange={(e) => {
                    setProductDepartment(e.target.value)
                    setProductCategory('All')
                  }}
                  className="h-10 w-full sm:w-auto rounded-xl border border-[#d4a338]/35 bg-white px-3 text-xs font-bold text-[#241705] outline-none shadow-xs"
                >
                  <option value="All">All Departments</option>
                  <option value="aquarium">Living Aquatics</option>
                  <option value="crafts">Handmade Crafts</option>
                </select>

                {/* Category Filter */}
                <select
                  value={productCategory}
                  onChange={(e) => setProductCategory(e.target.value)}
                  className="h-10 w-full sm:w-auto rounded-xl border border-[#d4a338]/35 bg-white px-3 text-xs font-bold text-[#241705] outline-none shadow-xs"
                >
                  <option value="All">All Categories</option>
                  {productDepartment !== 'crafts' &&
                    allAquariumCategories.map((c) => (
                      <option key={c} value={c}>
                        Aquatics: {c}
                      </option>
                    ))}
                  {productDepartment !== 'aquarium' &&
                    allCraftCategories.map((c) => (
                      <option key={c} value={c}>
                        Craft: {c}
                      </option>
                    ))}
                </select>

                <button
                  type="button"
                  onClick={() =>
                    openAddProductModal(
                      productDepartment === 'crafts' ? 'crafts' : 'aquarium',
                      productCategory !== 'All' ? productCategory : undefined
                    )
                  }
                  className="col-span-2 sm:col-span-1 btn-primary text-xs py-2 px-4 whitespace-nowrap flex items-center justify-center gap-1.5 w-full sm:w-auto"
                >
                  <Plus className="h-4 w-4" />
                  <span>
                    {productCategory !== 'All'
                      ? `Add to ${productCategory.length > 18 ? productCategory.slice(0, 16) + '...' : productCategory}`
                      : 'New Product'}
                  </span>
                </button>
              </div>
            </div>

            {/* Category-Wise Quick Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs -mx-2 px-2 sm:mx-0 sm:px-0">
              <span className="text-[10px] font-extrabold text-[#855A10] uppercase tracking-wider shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#faeed1]/70 border border-[#d4a338]/30">
                <Tag className="h-3 w-3 text-[#B8860B]" /> Filter:
              </span>
              <button
                type="button"
                onClick={() => setProductCategory('All')}
                className={`rounded-full px-3 py-1 font-bold whitespace-nowrap text-xs transition shrink-0 ${
                  productCategory === 'All'
                    ? 'bg-[#855A10] text-white shadow-xs'
                    : 'bg-white/85 border border-[#d4a338]/30 text-[#5E4318] hover:bg-[#faeed1]'
                }`}
              >
                All ({products.length})
              </button>
              {(productDepartment === 'crafts'
                ? allCraftCategories
                : productDepartment === 'aquarium'
                ? allAquariumCategories
                : Array.from(new Set([...allCraftCategories, ...allAquariumCategories]))
              ).map((cat) => {
                const count = products.filter((p: Product) => p.category === cat).length
                const isActive = productCategory === cat
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setProductCategory(cat)}
                    className={`rounded-full px-3 py-1 font-bold whitespace-nowrap text-xs transition flex items-center gap-1.5 shrink-0 ${
                      isActive
                        ? 'bg-[#855A10] text-white shadow-xs'
                        : 'bg-white/85 border border-[#d4a338]/30 text-[#5E4318] hover:bg-[#faeed1]'
                    }`}
                  >
                    <span>{cat}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        isActive ? 'bg-white/25 text-white' : 'bg-[#faeed1] text-[#855A10]'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Mobile Product Cards View (< md) */}
            <div className="space-y-3 md:hidden">
              {filteredProducts.length === 0 ? (
                <div className="glass-card p-8 text-center text-xs text-[#73562a]">
                  <Package className="mx-auto h-8 w-8 text-[#d4a338]/60 mb-2" />
                  <p className="font-bold text-sm text-[#241705]">No matching products found</p>
                  <p className="mt-1 text-[11px]">Try adjusting your search query or department filter.</p>
                </div>
              ) : (
                filteredProducts.map((p: Product) => {
                  const isAqua = p.department === 'aquarium' || aquariumCategories.includes(p.category)
                  return (
                    <div
                      key={p.id}
                      className="glass-card p-3.5 space-y-2.5 rounded-2xl border border-[#d4a338]/30 bg-white/90 shadow-xs"
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={p.image}
                          alt={p.title}
                          onError={(e) => {
                            e.currentTarget.src = fallbackCraftImage
                          }}
                          className="h-16 w-16 rounded-xl object-cover border border-[#d4a338]/25 shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`rounded-full px-2 py-0.5 text-[9px] font-bold shrink-0 ${
                                isAqua
                                  ? 'bg-cyan-100 text-cyan-900 border border-cyan-300'
                                  : 'bg-amber-100 text-amber-900 border border-amber-300'
                              }`}
                            >
                              {isAqua ? 'Aquatics' : 'Craft'}
                            </span>
                            <span className="text-[10px] font-bold text-[#855A10] truncate">
                              {p.category}
                            </span>
                          </div>
                          <h4 className="font-bold text-xs text-[#241705] truncate mt-1">
                            {p.title}
                          </h4>
                          <div className="flex items-center justify-between mt-1">
                            <span className="font-extrabold text-sm text-[#855a10]">
                              {p.price}
                            </span>
                            <span
                              className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${
                                (p.stock ?? 20) > 0
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {p.stock ?? 25} in stock
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-[#d4a338]/15 text-[11px]">
                        <span className="text-[#73562a] font-medium">
                          ★ {p.rating ?? 4.9} ({p.reviews ?? 12})
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => openEditProductModal(p)}
                            className="inline-flex items-center gap-1 rounded-lg border border-[#d4a338]/40 bg-[#faeed1]/70 px-2.5 py-1 font-bold text-[#241705] text-xs hover:bg-[#faeed1]"
                          >
                            <Edit className="h-3 w-3" /> Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Delete "${p.title}"?`)) {
                                deleteProduct(p.id)
                              }
                            }}
                            className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1 font-bold text-rose-600 text-xs hover:bg-rose-500 hover:text-white"
                          >
                            <Trash2 className="h-3 w-3" /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>

            {/* Desktop Products Table View (>= md) */}
            <div className="hidden md:block glass-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-[#d4a338]/20 bg-[#faeed1]/50 font-bold uppercase tracking-wider text-[#73562a]">
                    <tr>
                      <th className="p-4">Product</th>
                      <th className="p-4">Department</th>
                      <th className="p-4">Category &amp; Subcategory</th>
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
                              {isAqua ? 'Aquatics' : 'Craft'}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="font-semibold text-[#5E4318]">{p.category}</div>
                            {p.subCategory && p.subCategory !== p.category && (
                              <div className="text-[10px] text-[#8C827A] flex items-center gap-1 mt-0.5">
                                <Tag className="h-2.5 w-2.5 text-[#b8860b]" />
                                <span>{p.subCategory}</span>
                              </div>
                            )}
                          </td>
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
                            {p.rating ?? 4.9} ({p.reviews ?? 12} reviews)
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
          <div className="space-y-6">
            {/* Top Bar with Live Store Link */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-2xl border border-[#D4AF37]/40 bg-gradient-to-r from-white via-[#FCF9EE] to-[#FAF3DE] p-4 sm:p-5 shadow-xs">
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full border border-[#D4AF37]/50 bg-white px-3 py-1 text-xs font-bold text-[#855A10] shadow-xs">
                  <Palette className="h-3.5 w-3.5 text-[#B8860B]" />
                  <span>Real-Time Brand System</span>
                </div>
                <h3 className="mt-2 font-serif text-xl sm:text-2xl font-bold text-[#141414]">
                  Store Branding &amp; Identity Studio
                </h3>
                <p className="mt-1 text-xs text-[#5A554E] max-w-2xl leading-relaxed">
                  Categorized studio settings. Configure brand identity, logos, top ticker ribbons, and WhatsApp routing. All edits reflect in the live device simulator.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/"
                  target="_blank"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-[#D4AF37]/60 bg-white px-3.5 py-2 text-xs font-bold text-[#855A10] hover:bg-[#FAF4E5] hover:border-[#D4AF37] transition shadow-xs shrink-0 cursor-pointer"
                >
                  <span>View Live Store</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {/* Categorized Sub-Tabs Navigation Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
              {[
                {
                  id: 'identity',
                  label: 'Identity & Currency',
                  short: 'Identity',
                  icon: Globe,
                  desc: 'Brand name, tagline & currency',
                },
                {
                  id: 'logo',
                  label: 'Logo & Brandmark',
                  short: 'Brandmark',
                  icon: Sparkles,
                  desc: 'Medallion badge & graphic logo',
                },
                {
                  id: 'announcement',
                  label: 'Announcement Ribbon',
                  short: 'Announcements',
                  icon: Tag,
                  desc: 'Top header sale ribbon & presets',
                },
                {
                  id: 'contact',
                  label: 'Support & WhatsApp',
                  short: 'WhatsApp & Line',
                  icon: Phone,
                  desc: 'Support email & 1-click orders',
                },
              ].map((tab) => {
                const isActive = brandingSubTab === tab.id
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setBrandingSubTab(tab.id as any)}
                    className={`group relative p-3 sm:p-3.5 rounded-2xl border text-left transition flex flex-col justify-between cursor-pointer ${
                      isActive
                        ? 'border-[#D4AF37] bg-gradient-to-br from-white via-[#FFFDF8] to-[#FBF4E4] ring-2 ring-[#D4AF37]/40 shadow-sm'
                        : 'border-[#E8DEC7] bg-white/80 hover:bg-[#FAF6EE] hover:border-[#D4AF37]/60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div
                        className={`grid h-8 w-8 place-items-center rounded-xl transition ${
                          isActive
                            ? 'bg-[#141414] text-[#ECC872] shadow-xs'
                            : 'bg-[#F5EFE3] text-[#8C7A58] group-hover:text-[#B8860B]'
                        }`}
                      >
                        <tab.icon className="h-4 w-4" />
                      </div>
                      {isActive ? (
                        <span className="flex h-2 w-2 relative">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B8860B] opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#B8860B]" />
                        </span>
                      ) : (
                        <span className="text-[10px] text-[#A6977D] font-mono">0{['identity', 'logo', 'announcement', 'contact'].indexOf(tab.id) + 1}</span>
                      )}
                    </div>
                    <div>
                      <p className={`text-xs sm:text-sm font-bold truncate ${isActive ? 'text-[#141414]' : 'text-[#5A5043]'}`}>
                        {tab.label}
                      </p>
                      <p className="text-[11px] text-[#8C7E6A] mt-0.5 hidden sm:block truncate">
                        {tab.desc}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Split Studio: Left = Active Sub-Tab Form, Right = Live Desktop / Mobile Switcher Preview */}
            <div className="grid gap-6 lg:gap-8 grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] items-start">
              {/* Left Column: Categorized Settings Form Card */}
              <div className="glass-card p-5 sm:p-7 md:p-8 space-y-6">
                <form onSubmit={handleSaveBranding} className="space-y-6">
                  {/* SUB-TAB 1: CORE STORE IDENTITY & CURRENCY */}
                  {brandingSubTab === 'identity' && (
                    <div className="space-y-5">
                      <div className="flex items-center justify-between border-b border-[#E8DEC7] pb-3">
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-[#B8860B]" />
                          <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-[#141414]">
                            Store Identity &amp; Currency
                          </h4>
                        </div>
                        <span className="rounded-full bg-[#FAF3DE] border border-[#DFCFA6] px-2.5 py-0.5 text-[10px] font-bold text-[#855A10]">
                          Tab 1 of 4
                        </span>
                      </div>

                      <div className="space-y-4">
                        {/* Website Name */}
                        <div>
                          <label className="block text-xs font-bold text-[#141414] mb-1.5">
                            Website / Brand Name <span className="text-rose-500">*</span>
                          </label>
                          <input
                            required
                            type="text"
                            value={brandingForm.siteName}
                            onChange={(e) => setBrandingForm({ ...brandingForm, siteName: e.target.value })}
                            placeholder="e.g. NP Atelier"
                            className="h-11 w-full rounded-xl border border-[#d4a338]/40 bg-white px-3.5 text-sm font-bold text-[#141414] outline-none focus:border-[#c59325] focus:ring-2 focus:ring-[#D4AF37]/20 shadow-xs transition"
                          />
                          <p className="mt-1 text-[11px] text-[#7A6F62]">
                            Appears in navbar, header logo, customer invoices, emails, metadata, and browser title.
                          </p>
                          {/* Quick brand name chips */}
                          <div className="mt-2 flex flex-wrap gap-1.5 items-center">
                            <span className="text-[10px] font-bold text-[#8C7A58] uppercase tracking-wider">Quick Suggestions:</span>
                            {['NP Atelier', 'NP Studio', 'Atelier Aquatics', 'The Artisan Collective'].map((n) => (
                              <button
                                key={n}
                                type="button"
                                onClick={() => setBrandingForm({ ...brandingForm, siteName: n })}
                                className="rounded-lg border border-[#DFCFA6]/60 bg-white px-2 py-0.5 text-[10px] font-semibold text-[#6E5C32] hover:bg-[#FAF4E5] hover:border-[#D4AF37] transition cursor-pointer"
                              >
                                {n}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Tagline / Subtitle */}
                        <div>
                          <label className="block text-xs font-bold text-[#141414] mb-1.5">
                            Website Tagline / Subtitle
                          </label>
                          <input
                            type="text"
                            value={brandingForm.tagline}
                            onChange={(e) => setBrandingForm({ ...brandingForm, tagline: e.target.value })}
                            placeholder="e.g. Luxury Crafts &amp; Exotic Aquatics"
                            className="h-11 w-full rounded-xl border border-[#d4a338]/40 bg-white px-3.5 text-xs sm:text-sm text-[#141414] outline-none focus:border-[#c59325] focus:ring-2 focus:ring-[#D4AF37]/20 shadow-xs transition"
                          />
                          <p className="mt-1 text-[11px] text-[#7A6F62]">
                            Displays beneath the brand logo across hero sections, search headers, and footer cards.
                          </p>
                          {/* Quick tagline chips */}
                          <div className="mt-2 flex flex-wrap gap-1.5 items-center">
                            <span className="text-[10px] font-bold text-[#8C7A58] uppercase tracking-wider">Presets:</span>
                            {[
                              'Luxury Crafts & Exotic Aquatics',
                              'Handcrafted Art & Living Waters',
                              'Bespoke Resin Art & Marine Life',
                            ].map((tg) => (
                              <button
                                key={tg}
                                type="button"
                                onClick={() => setBrandingForm({ ...brandingForm, tagline: tg })}
                                className="rounded-lg border border-[#DFCFA6]/60 bg-white px-2 py-0.5 text-[10px] font-semibold text-[#6E5C32] hover:bg-[#FAF4E5] hover:border-[#D4AF37] transition cursor-pointer"
                              >
                                {tg}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Store Currency */}
                        <div>
                          <label className="block text-xs font-bold text-[#141414] mb-1.5">
                            Store Primary Currency
                          </label>
                          <select
                            value={brandingForm.currency || '₹'}
                            onChange={(e) => setBrandingForm({ ...brandingForm, currency: e.target.value })}
                            className="h-11 w-full rounded-xl border border-[#d4a338]/40 bg-white px-3.5 text-xs sm:text-sm font-bold text-[#141414] outline-none focus:border-[#c59325] shadow-xs cursor-pointer"
                          >
                            <option value="₹">₹ INR — Indian Rupee (Default)</option>
                            <option value="$">$ USD — US Dollar</option>
                            <option value="€">€ EUR — Euro</option>
                            <option value="£">£ GBP — British Pound</option>
                            <option value="AED">AED — United Arab Emirates Dirham</option>
                            <option value="¥">¥ JPY — Japanese Yen</option>
                          </select>
                          <p className="mt-1 text-[11px] text-[#7A6F62]">
                            Applied automatically across all prices, cart summaries, and customer invoices.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SUB-TAB 2: LOGO & BRANDMARK */}
                  {brandingSubTab === 'logo' && (
                    <div className="space-y-5">
                      <div className="flex items-center justify-between border-b border-[#E8DEC7] pb-3">
                        <div className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-[#B8860B]" />
                          <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-[#141414]">
                            Logo &amp; Brandmark Studio
                          </h4>
                        </div>
                        <span className="rounded-full bg-[#FAF3DE] border border-[#DFCFA6] px-2.5 py-0.5 text-[10px] font-bold text-[#855A10]">
                          Tab 2 of 4
                        </span>
                      </div>

                      {/* Presentation Format Picker */}
                      <div>
                        <label className="block text-xs font-bold text-[#141414] mb-2">
                          Logo Presentation Format
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                          {[
                            {
                              id: 'icon',
                              label: 'Monogram Emblem',
                              desc: 'Gold circular medallion badge',
                              icon: Sparkles,
                            },
                            {
                              id: 'image',
                              label: 'Graphic Logo',
                              desc: 'Custom uploaded image/vector',
                              icon: ImageIcon,
                            },
                            {
                              id: 'both',
                              label: 'Icon + Graphic',
                              desc: 'Medallion badge & custom logo',
                              icon: Layers,
                            },
                          ].map((mode) => {
                            const isSelected = brandingForm.logoType === mode.id
                            return (
                              <button
                                key={mode.id}
                                type="button"
                                onClick={() => setBrandingForm({ ...brandingForm, logoType: mode.id as any })}
                                className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between cursor-pointer ${
                                  isSelected
                                    ? 'border-[#D4AF37] bg-gradient-to-b from-[#FFFDF8] via-[#FAF3DE] to-[#F5E6BF] ring-2 ring-[#D4AF37]/50 shadow-sm'
                                    : 'border-[#DFCFA6]/60 bg-white hover:border-[#D4AF37] hover:bg-[#FAF6EE]'
                                }`}
                              >
                                <div className="flex items-center justify-between mb-1.5">
                                  <mode.icon
                                    className={`h-4 w-4 ${isSelected ? 'text-[#855A10]' : 'text-[#8C827A]'}`}
                                  />
                                  {isSelected && (
                                    <span className="h-2 w-2 rounded-full bg-[#B8860B]" />
                                  )}
                                </div>
                                <div>
                                  <p className="text-xs font-bold text-[#141414]">{mode.label}</p>
                                  <p className="text-[10px] text-[#6E6352] mt-0.5 leading-snug">{mode.desc}</p>
                                </div>
                              </button>
                            )
                          })}
                        </div>
                      </div>

                      {/* Monogram Symbol Editor */}
                      {(brandingForm.logoType === 'icon' || brandingForm.logoType === 'both') && (
                        <div className="rounded-2xl border border-[#D4AF37]/40 bg-gradient-to-b from-[#FFFDF9] to-[#FAF5E8] p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-[#141414]">
                              Emblem Monogram Symbol (Up to 5 characters)
                            </label>
                            <span className="text-[10px] font-bold text-[#855A10] uppercase tracking-wider">
                              Live Medallion
                            </span>
                          </div>

                          <div className="flex items-center gap-3">
                            {/* Live Medallion Badge */}
                            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-[#1C170F] via-[#120F0A] to-[#0A0805] text-[#ECC872] border-2 border-[#D4AF37] font-serif text-base font-extrabold shadow-md shrink-0">
                              {brandingForm.logoText || 'NP'}
                            </div>

                            {/* Symbol Input */}
                            <div className="flex-1">
                              <input
                                type="text"
                                maxLength={5}
                                value={brandingForm.logoText}
                                onChange={(e) => setBrandingForm({ ...brandingForm, logoText: e.target.value })}
                                placeholder="NP"
                                className="h-11 w-full rounded-xl border border-[#d4a338]/40 bg-white px-3.5 text-center sm:text-left text-base font-bold text-[#141414] outline-none focus:border-[#c59325] focus:ring-2 focus:ring-[#D4AF37]/20 shadow-xs"
                              />
                            </div>
                          </div>

                          {/* Preset Chips */}
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-[#8C7A58] mb-1.5">
                              Curated Brand Monograms:
                            </p>
                            <div className="flex flex-wrap items-center gap-2">
                              {['NP', 'NPA', 'ATEL', 'LUX', 'ART', '✦NP'].map((sym) => {
                                const isActive = brandingForm.logoText === sym
                                return (
                                  <button
                                    key={sym}
                                    type="button"
                                    onClick={() => setBrandingForm({ ...brandingForm, logoText: sym })}
                                    className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition shadow-xs cursor-pointer ${
                                      isActive
                                        ? 'border-[#D4AF37] bg-[#141414] text-[#ECC872] shadow-sm scale-105'
                                        : 'border-[#DFCFA6]/60 bg-white text-[#5A554E] hover:border-[#D4AF37] hover:bg-[#FAF4E5]'
                                    }`}
                                  >
                                    {sym}
                                  </button>
                                )
                              })}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Logo Image Upload & URL */}
                      {(brandingForm.logoType === 'image' || brandingForm.logoType === 'both') && (
                        <div className="space-y-3 rounded-2xl border border-[#d4a338]/30 bg-white/70 p-4">
                          <label className="block text-xs font-bold text-[#141414]">
                            Graphic Brandmark Image
                          </label>

                          {/* File Upload Button + Preview */}
                          <div className="flex items-center gap-3">
                            {brandingForm.logoImageUrl ? (
                              <div className="relative h-14 w-14 shrink-0 rounded-xl border border-[#d4a338]/40 bg-white p-1 shadow-xs">
                                <img
                                  src={brandingForm.logoImageUrl}
                                  alt="Logo Preview"
                                  className="h-full w-full object-contain"
                                />
                              </div>
                            ) : null}

                            <div className="flex-1 space-y-1">
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
                                className="btn-gold text-xs py-2 px-4 shadow-xs cursor-pointer"
                              >
                                <Upload className="h-3.5 w-3.5" />
                                <span>{isUploadingLogo ? 'Uploading Logo...' : 'Upload Brand Logo'}</span>
                              </button>
                              <p className="text-[10px] text-[#8C827A]">
                                PNG, SVG, JPG, WebP transparent backgrounds recommended.
                              </p>
                            </div>
                          </div>

                          {/* Direct Logo Image URL Input */}
                          <div>
                            <span className="text-[11px] font-bold text-[#7A6F62] block mb-1">
                              Or enter direct image URL:
                            </span>
                            <input
                              type="url"
                              value={brandingForm.logoImageUrl}
                              onChange={(e) => setBrandingForm({ ...brandingForm, logoImageUrl: e.target.value })}
                              placeholder="https://example.com/brand-logo.png"
                              className="h-10 w-full rounded-xl border border-[#d4a338]/35 bg-white px-3 text-xs text-[#141414] outline-none focus:border-[#c59325]"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* SUB-TAB 3: ANNOUNCEMENT RIBBON */}
                  {brandingSubTab === 'announcement' && (
                    <div className="space-y-5">
                      <div className="flex items-center justify-between border-b border-[#E8DEC7] pb-3">
                        <div className="flex items-center gap-2">
                          <Tag className="h-4 w-4 text-[#B8860B]" />
                          <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-[#141414]">
                            Top Announcement Ribbon
                          </h4>
                        </div>
                        <span className="rounded-full bg-[#FAF3DE] border border-[#DFCFA6] px-2.5 py-0.5 text-[10px] font-bold text-[#855A10]">
                          Tab 3 of 4
                        </span>
                      </div>

                      <div className="space-y-3.5">
                        <div>
                          <label className="block text-xs font-bold text-[#141414] mb-1.5">
                            Announcement Bar Message
                          </label>
                          <textarea
                            rows={3}
                            value={brandingForm.announcementText}
                            onChange={(e) => setBrandingForm({ ...brandingForm, announcementText: e.target.value })}
                            placeholder="e.g. Handcrafted Artisan Drops &amp; Exotic Aquatics Live • Code ATELIER10 for 10% off"
                            className="w-full rounded-xl border border-[#d4a338]/40 bg-white p-3.5 text-xs text-[#141414] outline-none focus:border-[#c59325] focus:ring-2 focus:ring-[#D4AF37]/20 shadow-xs leading-relaxed"
                          />
                          <p className="mt-1 text-[11px] text-[#7A6F62]">
                            Pinned at the very top of all storefront pages to announce sales, free shipping, or special drops.
                          </p>
                        </div>

                        {/* Curated Presets */}
                        <div className="space-y-2 pt-2 border-t border-[#E8DEC7]">
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8C7A58]">
                            Curated Announcement Presets (Click to apply):
                          </label>
                          <div className="space-y-1.5">
                            {[
                              'Handcrafted Artisan Drops & Exotic Aquatics Live • Code ATELIER10 for 10% off',
                              '✦ Free Express Shipping on Orders Above ₹1,499 Across India',
                              'Live Transit Arrival Guarantee & Oxygenated Packaging on All Marine Drops',
                              '✨ New Spring Resin & Living Coral Collections Just Dropped',
                              'VIP Studio Access: DM on WhatsApp for Custom Commission Orders',
                            ].map((txt, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => setBrandingForm({ ...brandingForm, announcementText: txt })}
                                className="w-full text-left rounded-xl border border-[#DFCFA6]/60 bg-white/80 p-2.5 text-xs text-[#5A5043] hover:bg-[#FAF4E5] hover:border-[#D4AF37] hover:text-[#141414] transition shadow-xs flex items-center justify-between group cursor-pointer"
                              >
                                <span className="truncate pr-2 font-medium">{txt}</span>
                                <span className="text-[10px] font-bold text-[#B8860B] opacity-0 group-hover:opacity-100 transition shrink-0">
                                  Apply ↗
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SUB-TAB 4: SUPPORT CHANNELS & WHATSAPP */}
                  {brandingSubTab === 'contact' && (
                    <div className="space-y-5">
                      <div className="flex items-center justify-between border-b border-[#E8DEC7] pb-3">
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-[#B8860B]" />
                          <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-[#141414]">
                            Support Channels &amp; 1-Click WhatsApp
                          </h4>
                        </div>
                        <span className="rounded-full bg-[#FAF3DE] border border-[#DFCFA6] px-2.5 py-0.5 text-[10px] font-bold text-[#855A10]">
                          Tab 4 of 4
                        </span>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-[#141414] mb-1.5 flex items-center gap-1.5">
                            <Mail className="h-3.5 w-3.5 text-[#B8860B]" />
                            <span>Official Customer Support Email</span>
                          </label>
                          <input
                            type="email"
                            value={brandingForm.contactEmail}
                            onChange={(e) => setBrandingForm({ ...brandingForm, contactEmail: e.target.value })}
                            placeholder="npatelierindia@gmail.com"
                            className="h-11 w-full rounded-xl border border-[#d4a338]/40 bg-white px-3.5 text-xs font-medium text-[#141414] outline-none focus:border-[#c59325]"
                          />
                          <p className="mt-1 text-[11px] text-[#7A6F62]">
                            Displayed in the storefront footer, customer invoices, and contact modals.
                          </p>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-[#141414] mb-1.5 flex items-center gap-1.5">
                            <MessageCircle className="h-3.5 w-3.5 text-emerald-600" />
                            <span>WhatsApp &amp; Phone Support Line</span>
                          </label>
                          <input
                            type="text"
                            value={brandingForm.contactPhone}
                            onChange={(e) => setBrandingForm({ ...brandingForm, contactPhone: e.target.value })}
                            placeholder="+91 93412 97124"
                            className="h-11 w-full rounded-xl border border-[#d4a338]/40 bg-white px-3.5 text-xs font-bold text-[#141414] outline-none focus:border-[#c59325]"
                          />
                          <p className="mt-1 text-[11px] text-[#7A6F62]">
                            Powers the instant &quot;Order on WhatsApp&quot; button across all catalog cards.
                          </p>
                        </div>

                        {/* WhatsApp Ordering Direct Simulation Note */}
                        <div className="rounded-2xl border border-emerald-300/60 bg-gradient-to-br from-emerald-50/70 to-emerald-100/40 p-3.5 space-y-2">
                          <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                            <MessageCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                            <span>Instant WhatsApp Catalog Order Routing</span>
                          </div>
                          <p className="text-[11px] text-emerald-800 leading-relaxed">
                            When customers click &quot;Order on WhatsApp&quot; on any craft or marine item, a pre-filled WhatsApp message will automatically open addressed to <span className="font-bold underline">{brandingForm.contactPhone || '+91 93412 97124'}</span> with the item title, SKU, and price.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Sub-tab Progressive Navigation Buttons */}
                  <div className="flex items-center justify-between pt-4 border-t border-[#E8DEC7]">
                    <button
                      type="button"
                      disabled={brandingSubTab === 'identity'}
                      onClick={() => {
                        const tabs: Array<'identity' | 'logo' | 'announcement' | 'contact'> = [
                          'identity',
                          'logo',
                          'announcement',
                          'contact',
                        ]
                        const idx = tabs.indexOf(brandingSubTab)
                        if (idx > 0) setBrandingSubTab(tabs[idx - 1])
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#DFCFA6] text-xs font-bold text-[#6E5C32] hover:bg-[#FAF4E5] disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
                    >
                      <ChevronLeft className="h-3.5 w-3.5" />
                      <span>Previous Tab</span>
                    </button>

                    <button
                      type="button"
                      disabled={brandingSubTab === 'contact'}
                      onClick={() => {
                        const tabs: Array<'identity' | 'logo' | 'announcement' | 'contact'> = [
                          'identity',
                          'logo',
                          'announcement',
                          'contact',
                        ]
                        const idx = tabs.indexOf(brandingSubTab)
                        if (idx < tabs.length - 1) setBrandingSubTab(tabs[idx + 1])
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#DFCFA6] text-xs font-bold text-[#6E5C32] hover:bg-[#FAF4E5] disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
                    >
                      <span>Next Tab</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Primary Submit & Reset Actions */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-3 border-t border-[#d4a338]/30">
                    <button
                      type="submit"
                      disabled={isSavingBranding}
                      className="btn-gold flex-1 py-3 text-xs font-bold justify-center shadow-[0_6px_20px_rgba(212,175,55,0.35)] cursor-pointer"
                    >
                      <Save className="h-4 w-4" />
                      <span>{isSavingBranding ? 'Saving Changes...' : 'Save Branding Settings'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleResetBranding}
                      className="inline-flex items-center justify-center gap-1.5 rounded-full border border-[#d4a338]/30 bg-white px-4 py-2.5 text-xs font-bold text-[#8C827A] hover:bg-[#faeed1] hover:text-[#241705] transition cursor-pointer"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      <span>Reset to Defaults</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Right Column: Live Device Preview Switcher (Desktop & Mobile) */}
              <div className="space-y-4 lg:sticky lg:top-24">
                {/* Device Switcher Header Card */}
                <div className="flex items-center justify-between rounded-2xl border border-[#D4AF37]/50 bg-white p-2.5 shadow-xs">
                  <div className="flex items-center gap-2 pl-2">
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                    <span className="text-xs font-bold text-[#141414]">Live Preview</span>
                  </div>

                  {/* Desktop vs Mobile Toggle Buttons */}
                  <div className="flex items-center gap-1 rounded-xl bg-[#FAF5E8] p-1 border border-[#DFCFA6]/60">
                    <button
                      type="button"
                      onClick={() => setPreviewDevice('desktop')}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                        previewDevice === 'desktop'
                          ? 'bg-[#141414] text-[#ECC872] shadow-xs'
                          : 'text-[#6E5C32] hover:text-[#141414]'
                      }`}
                    >
                      <Monitor className="h-3.5 w-3.5" />
                      <span>Desktop</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPreviewDevice('mobile')}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                        previewDevice === 'mobile'
                          ? 'bg-[#141414] text-[#ECC872] shadow-xs'
                          : 'text-[#6E5C32] hover:text-[#141414]'
                      }`}
                    >
                      <Smartphone className="h-3.5 w-3.5" />
                      <span>Mobile</span>
                    </button>
                  </div>
                </div>

                {/* ========================================================= */}
                {/* VIEW 1: DESKTOP SIMULATOR */}
                {/* ========================================================= */}
                {previewDevice === 'desktop' && (
                  <div className="rounded-2xl overflow-hidden border border-[#D4AF37]/40 bg-white shadow-lg space-y-0 transition-all duration-300">
                    {/* Desktop Browser Chrome */}
                    <div className="bg-[#FAF5E8] px-3.5 py-2.5 border-b border-[#E8DEC7] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-rose-400 inline-block" />
                        <span className="h-2.5 w-2.5 rounded-full bg-amber-400 inline-block" />
                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 inline-block" />
                        <div className="ml-2 flex items-center gap-1.5 rounded-lg bg-white border border-[#E8DEC7] px-2.5 py-0.5 text-[10px] text-[#6E5C32] font-mono">
                          <span className="text-[#B8860B]">🔒</span>
                          <span>https://npatelier.in</span>
                        </div>
                      </div>
                      <span className="text-[9px] font-bold uppercase tracking-wider text-[#8C7A58]">
                        Desktop View
                      </span>
                    </div>

                    {/* Viewport Content */}
                    <div className="p-3 sm:p-4 bg-[#FAF7F2] space-y-3.5">
                      {/* 1. Desktop Simulated Top Ribbon */}
                      <div className="rounded-xl bg-gradient-to-r from-[#17130C] via-[#2A2214] to-[#17130C] border border-[#D4AF37]/50 p-2 text-center text-[10px] font-bold text-[#ECC872] flex items-center justify-center gap-1.5 shadow-xs">
                        <Sparkles className="h-3 w-3 text-[#ECC872] shrink-0" />
                        <span className="truncate">
                          {brandingForm.announcementText || 'Handcrafted Artisan Drops & Exotic Aquatics Live'}
                        </span>
                      </div>

                      {/* 2. Desktop Navigation Header */}
                      <div className="rounded-2xl border border-[#DFCFA6]/80 bg-white p-3 sm:p-3.5 shadow-sm space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          {/* Brand Logo & Title */}
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            {brandingForm.logoImageUrl &&
                            (brandingForm.logoType === 'image' || brandingForm.logoType === 'both') ? (
                              <img
                                src={brandingForm.logoImageUrl}
                                alt="Logo"
                                className="h-8 w-auto max-w-[65px] rounded-lg object-contain border border-[#d4a338]/40 bg-white p-0.5 shadow-xs shrink-0"
                              />
                            ) : null}

                            {(!brandingForm.logoImageUrl ||
                              brandingForm.logoType === 'icon' ||
                              brandingForm.logoType === 'both') && (
                              <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-[#1C170F] to-[#0A0805] text-[#ECC872] border border-[#D4AF37]/80 font-serif font-extrabold text-xs shadow-xs shrink-0">
                                {brandingForm.logoText || 'NP'}
                              </span>
                            )}

                            <div className="min-w-0">
                              <p className="font-serif text-sm font-bold text-[#141414] leading-tight truncate">
                                {brandingForm.siteName || 'NP Atelier'}
                              </p>
                              <p className="text-[8px] font-bold uppercase tracking-wider text-[#9E7A2E] truncate">
                                {brandingForm.tagline || 'Luxury Crafts & Exotic Aquatics'}
                              </p>
                            </div>
                          </div>

                          {/* Desktop Header Badges */}
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className="rounded-full bg-[#FAF5E8] border border-[#DFCFA6] text-[#7A5408] px-2 py-0.5 text-[9px] font-bold hidden sm:inline">
                              Wishlist (3)
                            </span>
                            <span className="rounded-full bg-[#141414] text-[#ECC872] border border-[#D4AF37]/60 px-2.5 py-1 text-[10px] font-extrabold shadow-xs">
                              Bag (2)
                            </span>
                          </div>
                        </div>

                        {/* Desktop Nav Links */}
                        <div className="flex items-center gap-3 pt-2 border-t border-[#F2ECE1] text-[10px] font-bold text-[#6B5A33]">
                          <span className="text-[#141414] border-b-2 border-[#D4AF37] pb-0.5">Artisan Drops</span>
                          <span>Living Aquatics</span>
                          <span>Meet Makers</span>
                          <span>Inspiration</span>
                        </div>
                      </div>

                      {/* 3. Hero Stage Banner */}
                      <div className="rounded-2xl border border-[#D4AF37]/40 bg-gradient-to-br from-white via-[#FCF9EE] to-[#F7ECCF] p-3.5 shadow-xs">
                        <span className="inline-block rounded-full bg-white/90 border border-[#D4AF37]/50 px-2 py-0.5 text-[9px] font-bold text-[#7A5408] mb-1 shadow-2xs">
                          ✦ Spring Curation
                        </span>
                        <h5 className="font-serif text-sm font-bold text-[#141414] leading-snug">
                          Where Fine Art Meets Living Waters.
                        </h5>
                        <p className="text-[10px] text-[#5A5043] mt-1 leading-relaxed">
                          Curated by <span className="font-bold text-[#141414]">{brandingForm.siteName || 'NP Atelier'}</span> Studio.
                        </p>
                      </div>

                      {/* 4. Desktop Luxury Footer Card */}
                      <div className="rounded-2xl bg-[#0F0E0C] text-white p-4 border border-[#D4AF37]/40 space-y-2.5 shadow-md">
                        <div className="flex items-center justify-between border-b border-white/10 pb-2">
                          <div>
                            <p className="font-serif text-sm font-bold bg-gradient-to-r from-white via-[#F2D785] to-[#D4AF37] bg-clip-text text-transparent truncate">
                              {brandingForm.siteName || 'NP Atelier'}
                            </p>
                            <p className="text-[9px] text-[#A6977D] truncate">
                              {brandingForm.tagline || 'Luxury Crafts & Exotic Aquatics'}
                            </p>
                          </div>
                          <span className="rounded-full bg-[#241E15] border border-[#D4AF37]/40 px-2 py-0.5 text-[8px] font-mono font-bold text-[#ECC872]">
                            FOOTER
                          </span>
                        </div>

                        {/* Contact Badges in Footer */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px]">
                          <div className="flex items-center gap-1.5 rounded-xl bg-white/5 border border-white/10 p-2 truncate">
                            <Mail className="h-3 w-3 text-[#ECC872] shrink-0" />
                            <span className="text-[#D9CEBA] font-medium truncate">
                              {brandingForm.contactEmail || 'npatelierindia@gmail.com'}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 p-2 truncate">
                            <MessageCircle className="h-3 w-3 text-emerald-400 shrink-0" />
                            <span className="text-emerald-300 font-bold truncate">
                              {brandingForm.contactPhone || '+91 93412 97124'}
                            </span>
                          </div>
                        </div>

                        {/* Copyright note */}
                        <p className="text-[9px] text-[#6E6352] pt-1 border-t border-white/10 flex items-center justify-between">
                          <span>© 2026 {brandingForm.siteName || 'NP Atelier'}. All rights reserved.</span>
                          <span className="text-[#A6832E] font-bold">100% Artisan Value</span>
                        </p>
                      </div>

                      {/* 5. Customer Invoice Preview */}
                      <div className="rounded-2xl border border-[#DFCFA6]/80 bg-white p-3.5 shadow-xs space-y-2">
                        <div className="flex items-center justify-between border-b border-[#F2ECE1] pb-1.5 text-[10px] font-bold">
                          <span className="flex items-center gap-1 text-[#855A10]">
                            <Receipt className="h-3 w-3" />
                            <span>Customer Invoice Preview</span>
                          </span>
                          <span className="text-[#8C827A] font-mono">#INV-9842</span>
                        </div>

                        <div className="flex items-center justify-between text-xs font-bold text-[#141414]">
                          <span className="truncate max-w-[170px]">{brandingForm.siteName} Special Drop</span>
                          <span className="text-[#855A10] font-mono">{brandingForm.currency || '₹'}1,599</span>
                        </div>

                        <p className="text-[10px] text-[#7A6F62] flex items-center justify-between">
                          <span>Invoice dispatched to buyer</span>
                          <span className="font-bold text-emerald-700">Verified Dispatch ✓</span>
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* ========================================================= */}
                {/* VIEW 2: SMARTPHONE MOBILE SIMULATOR */}
                {/* ========================================================= */}
                {previewDevice === 'mobile' && (
                  <div className="max-w-[340px] mx-auto rounded-[38px] border-[5px] border-[#2A2318] p-2.5 bg-[#14120E] shadow-2xl relative transition-all duration-300">
                    {/* Dynamic Island Pill */}
                    <div className="w-20 h-4 bg-black rounded-full mx-auto mb-2 flex items-center justify-center">
                      <div className="h-1.5 w-1.5 rounded-full bg-blue-900/60 ml-auto mr-2" />
                    </div>

                    {/* Mobile Viewport Screen */}
                    <div className="rounded-[28px] overflow-hidden bg-[#FAF7F2] border border-[#E8DEC7] space-y-3 p-3">
                      {/* Mobile Top Announcement Ribbon */}
                      <div className="rounded-lg bg-gradient-to-r from-[#17130C] via-[#2A2214] to-[#17130C] p-1.5 text-center text-[9px] font-bold text-[#ECC872] flex items-center justify-center gap-1 truncate shadow-2xs">
                        <Sparkles className="h-2.5 w-2.5 text-[#ECC872] shrink-0" />
                        <span className="truncate">
                          {brandingForm.announcementText || 'Handcrafted Artisan Drops Live'}
                        </span>
                      </div>

                      {/* Mobile Header Bar */}
                      <div className="rounded-xl border border-[#DFCFA6]/80 bg-white p-2.5 shadow-2xs flex items-center justify-between gap-2">
                        {/* Hamburger icon representation */}
                        <div className="grid h-7 w-7 place-items-center rounded-lg bg-[#FAF5E8] border border-[#DFCFA6] text-[#855A10] shrink-0">
                          <span className="text-xs font-bold">☰</span>
                        </div>

                        {/* Center Logo & Brand Name */}
                        <div className="flex items-center gap-1.5 min-w-0 flex-1 justify-center">
                          {brandingForm.logoImageUrl &&
                          (brandingForm.logoType === 'image' || brandingForm.logoType === 'both') ? (
                            <img
                              src={brandingForm.logoImageUrl}
                              alt="Logo"
                              className="h-6 w-auto max-w-[40px] rounded object-contain border border-[#d4a338]/40 bg-white p-0.5 shrink-0"
                            />
                          ) : null}

                          {(!brandingForm.logoImageUrl ||
                            brandingForm.logoType === 'icon' ||
                            brandingForm.logoType === 'both') && (
                            <span className="grid h-6 w-6 place-items-center rounded-lg bg-gradient-to-br from-[#1C170F] to-[#0A0805] text-[#ECC872] border border-[#D4AF37]/80 font-serif font-extrabold text-[10px] shrink-0">
                              {brandingForm.logoText || 'NP'}
                            </span>
                          )}

                          <div className="min-w-0 text-center">
                            <p className="font-serif text-xs font-bold text-[#141414] leading-tight truncate">
                              {brandingForm.siteName || 'NP Atelier'}
                            </p>
                          </div>
                        </div>

                        {/* Shopping Bag */}
                        <div className="grid h-7 w-7 place-items-center rounded-lg bg-[#141414] text-[#ECC872] border border-[#D4AF37]/60 text-[10px] font-bold shrink-0">
                          2
                        </div>
                      </div>

                      {/* Mobile Hero Spotlight */}
                      <div className="rounded-xl border border-[#D4AF37]/40 bg-gradient-to-br from-white via-[#FCF9EE] to-[#F7ECCF] p-3 text-center space-y-1 shadow-2xs">
                        <span className="inline-block rounded-full bg-white/90 border border-[#D4AF37]/50 px-2 py-0.5 text-[8px] font-bold text-[#7A5408]">
                          ✦ Fine Art &amp; Living Waters
                        </span>
                        <h6 className="font-serif text-xs font-bold text-[#141414]">
                          {brandingForm.siteName || 'NP Atelier'}
                        </h6>
                        <p className="text-[9px] text-[#5A5043] leading-snug">
                          {brandingForm.tagline || 'Luxury Crafts & Exotic Aquatics'}
                        </p>
                      </div>

                      {/* Mobile Product Card with 1-Click WhatsApp */}
                      <div className="rounded-xl border border-[#DFCFA6]/80 bg-white p-2.5 shadow-2xs space-y-2">
                        <div className="flex items-center justify-between text-[10px] font-bold">
                          <span className="truncate max-w-[130px] text-[#141414]">Aura Ocean Resin Board</span>
                          <span className="text-[#855A10] font-mono">{brandingForm.currency || '₹'}1,850</span>
                        </div>

                        {/* Simulated Mobile Order on WhatsApp Button */}
                        <div className="rounded-lg bg-emerald-600 text-white p-2 text-center text-[10px] font-bold flex items-center justify-center gap-1.5 shadow-xs">
                          <MessageCircle className="h-3 w-3 text-white shrink-0" />
                          <span className="truncate">Order on WhatsApp</span>
                        </div>
                      </div>

                      {/* Mobile Simulated Bottom Dock */}
                      <div className="rounded-xl bg-[#141414] text-[#DCD1BA] p-2 border border-[#D4AF37]/40 flex items-center justify-around text-[8px] font-bold">
                        <span className="text-[#ECC872] flex flex-col items-center">
                          <span>✦</span>
                          <span>Home</span>
                        </span>
                        <span className="flex flex-col items-center opacity-70">
                          <span>🎨</span>
                          <span>Crafts</span>
                        </span>
                        <span className="flex flex-col items-center opacity-70">
                          <span>🐠</span>
                          <span>Aquatics</span>
                        </span>
                        <span className="flex flex-col items-center opacity-70">
                          <span>♡</span>
                          <span>Saved</span>
                        </span>
                        <span className="flex flex-col items-center opacity-70">
                          <span>👜</span>
                          <span>Bag</span>
                        </span>
                      </div>
                    </div>

                    {/* Smartphone Home Bar Indicator */}
                    <div className="w-28 h-1 bg-white/40 rounded-full mx-auto mt-2" />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: ORDERS & FULFILLMENT */}
        {/* ========================================================================= */}
        {activeTab === 'orders' && (
          <div className="space-y-4 sm:space-y-6">
            <div className="glass-card overflow-hidden">
              <div className="border-b border-[#d4a338]/20 bg-[#faeed1]/50 p-3.5 sm:p-4">
                <h3 className="font-serif text-lg sm:text-xl font-bold text-[#241705]">
                  All Customer Orders ({orders.length})
                </h3>
                <p className="text-[11px] sm:text-xs text-[#5e4318]">
                  Manage craft packing, oxygenated aquatic bagging, and shipment tracking
                </p>
              </div>

              {/* Mobile View: Dedicated Luxury Order Cards (md:hidden) */}
              <div className="block md:hidden divide-y divide-[#d4a338]/15">
                {orders.length === 0 ? (
                  <div className="p-8 text-center text-[#73562a]">
                    <Package className="mx-auto h-8 w-8 text-[#d4a338]/60 mb-2" />
                    <p className="font-serif text-sm font-bold text-[#241705]">No Customer Orders Yet</p>
                    <p className="text-[11px] text-[#5e4318] mt-1">
                      Live orders placed by buyers on the store will appear here in real time.
                    </p>
                  </div>
                ) : (
                  orders.map((order: any) => {
                    const hasAquatics = order.items?.some(
                      (i: any) => i.department === 'aquarium' || aquariumCategories.includes(i.category)
                    )
                    return (
                      <div key={order.orderId} className="p-3.5 space-y-3 bg-white/40 transition hover:bg-white/80">
                        {/* Top: Order ID & Date & View */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-mono text-xs font-bold text-[#241705] bg-[#faeed1] px-2 py-0.5 rounded-lg border border-[#d4a338]/30">
                              #{order.orderId}
                            </span>
                            {hasAquatics && (
                              <span className="rounded-full bg-cyan-100 px-1.5 py-0.5 text-[8px] font-bold text-cyan-800">
                                🐟 Aquatic
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-[#73562a] font-medium">{order.date}</span>
                        </div>

                        {/* Customer & Items Summary */}
                        <div className="flex items-start justify-between gap-2 text-xs">
                          <div>
                            <p className="font-bold text-[#241705]">{order.customer?.fullName || 'Customer'}</p>
                            <p className="text-[10px] text-[#73562a]">
                              {order.customer?.city || 'India'}{order.customer?.phone ? ` • ${order.customer.phone}` : ''}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-extrabold text-[#855a10]">₹{order.total?.toFixed(0)}</p>
                            <p className="text-[10px] text-[#73562a] font-semibold">{order.items?.length || 1} item(s)</p>
                          </div>
                        </div>

                        {/* Status Select & Action Button */}
                        <div className="flex items-center gap-2 pt-1 border-t border-[#d4a338]/10">
                          <div className="flex-1">
                            <select
                              value={order.status}
                              onChange={(e) => updateOrderStatus(order.orderId, e.target.value)}
                              className="h-8 w-full rounded-xl border border-[#d4a338]/35 bg-white px-2 text-[11px] font-bold text-[#241705] outline-none shadow-xs truncate"
                            >
                              <option value="Aquatic Packing & Oxygenation">Aquatic Packing</option>
                              <option value="Handcrafting & Packing">Craft Packing</option>
                              <option value="Shipped (Express Courier)">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </div>
                          <button
                            type="button"
                            onClick={() => setSelectedOrder(order)}
                            className="inline-flex items-center gap-1 rounded-xl border border-[#d4a338]/40 bg-white px-3 py-1.5 text-xs font-bold text-[#241705] hover:bg-[#faeed1] transition shadow-xs shrink-0"
                          >
                            <Eye className="h-3.5 w-3.5 text-[#855a10]" /> View
                          </button>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>

              {/* Desktop View: Full 7-Column Data Table (hidden md:block) */}
              <div className="hidden md:block overflow-x-auto">
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
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-12 text-center text-[#73562a]">
                          <Package className="mx-auto h-10 w-10 text-[#d4a338]/60 mb-2" />
                          <p className="font-serif text-base font-bold text-[#241705]">No Customer Orders Yet</p>
                          <p className="text-xs text-[#5e4318] mt-1">
                            Live orders placed by buyers on the store will appear here in real time.
                          </p>
                        </td>
                      </tr>
                    ) : (
                      orders.map((order: any) => {
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
                                    Aquatic
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
                      })
                    )}
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
          <div className="grid gap-4 sm:gap-6 lg:grid-cols-[1fr_1.1fr]">
            {/* Create Coupon Form */}
            <div className="glass-card p-4 sm:p-6">
              <h3 className="font-serif text-lg sm:text-xl font-bold text-[#241705]">Create Promotional Coupon</h3>
              <p className="mt-1 text-xs text-[#5e4318]">
                New codes will be immediately valid for customers in the storefront checkout.
              </p>

              <form onSubmit={handleCreateCoupon} className="mt-4 sm:mt-5 space-y-3.5 sm:space-y-4">
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

                <button type="submit" className="btn-primary w-full py-3 text-xs shadow-sm">
                  <Tag className="h-4 w-4" /> Activate Coupon Code
                </button>
              </form>
            </div>

            {/* Active Coupons List */}
            <div className="glass-card p-4 sm:p-6">
              <h3 className="font-serif text-lg sm:text-xl font-bold text-[#241705]">Active Coupon Codes</h3>
              <p className="mt-1 text-xs text-[#5e4318]">Active codes applicable by store shoppers</p>

              <div className="mt-4 sm:mt-5 space-y-2.5 sm:space-y-3">
                {Object.values(availableCoupons as Record<string, any>).map((c: any) => (
                  <div
                    key={c.code}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-[#d4a338]/25 bg-white p-3 sm:p-3.5 shadow-sm"
                  >
                    <div className="min-w-0">
                      <span className="inline-block rounded-lg border border-dashed border-[#855a10] bg-[#faeed1] px-2.5 py-0.5 font-mono text-xs font-bold text-[#855a10]">
                        {c.code}
                      </span>
                      <p className="mt-1 text-xs font-bold text-[#241705] truncate">{c.label}</p>
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
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-xl border border-rose-200 bg-rose-50 text-rose-600 transition hover:bg-rose-500 hover:text-white"
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
          <div className="grid gap-3 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { name: 'Dr. Vikram Aqua Studio', specialty: 'Captive Discus & Planted Tanks', items: 8, location: 'Kochi & Bengaluru', status: 'Master Aquarist' },
              { name: 'Ananya & Maya', specialty: 'Silk Thread & Kundan Jewelry', items: 8, location: 'Jaipur / CA', status: 'Master Maker' },
              { name: 'Reef Wonders Lab', specialty: 'Marine Clownfish & Zoanthid Corals', items: 4, location: 'Goa Coast', status: 'Reef Certified' },
              { name: 'Clara & Fern', specialty: 'UV Pressed Florals & Resins', items: 6, location: 'Portland / Mumbai', status: 'Top Rated' },
              { name: 'AquaScape Hardscape Co', specialty: 'Ohko Stone & Bonsai Driftwood', items: 5, location: 'Hyderabad', status: 'Hardscape Guild' },
              { name: 'Aiden Apothecary', specialty: 'Botanical Soy Wax Candles', items: 5, location: 'Shimla Studios', status: 'Clean Certified' },
            ].map((artisan, idx) => (
              <div key={idx} className="glass-card p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                    {artisan.status}
                  </span>
                  <span className="text-xs font-bold text-[#855a10]">{artisan.items} Offerings</span>
                </div>
                <h4 className="mt-2.5 sm:mt-3 font-serif text-lg sm:text-xl font-bold text-[#241705]">{artisan.name}</h4>
                <p className="text-xs font-semibold text-[#5e4318]">{artisan.specialty}</p>
                <p className="mt-1.5 sm:mt-2 text-xs text-[#8C827A]">{artisan.location}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* ADD / EDIT PRODUCT MODAL (COMPLETE WITH FISH & AQUARIUM & CRAFTS SUPPORT) */}
      {/* ========================================================================= */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#17120a]/60 p-2.5 sm:p-4 backdrop-blur-md overflow-hidden">
          <div className="relative my-auto w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden rounded-2xl sm:rounded-[2.2rem] bg-gradient-to-br from-[#fffdf9] via-[#faeed1] to-[#f6e1b3] border border-[#d4a338]/40 shadow-[0_25px_60px_rgba(133,90,16,0.25)]">
            <button
              type="button"
              onClick={() => setIsProductModalOpen(false)}
              className="absolute right-3.5 top-3.5 sm:right-5 sm:top-5 grid h-8 w-8 sm:h-9 sm:w-9 place-items-center rounded-full border border-[#d4a338]/30 bg-white/80 text-[#241705] hover:bg-white z-10 transition shadow-xs cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="shrink-0 border-b border-[#d4a338]/20 bg-[#faeed1]/50 p-4 sm:p-6 pr-12">
              <span className="section-eyebrow">Catalog Product Management</span>
              <h3 className="mt-1 sm:mt-2 font-serif text-xl sm:text-2xl font-bold text-[#241705]">
                {editingProduct ? 'Edit Product Details' : 'Add New Offering'}
              </h3>
            </div>

            <form onSubmit={handleProductSubmit} className="flex-1 min-h-0 space-y-3.5 sm:space-y-4 p-3.5 sm:p-6 sidebar-scroller">
              {/* Department Selector */}
              <div>
                <label className="mb-1.5 block text-xs font-bold text-[#241705]">Department</label>
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      const newDeptCats = allAquariumCategories
                      setProductForm({
                        ...productForm,
                        department: 'aquarium',
                        category: isCustomCategory ? productForm.category : (newDeptCats[0] || aquariumCategories[0]),
                      })
                    }}
                    className={`flex items-center justify-center gap-1.5 sm:gap-2 rounded-xl border p-2 sm:p-2.5 text-xs font-bold transition ${
                      productForm.department === 'aquarium'
                        ? 'border-cyan-600 bg-cyan-700 text-white shadow-sm'
                        : 'border-[#d4a338]/40 bg-white text-[#241705] hover:bg-[#faeed1]'
                    }`}
                  >
                    <Fish className="h-4 w-4 shrink-0" />
                    <span className="truncate">Living Aquatics</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const newDeptCats = allCraftCategories
                      setProductForm({
                        ...productForm,
                        department: 'crafts',
                        category: isCustomCategory ? productForm.category : (newDeptCats[0] || craftCategories[0]),
                      })
                    }}
                    className={`flex items-center justify-center gap-1.5 sm:gap-2 rounded-xl border p-2 sm:p-2.5 text-xs font-bold transition ${
                      productForm.department === 'crafts'
                        ? 'border-[#855a10] bg-[#855a10] text-white shadow-sm'
                        : 'border-[#d4a338]/40 bg-white text-[#241705] hover:bg-[#faeed1]'
                    }`}
                  >
                    <Palette className="h-4 w-4 shrink-0" />
                    <span className="truncate">Handmade Crafts</span>
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

              {/* Category-Wise Selection Hub */}
              <div className="rounded-2xl border border-[#d4a338]/35 bg-white/70 p-3 sm:p-4 space-y-3 sm:space-y-3.5 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Layers className="h-4 w-4 text-[#855a10] shrink-0" />
                    <div>
                      <span className="text-xs font-extrabold text-[#241705]">Product Category (Category-Wise)</span>
                      <p className="text-[10px] text-[#73562a]">Organize product category-wise or create a brand new category</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (!isCustomCategory) {
                        setIsCustomCategory(true)
                        setCustomCategoryInput('')
                      } else {
                        setIsCustomCategory(false)
                        setProductForm((prev) => ({
                          ...prev,
                          category: activeDepartmentCategories[0] || (productForm.department === 'aquarium' ? aquariumCategories[0] : craftCategories[0]),
                        }))
                      }
                    }}
                    className="inline-flex items-center justify-center gap-1 rounded-lg border border-[#d4a338]/40 bg-[#faeed1] px-2.5 py-1 text-[11px] font-bold text-[#855a10] hover:bg-[#f5e0b8] transition shadow-xs shrink-0 self-start sm:self-auto"
                  >
                    {isCustomCategory ? (
                      <>
                        <RefreshCw className="h-3 w-3" />
                        <span>Select Existing</span>
                      </>
                    ) : (
                      <>
                        <Plus className="h-3 w-3" />
                        <span>+ Custom Category</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Quick Category Chips */}
                {!isCustomCategory && (
                  <div>
                    <label className="mb-1.5 block text-[10px] font-extrabold uppercase tracking-wider text-[#73562a]">
                      Pick Category ({activeDepartmentCategories.length} Available):
                    </label>
                    <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1">
                      {activeDepartmentCategories.map((c) => {
                        const isSelected = productForm.category === c
                        const isAqua = productForm.department === 'aquarium'
                        return (
                          <button
                            key={c}
                            type="button"
                            onClick={() => setProductForm({ ...productForm, category: c })}
                            className={`rounded-xl px-2.5 py-1 text-[11px] font-bold transition flex items-center gap-1.5 ${
                              isSelected
                                ? isAqua
                                  ? 'bg-cyan-700 text-white shadow-xs'
                                  : 'bg-[#855a10] text-white shadow-xs'
                                : 'border border-[#d4a338]/30 bg-white text-[#5e4318] hover:bg-[#faeed1]'
                            }`}
                          >
                            {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                            <span>{c}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Category Dropdown or Custom Input */}
                {isCustomCategory ? (
                  <div className="rounded-xl border border-dashed border-[#855a10]/50 bg-[#faeed1]/40 p-3 space-y-1">
                    <label className="block text-[11px] font-bold text-[#855a10]">
                      Enter Custom Category Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      value={customCategoryInput}
                      onChange={(e) => {
                        setCustomCategoryInput(e.target.value)
                        setProductForm({ ...productForm, category: e.target.value })
                      }}
                      placeholder={
                        productForm.department === 'aquarium'
                          ? 'e.g. Freshwater Shrimp, Terrarium Kits, Coral Frags'
                          : 'e.g. Resin Clocks, Polymer Clay Jewelry, Handmade Candles'
                      }
                      className="h-10 w-full rounded-xl border border-[#d4a338]/50 bg-white px-3 text-xs font-bold text-[#241705] outline-none focus:border-[#855a10] shadow-sm"
                    />
                    <p className="text-[10px] text-[#73562a]">
                      This category will appear live in catalog filters, admin analytics, and navigation.
                    </p>
                  </div>
                ) : (
                  <div>
                    <label className="mb-1 block text-[11px] font-bold text-[#241705]">
                      Selected Category Dropdown
                    </label>
                    <select
                      value={productForm.category}
                      onChange={(e) => {
                        if (e.target.value === '__NEW_CUSTOM_CATEGORY__') {
                          setIsCustomCategory(true)
                          setCustomCategoryInput('')
                        } else {
                          setProductForm({ ...productForm, category: e.target.value })
                        }
                      }}
                      className="h-10 w-full rounded-xl border border-[#d4a338]/35 bg-white px-3 text-xs font-bold text-[#241705] outline-none shadow-sm"
                    >
                      {activeDepartmentCategories.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                      <option value="__NEW_CUSTOM_CATEGORY__">
                        + Create a New Custom Category...
                      </option>
                    </select>
                  </div>
                )}

                {/* Subcategory / Micro-tag input */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold text-[#241705]">
                      Subcategory / Specific Type <span className="text-[10px] font-normal text-[#8c827a]">(Optional)</span>
                    </label>
                    <span className="text-[10px] text-[#8c827a] hidden sm:inline">e.g. Serving Tray, Studs, Discus Pair</span>
                  </div>
                  <input
                    type="text"
                    value={productForm.subCategory}
                    onChange={(e) => setProductForm({ ...productForm, subCategory: e.target.value })}
                    placeholder={
                      productForm.department === 'aquarium'
                        ? 'e.g. Discus Cichlid, Nano Rimless 60P, External Canister'
                        : 'e.g. Scalloped Floral Tray, Silk Bangles, Soy Wax Candle'
                    }
                    className="h-9 w-full rounded-xl border border-[#d4a338]/30 bg-white px-3 text-xs font-medium text-[#241705] outline-none focus:border-[#c59325] shadow-xs"
                  />
                </div>
              </div>

              {/* Price & Stock Inventory Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
              </div>

              {/* Badges */}
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
                  placeholder="Live Arrival Guarantee, Captive Bred, Handmade"
                  className="h-10 w-full rounded-xl border border-[#d4a338]/35 bg-white px-3 text-xs font-bold text-[#241705] outline-none shadow-sm"
                />
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
                <div className="rounded-2xl border border-cyan-400/50 bg-cyan-50/70 p-3.5 sm:p-4 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-cyan-900">
                    <Fish className="h-4 w-4 text-cyan-700" />
                    <span>Aquatic Parameters &amp; Transit Specs</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 text-xs">
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
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                  {PRESET_IMAGES.filter(
                    (img) => productForm.department === 'all' || img.department === productForm.department
                  ).map((img) => (
                    <button
                      key={img.label}
                      type="button"
                      onClick={() => setProductForm({ ...productForm, image: img.url })}
                      className="rounded-full border border-[#d4a338]/30 bg-white/80 px-2.5 py-1 text-[10px] font-bold text-[#241705] hover:bg-[#faeed1] shadow-xs"
                    >
                      {img.label}
                    </button>
                  ))}
                </div>

                {/* Image URL Input with Preview */}
                <div className="flex items-center gap-2 sm:gap-3">
                  <input
                    required
                    value={productForm.image}
                    onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="h-10 flex-1 min-w-0 rounded-xl border border-[#d4a338]/35 bg-white px-3 text-xs text-[#241705] outline-none shadow-sm"
                  />
                  {productForm.image && (
                    <img
                      src={productForm.image}
                      alt="Preview"
                      onError={(e) => {
                        e.currentTarget.src = fallbackCraftImage
                      }}
                      className="h-10 w-10 shrink-0 rounded-xl object-cover border border-[#d4a338]/30"
                    />
                  )}
                </div>
              </div>

              <div className="flex gap-2 pt-2 sm:pt-3">
                <button type="submit" className="btn-primary w-full py-3 sm:py-3.5 text-xs shadow-glow">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#17120a]/60 p-2.5 sm:p-4 backdrop-blur-md overflow-hidden">
          <div className="relative my-auto w-full max-w-xl max-h-[92vh] flex flex-col overflow-hidden rounded-2xl sm:rounded-[2.2rem] bg-gradient-to-br from-[#fffdf9] via-[#faeed1] to-[#f6e1b3] border border-[#d4a338]/40 shadow-[0_25px_60px_rgba(133,90,16,0.25)]">
            <button
              type="button"
              onClick={() => setSelectedOrder(null)}
              className="absolute right-3.5 top-3.5 sm:right-5 sm:top-5 grid h-8 w-8 sm:h-9 sm:w-9 place-items-center rounded-full border border-[#d4a338]/30 bg-white/80 text-[#241705] hover:bg-white z-10 transition shadow-xs cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="shrink-0 border-b border-[#d4a338]/20 bg-[#faeed1]/50 p-4 sm:p-6 pr-12">
              <span className="section-eyebrow">Order Inspection &amp; Tracking</span>
              <h3 className="mt-1 sm:mt-2 font-serif text-xl sm:text-2xl font-bold text-[#241705]">
                Order #{selectedOrder.orderId}
              </h3>
              <p className="text-xs text-[#5e4318]">Placed on {selectedOrder.date}</p>
            </div>

            <div className="flex-1 min-h-0 space-y-3.5 sm:space-y-4 p-4 sm:p-6 text-xs sidebar-scroller">
              {/* Customer Info */}
              <div className="rounded-2xl border border-[#d4a338]/30 bg-white/80 p-3.5 sm:p-4 shadow-sm">
                <h4 className="font-bold text-[#241705]">Customer &amp; Shipping Destination</h4>
                <p className="mt-1.5 text-[#241705] font-semibold">{selectedOrder.customer?.fullName}</p>
                <p className="text-[#5e4318]">{selectedOrder.customer?.email}</p>
                <p className="text-[#5e4318]">{selectedOrder.customer?.phone}</p>
                <p className="text-[#5e4318]">{selectedOrder.customer?.address}</p>
                <p className="text-[#5e4318]">{selectedOrder.customer?.city}</p>
              </div>

              {/* Items */}
              <div className="rounded-2xl border border-[#d4a338]/30 bg-white/80 p-3.5 sm:p-4 shadow-sm">
                <h4 className="font-bold text-[#241705]">Ordered Items ({selectedOrder.items?.length || 1})</h4>
                <div className="mt-3 space-y-2">
                  {selectedOrder.items?.map((item: any, i: number) => {
                    const isAqua = item.department === 'aquarium' || aquariumCategories.includes(item.category)
                    return (
                      <div key={i} className="flex items-center justify-between gap-2 border-b border-[#d4a338]/15 pb-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="h-10 w-10 shrink-0 rounded-lg object-cover border border-[#d4a338]/25"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <p className="font-bold text-[#241705] truncate">{item.title}</p>
                              {isAqua && (
                                <span className="rounded-full bg-cyan-100 px-1.5 py-0.2 text-[8px] font-bold text-cyan-800 shrink-0">
                                  Aquatic
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-emerald-700 font-semibold">
                              {item.quantity}x @ {item.price}
                            </p>
                          </div>
                        </div>
                        <span className="font-bold text-[#855a10] shrink-0">{item.price}</span>
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
