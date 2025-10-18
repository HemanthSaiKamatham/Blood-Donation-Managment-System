'use client';
import {
  Bell,
  CalendarClock,
  LayoutDashboard,
  LogOut,
  User,
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
  { href: '/donor/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/donor/profile', icon: User, label: 'Profile' },
  { href: '/donor/schedule', icon: CalendarClock, label: 'Schedule' },
  { href: '/donor/notifications', icon: Bell, label: 'Notifications' },
];

export default function DonorLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const avatar = PlaceHolderImages.find((img) => img.id === 'user-avatar-1');
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  if(isUserLoading) {
    return <div>Loading...</div>
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
                <Link href={item.href} legacyBehavior passHref>
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
                    {avatar && <AvatarImage src={avatar.imageUrl} alt={user?.displayName || ''} data-ai-hint={avatar.imageHint} />}
                    <AvatarFallback>{user?.email?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <span className="font-semibold text-sm text-foreground">{user?.displayName || 'Donor'}</span>
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