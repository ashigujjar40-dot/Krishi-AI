export type UserRole = 'farmer' | 'dealer' | 'agronomist';

export type LanguageCode = 'en' | 'hi' | 'mr' | 'te';

export interface UserProfile {
  id: string;
  phone: string;
  name: string;
  role: UserRole;
  language: LanguageCode;
  pincode: string;
  state?: string;
  district?: string;
  // Farmer specific
  landSizeAcres?: number;
  primaryCrops?: string[];
  // Dealer specific
  shopName?: string;
  gstNumber?: string;
  address?: string;
}

export type ProblemType = 'disease' | 'pest' | 'nutrient_deficiency' | 'healthy' | 'unknown';
export type SeverityLevel = 'mild' | 'moderate' | 'severe';

export interface TreatmentOption {
  type: 'organic' | 'chemical' | 'cultural';
  title: string;
  productName: string;
  activeIngredient: string;
  dosePerAcre: string;
  applicationTiming: string;
  safetyPrecautions: string[];
  waitingPeriodDays?: number; // Pre-harvest interval (PHI)
  cibrcRegistered: boolean; // India Central Insecticides Board registration verified
  estimatedCostInr: number;
}

export interface CropDiagnosisResult {
  id: string;
  farmerId: string;
  farmerPhone: string;
  cropName: string;
  cropVariety?: string;
  problemName: string;
  problemNameTranslated?: string;
  scientificName?: string;
  problemType: ProblemType;
  confidence: number; // 0 to 100
  severity: SeverityLevel;
  symptomsObserved: string[];
  imageUrls: string[];
  treatments: TreatmentOption[];
  needsExpertReview: boolean;
  expertQuestions?: string[];
  audioSummaryText?: string;
  createdAt: string;
  fieldId?: string;
}

export interface FollowUpRecord {
  id: string;
  diagnosisId: string;
  farmerId: string;
  cropName: string;
  problemName: string;
  dayTarget: 3 | 7;
  dueDate: string;
  status: 'pending' | 'completed' | 'escalated';
  outcome?: 'improved' | 'same' | 'worse';
  newImageUrl?: string;
  notes?: string;
  agronomistNotes?: string;
  createdAt: string;
}

export interface AgriProduct {
  id: string;
  name: string;
  brand: string;
  category: 'bio_pesticide' | 'fungicide' | 'insecticide' | 'herbicide' | 'fertilizer' | 'growth_promoter';
  activeIngredient: string;
  packSize: string;
  mrpHindi?: string;
  mrp: number;
  cibrcRegistrationNumber: string;
  isBannedInIndia: boolean;
  suitableCrops: string[];
  targetPestsDiseases: string[];
  safetyWear: string[];
  imageUrl: string;
}

export interface DealerStockItem {
  id: string;
  dealerId: string;
  dealerName: string;
  shopName: string;
  phone: string;
  pincode: string;
  distanceKm: number;
  productId: string;
  productName: string;
  brand: string;
  packSize: string;
  price: number;
  inStock: boolean;
  stockQuantity: number;
  rating: number;
  verifiedDealer: boolean;
}

export interface CartItem {
  stockItem: DealerStockItem;
  quantity: number;
}

export type OrderStatus = 'pending' | 'accepted' | 'ready_for_pickup' | 'out_for_delivery' | 'delivered' | 'cancelled';
export type DeliveryType = 'pickup' | 'delivery';
export type PaymentMethod = 'upi' | 'cod';
export type PaymentStatus = 'pending' | 'paid' | 'cash_on_delivery';

export interface Order {
  id: string;
  orderNumber: string;
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  deliveryAddress: string;
  pincode: string;
  dealerId: string;
  dealerShopName: string;
  dealerPhone: string;
  items: {
    productId: string;
    productName: string;
    packSize: string;
    unitPrice: number;
    quantity: number;
  }[];
  totalAmount: number;
  status: OrderStatus;
  deliveryType: DeliveryType;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  createdAt: string;
  diagnosisId?: string;
  whatsappNotified?: boolean;
}

export interface FarmField {
  id: string;
  name: string;
  crop: string;
  areaAcres: number;
  sowingDate: string;
  soilType: string;
  irrigationType: 'drip' | 'sprinkler' | 'flood' | 'rainfed';
  pincode: string;
  lastSprayDate?: string;
}

export interface WeatherAlert {
  location: string;
  tempCelsius: number;
  condition: string;
  humidityPercent: number;
  rainProbabilityPercent: number;
  windSpeedKmH: number;
  sprayAdvisory: string;
  sprayFeasible: boolean;
}

export interface WhatsAppPreferences {
  enabled: boolean;
  whatsappPhone: string;
  orderUpdates: boolean;
  weatherAlerts: boolean;
  followUpReminders: boolean;
  consentedAt?: string;
}

export interface WhatsAppNotification {
  id: string;
  recipientPhone: string;
  type: 'order_status' | 'weather_advisory' | 'followup_reminder' | 'test';
  title: string;
  body: string;
  status: 'sent' | 'delivered' | 'simulated' | 'failed';
  provider: 'twilio' | 'msg91' | 'simulated';
  orderId?: string;
  whatsappLink?: string;
  sentAt: string;
}
