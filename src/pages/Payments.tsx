import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CreditCard, Plus, Trash2, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

const Payments = () => {
  const navigate = useNavigate();
  const [showAddCard, setShowAddCard] = useState(false);
  const [saving, setSaving] = useState(false);
  const [cardForm, setCardForm] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });

  const [paymentMethods] = useState([
    {
      id: '1',
      type: 'Visa',
      last4: '4242',
      expiry: '12/25',
      isDefault: true
    },
    {
      id: '2',
      type: 'Mastercard',
      last4: '5555',
      expiry: '08/24',
      isDefault: false
    }
  ]);

  const handleAddCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardForm.number || !cardForm.name || !cardForm.expiry || !cardForm.cvv) {
      toast.error('Please fill in all card details');
      return;
    }

    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success('Payment method added successfully!');
    setCardForm({ number: '', name: '', expiry: '', cvv: '' });
    setShowAddCard(false);
    setSaving(false);
  };

  const handleDelete = (id: string) => {
    toast.success('Payment method removed');
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
          <h1 className="text-lg sm:text-2xl font-bold">Payment Methods</h1>
        </div>
      </div>

      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-2xl space-y-4 sm:space-y-6">
        {/* Info Banner */}
        <Card className="border-blue-500/20 bg-blue-500/5">
          <CardContent className="p-4 flex items-start gap-3">
            <DollarSign className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm sm:text-base font-medium mb-1">Secure Payments</p>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Your payment information is encrypted and securely stored. We never share your details with vendors.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Saved Payment Methods */}
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg sm:text-xl">Saved Cards</CardTitle>
                <CardDescription className="text-sm sm:text-base">Manage your payment methods</CardDescription>
              </div>
              <Button
                onClick={() => setShowAddCard(!showAddCard)}
                size="sm"
                className="min-h-[44px] min-w-[44px]"
              >
                <Plus className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Add Card</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-3">
            {paymentMethods.length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                <CreditCard className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-3 sm:mb-4 text-muted-foreground opacity-50" />
                <p className="text-sm sm:text-base text-muted-foreground mb-4">No payment methods added yet</p>
                <Button onClick={() => setShowAddCard(true)} className="min-h-[44px]">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Card
                </Button>
              </div>
            ) : (
              paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="bg-primary/10 p-2 sm:p-3 rounded-lg">
                    <CreditCard className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-sm sm:text-base">
                        {method.type} •••• {method.last4}
                      </p>
                      {method.isDefault && (
                        <Badge variant="secondary" className="text-xs">Default</Badge>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground">Expires {method.expiry}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(method.id)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 min-h-[44px] min-w-[44px]"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Add Card Form */}
        {showAddCard && (
          <Card className="border-primary/20">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-lg sm:text-xl">Add New Card</CardTitle>
              <CardDescription className="text-sm sm:text-base">Enter your card details below</CardDescription>
            </CardHeader>
            <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
              <form onSubmit={handleAddCard} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="card-number" className="text-sm sm:text-base">Card Number</Label>
                  <Input
                    id="card-number"
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    value={cardForm.number}
                    onChange={(e) => {
                      let value = e.target.value.replace(/\s/g, '');
                      if (value.length > 0) {
                        value = value.match(/.{1,4}/g)?.join(' ') || value;
                      }
                      setCardForm({ ...cardForm, number: value });
                    }}
                    disabled={saving}
                    className="min-h-[44px] text-sm sm:text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="card-name" className="text-sm sm:text-base">Cardholder Name</Label>
                  <Input
                    id="card-name"
                    placeholder="JOHN DOE"
                    value={cardForm.name}
                    onChange={(e) => setCardForm({ ...cardForm, name: e.target.value.toUpperCase() })}
                    disabled={saving}
                    className="min-h-[44px] text-sm sm:text-base"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry" className="text-sm sm:text-base">Expiry Date</Label>
                    <Input
                      id="expiry"
                      placeholder="MM/YY"
                      maxLength={5}
                      value={cardForm.expiry}
                      onChange={(e) => {
                        let value = e.target.value.replace(/\D/g, '');
                        if (value.length >= 2) {
                          value = value.slice(0, 2) + '/' + value.slice(2, 4);
                        }
                        setCardForm({ ...cardForm, expiry: value });
                      }}
                      disabled={saving}
                      className="min-h-[44px] text-sm sm:text-base"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cvv" className="text-sm sm:text-base">CVV</Label>
                    <Input
                      id="cvv"
                      type="password"
                      placeholder="123"
                      maxLength={4}
                      value={cardForm.cvv}
                      onChange={(e) => setCardForm({ ...cardForm, cvv: e.target.value.replace(/\D/g, '') })}
                      disabled={saving}
                      className="min-h-[44px] text-sm sm:text-base"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    type="submit"
                    disabled={saving}
                    className="flex-1 min-h-[44px]"
                  >
                    {saving ? (
                      <>
                        <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                        </svg>
                        Adding...
                      </>
                    ) : (
                      'Add Card'
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddCard(false)}
                    disabled={saving}
                    className="flex-1 min-h-[44px]"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Payment History */}
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">Recent Transactions</CardTitle>
            <CardDescription className="text-sm sm:text-base">Your payment history</CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
            <div className="text-center py-8 sm:py-12">
              <DollarSign className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-3 sm:mb-4 text-muted-foreground opacity-50" />
              <p className="text-sm sm:text-base text-muted-foreground">No transactions yet</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Payments;
