import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth/auth-options";
import UpdateProfile from "./UpdateProfile";
import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Atualize seu perfil",
};

export default async function UpdateProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }
  return <UpdateProfile session={session} />;
}
