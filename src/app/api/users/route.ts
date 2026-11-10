import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function POST(request: Request) {
  try {
    const { name, username } = await request.json();

    const userExists = await prisma.user.findUnique({
      where: { username },
    });

    if (userExists) {
      return NextResponse.json(
        { message: "Username Already Exists" },
        { status: 400 },
      );
    }

    const user = await prisma.user.create({
      data: { name, username },
    });

    const response = NextResponse.json(user, { status: 201 });

    response.cookies.set("@ignitecall:userId", user.id, {
      maxAge: 60 * 60 * 24 * 7, // 7 dias
      path: "/",
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to create user" },
      { status: 500 },
    );
  }
}
