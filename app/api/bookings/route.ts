import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { z } from "zod";
import { sendBookingConfirmationEmail } from "@/lib/email";
import { addHours, subDays, isAfter } from "date-fns";

const bookingSchema = z.object({
  date: z.string().transform((val) => new Date(val)),
  message: z.string().min(10).max(500),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Only customers can book appointments
    if (session.user.role !== "CUSTOMER") {
      return NextResponse.json(
        { error: "Only customers can book appointments" },
        { status: 403 }
      );
    }
    
    // Check if user is verified
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });
    
    if (!user || !user.emailVerified) {
      return NextResponse.json(
        { error: "Email verification required before booking" },
        { status: 403 }
      );
    }
    
    const body = await req.json();
    const { date, message } = bookingSchema.parse(body);
    
    // Validate date is in the future
    const now = new Date();
    if (!isAfter(date, now)) {
      return NextResponse.json(
        { error: "Booking date must be in the future" },
        { status: 400 }
      );
    }
    
    // Check if user has a booking in the last 24 hours
    const recentBooking = await prisma.booking.findFirst({
      where: {
        userId: session.user.id,
        createdAt: {
          gte: subDays(new Date(), 1),
        },
      },
    });
    
    if (recentBooking) {
      return NextResponse.json(
        { error: "You can only book once every 24 hours" },
        { status: 429 }
      );
    }
    
    // Check if user has a pending booking
    const pendingBooking = await prisma.booking.findFirst({
      where: {
        userId: session.user.id,
        contacted: false,
      },
    });
    
    if (pendingBooking) {
      return NextResponse.json(
        { error: "You already have a pending booking" },
        { status: 400 }
      );
    }
    
    // Create booking
    const booking = await prisma.booking.create({
      data: {
        userId: session.user.id,
        date,
        message,
      },
    });
    
    // Send confirmation email
    await sendBookingConfirmationEmail(
      user.email,
      user.name || "",
      date,
      message
    );
    
    return NextResponse.json({
      success: true,
      booking,
    });
  } catch (error) {
    console.error("Booking error:", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // For admin users, return all bookings
    // For regular users, return only their bookings
    const bookings = await prisma.booking.findMany({
      where: {
        ...(session.user.role !== "ADMIN" && { userId: session.user.id }),
      },
      orderBy: {
        date: "desc",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    
    return NextResponse.json({
      bookings,
    });
  } catch (error) {
    console.error("Get bookings error:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}
