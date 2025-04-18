"use client";

import { useEffect, useRef } from "react";
import { Location, RouteInfo } from "@/types";
import { loadGoogleMaps } from "@/lib/google-maps";

interface MapViewProps {
  workLocation: Location;
  disposalLocation: Location;
  routeInfo: RouteInfo;
}

export function MapView({ workLocation, disposalLocation, routeInfo }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);

  useEffect(() => {
    let isMounted = true;

    const initializeMap = async () => {
      try {
        await loadGoogleMaps();

        if (!mapRef.current || mapInstanceRef.current || !isMounted) return;

        // Initialize map
        const map = new google.maps.Map(mapRef.current, {
          center: workLocation.coordinates,
          zoom: 12,
        });
        mapInstanceRef.current = map;

        // Initialize directions renderer
        const directionsRenderer = new google.maps.DirectionsRenderer({
          map,
          suppressMarkers: false,
        });
        directionsRendererRef.current = directionsRenderer;

        // Create directions service
        const directionsService = new google.maps.DirectionsService();

        // Calculate and display route
        directionsService.route(
          {
            origin: workLocation.coordinates,
            destination: disposalLocation.coordinates,
            travelMode: google.maps.TravelMode.DRIVING,
          },
          (result, status) => {
            if (status === google.maps.DirectionsStatus.OK && result && isMounted) {
              directionsRenderer.setDirections(result);

              // Fit map to show entire route
              const bounds = new google.maps.LatLngBounds();
              result.routes[0].legs[0].steps.forEach((step) => {
                bounds.extend(step.start_location);
                bounds.extend(step.end_location);
              });
              map.fitBounds(bounds);
            }
          }
        );
      } catch (error) {
        console.error("Error initializing map:", error);
      }
    };

    initializeMap();

    return () => {
      isMounted = false;
    };
  }, [workLocation, disposalLocation]);

  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden">
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
} 