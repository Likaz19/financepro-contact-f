import { useEffect, useRef, useState } from 'react'

export interface PlaceResult {
  formatted_address: string
  address_components?: Array<{
    long_name: string
    short_name: string
    types: string[]
  }>
  geometry?: {
    location: {
      lat(): number
      lng(): number
    }
  }
}

export function useGooglePlaces(apiKey: string | null) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const scriptRef = useRef<HTMLScriptElement | null>(null)

  useEffect(() => {
    if (!apiKey) {
      setError("Clé API Google Places non configurée")
      return
    }

    if ((window as any).google?.maps?.places) {
      setIsLoaded(true)
      return
    }

    if (scriptRef.current) {
      return
    }

    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&language=fr`
    script.async = true
    script.defer = true
    
    script.onload = () => {
      setIsLoaded(true)
      setError(null)
    }
    
    script.onerror = () => {
      setError("Erreur lors du chargement de Google Places API")
      setIsLoaded(false)
    }

    scriptRef.current = script
    document.head.appendChild(script)

    return () => {
      if (scriptRef.current && scriptRef.current.parentNode) {
        scriptRef.current.parentNode.removeChild(scriptRef.current)
        scriptRef.current = null
      }
    }
  }, [apiKey])

  return { isLoaded, error }
}

export function useAutocomplete(
  inputRef: React.RefObject<HTMLInputElement | null>,
  onPlaceSelected: (place: PlaceResult) => void,
  isLoaded: boolean
) {
  const autocompleteRef = useRef<any>(null)

  useEffect(() => {
    if (!isLoaded || !inputRef.current || autocompleteRef.current) {
      return
    }

    try {
      const google = (window as any).google
      if (!google?.maps?.places) {
        return
      }

      const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
        types: ['address'],
        fields: ['formatted_address', 'address_components', 'geometry'],
      })

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace()
        if (place.formatted_address) {
          onPlaceSelected({
            formatted_address: place.formatted_address,
            address_components: place.address_components,
            geometry: place.geometry,
          })
        }
      })

      autocompleteRef.current = autocomplete
    } catch (err) {
      console.error('Erreur initialisation autocomplete:', err)
    }

    return () => {
      if (autocompleteRef.current) {
        const google = (window as any).google
        if (google?.maps?.event) {
          google.maps.event.clearInstanceListeners(autocompleteRef.current)
        }
        autocompleteRef.current = null
      }
    }
  }, [isLoaded, inputRef, onPlaceSelected])

  return autocompleteRef
}
