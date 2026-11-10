import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/src/lib/auth/auth-options";
import { prisma } from "@/src/lib/prisma";

const timeIntervalsBodySchema = z.object({
  intervals: z.array(
    z.object({
      weekDay: z.number(),
      startTimeInMinutes: z.number(),
      endTimeInMinutes: z.number(),
    }),
  ),
});

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        {
          message: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    const body = await request.json();

    const { intervals } = timeIntervalsBodySchema.parse(body);

    await prisma.$transaction([
      prisma.userTimeInterval.deleteMany({
        where: { user_id: session.user.id },
      }),
      ...intervals.map((interval) =>
        prisma.userTimeInterval.create({
          data: {
            week_day: interval.weekDay,
            time_start_in_minutes: interval.startTimeInMinutes,
            time_end_in_minutes: interval.endTimeInMinutes,
            user_id: session.user.id,
          },
        }),
      ),
    ]);

    return NextResponse.json(
      {
        message: "Time intervals created successfully",
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Failed to create time intervals",
      },
      {
        status: 500,
      },
    );
  }
}
