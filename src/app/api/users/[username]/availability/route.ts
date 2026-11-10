import { NextRequest, NextResponse } from "next/server";
import dayjs from "dayjs";
import { prisma } from "@/src/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ username: string }> },
) {
  const { username } = await params;
  const date = req.nextUrl.searchParams.get("date");

  if (!date) {
    return NextResponse.json(
      { message: "Date not provided." },
      { status: 400 },
    );
  }

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (!user) {
    return NextResponse.json(
      { message: "User does not exist." },
      { status: 404 },
    );
  }

  const referenceDate = dayjs(date);

  if (!referenceDate.isValid()) {
    return NextResponse.json({ message: "Invalid date." }, { status: 400 });
  }

  const isPastDate = referenceDate.endOf("day").isBefore(dayjs());

  if (isPastDate) {
    return NextResponse.json({ possibleTimes: [], availableTimes: [] });
  }

  const userAvailability = await prisma.userTimeInterval.findFirst({
    where: {
      user_id: user.id,
      week_day: referenceDate.day(),
    },
  });

  if (!userAvailability) {
    return NextResponse.json({ possibleTimes: [], availableTimes: [] });
  }

  const { time_start_in_minutes, time_end_in_minutes } = userAvailability;

  const startHour = time_start_in_minutes / 60;
  const endHour = time_end_in_minutes / 60;

  const possibleTimes = Array.from({
    length: endHour - startHour,
  }).map((_, i) => startHour + i);

  const blockedTimes = await prisma.scheduling.findMany({
    select: {
      date: true,
    },
    where: {
      user_id: user.id,
      date: {
        gte: referenceDate.set("hour", startHour).toDate(),
        lte: referenceDate.set("hour", endHour).toDate(),
      },
    },
  });

  const availableTimes = possibleTimes.filter((time) => {
    const isTimeBlocked = blockedTimes.some(
      (blockedTime) => blockedTime.date.getHours() === time,
    );

    const isTimeInPast = referenceDate.set("hour", time).isBefore(new Date());

    return !isTimeBlocked && !isTimeInPast;
  });

  return NextResponse.json({ possibleTimes, availableTimes });
}
