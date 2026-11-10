import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";

import { authOptions } from "@/src/lib/auth/auth-options";
import { prisma } from "@/src/lib/prisma";

const updateProfileBodySchema = z.object({
  bio: z.string(),
});

export async function PUT(request: Request) {
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

    const { bio } = updateProfileBodySchema.parse(body);

    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        bio,
      },
    });

    return NextResponse.json(
      {
        message: "Profile updated successfully",
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          message: "Invalid data",
          issues: error.issues,
        },
        {
          status: 400,
        },
      );
    }

    console.error(error);

    return NextResponse.json(
      {
        message: "Failed to update profile",
      },
      {
        status: 500,
      },
    );
  }
}
