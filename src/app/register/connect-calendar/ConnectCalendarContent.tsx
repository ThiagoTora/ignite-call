"use client";

import { Button, Heading, MultiStep, Text } from "@ignite-ui/react";
import { Container, Header } from "../styles";
import { ArrowRight, Check } from "phosphor-react";
import { AuthError, ConnectBox, ConnectItem } from "./styles";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent } from "react";

export function ConnectCalendarContent() {
  const searchParams = useSearchParams();
  const session = useSession();
  const router = useRouter();

  const hasAuthError = !!searchParams.get("error");
  const isSignedIn = session.status === "authenticated";

  async function handleConnectCalendar() {
    await signIn("google");
  }

  async function handleNextStep(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push("/register/update-profile");
  }

  return (
    <Container>
      <Header>
        <Heading as="strong">Conecte sua agenda!</Heading>

        <Text>
          Conecte o seu calendário para verificar automaticamente as horas
          ocupadas e os novos eventos à medida em que são agendados.
        </Text>

        <MultiStep size={4} currentStep={2} />
      </Header>

      <ConnectBox as="form" onSubmit={handleNextStep}>
        <ConnectItem>
          <Text>Google Calendar</Text>

          {isSignedIn ? (
            <Button type="button" size="sm" disabled>
              Conectado
              <Check />
            </Button>
          ) : (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleConnectCalendar}
            >
              Conectar
              <ArrowRight />
            </Button>
          )}
        </ConnectItem>

        {hasAuthError && (
          <>
            <AuthError>
              Falha ao se conectar ao Google, verifique as permissões.
            </AuthError>

            <Button
              type="button"
              variant="tertiary"
              size="sm"
              onClick={() => signOut()}
            >
              Tentar com outra conta
            </Button>
          </>
        )}

        <Button type="submit" disabled={!isSignedIn}>
          Próximo passo
          <ArrowRight />
        </Button>
      </ConnectBox>
    </Container>
  );
}
