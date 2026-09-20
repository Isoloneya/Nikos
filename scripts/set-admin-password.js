const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const email = process.argv[2];
  const newPassword = process.argv[3];

  if (!email || !newPassword) {
    console.error("Використання: node scripts/set-admin-password.js <email> <новий_пароль>");
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);

  const admin = await prisma.adminUser.update({
    where: { email },
    data: { passwordHash },
  });

  console.log(`Пароль оновлено для ${admin.email}`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });