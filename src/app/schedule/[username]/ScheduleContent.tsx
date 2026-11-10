"use client";

import { Avatar as UIAvatar, Heading, Text } from "@ignite-ui/react";
import type { ComponentType } from "react";
import { Container, UserHeader } from "./styles";
import { ScheduleForm } from "./ScheduleForm";

const Avatar = UIAvatar as ComponentType<{
  src?: string;
}>;

interface ScheduleContentProps {
  user: {
    name: string;
    email: string | null;
    avatar_url: string | null;
  };
}

export function ScheduleContent({ user }: ScheduleContentProps) {
  return (
    <Container>
      <UserHeader>
        <Avatar src={user.avatar_url ?? ""} />
        <Heading>{user.name}</Heading>
        <Text>{user.email ?? ""}</Text>
      </UserHeader>

      <ScheduleForm />
    </Container>
  );
}
