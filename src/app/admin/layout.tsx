import AdminGuard from "@/components/auth/admin-guard";
import AdminSidebar from "@/components/navigation/admin-sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <div className="flex flex-1 flex-col lg:flex-row">
        <AdminSidebar />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </AdminGuard>
  );
}
