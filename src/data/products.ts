export interface AquaticSpecs {
  careLevel?: 'Easy' | 'Moderate' | 'Expert'
  temperament?: 'Peaceful' | 'Semi-Aggressive' | 'Aggressive'
  waterType?: 'Freshwater' | 'Saltwater / Marine' | 'Brackish'
  tankSize?: string
  diet?: string
  dimensions?: string
  warranty?: string
  liveArrivalGuarantee?: boolean
  flowRate?: string
  power?: string
}

export interface Product {
  id: number | string
  title: string
  price: string
  department?: 'crafts' | 'aquarium'
  category: string
  subCategory?: string
  image: string
  images?: string[]
  badges?: string[]
  description?: string
  stock?: number
  palette?: string
  personalization?: string
  rating?: number
  reviews?: number
  reviewsCount?: number
  isBestSeller?: boolean
  isLimitedDrop?: boolean
  isUserCreated?: boolean
  artisanName?: string
  aquaticSpecs?: AquaticSpecs
}

export interface CategoryGroup {
  title: string
  badge: string
  description: string
  accent: string
  image: string
}

export interface InspirationTile {
  title: string
  image: string
}

export interface Testimonial {
  name: string
  role: string
  quote: string
}

export const craftCategories: string[] = [
  'Handmade Jewelry',
  'DIY Home Decor & Crafts',
  'Beauty DIY Products',
  'Cute Handmade Accessories',
]

export const aquariumCategories: string[] = [
  'Live Freshwater Fish',
  'Marine & Saltwater Fish',
  'Aquariums & Nano Tanks',
  'Filtration, Pumps & Equipment',
  'Aquarium Lighting & CO2',
  'Live Aquatic Plants & Aquascaping',
  'Fish Food, Care & Supplements',
]

export const categories: string[] = [...craftCategories, ...aquariumCategories]

export const categoryGroups: CategoryGroup[] = [
  {
    title: 'Handmade Jewelry',
    badge: 'Artisan Talisman',
    description:
      'Soft shimmer, artisan finishes, and statement pieces made for everyday layering.',
    accent: 'from-rose-100 via-white to-amber-50',
    image: '/products/atelier-evil-eye-pendant.jpg',
  },
  {
    title: 'DIY Home Decor & Crafts',
    badge: 'Atelier NP Kits',
    description:
      'Decor pieces with cozy glow, airy textures, and a Pinterest-friendly finish.',
    accent: 'from-sky-100 via-white to-mint-50',
    image: '/products/atelier-diy-paint-kit-explorer.jpg',
  },
  {
    title: 'Beauty DIY Products',
    badge: 'Creative Studio',
    description:
      'Pretty, gentle essentials inspired by spa rituals and creative craft kits.',
    accent: 'from-lilac-100 via-white to-rose-50',
    image: '/products/atelier-diy-paint-kit-sea.jpg',
  },
  {
    title: 'Cute Handmade Accessories',
    badge: 'Custom Keepsakes',
    description:
      'Tiny treasures, custom keepsakes, and playful accents with a premium feel.',
    accent: 'from-peach-100 via-white to-gold-50',
    image: '/products/atelier-ruby-glitter-keychains.jpg',
  },
]

export const handmadeProducts = [
  {
    id: 1,
    title: 'Atelier NP Sea Life DIY Paint Kit',
    price: '₹449',
    category: 'Beauty DIY Products',
    image: '/products/atelier-diy-paint-kit-sea.jpg',
    badges: ['Atelier Signature', 'DIY Kit'],
    description: 'Official NP Atelier creative craft kit featuring handcrafted plaster marine animal figurines (whale, fish, dolphin), 6 acrylic paint pots, and detail brush. Paint • Create • Enjoy!',
  },
  {
    id: 2,
    title: 'Atelier NP Explorer DIY Paint Kit',
    price: '₹449',
    category: 'DIY Home Decor & Crafts',
    image: '/products/atelier-diy-paint-kit-explorer.jpg',
    badges: ['Atelier Signature', 'Best Seller'],
    description: 'Official NP Atelier creative plaster kit with vintage locomotive steam train, coastal lighthouse, and explorer figurines with rich acrylic paints and brush.',
  },
  {
    id: 3,
    title: 'Ruby Dip Resin Alphabet Keychains',
    price: '₹299',
    category: 'Cute Handmade Accessories',
    image: '/products/atelier-ruby-glitter-keychains.jpg',
    badges: ['Trending', 'Handmade'],
    description: 'Bespoke hand-poured crimson ruby resin monogram letter keychains with chunky 24k gold glitter half-dip on high-shine golden keyrings.',
  },
  {
    id: 4,
    title: 'Celestial Evil Eye Mandala Pendant',
    price: '₹599',
    category: 'Handmade Jewelry',
    image: '/products/atelier-evil-eye-pendant.jpg',
    badges: ['New', 'Handmade', 'Talisman'],
    description: 'Handcrafted cobalt blue mandala evil eye talisman pendant encased in high-polish gold-tone bezel on a dainty gold cable chain.',
  },
  {
    id: 5,
    title: 'Pressed Flower Resin Teardrop Earrings',
    price: '₹649',
    category: 'Handmade Jewelry',
    image: '/products/resin-earrings.jpg',
    badges: ['Trending', 'Handmade'],
    description: 'Translucent crystal resin earrings embedding real pressed wild daisies and gold foil flakes on French wire hooks.',
  },
  {
    id: 6,
    title: 'Artisan Silk Thread Bangles Set',
    price: '₹499',
    category: 'Handmade Jewelry',
    image: '/products/silk-thread-bangles.jpg',
    badges: ['New', 'Handmade'],
    description: 'Hand-wrapped raw silk thread bangles in blush pink and mint green embellished with gold zari cord and faux pearls.',
  },
  {
    id: 7,
    title: 'Royal Kundan Meenakari Jhumkas',
    price: '₹899',
    category: 'Handmade Jewelry',
    image: '/products/kundan-earrings.jpg',
    badges: ['New', 'Artisan Favorite'],
    description: 'Traditional Rajasthani Kundan meenakari earrings featuring uncut polki stones, pearl clusters, and emerald drops.',
  },
  {
    id: 8,
    title: 'Pastel Heishi & Gemstone Stack Bracelets',
    price: '₹399',
    category: 'Handmade Jewelry',
    image: '/products/beaded-bracelets.jpg',
    badges: ['Trending'],
    description: 'Set of stackable stretch bracelets crafted with pastel polymer clay heishi beads, natural quartz, and 18k gold discs.',
  },
  {
    id: 9,
    title: 'Terracotta Polymer Clay Arch Earrings',
    price: '₹499',
    category: 'Handmade Jewelry',
    image: '/products/clay-earrings.jpg',
    badges: ['Handmade', 'Minimalist'],
    description: 'Lightweight geometric polymer clay arch dangle earrings in warm terracotta and speckled stone textures.',
  },
  {
    id: 10,
    title: 'Ocean Wave Resin Art Serving Tray',
    price: '₹1,199',
    category: 'DIY Home Decor & Crafts',
    image: '/products/resin-art-tray.jpg',
    badges: ['Trending', 'Statement Piece'],
    description: 'Handcrafted wooden serving platter with multi-layered oceanic turquoise resin, realistic seafoam lacing, and brass handles.',
  },
  {
    id: 11,
    title: 'Raw Amethyst & Prism Crystal Suncatcher',
    price: '₹899',
    category: 'DIY Home Decor & Crafts',
    image: '/products/crystal-suncatcher.jpg',
    badges: ['Handmade', 'Rainbow Maker'],
    description: 'Hanging brass mobile adorned with genuine raw amethyst clusters and faceted glass prisms that cast rainbow patterns.',
  },
  {
    id: 12,
    title: 'Boho Mandala Macrame Dream Catcher',
    price: '₹599',
    category: 'DIY Home Decor & Crafts',
    image: '/products/dream-catcher.jpg',
    badges: ['New', 'Handmade'],
    description: 'Intricately woven cream cotton rope dream catcher featuring a sacred mandala center, natural wooden beads, and soft plumage.',
  },
  {
    id: 13,
    title: 'Moroccan Brass & Amber Glass Lantern',
    price: '₹649',
    category: 'DIY Home Decor & Crafts',
    image: '/products/mini-lantern.jpg',
    badges: ['Trending', 'Cozy Glow'],
    description: 'Vintage-inspired antique brass tea light lantern with embossed amber glass panels and ornate Moroccan filigree cutwork.',
  },
  {
    id: 14,
    title: 'Textured Sage Macrame Wall Tapestry',
    price: '₹1,099',
    category: 'DIY Home Decor & Crafts',
    image: '/products/macrame-wall-hanging.jpg',
    badges: ['Handmade'],
    description: 'Boho wall hanging knotted with natural cream cotton rope and sage green geometric chevrons on a genuine wooden driftwood branch.',
  },
  {
    id: 15,
    title: 'Hand-Carved Terracotta Planter Duo',
    price: '₹599',
    category: 'DIY Home Decor & Crafts',
    image: '/products/terracotta-pots.jpg',
    badges: ['Eco-Friendly', 'Artisan Clay'],
    description: 'Wheel-thrown porous terracotta pots with geometric hand-etched motifs, ideal for succulents, herbs, and indoor greens.',
  },
  {
    id: 16,
    title: 'Hand-Braided Natural Jute Coasters (Set of 4)',
    price: '₹349',
    category: 'DIY Home Decor & Crafts',
    image: '/products/jute-coasters.jpg',
    badges: ['100% Biodegradable', 'Handmade'],
    description: 'Durable heat-resistant drink coasters hand-coiled from eco-friendly unbleached natural golden jute fibers.',
  },
  {
    id: 17,
    title: 'Solid Brass Lotus Incense Burner',
    price: '₹549',
    category: 'DIY Home Decor & Crafts',
    image: '/products/brass-incense-holder.jpg',
    badges: ['New', 'Zen Studio'],
    description: 'Heavyweight hand-cast brass incense stick and dhoop cone holder shaped like an unfolding sacred lotus bloom.',
  },
  {
    id: 18,
    title: 'Lavender Soy Aromatherapy Candle',
    price: '₹449',
    category: 'Beauty DIY Products',
    image: '/products/botanical-candle.jpg',
    badges: ['Clean Burn', 'Zero Toxin'],
    description: '100% vegan soy wax candle infused with organic French lavender essential oils, dried flower buds, and a crackling wood wick.',
  },
  {
    id: 19,
    title: 'Cold-Pressed Oat & Lavender Soap Bar',
    price: '₹299',
    category: 'Beauty DIY Products',
    image: '/products/lavender-soap.jpg',
    badges: ['Handmade', 'Organic'],
    description: 'Artisanal moisturizing soap handcrafted with olive oil, shea butter, colloidal oatmeal, and pure lavender botanical essence.',
  },
  {
    id: 20,
    title: 'Beeswax & Rose Herbal Lip Balm Tins (Trio)',
    price: '₹349',
    category: 'Beauty DIY Products',
    image: '/products/organic-lip-balm.jpg',
    badges: ['Handmade', 'Clean Beauty'],
    description: 'Nourishing pocket lip balms formulated with wild beeswax, virgin coconut oil, vitamin E, and natural damask rose extract.',
  },
  {
    id: 21,
    title: 'Hand-Hammered Ayurvedic Copper Bottle',
    price: '₹799',
    category: 'Beauty DIY Products',
    image: '/products/copper-bottle.jpg',
    badges: ['Wellness', 'Traditional'],
    description: 'Pure copper water vessel hand-beaten by hereditary coppersmiths with leak-proof brass cap and antimicrobial wellness benefits.',
  },
  {
    id: 22,
    title: 'Hand-Knitted Crochet Tulip Flower Pot',
    price: '₹399',
    category: 'Cute Handmade Accessories',
    image: '/products/crochet-flowers.jpg',
    badges: ['New', 'Handmade'],
    description: 'Everlasting pastel yarn crochet tulips and daisies planted in a cozy knitted pot with an authentic "Handmade" wooden charm.',
  },
  {
    id: 23,
    title: 'Pastel Beaded Phone Charm Wristlet',
    price: '₹329',
    category: 'Cute Handmade Accessories',
    image: '/products/phone-charms.jpg',
    badges: ['Trending', 'Y2K Aesthetic'],
    description: 'Dainty mobile phone lanyard crafted with pastel acrylic candy hearts, flower beads, faux pearls, and gold lobster clasp.',
  },
  {
    id: 24,
    title: 'Embroidered Silk Hair Bow & Barrette Set',
    price: '₹349',
    category: 'Cute Handmade Accessories',
    image: '/products/hair-accessories.jpg',
    badges: ['New', 'Boutique'],
    description: 'Heirloom French barrettes and silk bow clips with intricate hand-embroidered wild rose floral motifs and pearl borders.',
  },
  {
    id: 25,
    title: 'Personalized Resin Photo Keepsake Keychain',
    price: '₹699',
    category: 'Cute Handmade Accessories',
    image: '/products/custom-photo-resin.jpg',
    badges: ['Bespoke Custom', 'Handmade'],
    description: 'Custom crystal-clear UV resin photo keychain embedding your uploaded memory surrounded by real pressed petals and gold leaf.',
  },
  {
    id: 26,
    title: 'Botanical Embroidered Canvas Tote Bag',
    price: '₹499',
    category: 'Cute Handmade Accessories',
    image: '/products/tote-bag.jpg',
    badges: ['Eco-Cotton', 'Handmade'],
    description: 'Heavyweight 100% unbleached cotton canvas market tote bag featuring hand-stitched wild meadow wildflower embroidery.',
  },
  {
    id: 27,
    title: 'Vintage Hand-Bound Leather Journal',
    price: '₹849',
    category: 'Cute Handmade Accessories',
    image: '/products/leather-journal.jpg',
    badges: ['Artisan Keepsake'],
    description: 'Refillable distressed genuine leather diary with deckle-edge recycled cotton paper pages and rustic wraparound leather tie.',
  },
  {
    id: 28,
    title: 'Pure French Linen Hair Scrunchies (Pack of 3)',
    price: '₹299',
    category: 'Cute Handmade Accessories',
    image: '/products/linen-scrunchies.jpg',
    badges: ['Zero Plastic', 'Gentle on Hair'],
    description: 'Oversized hair ties sewn from 100% natural stonewashed French linen in oat, terracotta, and olive tones.',
  },
  {
    id: 29,
    title: 'Hand-Carved Neem Wood Detangling Comb',
    price: '₹249',
    category: 'Cute Handmade Accessories',
    image: '/products/wooden-comb.jpg',
    badges: ['Ayurvedic', 'Eco-Living'],
    description: 'Smooth wide-tooth hair comb carved from a single piece of medicinal neem wood to reduce frizz and stimulate hair follicles.',
  },
  {
    id: 30,
    title: 'Hand-Thrown Speckled Stoneware Ceramic Mug',
    price: '₹599',
    category: 'DIY Home Decor & Crafts',
    image: '/products/ceramic-mug.jpg',
    badges: ['Studio Pottery', 'Handmade'],
    description: 'Artisan wheel-thrown ceramic coffee mug with rustic speckled clay body, exposed raw base, and smooth milky gloss glaze.',
  },
]

export const aquariumCategoryGroups: CategoryGroup[] = [
  {
    title: 'Live Freshwater Fish',
    badge: 'Live Arrival Guarantee',
    description: 'Captive-bred Discus, Show Bettas, Guppies, and peaceful schooling community fish.',
    accent: 'from-cyan-100 via-white to-blue-50',
    image: 'https://images.unsplash.com/photo-1544943910-4c1dc44a0b38?auto=format&fit=crop&w=700&q=80',
  },
  {
    title: 'Marine & Saltwater Fish',
    badge: 'Reef Safe Marine',
    description: 'Vibrant Clownfish pairs, Gobies, and marine wonders for saltwater enthusiasts.',
    accent: 'from-blue-100 via-white to-sky-50',
    image: 'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&w=700&q=80',
  },
  {
    title: 'Aquariums & Nano Tanks',
    badge: 'Optiwhite Ultra-Clear',
    description: 'Low-iron rimless glass aquariums and curved panoramic nano tanks engineered for aquascaping.',
    accent: 'from-emerald-100 via-white to-teal-50',
    image: 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?auto=format&fit=crop&w=700&q=80',
  },
  {
    title: 'Live Aquatic Plants & Aquascaping',
    badge: '100% Snail-Free',
    description: 'Lush potted Anubias, Java Moss on driftwood, and natural Dragon Stone hardscape.',
    accent: 'from-teal-100 via-white to-mint-50',
    image: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?auto=format&fit=crop&w=700&q=80',
  },
  {
    title: 'Filtration, Pumps & Equipment',
    badge: 'Whisper Silent Pro',
    description: 'Canister filters, piezoelectric air pumps, and high-PAR WRGB LED planted aquarium lights.',
    accent: 'from-sky-100 via-white to-indigo-50',
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=700&q=80',
  },
  {
    title: 'Fish Food, Care & Supplements',
    badge: 'Probiotic Nutrition',
    description: 'Spirulina flakes, probiotic micro-pellets, and instant water conditioning essentials.',
    accent: 'from-amber-100 via-white to-orange-50',
    image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=700&q=80',
  },
]

export const fishAndAquariumProducts: Product[] = [
  {
    id: 101,
    title: 'Royal Blue Diamond Discus Pair (Captive Bred)',
    price: '₹2,999',
    department: 'aquarium',
    category: 'Live Freshwater Fish',
    image: 'https://images.unsplash.com/photo-1544943910-4c1dc44a0b38?auto=format&fit=crop&w=800&q=80',
    badges: ['Live Arrival Guarantee', 'Captive Bred', 'Centerpiece Fish'],
    description: 'Vibrant iridescent cobalt blue captive-bred discus pair. Acclimated to standard freshwater parameters (pH 6.5-7.2, 28-30°C). Shipped in temperature-controlled oxygenated breather bags with heat/ice pack.',
    stock: 8,
    rating: 4.9,
    reviews: 24,
    aquaticSpecs: {
      careLevel: 'Moderate',
      temperament: 'Peaceful',
      waterType: 'Freshwater',
      tankSize: '100 Liters+',
      diet: 'Omnivore / High-protein granules',
      liveArrivalGuarantee: true,
    },
  },
  {
    id: 102,
    title: 'Samurai Koi Halfmoon Plakat Betta (Show Grade)',
    price: '₹899',
    department: 'aquarium',
    category: 'Live Freshwater Fish',
    image: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=800&q=80',
    badges: ['Premium Grade', 'Live Arrival Guarantee', 'Show Betta'],
    description: 'Exceptional black samurai dragon scale body with metallic silver crown and vibrant marble fins. Active flare, healthy appetite, conditioned on live culture and premium pellets.',
    stock: 15,
    rating: 5.0,
    reviews: 38,
    aquaticSpecs: {
      careLevel: 'Easy',
      temperament: 'Semi-Aggressive',
      waterType: 'Freshwater',
      tankSize: '15 Liters+',
      diet: 'Carnivore / Insect larvae & micro pellets',
      liveArrivalGuarantee: true,
    },
  },
  {
    id: 103,
    title: 'Neon Blue Dwarf Gourami Trio',
    price: '₹549',
    department: 'aquarium',
    category: 'Live Freshwater Fish',
    image: 'https://images.unsplash.com/photo-1520302509741-698e4d3a24b1?auto=format&fit=crop&w=800&q=80',
    badges: ['Best Seller', 'Peaceful Community', 'Live Arrival Guarantee'],
    description: 'Shimmering metallic sky-blue sheen with red vertical accents. Peaceful labyrinth fish ideal for lush planted desktop aquariums and community tanks.',
    stock: 20,
    rating: 4.8,
    reviews: 19,
    aquaticSpecs: {
      careLevel: 'Easy',
      temperament: 'Peaceful',
      waterType: 'Freshwater',
      tankSize: '30 Liters+',
      diet: 'Omnivore / Flakes & small pellets',
      liveArrivalGuarantee: true,
    },
  },
  {
    id: 104,
    title: 'Ocellaris Clownfish Bonded Pair (Reef Safe Marine)',
    price: '₹1,899',
    department: 'aquarium',
    category: 'Marine & Saltwater Fish',
    image: 'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&w=800&q=80',
    badges: ['Reef Safe', 'Marine Classic', 'Live Arrival Guarantee'],
    description: 'Tank-bred juvenile bonded pair of iconic orange and white Ocellaris clownfish. Fully adjusted to saltwater aquarium life, mysis shrimp, and marine pellets.',
    stock: 10,
    rating: 4.9,
    reviews: 31,
    aquaticSpecs: {
      careLevel: 'Moderate',
      temperament: 'Peaceful',
      waterType: 'Saltwater / Marine',
      tankSize: '50 Liters+',
      diet: 'Marine Omnivore / Mysis & marine pellets',
      liveArrivalGuarantee: true,
    },
  },
  {
    id: 105,
    title: 'Ultra-Clear Rimless 60P Low-Iron Glass Aquarium (64 Liters)',
    price: '₹4,499',
    department: 'aquarium',
    category: 'Aquariums & Nano Tanks',
    image: 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?auto=format&fit=crop&w=800&q=80',
    badges: ['91% Light Transmittance', 'Low-Iron Optiwhite', 'Aquascaping Standard'],
    description: 'Premium 60x30x36cm 64L rimless aquarium crafted with 6mm ultra-white high clarity diamond-beveled float glass and German high-strength transparent silicone seams. Includes leveling foam mat.',
    stock: 12,
    rating: 5.0,
    reviews: 42,
    aquaticSpecs: {
      dimensions: '60 x 30 x 36 cm (64L)',
      warranty: '2 Years Leak-Proof Guarantee',
      careLevel: 'Easy',
    },
  },
  {
    id: 106,
    title: 'Curved Panoramic Nano Desktop Aquarium Kit (25 Liters)',
    price: '₹2,799',
    department: 'aquarium',
    category: 'Aquariums & Nano Tanks',
    image: 'https://images.unsplash.com/photo-1535591273668-578e31182c4f?auto=format&fit=crop&w=800&q=80',
    badges: ['All-in-One Kit', 'Zero Seam Front', 'LED Touch Hood'],
    description: 'Seamless curved front glass nano tank with built-in 3-stage back filtration chamber, 500L/H submersible silent pump, and 3-mode touch-controlled RGB LED canopy.',
    stock: 18,
    rating: 4.8,
    reviews: 29,
    aquaticSpecs: {
      dimensions: '30 x 30 x 35 cm (25L)',
      flowRate: '500 L/H',
      power: '6W LED + 5W Pump',
    },
  },
  {
    id: 107,
    title: 'Crystal Pro 1200 Multi-Stage External Canister Filter',
    price: '₹3,299',
    department: 'aquarium',
    category: 'Filtration, Pumps & Equipment',
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80',
    badges: ['Ultra-Quiet <28dB', 'Quick-Prime', 'Multi-Basket'],
    description: 'High-efficiency external canister filter pumping 1200 L/H with ceramic bio-rings, coarse sponge, and activated carbon baskets. Ideal for 100-300L planted and community tanks.',
    stock: 14,
    rating: 4.9,
    reviews: 35,
    aquaticSpecs: {
      flowRate: '1200 Liters / Hour',
      power: '18W Energy Saver',
      warranty: '1 Year Manufacturer Warranty',
    },
  },
  {
    id: 108,
    title: 'AeroSilent Dual-Outlet Air Pump & Nano Ceramic Disc Diffuser',
    price: '₹699',
    department: 'aquarium',
    category: 'Filtration, Pumps & Equipment',
    image: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?auto=format&fit=crop&w=800&q=80',
    badges: ['Whisper Quiet', 'Micro-Bubbles', 'Energy Star'],
    description: 'Shock-absorbing piezoelectric motor delivering 4L/min micro-fine aeration with dual adjustable air knobs, check valves, and ultra-dense micro-bubble ceramic disc stone.',
    stock: 30,
    rating: 4.7,
    reviews: 16,
    aquaticSpecs: {
      flowRate: '4.0 L/min dual ports',
      power: '3.5W',
    },
  },
  {
    id: 109,
    title: 'LuminaFlora WRGB II Planted Aquarium LED Light (60cm)',
    price: '₹3,899',
    department: 'aquarium',
    category: 'Aquarium Lighting & CO2',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    badges: ['Full Spectrum WRGB', 'Sunrise / Sunset App', 'Intense Coloration'],
    description: 'High PAR WRGB LED fixture with aluminum alloy heat sink and Bluetooth sunrise/sunset ramp controller. Stimulates intense red coloration in Rotala and crisp green foreground carpets.',
    stock: 10,
    rating: 5.0,
    reviews: 22,
    aquaticSpecs: {
      power: '45W High PAR',
      dimensions: 'Fits 60cm - 75cm aquariums',
      warranty: '1 Year Warranty',
    },
  },
  {
    id: 110,
    title: 'Anubias Nana Petite on Handcrafted Driftwood Bonsai',
    price: '₹799',
    department: 'aquarium',
    category: 'Live Aquatic Plants & Aquascaping',
    image: 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?auto=format&fit=crop&w=800&q=80',
    badges: ['100% Snail Free', 'Low Tech / No CO2', 'Ready to Place'],
    description: 'Lush, hearty Anubias Nana Petite cluster naturally rooted onto aged, cured Malaysian driftwood root sculpture. Low light requirement, safe for bettas and shrimp.',
    stock: 22,
    rating: 4.9,
    reviews: 27,
    aquaticSpecs: {
      careLevel: 'Easy',
      tankSize: 'Any Tank Size',
      waterType: 'Freshwater',
    },
  },
  {
    id: 111,
    title: 'Natural Dragon Stone (Ohko Rock) Aquascaping Set (5kg Pack)',
    price: '₹1,199',
    department: 'aquarium',
    category: 'Live Aquatic Plants & Aquascaping',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    badges: ['Inert pH Neutral', 'Ancient Clay Terracotta', 'Iwagumi Ready'],
    description: 'Authentic cratered Ohko dragon stone with intricate cavernous holes and warm amber hues. 100% aquarium safe, does not raise water hardness (GH/KH).',
    stock: 16,
    rating: 4.8,
    reviews: 14,
    aquaticSpecs: {
      dimensions: '4-6 Assorted Rocks (5kg)',
      careLevel: 'Easy',
    },
  },
  {
    id: 112,
    title: 'AquaVita Pro Spirulina & Krill Flakes + Water Conditioner Duo',
    price: '₹499',
    department: 'aquarium',
    category: 'Fish Food, Care & Supplements',
    image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=800&q=80',
    badges: ['Color Enhancing', 'Probiotic Formula', 'Instant Dechlorinator'],
    description: 'Value duo featuring 100g Spirulina & Antarctic Krill protein flakes with digestive enzymes, plus 250ml fast-acting concentrated dechlorinator that detoxifies heavy metals.',
    stock: 40,
    rating: 4.9,
    reviews: 48,
    aquaticSpecs: {
      careLevel: 'Easy',
      diet: 'High Protein / Spirulina 12%',
    },
  },
]

export const inspirationTiles = [
  {
    title: 'Atelier NP Marine Paint Kit',
    image: '/products/atelier-diy-paint-kit-sea.jpg',
  },
  {
    title: 'Ruby Gold Initial Keychains',
    image: '/products/atelier-ruby-glitter-keychains.jpg',
  },
  {
    title: 'Evil Eye Mandala Talisman',
    image: '/products/atelier-evil-eye-pendant.jpg',
  },
  {
    title: 'Atelier NP Explorer Plaster Craft',
    image: '/products/atelier-diy-paint-kit-explorer.jpg',
  },
  {
    title: 'Royal Discus Aquatic Display',
    image: 'https://images.unsplash.com/photo-1544943910-4c1dc44a0b38?auto=format&fit=crop&w=700&q=80',
  },
  {
    title: 'Lush Rimless Aquascape',
    image: 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?auto=format&fit=crop&w=700&q=80',
  },
]

export const testimonials = [
  {
    name: 'Ananya Sharma',
    role: 'Handmade jewelry collector, Jaipur',
    quote:
      'The silk bangles and kundan earrings arrived in gorgeous velvet-lined packaging. The craftsmanship feels like high-end boutique couture at an accessible price.',
  },
  {
    name: 'Dr. Vikram Malhotra',
    role: 'Aquascaper & Marine Biologist, Kochi',
    quote:
      'The Discus pair arrived active, healthy, and pristine in temperature-regulated packaging. The rimless Optiwhite tank clarity is unmatched. Incredible marketplace for both artisan crafts and aquatic treasures!',
  },
  {
    name: 'Pooja Nair',
    role: 'Interior stylist, Bengaluru',
    quote:
      'Every category feels thoughtful, colorful, and easy to browse. The botanical resin pieces and planted aquarium accessories look stunning on our living room shelves.',
  },
  {
    name: 'Rohan Mehra',
    role: 'Gift curator, Mumbai',
    quote:
      'The cards, badges, and soft palette make the whole store feel elevated while still warm and handmade. Quick delivery and zero plastic packaging!',
  },
]

export const allInitialProducts: Product[] = [
  ...fishAndAquariumProducts,
  ...handmadeProducts.map((p) => ({ ...p, department: 'crafts' as const })),
]

export const products = allInitialProducts


