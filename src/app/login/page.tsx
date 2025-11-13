'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Logo from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth, useUser } from '@/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const loginBg = PlaceHolderImages.find(img => img.id === 'login-bg');
  const auth = useAuth();
  const { user, isUserLoading } = useUser();

  useEffect(() => {
    if (user && !isUserLoading) {
        // This is a simple role detection. In a real app, you'd use custom claims.
        if (user.email?.includes('donor')) {
            router.push('/donor/dashboard');
        } else if (user.email?.includes('hospital')) {
            router.push('/acceptor/dashboard');
        } else if (user.email?.includes('admin')) {
            router.push('/admin/dashboard');
        }
    }
  }, [user, isUserLoading, router]);

  const handleAuth = async (role: 'donor' | 'acceptor') => {
    setLoading(true);
    let emailInput: HTMLInputElement | null = null;
    let passwordInput: HTMLInputElement | null = null;
    
    if (role === 'donor') {
        emailInput = document.getElementById('donor-email') as HTMLInputElement;
        passwordInput = document.getElementById('donor-password') as HTMLInputElement;
    } else { // acceptor
        emailInput = document.getElementById('acceptor-email') as HTMLInputElement;
        passwordInput = document.getElementById('acceptor-password') as HTMLInputElement;
    }
    
    const email = emailInput.value;
    const password = passwordInput.value;

    try {
        // Try to create a new user first.
        await createUserWithEmailAndPassword(auth, email, password);
        // If successful, the onAuthStateChanged listener will redirect.
    } catch (error: any) {
        // If the error is 'auth/email-already-in-use', it means the user exists.
        // So, we can proceed to sign them in.
        if (error.code === 'auth/email-already-in-use') {
            try {
                await signInWithEmailAndPassword(auth, email, password);
                // If successful, the onAuthStateChanged listener will redirect.
            } catch (signInError: any) {
                // This will catch errors like 'auth/wrong-password'.
                toast({
                    variant: 'destructive',
                    title: 'Login Failed',
                    description: "Invalid credentials. Please check email and password.",
                });
            }
        } else {
            // Handle other registration errors (e.g., weak password).
            toast({
                variant: 'destructive',
                title: 'Registration Failed',
                description: error.message,
            });
        }
    } finally {
        setLoading(false);
    }
  };
  
  if (isUserLoading || user) {
    return (
        <div className="flex min-h-screen w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    )
  }


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
          <CardDescription>The future of blood donation. Sign in or register to continue.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="donor" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="donor">Donor</TabsTrigger>
              <TabsTrigger value="acceptor">Acceptor</TabsTrigger>
            </TabsList>
            <TabsContent value="donor" className="mt-4">
              <form onSubmit={(e) => { e.preventDefault(); handleAuth('donor'); }} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="donor-email">Email</Label>
                  <Input id="donor-email" type="email" placeholder="donor@example.com" required defaultValue="donor@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="donor-password">Password</Label>
                  <Input id="donor-password" type="password" required defaultValue="password" />
                </div>
                <Button type="submit" className="w-full glow-primary" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Sign in / Register
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="acceptor" className="mt-4">
              <form onSubmit={(e) => { e.preventDefault(); handleAuth('acceptor'); }} className="space-y-4">
                 <div className="space-y-2">
                  <Label htmlFor="acceptor-email">Email</Label>
                  <Input id="acceptor-email" type="email" placeholder="hospital@example.com" required defaultValue="hospital@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="acceptor-password">Password</Label>
                  <Input id="acceptor-password" type="password" required defaultValue="password" />
                </div>
                <Button type="submit" className="w-full glow-accent" variant="secondary" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Sign in / Register
                </Button>
              </form>
            </TabsContent>
          </Tabs>
          <div className="mt-4 text-center text-sm">
            Admin?{' '}
            <Link href="/admin/login" className="underline">
              Go to Admin Portal
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
