export interface PincodeDetails {
  pincode: string
  city: string
  state: string
  district?: string
  success: boolean
}

// Instant local prefix map for zero-latency detection of states & major capitals
const PREFIX_MAP: Record<string, { city: string; state: string }> = {
  // Delhi NCR
  '11': { city: 'New Delhi', state: 'Delhi' },

  // Haryana & Punjab
  '12': { city: 'Faridabad', state: 'Haryana' },
  '122': { city: 'Gurugram', state: 'Haryana' },
  '13': { city: 'Ambala', state: 'Haryana' },
  '134': { city: 'Panchkula', state: 'Haryana' },
  '14': { city: 'Amritsar', state: 'Punjab' },
  '141': { city: 'Ludhiana', state: 'Punjab' },
  '15': { city: 'Bathinda', state: 'Punjab' },
  '16': { city: 'Chandigarh', state: 'Chandigarh' },

  // Himachal Pradesh & J&K
  '171': { city: 'Shimla', state: 'Himachal Pradesh' },
  '17': { city: 'Dharamshala', state: 'Himachal Pradesh' },
  '180': { city: 'Jammu', state: 'Jammu and Kashmir' },
  '190': { city: 'Srinagar', state: 'Jammu and Kashmir' },

  // Uttar Pradesh & Uttarakhand
  '201': { city: 'Noida', state: 'Uttar Pradesh' },
  '20': { city: 'Aligarh', state: 'Uttar Pradesh' },
  '21': { city: 'Prayagraj', state: 'Uttar Pradesh' },
  '221': { city: 'Varanasi', state: 'Uttar Pradesh' },
  '226': { city: 'Lucknow', state: 'Uttar Pradesh' },
  '208': { city: 'Kanpur', state: 'Uttar Pradesh' },
  '248': { city: 'Dehradun', state: 'Uttarakhand' },
  '263': { city: 'Nainital', state: 'Uttarakhand' },
  '27': { city: 'Gorakhpur', state: 'Uttar Pradesh' },
  '28': { city: 'Agra', state: 'Uttar Pradesh' },

  // Rajasthan
  '302': { city: 'Jaipur', state: 'Rajasthan' },
  '30': { city: 'Jaipur', state: 'Rajasthan' },
  '313': { city: 'Udaipur', state: 'Rajasthan' },
  '324': { city: 'Kota', state: 'Rajasthan' },
  '342': { city: 'Jodhpur', state: 'Rajasthan' },

  // Gujarat
  '380': { city: 'Ahmedabad', state: 'Gujarat' },
  '382': { city: 'Gandhinagar', state: 'Gujarat' },
  '390': { city: 'Vadodara', state: 'Gujarat' },
  '395': { city: 'Surat', state: 'Gujarat' },
  '360': { city: 'Rajkot', state: 'Gujarat' },

  // Maharashtra & Goa
  '400': { city: 'Mumbai', state: 'Maharashtra' },
  '403': { city: 'Panaji', state: 'Goa' },
  '411': { city: 'Pune', state: 'Maharashtra' },
  '422': { city: 'Nashik', state: 'Maharashtra' },
  '431': { city: 'Chhatrapati Sambhajinagar', state: 'Maharashtra' },
  '440': { city: 'Nagpur', state: 'Maharashtra' },

  // Madhya Pradesh & Chhattisgarh
  '452': { city: 'Indore', state: 'Madhya Pradesh' },
  '462': { city: 'Bhopal', state: 'Madhya Pradesh' },
  '482': { city: 'Jabalpur', state: 'Madhya Pradesh' },
  '492': { city: 'Raipur', state: 'Chhattisgarh' },

  // Andhra Pradesh & Telangana
  '500': { city: 'Hyderabad', state: 'Telangana' },
  '520': { city: 'Vijayawada', state: 'Andhra Pradesh' },
  '530': { city: 'Visakhapatnam', state: 'Andhra Pradesh' },
  '522': { city: 'Guntur', state: 'Andhra Pradesh' },

  // Karnataka
  '560': { city: 'Bengaluru', state: 'Karnataka' },
  '570': { city: 'Mysuru', state: 'Karnataka' },
  '575': { city: 'Mangaluru', state: 'Karnataka' },
  '580': { city: 'Hubballi', state: 'Karnataka' },

  // Tamil Nadu & Kerala
  '600': { city: 'Chennai', state: 'Tamil Nadu' },
  '641': { city: 'Coimbatore', state: 'Tamil Nadu' },
  '625': { city: 'Madurai', state: 'Tamil Nadu' },
  '682': { city: 'Kochi', state: 'Kerala' },
  '695': { city: 'Thiruvananthapuram', state: 'Kerala' },
  '673': { city: 'Kozhikode', state: 'Kerala' },

  // West Bengal, Odisha & Northeast
  '700': { city: 'Kolkata', state: 'West Bengal' },
  '734': { city: 'Siliguri', state: 'West Bengal' },
  '751': { city: 'Bhubaneswar', state: 'Odisha' },
  '753': { city: 'Cuttack', state: 'Odisha' },
  '781': { city: 'Guwahati', state: 'Assam' },
  '791': { city: 'Itanagar', state: 'Arunachal Pradesh' },
  '793': { city: 'Shillong', state: 'Meghalaya' },
  '795': { city: 'Imphal', state: 'Manipur' },
  '796': { city: 'Aizawl', state: 'Mizoram' },
  '797': { city: 'Kohima', state: 'Nagaland' },
  '799': { city: 'Agartala', state: 'Tripura' },
  '737': { city: 'Gangtok', state: 'Sikkim' },

  // Bihar & Jharkhand
  '800': { city: 'Patna', state: 'Bihar' },
  '834': { city: 'Ranchi', state: 'Jharkhand' },
  '831': { city: 'Jamshedpur', state: 'Jharkhand' },
  '826': { city: 'Dhanbad', state: 'Jharkhand' },
}

const memoryCache = new Map<string, PincodeDetails>()

/**
 * Fast lookup of Indian PIN code
 * First checks memory cache, then instant prefix table, then fetches official postal API
 */
export async function lookupPincode(pincodeRaw: string): Promise<PincodeDetails | null> {
  const pin = pincodeRaw.replace(/[^0-9]/g, '').slice(0, 6)
  if (pin.length !== 6) return null

  // 1. Check memory cache
  if (memoryCache.has(pin)) {
    return memoryCache.get(pin)!
  }

  // 2. Initial instant local guess from prefix (so UI updates with zero lag)
  let instantGuess: { city: string; state: string } | null = null
  for (const len of [3, 2]) {
    const prefix = pin.slice(0, len)
    if (PREFIX_MAP[prefix]) {
      instantGuess = PREFIX_MAP[prefix]
      break
    }
  }

  // 3. Query India Post Public API for 100% exact district & state
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 3500)

    const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`, {
      signal: controller.signal,
    })
    clearTimeout(timeoutId)

    if (res.ok) {
      const data = await res.json()
      if (Array.isArray(data) && data[0]?.Status === 'Success' && data[0]?.PostOffice?.length > 0) {
        const po = data[0].PostOffice[0]
        const details: PincodeDetails = {
          pincode: pin,
          city: po.District || po.Block || po.Division || instantGuess?.city || '',
          state: po.State || instantGuess?.state || '',
          district: po.District || po.Name,
          success: true,
        }
        memoryCache.set(pin, details)
        return details
      }
    }
  } catch (err) {
    console.warn('Postal API network lookup failed, falling back to prefix map:', err)
  }

  // Fallback to instant prefix guess if API fails or is offline
  if (instantGuess) {
    const fallbackDetails: PincodeDetails = {
      pincode: pin,
      city: instantGuess.city,
      state: instantGuess.state,
      success: true,
    }
    memoryCache.set(pin, fallbackDetails)
    return fallbackDetails
  }

  return null
}
