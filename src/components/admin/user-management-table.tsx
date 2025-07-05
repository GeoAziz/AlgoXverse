'use client';

import { useTransition } from 'react';
import type { AppUser, UserRole } from "@/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useAuth } from '@/context/auth-context';
import { updateUserRole } from '@/app/admin/actions';
import { useToast } from '@/hooks/use-toast';

export function UserManagementTable({ users }: { users: AppUser[] }) {
    const { user: currentUser } = useAuth();
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();

    const handleRoleChange = (uid: string, role: UserRole) => {
        startTransition(async () => {
            if (role === 'owner') return; // Should not be an option in UI
            const result = await updateUserRole(uid, role);
            if (result.success) {
                toast({
                    title: 'Role Updated',
                    description: 'User role has been successfully updated.',
                });
                // Note: Revalidation will refresh the data, no need for client-side state update
            } else {
                 toast({
                    variant: 'destructive',
                    title: 'Error',
                    description: 'Failed to update user role.',
                });
            }
        });
    };

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Manage Role</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {users.map((user) => (
                    <TableRow key={user.uid}>
                        <TableCell>
                            <div className="font-medium">{user.displayName}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                        </TableCell>
                        <TableCell>
                            <Badge variant={user.role === 'owner' ? 'destructive' : user.role === 'admin' ? 'default' : 'secondary'}>
                                {user.role}
                            </Badge>
                        </TableCell>
                        <TableCell>{format(user.createdAt.toDate(), 'PPP')}</TableCell>
                        <TableCell className="text-right">
                           {user.role !== 'owner' && user.uid !== currentUser?.uid ? (
                             <Select 
                                defaultValue={user.role} 
                                onValueChange={(value) => handleRoleChange(user.uid, value as UserRole)}
                                disabled={isPending}
                             >
                                <SelectTrigger className="w-[120px] ml-auto">
                                    <SelectValue placeholder="Change role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="trader">Trader</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                </SelectContent>
                             </Select>
                           ) : (
                            <span className="text-sm text-muted-foreground">N/A</span>
                           )}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
