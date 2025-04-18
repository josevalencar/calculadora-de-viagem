import { Loader } from '@googlemaps/js-api-loader';

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

// Create a loader with all required libraries
export const googleMapsLoader = new Loader({
  apiKey: GOOGLE_MAPS_API_KEY,
  version: "weekly",
  libraries: ["places", "geometry"],
});

// Track if the API has been loaded
let isLoaded = false;

export async function loadGoogleMaps() {
  if (!isLoaded) {
    await googleMapsLoader.load();
    isLoaded = true;
  }
  
  return window.google;
} 