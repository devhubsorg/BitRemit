const { PrismaClient } = require("@prisma/client");
const p = new PrismaClient();
p.recipient
  .findUnique({ where: { phoneNumber: "+2348031234567" } })
  .then((r) => {
    console.log(JSON.stringify(r, null, 2));
    p.$disconnect();
  });
