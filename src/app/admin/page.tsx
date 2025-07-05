import { getStrategiesForApproval, getAllUsers } from "./actions";
import { AdminDashboard } from "@/components/admin/admin-dashboard";

export default async function AdminPage() {
    const users = await getAllUsers();
    const strategies = await getStrategiesForApproval();

    return <AdminDashboard strategies={strategies} users={users} />;
}
