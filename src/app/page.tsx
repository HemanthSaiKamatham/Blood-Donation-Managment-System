'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Droplets, HeartHandshake, Hospital, UserCheck } from 'lucide-react';
import Logo from '@/components/logo';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function LandingPage() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'login-bg');
  
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
          <Logo />
          <div className="flex items-center gap-2">
            <Link href="/login" passHref>
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/login" passHref>
              <Button>Register</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32">
           {heroImage && (
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              data-ai-hint={heroImage.imageHint}
              fill
              className="absolute inset-0 -z-10 object-cover opacity-20"
            />
          )}
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-background/80 to-transparent"></div>
          <div className="container text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6">
              Become a Lifesaver.
              <br />
              <span className="text-primary">Donate Blood Today.</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-muted-foreground mb-8">
              iDonate connects blood donors with hospitals and patients in need, making it easier than ever to make a difference.
            </p>
            <Link href="/login" passHref>
              <Button size="lg" className="glow-primary">
                Join Now
              </Button>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-secondary">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold">Why iDonate?</h2>
              <p className="text-muted-foreground">A smarter way to manage blood donations.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center p-6 bg-background rounded-lg shadow-md">
                <HeartHandshake className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">For Donors</h3>
                <p className="text-muted-foreground">
                  Find nearby donation centers, schedule appointments, and track your life-saving contributions with our gamified system.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-6 bg-background rounded-lg shadow-md">
                <Hospital className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">For Hospitals</h3>
                <p className="text-muted-foreground">
                  Easily submit blood requests, manage your inventory, and connect with available donors in real-time using our AI-powered matching.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-6 bg-background rounded-lg shadow-md">
                <UserCheck className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Verified & Secure</h3>
                <p className="text-muted-foreground">
                  Our platform ensures all hospitals are verified and all data is handled securely, providing a trustworthy environment for everyone.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-6 border-t">
        <div className="container text-center text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} iDonate. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
