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

  // Handle slider change (logarithmic scale for better UX)
  const handleChange = (values: number[]) => {
    const sliderValue = values[0];
    // Map 0-100 slider to 0.01-5 km range
    // Use exponential scale for better control at small values
    const minLog = Math.log(0.01);
    const maxLog = Math.log(5);
    const scale = (maxLog - minLog) / 100;
    const actualValue = Math.exp(minLog + scale * sliderValue);
    onChange(Number(actualValue.toFixed(3)));
  };

  // Get slider position from actual value
  const getSliderValue = (val: number) => {
    const minLog = Math.log(0.01);
    const maxLog = Math.log(5);
    const scale = (maxLog - minLog) / 100;
    return ((Math.log(val) - minLog) / scale);
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
          <span className="text-xs text-muted-foreground">10m - 5km</span>
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
          <span>10m</span>
          <span>100m</span>
          <span>1km</span>
          <span>5km</span>
        </div>
      </div>
    </div>
  );
};

export default RadiusSlider;
