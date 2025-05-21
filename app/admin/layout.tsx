import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { requireAdmin } from '@/lib/auth';
import { ToastProvider } from '@/components/ui/Toast';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdmin();

  return (
    <ToastProvider>
      <div className="min-h-screen bg-dark">
        <AdminSidebar user={user} />
        <div className="md:pl-[280px] min-h-screen">
          <main className="p-6">{children}</main>
        </div>
      </div>
    </ToastProvider>
  );
}
