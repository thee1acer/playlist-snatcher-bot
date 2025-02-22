/*
  Warnings:

  - A unique constraint covering the columns `[subscriptionName]` on the table `Subscription` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Subscription_subscriptionName_key" ON "Subscription"("subscriptionName");
