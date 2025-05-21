import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { startOfDay, endOfDay } from "date-fns";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Only admins can access booking stats
    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only admins can access booking stats" },
        { status: 403 }
      );
    }
    
    // Get total bookings count
    const totalBookings = await prisma.booking.count();
    
    // Get pending bookings count
    const pendingBookings = await prisma.booking.count({
      where: {
        contacted: false,
      },
    });
    
    // Get contacted bookings count
    const contactedBookings = await prisma.booking.count({
      where: {
        contacted: true,
      },
    });
    
    // Get today's bookings count
    const today = new Date();
    const todayStart = startOfDay(today);
    const todayEnd = endOfDay(today);
    
    const todayBookings = await prisma.booking.count({
      where: {
        date: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
    });
    
    return NextResponse.json({
      totalBookings,
      pendingBookings,
      contactedBookings,
      todayBookings,
    });
  } catch (error) {
    console.error("Admin booking stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch booking stats" },
      { status: 500 }
    );
  }
}
