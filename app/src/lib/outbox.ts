import { Prisma } from "@prisma/client";

type OutboxClient = Pick<Prisma.TransactionClient, "outboxEvent">;

export async function enqueueOutbox(
  client: OutboxClient,
  event: {
    type: string;
    aggregateId?: string;
    eventKey?: string;
    payload?: Record<string, string | number | boolean | null>;
    availableAt?: Date;
  },
) {
  const data = {
    type: event.type,
    aggregateId: event.aggregateId,
    payload: JSON.stringify(event.payload ?? {}),
    availableAt: event.availableAt ?? new Date(),
  };
  if (event.eventKey) {
    return client.outboxEvent.upsert({
      where: { eventKey: event.eventKey },
      update: {},
      create: { ...data, eventKey: event.eventKey },
    });
  }
  return client.outboxEvent.create({ data });
}
