declare namespace google.maps {
  class Map {
    constructor(element: HTMLElement, options?: MapOptions);
    setCenter(latLng: LatLng | LatLngLiteral): void;
    setZoom(zoom: number): void;
    fitBounds(bounds: LatLngBounds): void;
  }

  interface MapOptions {
    center?: LatLng | LatLngLiteral;
    zoom?: number;
  }

  class LatLng {
    constructor(lat: number, lng: number);
    lat(): number;
    lng(): number;
  }

  interface LatLngLiteral {
    lat: number;
    lng: number;
  }

  class LatLngBounds {
    constructor(sw?: LatLng | LatLngLiteral, ne?: LatLng | LatLngLiteral);
    extend(point: LatLng | LatLngLiteral): void;
  }

  class DirectionsService {
    route(
      request: DirectionsRequest,
      callback: (
        result: DirectionsResult | null,
        status: DirectionsStatus
      ) => void
    ): void;
  }

  interface DirectionsRequest {
    origin: LatLng | LatLngLiteral;
    destination: LatLng | LatLngLiteral;
    travelMode: TravelMode;
  }

  interface DirectionsResult {
    routes: DirectionsRoute[];
  }

  interface DirectionsRoute {
    legs: DirectionsLeg[];
  }

  interface DirectionsLeg {
    distance?: Distance;
    duration?: Duration;
    steps: DirectionsStep[];
  }

  interface DirectionsStep {
    start_location: LatLng;
    end_location: LatLng;
  }

  interface Duration {
    text: string;
    value: number;
  }

  interface Distance {
    text: string;
    value: number;
  }

  class DirectionsRenderer {
    constructor(options?: DirectionsRendererOptions);
    setDirections(directions: DirectionsResult): void;
  }

  interface DirectionsRendererOptions {
    map?: Map;
    directions?: DirectionsResult;
    suppressMarkers?: boolean;
  }

  enum TravelMode {
    DRIVING = "DRIVING",
    WALKING = "WALKING",
    BICYCLING = "BICYCLING",
    TRANSIT = "TRANSIT",
  }

  enum DirectionsStatus {
    OK = "OK",
    NOT_FOUND = "NOT_FOUND",
    ZERO_RESULTS = "ZERO_RESULTS",
    MAX_WAYPOINTS_EXCEEDED = "MAX_WAYPOINTS_EXCEEDED",
    INVALID_REQUEST = "INVALID_REQUEST",
    OVER_QUERY_LIMIT = "OVER_QUERY_LIMIT",
    REQUEST_DENIED = "REQUEST_DENIED",
    UNKNOWN_ERROR = "UNKNOWN_ERROR",
  }

  class Geocoder {
    constructor();
    geocode(
      request: GeocoderRequest,
      callback: (
        results: GeocoderResult[] | null,
        status: GeocoderStatus
      ) => void
    ): void;
  }

  interface GeocoderRequest {
    address: string;
  }

  interface GeocoderResult {
    formatted_address: string;
    geometry: {
      location: LatLng;
    };
  }

  enum GeocoderStatus {
    OK = "OK",
    ZERO_RESULTS = "ZERO_RESULTS",
    OVER_QUERY_LIMIT = "OVER_QUERY_LIMIT",
    REQUEST_DENIED = "REQUEST_DENIED",
    INVALID_REQUEST = "INVALID_REQUEST",
    UNKNOWN_ERROR = "UNKNOWN_ERROR",
  }
}

declare namespace google.maps.places {
  class Autocomplete {
    constructor(
      inputField: HTMLInputElement,
      opts?: AutocompleteOptions
    );
    addListener(
      eventName: string,
      handler: () => void
    ): void;
    getPlace(): PlaceResult;
  }

  interface AutocompleteOptions {
    types?: string[];
    componentRestrictions?: {
      country: string | string[];
    };
    fields?: string[];
  }

  interface PlaceResult {
    formatted_address?: string;
    geometry?: {
      location: google.maps.LatLng;
    };
    address_components?: AddressComponent[];
  }

  interface AddressComponent {
    long_name: string;
    short_name: string;
    types: string[];
  }
} 