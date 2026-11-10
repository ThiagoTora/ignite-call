"use client";

import { Button, Heading, MultiStep, Text } from "@ignite-ui/react";
import { Container, Form, FormError, Header } from "./styles";
import { ArrowRight } from "phosphor-react";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect } from "react";
import { api } from "@/src/lib/axios";
import { AxiosError } from "axios";
import { TextInput } from "@/src/components/TextInput";

const registerFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: "O usuário precisa ter pelo menos 3 letras." })
    .regex(/^([a-z\-]+)$/i, {
      message: "O usuário pode ter apenas letras e hifens.",
    })
    .transform((username) => username.toLowerCase()),
  name: z
    .string()
    .min(3, { message: "O nome precisa ter pelo menos 3 letras." }),
});

type RegisterFormData = z.infer<typeof registerFormSchema>;

function RegisterContent() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
  });

  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const username = searchParams.get("username") ?? "";

    if (username) {
      setValue("username", username);
    }
  }, [searchParams, setValue]);

  async function handleRegister(data: RegisterFormData) {
    try {
      await api.post("/users", {
        name: data.name,
        username: data.username,
      });

      router.push("/register/connect-calendar");
    } catch (err) {
      if (err instanceof AxiosError) {
        const message = err.response?.data?.message;

        if (message) {
          alert(message);
        }
      }

      console.error(err);
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

        <MultiStep size={4} currentStep={1} />
      </Header>
      <Form as="form" onSubmit={handleSubmit(handleRegister)}>
        <label>
          <Text size="sm">Nome de usuário</Text>
          <TextInput
            prefix="ignite.com/"
            placeholder="seu-usuario"
            {...register("username")}
          />
          {errors.username && (
            <FormError size="sm">{errors.username.message}</FormError>
          )}
        </label>

        <label>
          <Text size="sm">Nome completo</Text>
          <TextInput placeholder="Seu nome" {...register("name")} />
          {errors.name && (
            <FormError size="sm">{errors.name.message}</FormError>
          )}
        </label>

        <Button type="submit" disabled={isSubmitting}>
          Próximo passo
          <ArrowRight />
        </Button>
      </Form>
    </Container>
  );
}

export default function Register() {
  return (
    <Suspense fallback={null}>
      <RegisterContent />
    </Suspense>
  );
}
