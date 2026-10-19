/** Base class of every business-rule violation. The HTTP filter in src/platform turns it into a 400 with its message. */
export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}
