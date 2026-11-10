import { prisma } from "../src/lib/prisma";

async function main() {
  const user = await prisma.user.findUnique({ where: { username: "thiago" } });

  if (!user) throw new Error("Usuário não encontrado");

  await prisma.userTimeInterval.deleteMany({ where: { user_id: user.id } });

  await prisma.userTimeInterval.createMany({
    data: [1, 2, 3, 4, 5].map((weekDay) => ({
      week_day: weekDay,
      time_start_in_minutes: 480,
      time_end_in_minutes: 1080,
      user_id: user.id,
    })),
  });

  console.log("Intervalos criados");
}

main().finally(() => prisma.$disconnect());
