import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserManagementTable } from "@/components/admin/user-management-table";
import { getSystemStats, getAllUsers } from "../admin/actions";
import { Users, Bot, PlayCircle, Clock } from "lucide-react";

async function StatCard({ title, value, icon: Icon, description }: { title: string, value: string | number, icon: React.ElementType, description: string }) {
    return (
        <Card className="bg-card/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-xs text-muted-foreground">{description}</p>
            </CardContent>
        </Card>
    )
}

export default async function OwnerPage() {
    const stats = await getSystemStats();
    const users = await getAllUsers();
    
    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="font-headline text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-accent">Owner Mission Control</h1>
                <p className="text-muted-foreground max-w-2xl">
                    System-wide overview and core administrative controls.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard title="Total Users" value={stats.totalUsers} icon={Users} description="All registered navigators."/>
                <StatCard title="Total Strategies" value={stats.totalStrategies} icon={Bot} description="All strategies analyzed."/>
                <StatCard title="Running Bots" value={stats.runningStrategies} icon={PlayCircle} description="Strategies currently active."/>
                <StatCard title="Pending Approval" value={stats.pendingStrategies} icon={Clock} description="Strategies awaiting review."/>
            </div>

            <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">User & Role Management</CardTitle>
                    <CardDescription>
                        Assign roles and manage all users in the system.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <UserManagementTable users={users} />
                </CardContent>
            </Card>
        </div>
    );
}
