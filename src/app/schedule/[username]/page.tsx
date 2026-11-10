import { Avatar as UIAvatar, Heading, Text } from "@ignite-ui/react";
import { notFound } from "next/navigation";
import { prisma } from "../../../lib/prisma";
import { Container, UserHeader } from "./styles";
import { Metadata } from "next";
import type { ComponentType } from "react";

const Avatar = UIAvatar as ComponentType<{
  src?: string;
}>;

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
    where: {
      username,
    },
  });

  return {
    title: user ? `Agendar com ${user.name}` : "Usuário não encontrado",
  };
}

export default async function Schedule({ params }: ScheduleProps) {
  const { username } = await params;

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (!user) {
    notFound();
  }

  return (
    <Container>
      <UserHeader>
        <Avatar src={user.avatar_url ?? ""} />
        <Heading>{user.name}</Heading>
        <Text>{user.email ?? ""}</Text>
      </UserHeader>
    </Container>
  );
}
