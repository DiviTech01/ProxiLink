import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Shield, Eye, MapPin, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

const PrivacySettings = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    showProfile: true,
    showLocation: true,
    allowMessages: true,
    showActivity: false,
    dataSharing: false
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      // In a real app, save to database
      // For now, just show success
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Privacy settings updated successfully!');
    } catch (error) {
      console.error('Error saving privacy settings:', error);
      toast.error('Failed to update privacy settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <div className="bg-gradient-hero text-white p-3 sm:p-4 sticky top-0 z-10 shadow-lg">
        <div className="container mx-auto flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/profile')}
            className="text-white hover:bg-white/20 h-9 w-9 sm:h-10 sm:w-10"
          >
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
          <h1 className="text-lg sm:text-2xl font-bold">Privacy Settings</h1>
        </div>
      </div>

      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-2xl space-y-4">
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Privacy & Visibility
            </CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Control who can see your information and how it's used
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-6">
            <div className="flex items-center justify-between space-x-4 py-3 border-b">
              <div className="flex items-start gap-3 flex-1">
                <Eye className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <Label htmlFor="showProfile" className="text-base font-medium cursor-pointer">
                    Show Profile to Others
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Allow other users to view your profile
                  </p>
                </div>
              </div>
              <Switch
                id="showProfile"
                checked={settings.showProfile}
                onCheckedChange={(checked) => setSettings({ ...settings, showProfile: checked })}
              />
            </div>

            <div className="flex items-center justify-between space-x-4 py-3 border-b">
              <div className="flex items-start gap-3 flex-1">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <Label htmlFor="showLocation" className="text-base font-medium cursor-pointer">
                    Share Location
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Allow services to see your approximate location
                  </p>
                </div>
              </div>
              <Switch
                id="showLocation"
                checked={settings.showLocation}
                onCheckedChange={(checked) => setSettings({ ...settings, showLocation: checked })}
              />
            </div>

            <div className="flex items-center justify-between space-x-4 py-3 border-b">
              <div className="flex items-start gap-3 flex-1">
                <MessageCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <Label htmlFor="allowMessages" className="text-base font-medium cursor-pointer">
                    Allow Direct Messages
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Let vendors and users send you messages
                  </p>
                </div>
              </div>
              <Switch
                id="allowMessages"
                checked={settings.allowMessages}
                onCheckedChange={(checked) => setSettings({ ...settings, allowMessages: checked })}
              />
            </div>

            <div className="flex items-center justify-between space-x-4 py-3 border-b">
              <div className="flex items-start gap-3 flex-1">
                <Shield className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <Label htmlFor="showActivity" className="text-base font-medium cursor-pointer">
                    Show Activity Status
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Let others see when you're online
                  </p>
                </div>
              </div>
              <Switch
                id="showActivity"
                checked={settings.showActivity}
                onCheckedChange={(checked) => setSettings({ ...settings, showActivity: checked })}
              />
            </div>

            <div className="flex items-center justify-between space-x-4 py-3">
              <div className="flex items-start gap-3 flex-1">
                <Shield className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <Label htmlFor="dataSharing" className="text-base font-medium cursor-pointer">
                    Data Sharing for Analytics
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Help us improve by sharing anonymous usage data
                  </p>
                </div>
              </div>
              <Switch
                id="dataSharing"
                checked={settings.dataSharing}
                onCheckedChange={(checked) => setSettings({ ...settings, dataSharing: checked })}
              />
            </div>

            <Button
              onClick={handleSave}
              disabled={loading}
              size="lg"
              className="w-full min-h-[44px] mt-6"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  Saving...
                </>
              ) : (
                'Save Settings'
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrivacySettings;
