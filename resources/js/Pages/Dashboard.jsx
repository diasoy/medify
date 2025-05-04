import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import DashboardAdmin from "@/Admin/DashboardAdmin";
import DashboardCustomer from "@/Customer/DashboardCustomer";

export default function Dashboard() {
  const { auth, userRole, ...props } = usePage().props;
  const role = userRole || auth.user.role;

  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight">Dashboard</h2>
      }
    >
      <Head title="Dashboard" />
      {role === "admin" ? (
        <DashboardAdmin {...props} />
      ) : role === "customer" ? (
        <DashboardCustomer {...props} />
      ) : (
        <div className="flex items-center justify-center h-screen">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <strong>Error:</strong> You don't have permission to access this
            page.
          </div>
        </div>
      )}
    </AuthenticatedLayout>
  );
}
