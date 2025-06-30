import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { AdminLayout } from "@/components/admin/admin-layout";
import { authOptions } from "@/lib/auth";

export default async function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/admin/signin");
  }

  return <AdminLayout>{children}</AdminLayout>;
}
