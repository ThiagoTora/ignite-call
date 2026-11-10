"use client";

import type { ComponentProps } from "react";
import type { Session } from "next-auth";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Container, Header } from "../styles";
import {
  Avatar,
  Button,
  Heading,
  MultiStep,
  Text,
  TextArea,
} from "@ignite-ui/react";
import { FormAnnotation, PhotoField, ProfileBox } from "./styles";
import { ArrowRight } from "phosphor-react";
import { api } from "@/src/lib/axios";
import { AxiosError } from "axios";

const updateProfileFormSchema = z.object({
  bio: z.string(),
});

type UpdateProfileFormData = z.infer<typeof updateProfileFormSchema>;

interface UpdateProfileProps {
  session: Session;
}

export default function UpdateProfile({ session }: UpdateProfileProps) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileFormSchema),
  });

  const avatarProps = {
    src: session.user.avatar_url,
    alt: session.user.name ?? "Foto de perfil",
  } as ComponentProps<typeof Avatar>;

  async function handleUpdateProfile(data: UpdateProfileFormData) {
    console.log("session.user:", session.user);
    try {
      await api.put("/users/profile", { bio: data.bio });
      router.push(`/schedule/${session.user.username}`);
    } catch (err) {
      if (err instanceof AxiosError) {
        console.error(err.response?.status, err.response?.data);
      }
    }
  }

  return (
    <Container>
      <Header>
        <Heading as="strong">Bem-vindo ao Ignite Call!</Heading>

        <Text>
          Precisamos de algumas informações para criar seu perfil! Ah, você pode
          editar essas informações depois.
        </Text>

        <MultiStep size={4} currentStep={4} />
      </Header>

      <ProfileBox as="form" onSubmit={handleSubmit(handleUpdateProfile)}>
        <PhotoField>
          <Text size="sm">Foto de Perfil</Text>
          <Avatar {...avatarProps} />
        </PhotoField>

        <label>
          <Text size="sm">Sobre você</Text>

          <TextArea css={{ width: "100%" }} {...register("bio")} />

          <FormAnnotation>Fale um pouco sobre você</FormAnnotation>
        </label>

        <Button type="submit" disabled={isSubmitting}>
          Finalizar
          <ArrowRight />
        </Button>
      </ProfileBox>
    </Container>
  );
}
