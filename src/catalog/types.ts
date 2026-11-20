export interface Pagination { page: number; limit: number; total: number }
export interface Money { amount: string; currency: string }
export interface CatalogImage { id: string; url: string; altText: string | null; role: string; width: number | null; height: number | null }
export interface Amenity { code: string; name: string; category: string }

export interface HotelSummary {
  id: string;
  slug: string;
  name: string;
  shortDescription: string | null;
  city: string;
  region: string | null;
  countryCode: string;
  starRating: number | null;
  coverImageUrl: string | null;
  fromPrice: Money | null;
}

export interface HotelDetail {
  id: string;
  slug: string;
  name: string;
  shortDescription: string | null;
  description: string | null;
  phone: string | null;
  address: { line: string | null; city: string; region: string | null; postalCode: string | null; countryCode: string };
  coordinates: { latitude: number; longitude: number } | null;
  timezone: string;
  starRating: number | null;
  images: CatalogImage[];
  amenities: Amenity[];
}

export interface HotelRatePlan {
  id: string;
  name: string;
  mealPlan: "ROOM_ONLY" | "BREAKFAST" | "HALF_BOARD" | "FULL_BOARD" | "ALL_INCLUSIVE";
  basePriceAmount: string;
  currency: string;
  priceUnit: "PER_ROOM_NIGHT" | "PER_STAY";
  cancellationTerms: Record<string, unknown>;
}

export interface HotelRoomType {
  id: string;
  name: string;
  category: string | null;
  description: string | null;
  areaSqm: number | null;
  maxGuests: number;
  images: CatalogImage[];
  beds: Array<{ type: string; quantity: number }>;
  amenities: Amenity[];
  ratePlans: HotelRatePlan[];
}

export interface CompanionSummary {
  id: string;
  displayName: string;
  slug: string;
  portraitUrl: string;
  ratings: { sights: number; food: number; nightlife: number };
}

export interface CompanionProfile {
  slug: string;
  portraitUrl: string;
  galleryUrls: string[];
  tagline: string;
  introduction: string;
  city: string;
  serviceArea: string;
  languages: string[];
  ratings: CompanionSummary["ratings"];
  ageRange: string;
  heightCm: number;
  weightKg: number;
  hair: string;
  eyes: string;
  figure: string;
  cuisines: string[];
  drinks: string[];
  wellness: string;
  travelPreferences: string;
}

export interface CompanionDetail {
  id: string;
  displayName: string;
  timezone: string;
  bookingWindowDays: number;
  slotDurationMinutes: number;
  serviceDay: { startsAt: string; endsAt: string };
  profile: CompanionProfile;
  services: Array<{ id: string; name: string; baseHourlyPriceAmount: string; currency: string; terms: Record<string, unknown> }>;
}

export interface CompanionAvailability {
  companionId: string;
  serviceId: string;
  serviceDate: string;
  timezone: string;
  currency: string;
  slots: Array<{
    id: string;
    startsAt: string;
    endsAt: string;
    rateBand: "STANDARD" | "EVENING" | "LATE_NIGHT";
    rateMultiplierBps: number;
    hourlyPriceAmount: string;
  }>;
}
