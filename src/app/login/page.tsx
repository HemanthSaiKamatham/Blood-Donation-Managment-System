'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Logo from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function LoginPage() {
  const router = useRouter();
  const loginBg = PlaceHolderImages.find(img => img.id === 'login-bg');

  const handleLogin = (role: 'donor' | 'acceptor' | 'admin') => {
    // In a real app, you'd handle authentication here.
    // For this prototype, we'll just navigate to the respective dashboard.
    if (role === 'donor') {
      router.push('/donor/dashboard');
    } else if (role === 'acceptor') {
      router.push('/acceptor/dashboard');
    } else {
      router.push('/admin/dashboard');
    }
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center p-4">
      {loginBg && (
        <Image
          src={loginBg.imageUrl}
          alt={loginBg.description}
          data-ai-hint={loginBg.imageHint}
          fill
          className="absolute inset-0 -z-10 object-cover opacity-30"
        />
      )}
      <div className="absolute inset-0 -z-10 bg-background/80 backdrop-blur-sm"></div>

      <Card className="w-full max-w-md bg-card/60 backdrop-blur-lg border-white/10 shadow-2xl">
        <CardHeader className="text-center">
          <Logo className="mx-auto mb-4" />
          <CardTitle className="text-3xl font-bold">Welcome to iDonate</CardTitle>
          <CardDescription>The future of blood donation. Sign in to continue.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="donor" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="donor">Donor</TabsTrigger>
              <TabsTrigger value="acceptor">Acceptor/Admin</TabsTrigger>
            </TabsList>
            <TabsContent value="donor" className="mt-4">
              <form onSubmit={(e) => { e.preventDefault(); handleLogin('donor'); }} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="donor-email">Email</Label>
                  <Input id="donor-email" type="email" placeholder="donor@example.com" required defaultValue="donor@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="donor-password">Password</Label>
                  <Input id="donor-password" type="password" required defaultValue="password" />
                </div>
                <Button type="submit" className="w-full glow-primary">
                  Sign in as Donor
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="acceptor" className="mt-4">
              <form onSubmit={(e) => { e.preventDefault(); handleLogin('acceptor'); }} className="space-y-4">
                 <div className="space-y-2">
                  <Label htmlFor="acceptor-email">Email</Label>
                  <Input id="acceptor-email" type="email" placeholder="hospital@example.com" required defaultValue="hospital@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="acceptor-password">Password</Label>
                  <Input id="acceptor-password" type="password" required defaultValue="password" />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="w-full glow-accent" variant="secondary">
                    Sign in as Acceptor
                  </Button>
                   <Button onClick={() => handleLogin('admin')} className="w-full" variant="outline">
                    Sign in as Admin
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
