import React from 'react';
import { useGeolocation } from '@/hooks/useGeolocation';
import GoogleMapView from './GoogleMapView';
import { AlertCircle, Loader2, MapPin } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import { Button } from './ui/button';

interface MapProps {
  userLocation?: { lat: number; lng: number };
  radiusKm?: number;
}

const MapWrapper = ({ userLocation, radiusKm = 5 }: MapProps) => {
  const { location, loading, error, requestLocation } = useGeolocation();

  // Use provided location or geolocation hook result
  const mapLocation = userLocation || location;

  // Show error state
  if (error) {
    return (
      <Alert variant="destructive" className="w-full">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={requestLocation}
            className="ml-4 px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded"
          >
            Retry
          </button>
        </AlertDescription>
      </Alert>
    );
  }

  // Show location request UI
  if (!mapLocation) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 relative overflow-hidden">
        <div className="relative text-center space-y-6 max-w-md px-6">
          {loading ? (
            <>
              <div className="relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 bg-primary/20 rounded-full animate-ping" />
                </div>
                <Loader2 className="h-16 w-16 animate-spin mx-auto text-primary relative z-10" />
              </div>
              <div className="space-y-2">
                <p className="text-xl font-bold">Locating You...</p>
                <p className="text-sm text-muted-foreground">
                  Please allow location access when your browser asks
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <MapPin className="h-10 w-10 text-primary" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">Find Vendors Near You</h2>
                <p className="text-muted-foreground">
                  ProxiLink uses your location to show nearby service providers
                </p>
              </div>
              <button
                onClick={requestLocation}
                className="w-full px-6 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-semibold transition-all hover:shadow-xl active:scale-95 flex items-center justify-center gap-2"
              >
                <MapPin className="h-5 w-5" />
                Enable Location
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  // Render Google Maps
  return (
    <div className="w-full h-full relative rounded-lg overflow-hidden border border-border shadow-lg bg-background">
      <GoogleMapView userLocation={mapLocation} radiusKm={radiusKm} />
    </div>
  );
};

export default MapWrapper;
