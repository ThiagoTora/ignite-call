import { notFound } from "next/navigation";
import { prisma } from "../../../lib/prisma";
import { Metadata } from "next";
import { ScheduleContent } from "./ScheduleContent";

interface ScheduleProps {
  params: Promise<{
    username: string;
  }>;
}

export async function generateMetadata({
  params,
}: ScheduleProps): Promise<Metadata> {
  const { username } = await params;

  const user = await prisma.user.findUnique({
    where: { username },
  });

  return {
    title: user ? `Agendar com ${user.name}` : "Usuário não encontrado",
  };
}

export default async function Schedule({ params }: ScheduleProps) {
  const { username } = await params;

  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) {
    notFound();
  }

  return (
    <ScheduleContent
      user={{
        name: user.name,
        email: user.email,
        avatar_url: user.avatar_url,
      }}
    />
  );
}
