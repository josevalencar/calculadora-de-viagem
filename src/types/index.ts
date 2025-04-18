export interface Location {
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface RouteInfo {
  distance: number; // in kilometers
  duration: number; // in minutes
  hasToll: boolean;
}

export interface CostCalculation {
  workLocation: Location;
  disposalLocation: Location;
  fuelCost: number;
  disposalCost: number;
  tollCost: number;
  driverHourlyCost: number;
  driverCommission: number;
  trackingCost: number;
  insuranceCost: number;
  generalExpenses: number;
  profit: number;
  totalCost: number;
}

export interface CalculationInputs {
  workLocation: Location;
  disposalLocation: Location;
  dieselPrice: number;
  disposalPrice: number;
  hasToll: boolean;
  roundTrip: boolean;
  profitPercentage: number;
}

export interface DefaultValues {
  dieselPrice: number;
  disposalPrice: number;
  tollPrice: number;
  semPararMonthly: number;
  trackingMonthly: number;
  insuranceMonthly: number;
  driverSalary: number;
  driverCommission: number;
  generalExpenses: number;
  averageTripsPerDay: number;
  kmPerLiter: number;
} 