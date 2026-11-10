import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import dayjs from "dayjs";
import { google } from "googleapis";
import { prisma } from "@/src/lib/prisma";
import { getGoogleOAuthToken } from "@/src/lib/google";

const createSchedulingBodySchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  observations: z.string().nullable().optional(),
  date: z.string().datetime(),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ username: string }> },
) {
  const { username } = await params;

  const body = await req.json().catch(() => null);
  const parsedBody = createSchedulingBodySchema.safeParse(body);

  if (!parsedBody.success) {
    return NextResponse.json({ message: "Invalid data." }, { status: 400 });
  }

  const { name, email, observations, date } = parsedBody.data;

  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) {
    return NextResponse.json(
      { message: "User does not exist." },
      { status: 404 },
    );
  }

  const schedulingDate = dayjs(date).startOf("hour");

  if (schedulingDate.isBefore(new Date())) {
    return NextResponse.json(
      { message: "Date is in the past." },
      { status: 400 },
    );
  }

  const conflictingScheduling = await prisma.scheduling.findFirst({
    where: {
      user_id: user.id,
      date: schedulingDate.toDate(),
    },
  });

  if (conflictingScheduling) {
    return NextResponse.json(
      { message: "There is another scheduling at the same time." },
      { status: 400 },
    );
  }

  const scheduling = await prisma.scheduling.create({
    data: {
      name,
      email,
      observations,
      date: schedulingDate.toDate(),
      user_id: user.id,
    },
  });

  const calendar = google.calendar({
    version: "v3",
    auth: await getGoogleOAuthToken(user.id),
  });

  await calendar.events.insert({
    calendarId: "primary",
    conferenceDataVersion: 1,
    requestBody: {
      summary: `Ignite Call: ${name}`,
      description: observations ?? undefined,
      start: {
        dateTime: schedulingDate.format(),
      },
      end: {
        dateTime: schedulingDate.add(1, "hour").format(),
      },
      attendees: [{ email, displayName: name }],
      conferenceData: {
        createRequest: {
          requestId: scheduling.id,
          conferenceSolutionKey: { type: "hangoutsMeet" },
        },
      },
    },
  });

  return NextResponse.json({}, { status: 201 });
}
