import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Package, Clock, CheckCircle, XCircle, MapPin, Phone, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

const Orders = () => {
  const navigate = useNavigate();

  const [orders] = useState([
    {
      id: 'ORD-001',
      service: 'Plumbing Repair',
      vendor: 'Quick Fix Plumbing',
      vendorPhone: '+234 800 111 2222',
      status: 'completed',
      amount: '₦15,000',
      date: '2024-11-20',
      location: 'Lagos, Nigeria',
      description: 'Fixed leaking pipes in kitchen'
    },
    {
      id: 'ORD-002',
      service: 'AC Maintenance',
      vendor: 'Cool Breeze Services',
      vendorPhone: '+234 800 333 4444',
      status: 'in_progress',
      amount: '₦25,000',
      date: '2024-11-21',
      location: 'Ikeja, Lagos',
      description: 'Annual AC servicing and gas refill'
    },
    {
      id: 'ORD-003',
      service: 'House Cleaning',
      vendor: 'Sparkle Clean Co.',
      vendorPhone: '+234 800 555 6666',
      status: 'pending',
      amount: '₦10,000',
      date: '2024-11-22',
      location: 'Victoria Island, Lagos',
      description: '3-bedroom apartment deep cleaning'
    },
    {
      id: 'ORD-004',
      service: 'Electrical Wiring',
      vendor: 'Power Pro Electric',
      vendorPhone: '+234 800 777 8888',
      status: 'cancelled',
      amount: '₦20,000',
      date: '2024-11-18',
      location: 'Lekki, Lagos',
      description: 'Install new power outlets'
    }
  ]);

  const getStatusBadge = (status: string) => {
    const config = {
      completed: { variant: 'default' as const, icon: CheckCircle, label: 'Completed', color: 'text-green-500' },
      in_progress: { variant: 'secondary' as const, icon: Clock, label: 'In Progress', color: 'text-blue-500' },
      pending: { variant: 'outline' as const, icon: Package, label: 'Pending', color: 'text-yellow-500' },
      cancelled: { variant: 'destructive' as const, icon: XCircle, label: 'Cancelled', color: 'text-red-500' }
    };

    const { variant, icon: Icon, label, color } = config[status as keyof typeof config];
    return (
      <Badge variant={variant} className="gap-1">
        <Icon className={`h-3 w-3 ${color}`} />
        {label}
      </Badge>
    );
  };

  const filterOrders = (status?: string) => {
    if (!status || status === 'all') return orders;
    return orders.filter(order => order.status === status);
  };

  const OrderCard = ({ order }: { order: typeof orders[0] }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="p-4 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <CardTitle className="text-base sm:text-lg">{order.service}</CardTitle>
            </div>
            <CardDescription className="text-xs sm:text-sm">Order #{order.id}</CardDescription>
          </div>
          {getStatusBadge(order.status)}
        </div>
      </CardHeader>
      <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-3">
        <p className="text-sm sm:text-base text-muted-foreground">{order.description}</p>
        
        <div className="space-y-2 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{order.vendor}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{order.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{new Date(order.date).toLocaleDateString('en-US', { 
              weekday: 'short', 
              month: 'short', 
              day: 'numeric' 
            })}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t">
          <span className="text-lg sm:text-xl font-bold text-primary">{order.amount}</span>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              className="min-h-[44px] min-w-[44px]"
              onClick={() => toast.info(`Calling ${order.vendor}...`)}
            >
              <Phone className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Call</span>
            </Button>
            <Button 
              size="sm"
              className="min-h-[44px]"
              onClick={() => navigate('/messages')}
            >
              <MessageCircle className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Message</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

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
          <h1 className="text-lg sm:text-2xl font-bold">My Orders</h1>
        </div>
      </div>

      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <Card>
            <CardContent className="p-3 sm:p-4 text-center">
              <p className="text-2xl sm:text-3xl font-bold text-primary">{orders.length}</p>
              <p className="text-xs sm:text-sm text-muted-foreground">Total</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 sm:p-4 text-center">
              <p className="text-2xl sm:text-3xl font-bold text-green-500">
                {filterOrders('completed').length}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground">Completed</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 sm:p-4 text-center">
              <p className="text-2xl sm:text-3xl font-bold text-blue-500">
                {filterOrders('in_progress').length}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground">Active</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 sm:p-4 text-center">
              <p className="text-2xl sm:text-3xl font-bold text-yellow-500">
                {filterOrders('pending').length}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground">Pending</p>
            </CardContent>
          </Card>
        </div>

        {/* Orders Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-4 sm:mb-6 h-auto">
            <TabsTrigger value="all" className="text-xs sm:text-sm py-2 min-h-[44px]">All</TabsTrigger>
            <TabsTrigger value="pending" className="text-xs sm:text-sm py-2 min-h-[44px]">Pending</TabsTrigger>
            <TabsTrigger value="in_progress" className="text-xs sm:text-sm py-2 min-h-[44px]">Active</TabsTrigger>
            <TabsTrigger value="completed" className="text-xs sm:text-sm py-2 min-h-[44px]">Done</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {orders.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground mb-4">No orders yet</p>
                  <Button onClick={() => navigate('/dashboard')}>Browse Services</Button>
                </CardContent>
              </Card>
            ) : (
              orders.map(order => <OrderCard key={order.id} order={order} />)
            )}
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            {filterOrders('pending').length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">No pending orders</p>
                </CardContent>
              </Card>
            ) : (
              filterOrders('pending').map(order => <OrderCard key={order.id} order={order} />)
            )}
          </TabsContent>

          <TabsContent value="in_progress" className="space-y-4">
            {filterOrders('in_progress').length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">No active orders</p>
                </CardContent>
              </Card>
            ) : (
              filterOrders('in_progress').map(order => <OrderCard key={order.id} order={order} />)
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {filterOrders('completed').length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">No completed orders</p>
                </CardContent>
              </Card>
            ) : (
              filterOrders('completed').map(order => <OrderCard key={order.id} order={order} />)
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Orders;
