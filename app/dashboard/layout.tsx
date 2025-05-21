import { DashboardSidebar } from '@/components/layout/DashboardSidebar';
import { requireAuth } from '@/lib/auth';
import { ToastProvider } from '@/components/ui/Toast';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAuth();

  return (
    <ToastProvider>
      <div className="min-h-screen bg-dark">
        <DashboardSidebar user={user} />
        <div className="md:pl-[280px] min-h-screen">
          <main className="p-6">{children}</main>
        </div>
      </div>
    </ToastProvider>
  );
}
