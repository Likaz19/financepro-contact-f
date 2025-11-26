declare namespace google.maps {
  export namespace places {
    export class Autocomplete {
      constructor(
        input: HTMLInputElement,
        options?: {
          types?: string[]
          fields?: string[]
          componentRestrictions?: { country: string | string[] }
        }
      )
      addListener(eventName: string, handler: () => void): void
      getPlace(): PlaceResult
    }

    export interface PlaceResult {
      formatted_address?: string
      address_components?: GeocoderAddressComponent[]
      geometry?: PlaceGeometry
    }

    export interface PlaceGeometry {
      location: LatLng
      viewport: LatLngBounds
    }
  }

  export interface GeocoderAddressComponent {
    long_name: string
    short_name: string
    types: string[]
  }

  export interface LatLng {
    lat(): number
    lng(): number
  }

  export interface LatLngBounds {
    getNorthEast(): LatLng
    getSouthWest(): LatLng
  }

  export namespace event {
    export function clearInstanceListeners(instance: any): void
  }
}

interface Window {
  google?: typeof google
}
