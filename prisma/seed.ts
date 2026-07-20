import "dotenv/config";
import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client.js";
import { v7 as uuidv7 } from "uuid";
import bcrypt from "bcryptjs";

const email = "admin@mozshaq.co.mz";
const password = "MozShaq#2026@Admin!!!";

async function main() {
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL }) as any;
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      console.log(`Utilizador ${email} já existe. Seed ignorado.`);
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        id: uuidv7(),
        name: "Administrador",
        email,
        password: hashedPassword,
        role: "ADMIN",
        status: "ACTIVE",
      },
    });

    console.log("Utilizador admin criado com sucesso:");
    console.log(`  ID:    ${user.id}`);
    console.log(`  Nome:  ${user.name}`);
    console.log(`  Email: ${user.email}`);
    console.log(`  Role:  ${user.role}`);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main().catch((e) => {
  console.error("Erro ao executar seed:", e);
  process.exit(1);
});
