import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MapPin, Users, Zap, Shield, Heart, Globe } from 'lucide-react';

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <div className="bg-gradient-hero text-white p-3 sm:p-4 sticky top-0 z-10 shadow-lg">
        <div className="container mx-auto flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="text-white hover:bg-white/20 h-9 w-9 sm:h-10 sm:w-10"
          >
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
          <h1 className="text-lg sm:text-2xl font-bold">About ProxiLink</h1>
        </div>
      </div>

      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 space-y-4 sm:space-y-6">
        {/* Hero Section */}
        <Card className="border-2 border-primary/20">
          <CardHeader className="p-4 sm:p-6">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="bg-primary/10 p-2 sm:p-3 rounded-lg">
                <MapPin className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-xl sm:text-2xl mb-2">Connecting Communities</CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  ProxiLink bridges the gap between service providers and customers through proximity-based connections.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              We believe that quality services should be easily accessible to everyone in your neighborhood. 
              Our platform uses real-time location data to connect you with trusted vendors, service providers, 
              and local businesses within your vicinity.
            </p>
          </CardContent>
        </Card>

        {/* Mission & Values */}
        <div className="grid sm:grid-cols-2 gap-4">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-blue-500/10 p-2 rounded-lg">
                  <Heart className="h-5 w-5 text-blue-500" />
                </div>
                <CardTitle className="text-lg sm:text-xl">Our Mission</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
              <p className="text-sm sm:text-base text-muted-foreground">
                To empower local communities by making quality services instantly discoverable and accessible through smart location technology.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-green-500/10 p-2 rounded-lg">
                  <Globe className="h-5 w-5 text-green-500" />
                </div>
                <CardTitle className="text-lg sm:text-xl">Our Vision</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
              <p className="text-sm sm:text-base text-muted-foreground">
                A world where every neighborhood thrives with connected local economies and instant access to trusted services.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Key Features */}
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">What We Offer</CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <div className="flex items-start gap-3 p-3 sm:p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm sm:text-base mb-1">Proximity Search</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">Find services near you instantly</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 sm:p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                <div className="bg-purple-500/10 p-2 rounded-lg">
                  <Users className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm sm:text-base mb-1">Verified Providers</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">Trusted and reviewed vendors</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 sm:p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                <div className="bg-orange-500/10 p-2 rounded-lg">
                  <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm sm:text-base mb-1">Instant Connect</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">Message providers directly</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 sm:p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                <div className="bg-red-500/10 p-2 rounded-lg">
                  <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm sm:text-base mb-1">Secure Platform</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">Your data is protected</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 sm:p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                <div className="bg-blue-500/10 p-2 rounded-lg">
                  <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm sm:text-base mb-1">Community First</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">Supporting local businesses</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 sm:p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                <div className="bg-green-500/10 p-2 rounded-lg">
                  <Globe className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm sm:text-base mb-1">24/7 Access</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">Services anytime, anywhere</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl text-center">By The Numbers</CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
            <div className="grid grid-cols-3 gap-3 sm:gap-6">
              <div className="text-center">
                <div className="text-2xl sm:text-4xl font-bold text-primary mb-1 sm:mb-2">5K+</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-4xl font-bold text-primary mb-1 sm:mb-2">1K+</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Vendors</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-4xl font-bold text-primary mb-1 sm:mb-2">50+</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Categories</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact CTA */}
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl text-center">Get In Touch</CardTitle>
            <CardDescription className="text-center text-sm sm:text-base">
              Have questions? We'd love to hear from you.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                onClick={() => navigate('/support')} 
                size="lg"
                className="w-full sm:w-auto min-h-[44px]"
              >
                Contact Support
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/dashboard')} 
                size="lg"
                className="w-full sm:w-auto min-h-[44px]"
              >
                Back to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer Badge */}
        <div className="flex justify-center pb-4">
          <Badge variant="secondary" className="text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2">
            Version 1.0.0 • Built with ❤️ for Communities
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default About;
