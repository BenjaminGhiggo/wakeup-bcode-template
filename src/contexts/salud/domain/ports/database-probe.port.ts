/** Output port: asks the persistence layer whether it answers. Implemented in infrastructure, wired in src/platform. */
export abstract class DatabaseProbe {
  abstract ping(): Promise<boolean>;
}
