"use client";

import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Location } from "@/types";
import { loadGoogleMaps } from "@/lib/google-maps";

interface AddressAutocompleteProps {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (location: Location) => void;
  onInputChange: (value: string) => void;
}

export function AddressAutocomplete({
  id,
  label,
  placeholder,
  value,
  onChange,
  onInputChange,
}: AddressAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const initializeAutocomplete = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Load Google Maps API
        const google = await loadGoogleMaps();
        
        // Check if Places library is available
        if (!google.maps.places) {
          throw new Error("Google Maps Places library not loaded");
        }

        if (!inputRef.current || autocompleteRef.current || !isMounted) return;

        // Initialize autocomplete
        const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
          componentRestrictions: { country: "br" },
          fields: ["address_components", "formatted_address", "geometry"],
        });

        // Add listener for place selection
        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          
          if (place.geometry && place.geometry.location) {
            const location: Location = {
              address: place.formatted_address || "",
              coordinates: {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng(),
              },
            };
            
            onChange(location);
            onInputChange(place.formatted_address || "");
          }
        });

        autocompleteRef.current = autocomplete;
      } catch (error) {
        console.error("Error initializing autocomplete:", error);
        if (isMounted) {
          setError(error instanceof Error ? error.message : "Failed to initialize address autocomplete");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAutocomplete();

    return () => {
      isMounted = false;
    };
  }, [onChange, onInputChange]);

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        ref={inputRef}
        id={id}
        value={value}
        onChange={(e) => onInputChange(e.target.value)}
        placeholder={placeholder}
        className="w-full"
        disabled={isLoading}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
} 