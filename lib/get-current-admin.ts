import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { verifyAdminSessionToken } from "@/lib/admin-auth";

export async function getCurrentAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;
  if (!token) return null;

  const payload = await verifyAdminSessionToken(token);
  if (!payload) return null;

  return prisma.adminUser.findUnique({ where: { id: payload.adminId } });
}