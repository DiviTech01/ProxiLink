import { useState, useCallback, useEffect } from 'react';

export interface Coordinates {
  lat: number;
  lng: number;
  accuracy?: number;
  timestamp?: number;
}

export interface GeolocationState {
  location: Coordinates | null;
  loading: boolean;
  error: string | null;
  isWatching: boolean;
  permissionGranted: boolean;
}

const LOCATION_CACHE_KEY = 'proxilink_last_location';
const PERMISSION_CACHE_KEY = 'proxilink_location_permission';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Custom hook for browser geolocation
 * Manages location requests, permissions, and tracking
 * Automatically requests location if permission was previously granted
 */
export const useGeolocation = () => {
  const [state, setState] = useState<GeolocationState>({
    location: null,
    loading: false,
    error: null,
    isWatching: false,
    permissionGranted: false,
  });

  const [watchId, setWatchId] = useState<number | null>(null);
  const [autoRequested, setAutoRequested] = useState(false);

  /**
   * Load cached location from localStorage
   * Returns true if valid cached location was found and loaded
   */
  const loadCachedLocation = useCallback(() => {
    try {
      const cached = localStorage.getItem(LOCATION_CACHE_KEY);
      if (!cached) return false;

      const parsed = JSON.parse(cached);
      const age = Date.now() - (parsed.timestamp || 0);

      if (age < CACHE_DURATION) {
        console.log('Loading cached location:', parsed);
        setState(prev => ({
          ...prev,
          location: parsed,
        }));
        return true;
      } else {
        console.log('Cached location expired');
        localStorage.removeItem(LOCATION_CACHE_KEY);
        return false;
      }
    } catch (error) {
      console.error('Error loading cached location:', error);
      return false;
    }
  }, []);

  /**
   * Check location permission status
   * Returns true if permission is granted
   */
  const checkPermission = useCallback(async () => {
    try {
      // Check localStorage cache first
      const cachedPermission = localStorage.getItem(PERMISSION_CACHE_KEY);
      if (cachedPermission === 'granted') {
        setState(prev => ({ ...prev, permissionGranted: true }));
        return true;
      }
      if (cachedPermission === 'denied') {
        setState(prev => ({ ...prev, permissionGranted: false }));
        return false;
      }

      // Check Permissions API if available
      if ('permissions' in navigator) {
        const result = await navigator.permissions.query({ name: 'geolocation' });
        const granted = result.state === 'granted';
        localStorage.setItem(PERMISSION_CACHE_KEY, granted ? 'granted' : 'denied');
        setState(prev => ({ ...prev, permissionGranted: granted }));
        return granted;
      }

      return false;
    } catch (error) {
      console.log('Permissions API not available or error:', error);
      return false;
    }
  }, []);

  /**
   * Request user's current location (one-time)
   */
  const requestLocation = useCallback((silent = false) => {
    if (!navigator.geolocation) {
      console.error('Geolocation not supported');
      setState((prev) => ({
        ...prev,
        error: 'Geolocation is not supported by this browser',
      }));
      return;
    }

    console.log('Requesting location...');
    setState((prev) => ({ ...prev, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        console.log('Location obtained:', { latitude, longitude, accuracy });
        
        const locationData = {
          lat: latitude,
          lng: longitude,
          accuracy,
          timestamp: Date.now(),
        };

        // Cache the location
        try {
          localStorage.setItem(LOCATION_CACHE_KEY, JSON.stringify(locationData));
          localStorage.setItem(PERMISSION_CACHE_KEY, 'granted');
        } catch (error) {
          console.error('Error caching location:', error);
        }

        setState((prev) => ({
          ...prev,
          location: locationData,
          loading: false,
          error: null,
          permissionGranted: true,
        }));
      },
      (error) => {
        console.error('Geolocation error:', error.code, error.message);
        let errorMessage = 'Unknown error occurred';

        if (error.code === error.PERMISSION_DENIED) {
          errorMessage =
            'Permission denied. Please enable location access in your browser settings.';
          localStorage.setItem(PERMISSION_CACHE_KEY, 'denied');
          setState(prev => ({ ...prev, permissionGranted: false }));
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorMessage = 'Location information is unavailable.';
        } else if (error.code === error.TIMEOUT) {
          errorMessage = 'The request to get user location timed out.';
        }

        if (!silent) {
          setState((prev) => ({
            ...prev,
            loading: false,
            error: errorMessage,
          }));
        } else {
          setState((prev) => ({
            ...prev,
            loading: false,
          }));
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, []);

  /**
   * Start watching user's location (continuous tracking)
   */
  const startWatching = useCallback(() => {
    if (!navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        error: 'Geolocation is not supported by this browser',
      }));
      return;
    }

    const id = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        setState((prev) => ({
          ...prev,
          location: {
            lat: latitude,
            lng: longitude,
            accuracy,
            timestamp: Date.now(),
          },
          error: null,
          isWatching: true,
        }));
      },
      (error) => {
        let errorMessage = 'Unknown error occurred';

        if (error.code === error.PERMISSION_DENIED) {
          errorMessage = 'Permission denied for location access.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorMessage = 'Location information is unavailable.';
        }

        setState((prev) => ({
          ...prev,
          error: errorMessage,
          isWatching: false,
        }));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 1000,
      }
    );

    setWatchId(id);
  }, []);

  /**
   * Stop watching user's location
   */
  const stopWatching = useCallback(() => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
      setState((prev) => ({
        ...prev,
        isWatching: false,
      }));
    }
  }, [watchId]);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setState((prev) => ({
      ...prev,
      error: null,
    }));
  }, []);

  /**
   * Auto-request location on mount if permission granted or cached location available
   */
  useEffect(() => {
    const autoRequest = async () => {
      if (autoRequested) return;
      setAutoRequested(true);

      // First, try to load cached location
      const hasCached = loadCachedLocation();
      
      // Then check permission and auto-request if granted
      const hasPermission = await checkPermission();
      
      if (hasPermission && !hasCached) {
        console.log('Auto-requesting location (permission granted)');
        requestLocation(true); // Silent mode
      } else if (hasCached) {
        console.log('Using cached location, skipping auto-request');
      }
    };

    autoRequest();
  }, [autoRequested]);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

  return {
    location: state.location,
    loading: state.loading,
    error: state.error,
    isWatching: state.isWatching,
    permissionGranted: state.permissionGranted,
    requestLocation,
    startWatching,
    stopWatching,
    clearError,
  };
};
