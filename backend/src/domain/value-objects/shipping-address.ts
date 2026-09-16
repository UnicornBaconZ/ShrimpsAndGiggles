/**
 * Value object: a shipping destination.
 *
 * Immutable and self-validating — an address cannot exist with empty parts.
 * Equality is by value, not identity.
 */
export class ShippingAddress {
  constructor(
    public readonly country: string,
    public readonly city: string,
    public readonly street: string,
    public readonly houseNumber: string,
  ) {
    const parts = { country, city, street, houseNumber };
    for (const [field, value] of Object.entries(parts)) {
      if (!value || value.trim().length === 0) {
        throw new Error(`Shipping address is missing "${field}"`);
      }
    }
  }

  /** Human-readable single line, e.g. "Dorpsstraat 12, Ghent, Belgium". */
  get formatted(): string {
    return `${this.street} ${this.houseNumber}, ${this.city}, ${this.country}`;
  }
}
