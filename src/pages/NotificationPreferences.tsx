import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Bell, Mail, MessageSquare, Star, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

const NotificationPreferences = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [preferences, setPreferences] = useState({
    pushNotifications: true,
    emailNotifications: true,
    messageNotifications: true,
    reviewNotifications: true,
    paymentNotifications: true,
    promotionalNotifications: false
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      // In a real app, save to database
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Notification preferences updated successfully!');
    } catch (error) {
      console.error('Error saving notification preferences:', error);
      toast.error('Failed to update notification preferences');
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
          <h1 className="text-lg sm:text-2xl font-bold">Notification Preferences</h1>
        </div>
      </div>

      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-2xl space-y-4">
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Manage Notifications
            </CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Choose how you want to be notified about updates
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-6">
            <div className="flex items-center justify-between space-x-4 py-3 border-b">
              <div className="flex items-start gap-3 flex-1">
                <Bell className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <Label htmlFor="pushNotifications" className="text-base font-medium cursor-pointer">
                    Push Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Receive notifications on your device
                  </p>
                </div>
              </div>
              <Switch
                id="pushNotifications"
                checked={preferences.pushNotifications}
                onCheckedChange={(checked) => setPreferences({ ...preferences, pushNotifications: checked })}
              />
            </div>

            <div className="flex items-center justify-between space-x-4 py-3 border-b">
              <div className="flex items-start gap-3 flex-1">
                <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <Label htmlFor="emailNotifications" className="text-base font-medium cursor-pointer">
                    Email Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Get updates via email
                  </p>
                </div>
              </div>
              <Switch
                id="emailNotifications"
                checked={preferences.emailNotifications}
                onCheckedChange={(checked) => setPreferences({ ...preferences, emailNotifications: checked })}
              />
            </div>

            <div className="flex items-center justify-between space-x-4 py-3 border-b">
              <div className="flex items-start gap-3 flex-1">
                <MessageSquare className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <Label htmlFor="messageNotifications" className="text-base font-medium cursor-pointer">
                    Message Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Notify me when I receive messages
                  </p>
                </div>
              </div>
              <Switch
                id="messageNotifications"
                checked={preferences.messageNotifications}
                onCheckedChange={(checked) => setPreferences({ ...preferences, messageNotifications: checked })}
              />
            </div>

            <div className="flex items-center justify-between space-x-4 py-3 border-b">
              <div className="flex items-start gap-3 flex-1">
                <Star className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <Label htmlFor="reviewNotifications" className="text-base font-medium cursor-pointer">
                    Review & Rating Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Get notified about new reviews
                  </p>
                </div>
              </div>
              <Switch
                id="reviewNotifications"
                checked={preferences.reviewNotifications}
                onCheckedChange={(checked) => setPreferences({ ...preferences, reviewNotifications: checked })}
              />
            </div>

            <div className="flex items-center justify-between space-x-4 py-3 border-b">
              <div className="flex items-start gap-3 flex-1">
                <DollarSign className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <Label htmlFor="paymentNotifications" className="text-base font-medium cursor-pointer">
                    Payment Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Updates about payments and transactions
                  </p>
                </div>
              </div>
              <Switch
                id="paymentNotifications"
                checked={preferences.paymentNotifications}
                onCheckedChange={(checked) => setPreferences({ ...preferences, paymentNotifications: checked })}
              />
            </div>

            <div className="flex items-center justify-between space-x-4 py-3">
              <div className="flex items-start gap-3 flex-1">
                <Bell className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <Label htmlFor="promotionalNotifications" className="text-base font-medium cursor-pointer">
                    Promotional Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Special offers and promotions
                  </p>
                </div>
              </div>
              <Switch
                id="promotionalNotifications"
                checked={preferences.promotionalNotifications}
                onCheckedChange={(checked) => setPreferences({ ...preferences, promotionalNotifications: checked })}
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
                'Save Preferences'
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotificationPreferences;
