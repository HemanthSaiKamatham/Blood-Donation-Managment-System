'use client';
import {
  HeartHandshake,
  LayoutDashboard,
  LogOut,
  Send,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import Logo from '@/components/logo';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useAuth, useUser } from '@/firebase';

const navItems = [
  { href: '/acceptor/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/acceptor/submit', icon: Send, label: 'Submit Request' },
  { href: '/acceptor/manage', icon: HeartHandshake, label: 'Manage Requests' },
];

export default function AcceptorLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();
  
  const acceptorProfile = {
    name: 'City General Hospital', // This could be fetched from Firestore
    avatarId: 'user-avatar-2'
  };
  const avatar = PlaceHolderImages.find((img) => img.id === acceptorProfile.avatarId);

  if (isUserLoading) {
    return <div>Loading...</div>;
  }

  if (!user && !isUserLoading) {
    router.push('/login');
    return null;
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Logo />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.label}>
                <Link href={item.href}>
                  <SidebarMenuButton
                    isActive={pathname.startsWith(item.href)}
                    icon={<item.icon />}
                  >
                    {item.label}
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className='gap-4'>
            <SidebarSeparator />
             <div className="flex items-center gap-3 px-2">
                <Avatar className="h-10 w-10">
                    {avatar && <AvatarImage src={avatar.imageUrl} alt={acceptorProfile.name} data-ai-hint={avatar.imageHint} />}
                    <AvatarFallback>{acceptorProfile.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <span className="font-semibold text-sm text-foreground">{acceptorProfile.name}</span>
                    <span className="text-xs text-muted-foreground">{user?.email}</span>
                </div>
            </div>
            <SidebarMenuButton icon={<LogOut />} onClick={() => auth.signOut()}>
                Logout
            </SidebarMenuButton>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
