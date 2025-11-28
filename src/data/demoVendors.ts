// Demo vendors shaped like Supabase rows used by Map.tsx (profiles nested)
type DemoVendor = {
  id: string;
  business_name: string;
  category?: string;
  profiles?: {
    location_lat?: number;
    location_lng?: number;
    full_name?: string;
    avatar_url?: string;
  };
};

type DemoService = {
  id: string;
  vendor_id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  status: string;
  vendor_profiles?: {
    business_name?: string;
    location_lat?: number;
    location_lng?: number;
  };
};

/**
 * Generate demo services from demo vendors
 */
export function generateDemoServices(vendors: DemoVendor[]): DemoService[] {
  const serviceTemplates = [
    { title: 'Fresh Delivery', desc: 'Daily fresh products from local sources', priceRange: [3, 8] },
    { title: 'Quick Service', desc: 'Fast and reliable service at your doorstep', priceRange: [5, 15] },
    { title: 'Professional Consultation', desc: 'Expert advice and consultation services', priceRange: [10, 30] },
    { title: 'Repair & Maintenance', desc: 'Quality repair and maintenance services', priceRange: [15, 50] },
    { title: 'Home Service', desc: 'Convenient home service available', priceRange: [8, 25] },
  ];

  const services: DemoService[] = [];
  
  vendors.forEach((vendor, index) => {
    const template = serviceTemplates[index % serviceTemplates.length];
    const price = template.priceRange[0] + Math.random() * (template.priceRange[1] - template.priceRange[0]);
    
    services.push({
      id: `demo-service-${vendor.id}`,
      vendor_id: vendor.id,
      title: template.title,
      description: template.desc,
      category: vendor.category || 'general',
      price: Math.round(price * 10) / 10,
      status: 'active',
      vendor_profiles: {
        business_name: vendor.business_name,
        location_lat: vendor.profiles?.location_lat,
        location_lng: vendor.profiles?.location_lng,
      }
    });
  });

  return services;
}

/**
 * Generate demo vendors around a user's location
 * This creates nearby vendors within ~5km radius
 */
export function generateNearbyDemoVendors(
  userLat: number,
  userLng: number,
  count: number = 12
): DemoVendor[] {
  const vendors: DemoVendor[] = [];
  const categories = ['grocery', 'food', 'health', 'electronics', 'tailoring', 'mechanic', 'transport', 'education', 'plumbing', 'construction'];
  const names = [
    "Fresh Foods Market",
    "Quick Bites Cafe",
    "Health Plus Clinic",
    "Tech Solutions",
    "Style Tailors",
    "Auto Repair Shop",
    "Swift Transport",
    "Learning Center",
    "Fix-It Plumbing",
    "Build Right Construction",
    "Green Grocery",
    "Spice Kitchen"
  ];

  for (let i = 0; i < count; i++) {
    // Generate random offset within ~5km (roughly 0.045 degrees)
    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
    const distance = 0.01 + Math.random() * 0.035; // 1-4km range
    
    const lat = userLat + Math.sin(angle) * distance;
    const lng = userLng + Math.cos(angle) * distance;

    vendors.push({
      id: `demo-vendor-${i + 1}`,
      business_name: names[i % names.length],
      category: categories[i % categories.length],
      profiles: {
        location_lat: lat,
        location_lng: lng,
        full_name: names[i % names.length],
        avatar_url: `https://i.pravatar.cc/100?img=${(i % 70) + 1}`
      }
    });
  }

  return vendors;
}

// Default demo vendors (for when user location is not available)
const demoVendors: DemoVendor[] = [
  {
    id: 'dv-1',
    business_name: "Nairobi Fresh Foods",
    category: 'grocery',
    profiles: { location_lat: -1.2921, location_lng: 36.8219, full_name: 'Nairobi Fresh Foods', avatar_url: 'https://i.pravatar.cc/100?img=1' },
  },
  {
    id: 'dv-2',
    business_name: "Mombasa Seafood Grill",
    category: 'food',
    profiles: { location_lat: -4.0435, location_lng: 39.6682, full_name: 'Mombasa Seafood Grill', avatar_url: 'https://i.pravatar.cc/100?img=2' },
  },
  {
    id: 'dv-3',
    business_name: "Kigali Health Clinic",
    category: 'health',
    profiles: { location_lat: -1.9706, location_lng: 30.1044, full_name: 'Kigali Health Clinic', avatar_url: 'https://i.pravatar.cc/100?img=3' },
  },
  {
    id: 'dv-4',
    business_name: "Lagos Electronics Hub",
    category: 'electronics',
    profiles: { location_lat: 6.5244, location_lng: 3.3792, full_name: 'Lagos Electronics Hub', avatar_url: 'https://i.pravatar.cc/100?img=4' },
  },
  {
    id: 'dv-5',
    business_name: "Accra Tailors & Co",
    category: 'tailoring',
    profiles: { location_lat: 5.6037, location_lng: -0.1870, full_name: 'Accra Tailors & Co', avatar_url: 'https://i.pravatar.cc/100?img=5' },
  },
  {
    id: 'dv-6',
    business_name: "Cape Town Mechanics",
    category: 'mechanic',
    profiles: { location_lat: -33.9249, location_lng: 18.4241, full_name: 'Cape Town Mechanics', avatar_url: 'https://i.pravatar.cc/100?img=6' },
  },
  {
    id: 'dv-7',
    business_name: "Dar Delivery Services",
    category: 'transport',
    profiles: { location_lat: -6.7924, location_lng: 39.2083, full_name: 'Dar Delivery Services', avatar_url: 'https://i.pravatar.cc/100?img=7' },
  },
  {
    id: 'dv-8',
    business_name: "Kampala Community Grocer",
    category: 'grocery',
    profiles: { location_lat: 0.3476, location_lng: 32.5825, full_name: 'Kampala Community Grocer', avatar_url: 'https://i.pravatar.cc/100?img=8' },
  },
];

export default demoVendors;
