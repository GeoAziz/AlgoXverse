'use client';

import * as React from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, BrainCircuit, Settings, LogIn, LogOut } from 'lucide-react';
import { Logo } from '@/components/icons';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { useAuth } from '@/context/auth-context';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase/client';

export function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isActive = (path: string) => pathname === path;
  const { user, loading } = useAuth();
  
  const protectedRoutes = ['/advisor', '/settings'];
  const authRoutes = ['/auth'];

  React.useEffect(() => {
    if (loading) return;

    if (!user && protectedRoutes.includes(pathname)) {
      router.push('/auth');
    }
    if (user && authRoutes.includes(pathname)) {
        router.push('/');
    }

  }, [user, loading, pathname, router]);


  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  if ((loading || !user) && protectedRoutes.includes(pathname)) {
    return null;
  }
  
  return (
    <SidebarProvider>
       {pathname !== '/auth' && (
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Logo className="w-8 h-8 text-primary drop-shadow-[0_0_5px_hsl(var(--primary))]" />
            <h1 className="font-headline text-lg font-semibold text-primary">AlgoXverse</h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <Link href="/" legacyBehavior passHref>
                <SidebarMenuButton isActive={isActive('/')} tooltip="Dashboard">
                  <LayoutDashboard />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            {user && (
              <>
                <SidebarMenuItem>
                  <Link href="/advisor" legacyBehavior passHref>
                    <SidebarMenuButton isActive={isActive('/advisor')} tooltip="AI Advisor">
                      <BrainCircuit />
                      <span>AI Advisor</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <Link href="/settings" legacyBehavior passHref>
                    <SidebarMenuButton isActive={isActive('/settings')} tooltip="Settings">
                      <Settings />
                      <span>Settings</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              </>
            )}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="w-full justify-start gap-2 px-2">
                      <Avatar className="h-8 w-8">
                          <AvatarImage src={user.photoURL ?? `https://placehold.co/100x100.png`} alt={user.email ?? 'User'} data-ai-hint="avatar user" />
                          <AvatarFallback>{user.email?.[0].toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className='flex flex-col items-start overflow-hidden'>
                          <span className='text-sm font-medium truncate'>{user.displayName ?? 'Trader'}</span>
                          <span className='text-xs text-muted-foreground truncate'>{user.email}</span>
                      </div>
                  </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right" align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-400 focus:text-red-400 focus:bg-red-500/10">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/auth" legacyBehavior passHref>
              <Button variant="outline" className="w-full">
                <LogIn className="mr-2 h-4 w-4"/>
                Login / Register
              </Button>
            </Link>
          )}
        </SidebarFooter>
      </Sidebar>
      )}
      <SidebarInset>
        {pathname !== '/auth' && (
          <header className="flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 lg:h-[60px] lg:px-6 sticky top-0 z-30">
            <SidebarTrigger className="flex md:hidden" />
            <div className="flex-1">
              <h1 className="font-headline text-lg font-semibold capitalize">
                {pathname.substring(1) || 'Dashboard'}
              </h1>
            </div>
          </header>
        )}
        <main className={`flex-1 ${pathname !== '/auth' ? 'p-4 lg:p-6': ''}`}>{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
