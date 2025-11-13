'use client';
import {
  LayoutDashboard,
  LogOut,
  Megaphone,
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
  { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Analytics' },
  { href: '/admin/campaigns', icon: Megaphone, label: 'Campaigns' },
];

const adminProfile = {
  name: 'Admin User',
  avatarId: 'user-avatar-3'
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const avatar = PlaceHolderImages.find((img) => img.id === adminProfile.avatarId);
  
  if (isUserLoading) {
    return <div>Loading...</div>;
  }

  if (!user && !isUserLoading) {
    router.push('/admin/login');
    return null;
  }


  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Logo />
        </SidebarHeader>
        <SidebarContent>
            <p className="px-4 py-2 text-xs text-muted-foreground font-semibold">ADMIN PANEL</p>
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
                    {avatar && <AvatarImage src={avatar.imageUrl} alt={adminProfile.name} data-ai-hint={avatar.imageHint} />}
                    <AvatarFallback>{adminProfile.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <span className="font-semibold text-sm text-foreground">{adminProfile.name}</span>
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
