export type RefrigeratorStatus = 'food_available' | 'empty' | 'offline' | 'unknown';

export interface Mosque {
  id: string;
  name: string;
  governorate: string;
  area: string;
  address: string;
  lat: number;
  lng: number;
  imam_name?: string;
  contact_phone?: string;
}

export interface CharityRefrigerator {
  id: string; // e.g. FRIDGE-AMM-001
  mosque_id: string;
  mosque_name: string;
  governorate: string;
  area: string;
  address: string;
  lat: number;
  lng: number;
  status: RefrigeratorStatus;
  fill_percentage: number; // 0 - 100%
  temperature_celsius: number; // e.g. 4.0 °C
  food_description: string;
  estimated_meals_count: number;
  last_sensor_update: string; // ISO string
  last_restocked_at?: string;
  sensor_device_id: string; // e.g. IOT-SENS-8841
  sensor_battery_level: number; // 0 - 100%
  sensor_signal_strength: 'excellent' | 'good' | 'weak' | 'offline';
  notes?: string;
  is_demo?: boolean;
}

export interface FreeFoodRestaurant {
  id: string;
  name: string;
  governorate: string;
  area: string;
  address: string;
  lat: number;
  lng: number;
  phone: string;
  available_meals_today: number;
  meal_type: string;
  working_hours: string;
  instructions: string;
  sponsor_name?: string;
  image_url?: string;
}

export interface CharityNetworkStats {
  totalRefrigerators: number;
  availableRefrigerators: number;
  emptyRefrigerators: number;
  offlineRefrigerators: number;
  totalRestaurants: number;
  totalMealsAvailable: number;
  totalBeneficiariesToday: number;
}
