import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ username: string }> },
) {
  const { username } = await params;
  const year = req.nextUrl.searchParams.get("year");
  const month = req.nextUrl.searchParams.get("month");

  if (!year || !month) {
    return NextResponse.json(
      { message: "Year or month not specified." },
      { status: 400 },
    );
  }

  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) {
    return NextResponse.json(
      { message: "User does not exist." },
      { status: 404 },
    );
  }

  const availableWeekDays = await prisma.userTimeInterval.findMany({
    select: { week_day: true },
    where: { user_id: user.id },
  });

  const blockedWeekDays = [0, 1, 2, 3, 4, 5, 6].filter(
    (weekDay) =>
      !availableWeekDays.some(
        (availableWeekDay) => availableWeekDay.week_day === weekDay,
      ),
  );

  const yearMonth = `${year}-${String(month).padStart(2, "0")}`;

  const blockedDatesRaw: Array<{ date: number }> = await prisma.$queryRaw`
  SELECT
    EXTRACT(DAY FROM S.date)::int AS date
  FROM schedulings S
  LEFT JOIN user_time_intervals UTI
    ON UTI.week_day = EXTRACT(DOW FROM S.date)::int
  WHERE S.user_id = ${user.id}
    AND TO_CHAR(S.date, 'YYYY-MM') = ${yearMonth}
  GROUP BY
    EXTRACT(DAY FROM S.date),
    UTI.time_start_in_minutes,
    UTI.time_end_in_minutes
  HAVING
    COUNT(S.date) >= ((UTI.time_end_in_minutes - UTI.time_start_in_minutes) / 60)
`;

  const blockedDates = blockedDatesRaw.map((item) => Number(item.date));

  return NextResponse.json({ blockedWeekDays, blockedDates });
}
