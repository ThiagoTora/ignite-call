import type { Metadata } from "next";
import { Heading, Text } from "@ignite-ui/react";
import Image from "next/image";
import { Container, Hero, Preview } from "./styles";

import previewImage from "../../assets/Calendar.png";
import { ClaimUsernameForm } from "./components/ClaimUserNameForm";

export const metadata: Metadata = {
  title: "Agendamento Descomplicado",
  description:
    "Conecte seu calendário e permita que as pessoas marquem agendamentos no seu tempo livre.",
};

export default function Home() {
  return (
    <Container>
      <Hero>
        <Heading as="h1" size="4xl">
          Agendamento Descomplicado
        </Heading>
        <Text size="lg">
          Conecte seu calendário e permita que as pessoas marquem agendamentos
          no seu tempo livre
        </Text>
        <ClaimUsernameForm />
      </Hero>
      <Preview>
        <Image
          src={previewImage}
          height={400}
          quality={100} // next/image padrão = 80
          priority // carrega a imagem primeiro, junto com os outros elementos
          alt="Calendário simbolizando aplicação em funcionamento"
        />
      </Preview>
    </Container>
  );
}
