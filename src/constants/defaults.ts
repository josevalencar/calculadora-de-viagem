import { DefaultValues } from "@/types";

export const DEFAULT_VALUES: DefaultValues = {
  dieselPrice: 5.80,
  disposalPrice: 120,
  tollPrice: 16.20,
  semPararMonthly: 66.90,
  trackingMonthly: 150, // Assuming average monthly tracking cost
  insuranceMonthly: 800, // Assuming average monthly insurance cost
  driverSalary: 3113.08,
  driverCommission: 15,
  generalExpenses: 5000, // Monthly general expenses
  averageTripsPerDay: 3.5, // Average of 2-5 trips per day
  kmPerLiter: 2.5, // Average km per liter of diesel
};

export const WORKING_HOURS_PER_MONTH = 176; // 44 hours per week * 4 weeks
export const DEFAULT_PROFIT_PERCENTAGE = 20; 