import { RouteInfo } from '@/types';
import { loadGoogleMaps } from '@/lib/google-maps';

export interface GeocodingResult {
  formattedAddress: string;
  location: google.maps.LatLng;
}

export class MapsService {
  private directionsService: google.maps.DirectionsService | null = null;
  private geocoder: google.maps.Geocoder | null = null;
  private static instance: MapsService | null = null;

  private constructor() {}

  public static async getInstance(): Promise<MapsService> {
    if (!MapsService.instance) {
      MapsService.instance = new MapsService();
      await MapsService.instance.initialize();
    }
    return MapsService.instance;
  }

  private async initialize(): Promise<void> {
    await loadGoogleMaps();
    this.directionsService = new google.maps.DirectionsService();
    this.geocoder = new google.maps.Geocoder();
  }

  async getRouteInfo(
    origin: google.maps.LatLng | google.maps.LatLngLiteral,
    destination: google.maps.LatLng | google.maps.LatLngLiteral
  ): Promise<RouteInfo> {
    if (!this.directionsService) {
      throw new Error("MapsService not initialized");
    }

    return new Promise((resolve, reject) => {
      this.directionsService!.route(
        {
          origin,
          destination,
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (
          result: google.maps.DirectionsResult | null,
          status: google.maps.DirectionsStatus
        ) => {
          if (status === google.maps.DirectionsStatus.OK && result) {
            const route = result.routes[0];
            const leg = route.legs[0];
            const distanceValue = leg.distance?.value ?? 0;
            const durationValue = leg.duration?.value ?? 0;
            resolve({
              distance: distanceValue / 1000, // Convert meters to kilometers
              duration: durationValue / 60, // Convert seconds to minutes
              hasToll: false, // This would need to be determined by checking the route for toll roads
            });
          } else {
            reject(new Error(`Directions request failed: ${status}`));
          }
        }
      );
    });
  }

  async geocodeAddress(address: string): Promise<GeocodingResult> {
    if (!this.geocoder) {
      throw new Error("MapsService not initialized");
    }

    return new Promise((resolve, reject) => {
      this.geocoder!.geocode(
        { address },
        (
          results: google.maps.GeocoderResult[] | null,
          status: google.maps.GeocoderStatus
        ) => {
          if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
            resolve({
              formattedAddress: results[0].formatted_address,
              location: results[0].geometry.location,
            });
          } else {
            reject(new Error(`Geocoding failed: ${status}`));
          }
        }
      );
    });
  }
} 