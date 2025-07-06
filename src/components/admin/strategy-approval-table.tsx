
'use client';

import { useState, useTransition } from 'react';
import type { SerializableStrategy } from "@/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { CheckCircle, Eye, XCircle } from "lucide-react";
import { updateStrategyApproval, getStrategyById } from '@/app/admin/actions';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '../ui/skeleton';
import { Badge } from '../ui/badge';

const StrategyDetailView = ({ strategyId }: { strategyId: string }) => {
    const [strategy, setStrategy] = useState<SerializableStrategy | null>(null);
    const [loading, setLoading] = useState(true);

    useState(() => {
        getStrategyById(strategyId).then(data => {
            if (data) setStrategy(data);
            setLoading(false);
        });
    });

    if (loading) {
        return <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-16 w-full" />
        </div>;
    }

    if (!strategy) {
        return <div>Strategy details not found.</div>;
    }

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>Strategy Code</CardTitle>
                </CardHeader>
                <CardContent>
                    <pre className="bg-background/50 p-4 rounded-md text-xs overflow-auto max-h-60">
                        <code>{JSON.stringify(JSON.parse(strategy.strategyCode), null, 2)}</code>
                    </pre>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>AI Analysis Suggestions</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">{strategy.analysis.suggestions}</p>
                </CardContent>
            </Card>
        </div>
    );
}

export function StrategyApprovalTable({ strategies: initialStrategies }: { strategies: SerializableStrategy[] }) {
    const [strategies, setStrategies] = useState(initialStrategies);
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();

    const handleApproval = (strategyId: string, status: 'approved' | 'rejected') => {
        startTransition(async () => {
            const result = await updateStrategyApproval(strategyId, status);
            if (result.success) {
                setStrategies(strategies.filter(s => s.id !== strategyId));
                toast({
                    title: `Strategy ${status}`,
                    description: 'The strategy status has been updated.',
                });
            } else {
                toast({
                    variant: 'destructive',
                    title: 'Error',
                    description: 'Failed to update strategy status.',
                });
            }
        });
    };
    
    if (strategies.length === 0) {
        return <div className="text-center py-12 text-muted-foreground">No pending strategies to review.</div>;
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Strategy Name</TableHead>
                    <TableHead>Trader</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {strategies.map((strategy) => (
                    <TableRow key={strategy.id}>
                        <TableCell className="font-medium">{strategy.strategyName}</TableCell>
                        <TableCell>
                            <div>{strategy.user?.displayName}</div>
                            <div className="text-xs text-muted-foreground">{strategy.user?.email}</div>
                        </TableCell>
                        <TableCell>{formatDistanceToNow(new Date(strategy.createdAt), { addSuffix: true })}</TableCell>
                        <TableCell className="text-right space-x-2">
                             <Dialog>
                                <DialogTrigger asChild>
                                    <Button size="sm" variant="ghost">
                                        <Eye className="w-4 h-4 mr-2" />
                                        Review
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-2xl bg-card/80 backdrop-blur-lg">
                                    <DialogHeader>
                                        <DialogTitle className="font-headline text-2xl text-primary">{strategy.strategyName}</DialogTitle>
                                        <DialogDescription>
                                            Review the strategy details before making a decision. Submitted by {strategy.user?.email}.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <StrategyDetailView strategyId={strategy.id} />
                                </DialogContent>
                             </Dialog>

                             <Button 
                                size="sm" 
                                variant="outline" 
                                className="border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                                onClick={() => handleApproval(strategy.id, 'rejected')}
                                disabled={isPending}
                            >
                                <XCircle className="w-4 h-4 mr-2" />
                                Reject
                            </Button>
                            <Button 
                                size="sm" 
                                variant="outline" 
                                className="border-green-500/50 text-green-400 hover:bg-green-500/10 hover:text-green-300"
                                onClick={() => handleApproval(strategy.id, 'approved')}
                                disabled={isPending}
                            >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Approve
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
