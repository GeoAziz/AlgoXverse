
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
import { LayoutDashboard, BrainCircuit, Settings, LogIn, LogOut, ShieldCheck, UserCog, TerminalSquare } from 'lucide-react';
import { Logo } from '@/components/icons';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { useAuth } from '@/context/auth-context';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase/client';
import { AnimatePresence, motion } from 'framer-motion';
import { CommandConsole } from './command-console';
import Link from 'next/link';

export function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isActive = (path: string) => pathname.startsWith(path) && path !== '/';
  const isHome = pathname === '/';
  const { user, loading, role } = useAuth();
  const [isConsoleOpen, setConsoleOpen] = React.useState(false);
  
  const protectedRoutes = ['/advisor', '/settings', '/strategy'];
  const adminRoutes = ['/admin'];
  const ownerRoutes = ['/owner'];
  const authRoutes = ['/auth'];

  React.useEffect(() => {
    if (loading) return;

    const isProtectedRoute = protectedRoutes.some(p => pathname.startsWith(p));
    const isAdminRoute = adminRoutes.some(p => pathname.startsWith(p));
    const isOwnerRoute = ownerRoutes.some(p => pathname.startsWith(p));
    
    if (!user) {
        if (isProtectedRoute || isAdminRoute || isOwnerRoute) {
            router.push('/auth');
        }
    } else {
        if (authRoutes.includes(pathname)) {
            router.push('/');
        }
        if (isAdminRoute && role !== 'admin' && role !== 'owner') {
            router.push('/');
        }
        if (isOwnerRoute && role !== 'owner') {
            router.push('/');
        }
    }

  }, [user, loading, role, pathname, router]);


  const handleLogout = async () => {
    await signOut(auth);
    router.push('/auth');
  };

  const isManagementRoute = adminRoutes.includes(pathname) || ownerRoutes.includes(pathname);
  if (loading && (protectedRoutes.some(p => pathname.startsWith(p)) || isManagementRoute || authRoutes.includes(pathname))) {
    return null;
  }
  
  // Do not render layout on auth page
  if (authRoutes.includes(pathname)) {
    return (
       <AnimatePresence mode="wait">
        <motion.div
            key={pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            {children}
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <SidebarProvider>
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
              <Link href="/">
                <SidebarMenuButton isActive={isHome} tooltip="Dashboard">
                  <LayoutDashboard />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            {user && (
              <>
                <SidebarMenuItem>
                  <Link href="/advisor">
                    <SidebarMenuButton isActive={isActive('/advisor')} tooltip="AI Advisor">
                      <BrainCircuit />
                      <span>AI Advisor</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <Link href="/settings">
                    <SidebarMenuButton isActive={isActive('/settings')} tooltip="Settings">
                      <Settings />
                      <span>Settings</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              </>
            )}
             {(role === 'admin' || role === 'owner') && (
                <SidebarMenuItem>
                  <Link href="/admin">
                    <SidebarMenuButton isActive={isActive('/admin')} tooltip="Admin Panel">
                      <ShieldCheck />
                      <span>Admin Panel</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
            )}
            {role === 'owner' && (
                <SidebarMenuItem>
                  <Link href="/owner">
                    <SidebarMenuButton isActive={isActive('/owner')} tooltip="Owner Controls">
                      <UserCog />
                      <span>Owner Controls</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
            )}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
         
            <Button variant="ghost" className="w-full justify-start gap-2" onClick={() => setConsoleOpen(true)}>
                <TerminalSquare className="w-5 h-5 text-accent" />
                <span className="text-muted-foreground">Command Console</span>
            </Button>
          
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
                  <DropdownMenuLabel>My Account ({role})</DropdownMenuLabel>
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
             <Link href="/auth" className='w-full'>
              <Button variant="outline" className="w-full">
                <LogIn className="mr-2 h-4 w-4"/>
                Login / Register
              </Button>
            </Link>
          )}
        </SidebarFooter>
      </Sidebar>
      
      <SidebarInset>
          <header className="flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 lg:h-[60px] lg:px-6 sticky top-0 z-30">
            <SidebarTrigger className="flex md:hidden" />
            <div className="flex-1">
              <h1 className="font-headline text-lg font-semibold capitalize">
                {pathname.split('/')[1] || 'Dashboard'}
              </h1>
            </div>
          </header>
        <AnimatePresence mode="wait" initial={false}>
          <motion.main
              key={pathname}
              initial={{ filter: 'blur(4px)', opacity: 0 }}
              animate={{ filter: 'blur(0px)', opacity: 1 }}
              exit={{ filter: 'blur(4px)', opacity: 0 }}
              transition={{ duration: 0.4, type: 'tween' }}
              className={`flex-1 p-4 lg:p-6`}
          >
              {children}
          </motion.main>
        </AnimatePresence>
        <CommandConsole isOpen={isConsoleOpen} onClose={() => setConsoleOpen(false)} />
      </SidebarInset>
    </SidebarProvider>
  );
}
