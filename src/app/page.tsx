'use client';

import React, { useEffect, useState, useTransition } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoveRight, Bot, PlusCircle, Activity, Play, Square, Info } from "lucide-react";
import Link from "next/link";
import { useAuth } from '@/context/auth-context';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import type { Strategy } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { updateStrategyStatus } from './advisor/actions';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';


const StrategyCard = ({ strategy }: { strategy: Strategy }) => {
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();
    const [isActive, setIsActive] = useState(strategy.status === 'running');
    const isApproved = strategy.approvalStatus === 'approved';

    const handleStatusChange = (newStatus: boolean) => {
        if (!isApproved) {
            toast({
                variant: 'destructive',
                title: 'Approval Required',
                description: 'This strategy must be approved by an admin before it can be run.',
            });
            return;
        }

        setIsActive(newStatus);
        startTransition(async () => {
            const status = newStatus ? 'running' : 'stopped';
            const result = await updateStrategyStatus(strategy.id, status);
            if (!result.success) {
                setIsActive(!newStatus);
                toast({
                    variant: 'destructive',
                    title: 'Error',
                    description: 'Failed to update strategy status.',
                });
            } else {
                 toast({
                    title: `Strategy ${status === 'running' ? 'Started' : 'Stopped'}`,
                    description: `${strategy.strategyName || "Unnamed Strategy"} is now ${status}.`,
                });
            }
        });
    };

    const getApprovalBadgeVariant = () => {
        switch (strategy.approvalStatus) {
            case 'approved': return 'default';
            case 'pending': return 'secondary';
            case 'rejected': return 'destructive';
            default: return 'secondary';
        }
    }
    
    const getApprovalBadgeClass = () => {
        switch (strategy.approvalStatus) {
            case 'approved': return 'bg-green-500/20 text-green-300 border-green-500/30';
            case 'pending': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
            case 'rejected': return 'bg-red-500/20 text-red-400 border-red-500/30';
            default: return '';
        }
    }

    return (
         <Card className="bg-background/50 hover:border-accent/50 transition-colors flex flex-col">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <CardTitle className="font-headline text-xl truncate pr-2">{strategy.strategyName || "Unnamed Strategy"}</CardTitle>
                    <Badge variant={getApprovalBadgeVariant()} className={cn("text-xs", getApprovalBadgeClass())}>
                        {strategy.approvalStatus}
                    </Badge>
                </div>
                <CardDescription>
                    Analyzed {formatDistanceToNow(strategy.createdAt.toDate(), { addSuffix: true })}
                </CardDescription>
            </CardHeader>
            <CardContent className="mt-auto">
                 <div className="flex justify-between items-center">
                    <Badge variant={isActive ? 'default' : 'secondary'} className={cn(isActive ? 'bg-green-500/20 text-green-300 border-green-500/30' : '', 'transition-colors')}>
                        {isActive ? 'Running' : 'Stopped'}
                    </Badge>
                     <div className="flex items-center space-x-2">
                        <Switch
                            id={`status-${strategy.id}`}
                            checked={isActive}
                            onCheckedChange={handleStatusChange}
                            disabled={isPending || !isApproved}
                            aria-label="Toggle strategy status"
                        />
                        <Label htmlFor={`status-${strategy.id}`} className={cn("flex items-center gap-1", !isApproved ? "cursor-not-allowed text-muted-foreground" : "cursor-pointer")}>
                            {isActive ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                            <span>{isActive ? 'Stop' : 'Start'}</span>
                        </Label>
                         {!isApproved && (
                             <TooltipProvider>
                                 <Tooltip>
                                     <TooltipTrigger>
                                         <Info className="w-4 h-4 text-muted-foreground" />
                                     </TooltipTrigger>
                                     <TooltipContent>
                                         <p>Strategy must be approved to start.</p>
                                     </TooltipContent>
                                 </Tooltip>
                             </TooltipProvider>
                         )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};


const StrategyCardSkeleton = () => (
  <Card className="bg-card/50 backdrop-blur-sm">
    <CardHeader>
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-1/2 mt-2" />
    </CardHeader>
    <CardContent>
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-10 w-24" />
      </div>
    </CardContent>
  </Card>
);

export default function TraderDashboard() {
  const { user, role } = useAuth();
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStrategies() {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const q = query(collection(db, 'strategies'), where('userId', '==', user.uid), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const userStrategies = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Strategy));
        setStrategies(userStrategies);
      } catch (error) {
        console.error("Error fetching strategies:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStrategies();
  }, [user]);

  if (!user) {
     return <GuestDashboard />;
  }
  
  return (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-8"
    >
      <div>
        <h1 className="font-headline text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-accent">
          {role === 'owner' ? "Owner's Dashboard" : role === 'admin' ? "Admin's Dashboard" : "Trader Dashboard"}
        </h1>
        <p className="text-muted-foreground max-w-2xl">
          Welcome, Navigator. Manage your active strategies or create a new one with the AI Advisor.
        </p>
      </div>

      <div className="flex justify-end">
        <Link href="/advisor">
            <Button className="group transition-all hover:drop-shadow-[0_0_8px_hsl(var(--primary))]">
                <PlusCircle className="w-4 h-4 mr-2" />
                New AI Analysis
            </Button>
        </Link>
      </div>

      <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
        <CardHeader>
            <CardTitle className="font-headline text-2xl flex items-center gap-2">
                <Activity className="text-primary"/>
                My Strategies
            </CardTitle>
            <CardDescription>
                Here are the strategies you have analyzed. Approved strategies can be started or stopped.
            </CardDescription>
        </CardHeader>
        <CardContent>
            {loading ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <StrategyCardSkeleton />
                    <StrategyCardSkeleton />
                    <StrategyCardSkeleton />
                 </div>
            ) : strategies.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {strategies.map(strategy => (
                       <StrategyCard key={strategy.id} strategy={strategy} />
                    ))}
                </div>
            ) : (
                 <div className="text-center py-12">
                    <Bot className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-semibold">No Strategies Found</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Get started by analyzing a new strategy with our AI Advisor.
                    </p>
                    <div className="mt-6">
                         <Link href="/advisor">
                            <Button>
                                Analyze First Strategy
                                <MoveRight className="w-4 h-4 ml-2" />
                            </Button>
                        </Link>
                    </div>
                </div>
            )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

const GuestDashboard = () => (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-8"
    >
      <div>
        <h1 className="font-headline text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-accent">Guest Console</h1>
        <p className="text-muted-foreground max-w-2xl">
          You are viewing a live demo of the AlgoXverse. Sign in to unlock your personal command center.
        </p>
      </div>
      
       <Card className="bg-card/50 backdrop-blur-sm border-primary/20 relative overflow-hidden">
        <CardHeader>
            <CardTitle className="font-headline text-2xl flex items-center gap-2">
                <Activity className="text-primary"/>
                Demo Strategies
            </CardTitle>
            <CardDescription>
                This is a preview of a real trader's dashboard.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StrategyCardSkeleton />
                <StrategyCardSkeleton />
                <StrategyCardSkeleton />
            </div>
        </CardContent>
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent flex items-center justify-center flex-col gap-4 p-4">
             <Card className="max-w-md bg-card/80 border-primary/50 backdrop-blur-lg animate-in fade-in-50 duration-500">
                <CardHeader className="items-center text-center">
                    <CardTitle className="flex items-center gap-2 font-headline text-2xl">
                        <span>Activate Your TradeDesk</span>
                    </CardTitle>
                    <CardDescription>
                    Register now to upload, backtest, and deploy your own AI-powered strategies.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Link href="/auth">
                    <Button className="w-full group transition-all hover:drop-shadow-[0_0_8px_hsl(var(--primary))]">
                        Login / Register
                        <MoveRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                    </Button>
                    </Link>
                </CardContent>
            </Card>
        </div>
      </Card>
    </motion.div>
);
