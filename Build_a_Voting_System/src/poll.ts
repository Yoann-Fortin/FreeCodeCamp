import { InMemoryPollStore } from "./adapters/in-memory-poll-store.ts";
import { PollService } from "./domain/poll-service.ts";

const store = new InMemoryPollStore();
export const service = new PollService(store);
export { store };
