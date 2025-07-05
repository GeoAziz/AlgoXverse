'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoveRight, Bot, PlusCircle, Activity } from "lucide-react";
import Link from "next/link";
import { useAuth } from '@/context/auth-context';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import type { Strategy } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

const StrategyCardSkeleton = () => (
  <Card className="bg-card/50 backdrop-blur-sm">
    <CardHeader>
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-1/2 mt-2" />
    </CardHeader>
    <CardContent>
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-4 w-20" />
      </div>
    </CardContent>
  </Card>
);

export default function TraderDashboard() {
  const { user } = useAuth();
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
     return <GuestWelcome />;
  }
  
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-headline text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-accent">Trader Dashboard</h1>
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
                Here are the strategies you have analyzed.
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
                        <Card key={strategy.id} className="bg-background/50 hover:border-accent/50 transition-colors">
                            <CardHeader>
                                <CardTitle className="font-headline text-xl truncate">{strategy.strategyName || "Unnamed Strategy"}</CardTitle>
                                <CardDescription>
                                    Analyzed {formatDistanceToNow(strategy.createdAt.toDate(), { addSuffix: true })}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex justify-between items-center">
                                    <Badge variant="outline">View Details</Badge>
                                </div>
                            </CardContent>
                        </Card>
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
    </div>
  );
}

const GuestWelcome = () => (
    <div className="flex flex-col gap-8 items-center justify-center h-full text-center">
      <div className="space-y-2">
        <h1 className="font-headline text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-accent">Welcome, Guest Navigator</h1>
        <p className="text-muted-foreground max-w-xl">
          Your portal to the AlgoXverse. Sign in to analyze, optimize, and deploy with the power of AI.
        </p>
      </div>

       <Card className="max-w-md bg-card/50 border-primary/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline text-2xl">
                <span>Access Your Command Console</span>
            </CardTitle>
            <CardDescription>
              Log in or create an account to access your personal Trader Dashboard and the AI Strategy Advisor.
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
);
