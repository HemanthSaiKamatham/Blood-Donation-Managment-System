'use client';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function HomePage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading) {
      if (user) {
        // This is a simple role detection. In a real app, you'd use custom claims.
        if (user.email?.includes('donor')) {
          router.replace('/donor/dashboard');
        } else if (user.email?.includes('hospital')) {
          router.replace('/acceptor/dashboard');
        } else if (user.email?.includes('admin')) {
            router.replace('/admin/dashboard');
        } else {
            router.replace('/login');
        }
      } else {
        router.replace('/login');
      }
    }
  }, [user, isUserLoading, router]);

  return (
    <div className="flex min-h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}
