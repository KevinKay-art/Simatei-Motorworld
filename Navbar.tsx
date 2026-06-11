/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number; // in km
  fuelType: 'Petrol' | 'Diesel' | 'Hybrid' | 'Electric';
  transmission: 'Automatic' | 'Manual';
  engine: string;
  color: string; // exterior color
  interiorColor?: string; // e.g., Black Leather, Beige Leather
  driveType?: 'AWD' | '4WD' | '2WD' | 'RWD' | 'FWD';
  dutyStatus?: 'Duty Paid' | 'Duty Free' | 'On Transit';
  importStatus?: 'Locally Used' | 'Foreign Used' | 'Brand New' | 'Direct Import';
  bodyType?: 'SUV' | 'Sedan' | 'Hatchback' | 'Station Wagon' | 'Coupe' | 'Convertible' | 'Pickup';
  location?: 'Nairobi' | 'Mombasa' | 'Transit';
  conditionGrade?: string; // e.g. Grade 4.5, Grade A
  features: string[];
  images: string[];
  status: 'Available' | 'Sold';
  description: string;
  createdAt: string;
}

export interface Inquiry {
  id: string;
  carId?: string;
  carName?: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  status: 'Unread' | 'Read' | 'Archived';
}

export interface AdminUser {
  id: string;
  username: string;
  name: string;
}

export interface AuthResponse {
  token: string;
  user: AdminUser;
}

export interface FilterParams {
  search: string;
  make: string;
  minPrice: string;
  maxPrice: string;
  minYear: string;
  maxYear: string;
  transmission: string;
  fuelType: string;
  status: string;
  sortBy: string;
}
