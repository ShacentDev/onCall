import { auth } from "@/lib/auth";
import prisma from "../lib/prisma";

async function main() {
    await auth.api.createUser({
      body: {
          email: "Hauzan@gmail.com",
          password: "HauzanLoveHauzan2510",
        name: "Admin Hauzan",
        role: "admin",
        data: {
          image: `https://ui-avatars.com/api/?name=${encodeURIComponent(
            "Admin Hauzan"
          )}`,
        },
      },
});

    console.log("✓ Admin created");
  
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });