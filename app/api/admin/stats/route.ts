import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get total users count
    const totalUsers = await prisma.user.count();

    // Get new users in the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const newUsers = await prisma.user.count({
      where: {
        createdAt: {
          gte: sevenDaysAgo,
        },
      },
    });

    // Get admin users count
    const adminUsers = await prisma.user.count({
      where: {
        role: "ADMIN",
      },
    });

    // Get active users (users with verified email)
    const activeUsers = await prisma.user.count({
      where: {
        emailVerified: {
          not: null,
        },
      },
    });

    // Get total bookings count
    const totalBookings = await prisma.booking.count();

    // Get pending bookings count
    const pendingBookings = await prisma.booking.count({
      where: {
        contacted: false,
      },
    });

    return NextResponse.json({
      totalUsers,
      newUsers,
      adminUsers,
      activeUsers,
      totalBookings,
      pendingBookings,
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch admin stats" },
      { status: 500 }
    );
  }
}
