import { getSystemStats, getAllUsers } from "../admin/actions";
import { OwnerDashboard } from "@/components/owner/owner-dashboard";

export default async function OwnerPage() {
    const stats = await getSystemStats();
    const users = await getAllUsers();
    
    return <OwnerDashboard stats={stats} users={users} />;
}
