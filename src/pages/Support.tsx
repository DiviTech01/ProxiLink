import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ChevronDown, ChevronUp, Mail, MessageCircle, Phone, Send } from 'lucide-react';
import { toast } from 'sonner';

const Support = () => {
  const navigate = useNavigate();
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const faqs = [
    {
      question: 'How do I find services near me?',
      answer: 'Simply log in to your dashboard and enable location services. The map will automatically show nearby vendors and service providers. You can adjust the search radius and filter by category to find exactly what you need.'
    },
    {
      question: 'How do I become a vendor on ProxiLink?',
      answer: 'Sign up and select "Vendor" during role selection. Complete your business profile with details about your services, location, and pricing. Once verified, your services will be visible to users in your area.'
    },
    {
      question: 'Is my location data secure?',
      answer: 'Yes! We take privacy seriously. Your precise location is never shared with vendors without your permission. We only show approximate proximity to help you find nearby services. All data is encrypted and stored securely.'
    },
    {
      question: 'How do payments work?',
      answer: 'Payment terms are negotiated directly between you and the service provider. ProxiLink facilitates the connection but does not handle payments directly at this time. Always agree on pricing before services are rendered.'
    },
    {
      question: 'Can I message vendors before booking?',
      answer: 'Absolutely! Use our in-app messaging system to discuss your needs, ask questions, and negotiate pricing before committing to any service. This ensures both parties are on the same page.'
    },
    {
      question: 'What if I have an issue with a service?',
      answer: 'Contact our support team immediately through this page or via the in-app chat. We take complaints seriously and work to resolve disputes fairly. You can also leave reviews to help other users make informed decisions.'
    },
    {
      question: 'How are vendors verified?',
      answer: 'Vendors must provide business documentation and contact information during registration. We also monitor reviews and ratings to ensure quality standards are maintained. Verified badges indicate completed verification.'
    },
    {
      question: 'Can I use ProxiLink without location services?',
      answer: 'While the app works best with location enabled, you can manually enter an address or area to search for services. However, proximity-based features and real-time tracking require location access.'
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success('Message sent! We\'ll get back to you within 24 hours.');
    setFormData({ name: '', email: '', message: '' });
    setIsSubmitting(false);
  };

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
          <h1 className="text-lg sm:text-2xl font-bold">Support & Help</h1>
        </div>
      </div>

      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 space-y-4 sm:space-y-6">
        {/* Quick Contact Options */}
        <div className="grid sm:grid-cols-3 gap-3 sm:gap-4">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="p-4 text-center">
              <div className="bg-blue-500/10 p-3 rounded-full w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-2 sm:mb-3 flex items-center justify-center">
                <Mail className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" />
              </div>
              <CardTitle className="text-sm sm:text-base">Email Us</CardTitle>
              <CardDescription className="text-xs sm:text-sm">support@proxilink.com</CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="p-4 text-center">
              <div className="bg-green-500/10 p-3 rounded-full w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-2 sm:mb-3 flex items-center justify-center">
                <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-500" />
              </div>
              <CardTitle className="text-sm sm:text-base">Live Chat</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Available 9AM-5PM</CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="p-4 text-center">
              <div className="bg-orange-500/10 p-3 rounded-full w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-2 sm:mb-3 flex items-center justify-center">
                <Phone className="h-5 w-5 sm:h-6 sm:w-6 text-orange-500" />
              </div>
              <CardTitle className="text-sm sm:text-base">Call Us</CardTitle>
              <CardDescription className="text-xs sm:text-sm">+234 800 123 4567</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* FAQ Section */}
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">Frequently Asked Questions</CardTitle>
            <CardDescription className="text-sm sm:text-base">Quick answers to common questions</CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-2">
            {faqs.map((faq, index) => (
              <div key={index} className="border rounded-lg overflow-hidden">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full p-3 sm:p-4 flex items-center justify-between hover:bg-muted/50 transition-colors text-left min-h-[44px]"
                >
                  <span className="font-medium text-sm sm:text-base pr-2">{faq.question}</span>
                  {expandedFaq === index ? (
                    <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0" />
                  ) : (
                    <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0" />
                  )}
                </button>
                {expandedFaq === index && (
                  <div className="p-3 sm:p-4 pt-0 text-sm sm:text-base text-muted-foreground bg-muted/30">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Contact Form */}
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">Send Us a Message</CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Can't find what you're looking for? Drop us a message and we'll get back to you.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm sm:text-base">Your Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={isSubmitting}
                  className="min-h-[44px] text-sm sm:text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm sm:text-base">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={isSubmitting}
                  className="min-h-[44px] text-sm sm:text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-sm sm:text-base">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Describe your issue or question..."
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  disabled={isSubmitting}
                  className="resize-none text-sm sm:text-base"
                />
              </div>

              <Button 
                type="submit" 
                size="lg" 
                className="w-full min-h-[44px]"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Help Center Badge */}
        <div className="flex justify-center pb-4">
          <Badge variant="secondary" className="text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2">
            Average response time: 2-4 hours
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default Support;
