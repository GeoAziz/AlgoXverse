import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getStrategiesForApproval, getAllUsers } from "./actions";
import { UserManagementTable } from "@/components/admin/user-management-table";
import { StrategyApprovalTable } from "@/components/admin/strategy-approval-table";
import { ShieldCheck, Users } from "lucide-react";
import { motion } from "framer-motion";

export default async function AdminPage() {
    const users = await getAllUsers();
    const strategies = await getStrategiesForApproval();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-8"
        >
            <div>
                <h1 className="font-headline text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-accent">Admin Panel</h1>
                <p className="text-muted-foreground max-w-2xl">
                    Manage users and review submitted strategies.
                </p>
            </div>

            <Tabs defaultValue="strategies" className="w-full">
                <TabsList className="grid w-full grid-cols-2 max-w-md">
                    <TabsTrigger value="strategies">
                        <ShieldCheck className="w-4 h-4 mr-2" />
                        Strategy Approvals
                    </TabsTrigger>
                    <TabsTrigger value="users">
                        <Users className="w-4 h-4 mr-2" />
                        User Management
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="strategies">
                    <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
                        <CardHeader>
                            <CardTitle className="font-headline text-2xl">Pending Strategies</CardTitle>
                            <CardDescription>
                                Review and approve or reject strategies submitted by traders.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <StrategyApprovalTable strategies={strategies} />
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="users">
                    <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
                        <CardHeader>
                            <CardTitle className="font-headline text-2xl">User Management</CardTitle>
                            <CardDescription>
                                View all users and manage their roles.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <UserManagementTable users={users} />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </motion.div>
    )
}
