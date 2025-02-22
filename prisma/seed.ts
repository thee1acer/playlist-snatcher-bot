import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const subscriptions = [
    {
      subscriptionName: "Basic Plan",
      subscriptionDescription: "Access to basic features",
      constOfSub: 10,
      lengthInDays: 30
    },
    {
      subscriptionName: "Premium Plan",
      subscriptionDescription: "Access to premium features",
      constOfSub: 25,
      lengthInDays: 90
    },
    {
      subscriptionName: "Annual Plan",
      subscriptionDescription: "Full access for a year",
      constOfSub: 80,
      lengthInDays: 365
    }
  ];

  for (const sub of subscriptions) {
    await prisma.subscription.upsert({
      where: { subscriptionName: sub.subscriptionName },
      update: sub,
      create: sub
    });
  }

  console.log("✅ Seed data upserted successfully!");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
