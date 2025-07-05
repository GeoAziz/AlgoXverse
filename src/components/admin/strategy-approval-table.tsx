'use client';

import { useState, useTransition } from 'react';
import type { SerializableStrategy } from "@/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { CheckCircle, XCircle } from "lucide-react";
import { updateStrategyApproval } from '@/app/admin/actions';
import { useToast } from '@/hooks/use-toast';

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
