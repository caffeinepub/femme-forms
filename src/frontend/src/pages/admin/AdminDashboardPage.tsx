import { Link } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Palette, Gem, ShoppingBag, Mail, ArrowRight } from 'lucide-react';
import { useGetAllArtworks, useGetAllJewelry, useGetAllOrders, useGetAllContactMessages } from '../../hooks/useQueries';

export default function AdminDashboardPage() {
  const { data: artworks } = useGetAllArtworks();
  const { data: jewelry } = useGetAllJewelry();
  const { data: orders } = useGetAllOrders();
  const { data: messages } = useGetAllContactMessages();

  const stats = [
    {
      title: 'Artworks',
      value: artworks?.length || 0,
      description: 'Total artworks in gallery',
      icon: Palette,
      link: '/admin/artworks',
    },
    {
      title: 'Jewelry',
      value: jewelry?.length || 0,
      description: 'Total jewelry items',
      icon: Gem,
      link: '/admin/jewelry',
    },
    {
      title: 'Orders',
      value: orders?.filter((o) => !o.handled).length || 0,
      description: 'Pending purchase inquiries',
      icon: ShoppingBag,
      link: '/admin/orders',
    },
    {
      title: 'Messages',
      value: messages?.length || 0,
      description: 'Contact form submissions',
      icon: Mail,
      link: '/admin/messages',
    },
  ];

  return (
    <div className="container py-12">
      <div className="mb-8">
        <h1 className="font-display text-4xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="mt-2 text-muted-foreground">Manage your art shop</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="shimmer-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
                <Button asChild variant="link" className="mt-2 h-auto p-0">
                  <Link to={stat.link}>
                    View all <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
