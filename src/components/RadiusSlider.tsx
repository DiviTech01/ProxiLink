import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { MapPin } from 'lucide-react';

interface RadiusSliderProps {
  value: number;
  onChange: (value: number) => void;
  className?: string;
}

const RadiusSlider = ({ value, onChange, className = '' }: RadiusSliderProps) => {
  // Convert value to display format
  const getDisplayValue = (val: number) => {
    if (val < 1) {
      return `${Math.round(val * 1000)}m`;
    }
    return `${val.toFixed(1)}km`;
  };

  // Handle slider change (linear scale for 1-5km range)
  const handleChange = (values: number[]) => {
    const sliderValue = values[0];
    // Map 0-100 slider to 1-5 km range (linear)
    const actualValue = 1 + (sliderValue / 100) * 4;
    onChange(Number(actualValue.toFixed(2)));
  };

  // Get slider position from actual value
  const getSliderValue = (val: number) => {
    // Map 1-5km to 0-100 slider position
    return ((val - 1) / 4) * 100;
  };

  return (
    <div className={`bg-white dark:bg-slate-800 rounded-lg shadow-lg p-4 border border-gray-200 dark:border-slate-700 ${className}`}>
      <div className="flex items-center gap-2 mb-3">
        <MapPin className="h-4 w-4 text-primary" />
        <Label className="text-sm font-medium">Search Radius</Label>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary">{getDisplayValue(value)}</span>
          <span className="text-xs text-muted-foreground">1km - 5km</span>
        </div>
        
        <Slider
          value={[getSliderValue(value)]}
          onValueChange={handleChange}
          min={0}
          max={100}
          step={1}
          className="w-full"
        />
        
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>1km</span>
          <span>2km</span>
          <span>3km</span>
          <span>4km</span>
          <span>5km</span>
        </div>
      </div>
    </div>
  );
};

export default RadiusSlider;
