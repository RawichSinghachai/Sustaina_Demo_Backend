import { EventStoreDBClient, jsonEvent, FORWARDS, START } from '@eventstore/db-client';

const connectionString = process.env.EVENTSTOREDB_URI || 'esdb://localhost:2113?tls=false';

const client = EventStoreDBClient.connectionString(connectionString);

export { client as default, jsonEvent, FORWARDS, START };
