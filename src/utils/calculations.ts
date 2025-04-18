import { CalculationInputs, CostCalculation, RouteInfo } from "@/types";
import { DEFAULT_VALUES, WORKING_HOURS_PER_MONTH } from "@/constants/defaults";

export function calculateCosts(
  inputs: CalculationInputs,
  routeInfo: RouteInfo
): CostCalculation {
  const {
    workLocation,
    disposalLocation,
    dieselPrice,
    disposalPrice,
    hasToll,
    roundTrip,
    profitPercentage,
  } = inputs;

  // Calculate total distance (including return trip if applicable)
  const totalDistance = routeInfo.distance * (roundTrip ? 2 : 1);

  // Calculate fuel cost
  const fuelCost = (totalDistance / DEFAULT_VALUES.kmPerLiter) * dieselPrice;

  // Calculate disposal cost
  const disposalCost = disposalPrice;

  // Calculate toll cost
  const tollCost = hasToll
    ? DEFAULT_VALUES.tollPrice * (roundTrip ? 2 : 1)
    : 0;

  // Calculate driver hourly cost
  const driverHourlyRate = DEFAULT_VALUES.driverSalary / WORKING_HOURS_PER_MONTH;
  const tripDurationHours = routeInfo.duration / 60;
  const driverHourlyCost = driverHourlyRate * tripDurationHours * (roundTrip ? 2 : 1);

  // Calculate driver commission
  const driverCommission = DEFAULT_VALUES.driverCommission;

  // Calculate tracking cost per trip
  const trackingCost =
    (DEFAULT_VALUES.trackingMonthly +
      DEFAULT_VALUES.semPararMonthly +
      DEFAULT_VALUES.insuranceMonthly) /
    (DEFAULT_VALUES.averageTripsPerDay * 30);

  // Calculate general expenses per trip
  const generalExpenses =
    DEFAULT_VALUES.generalExpenses /
    (DEFAULT_VALUES.averageTripsPerDay * 30);

  // Calculate subtotal
  const subtotal =
    fuelCost +
    disposalCost +
    tollCost +
    driverHourlyCost +
    driverCommission +
    trackingCost +
    generalExpenses;

  // Calculate profit
  const profit = (subtotal * profitPercentage) / 100;

  // Calculate total cost
  const totalCost = subtotal + profit;

  return {
    workLocation,
    disposalLocation,
    fuelCost,
    disposalCost,
    tollCost,
    driverHourlyCost,
    driverCommission,
    trackingCost,
    insuranceCost: trackingCost, // Included in tracking cost
    generalExpenses,
    profit,
    totalCost,
  };
} 