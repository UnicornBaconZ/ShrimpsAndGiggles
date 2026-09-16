/**
 * Domain entity: Product (a live shrimp variety).
 *
 * Pure business object with no framework or persistence concerns.
 * It knows nothing about TypeORM, HTTP, or NestJS.
 *
 * All varieties are Neocaridina davidi sold as live aquarium pets, priced
 * per individual shrimp.
 */
export class Product {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string,
    /** Price per shrimp in whole cents to avoid floating-point money bugs. */
    public readonly priceCents: number,
    public readonly imageUrl: string,
    /** Number of live shrimp currently available. */
    public readonly stock: number,
    /** Colour family, e.g. "red", "blue", "green", "yellow", "orange". */
    public readonly colorGroup: string,
    /** Keeping difficulty for the hobbyist, e.g. "Beginner", "Intermediate". */
    public readonly careLevel: string,
  ) {}

  get isAvailable(): boolean {
    return this.stock > 0;
  }

  canFulfill(quantity: number): boolean {
    return quantity > 0 && quantity <= this.stock;
  }

  /**
   * Returns a copy of this product with `quantity` fewer shrimp in stock.
   * Throws if there are not enough — the domain never allows negative stock.
   */
  reduceStock(quantity: number): Product {
    if (!this.canFulfill(quantity)) {
      throw new Error(
        `Cannot reduce stock of "${this.name}" by ${quantity}; only ${this.stock} available`,
      );
    }
    return new Product(
      this.id,
      this.name,
      this.description,
      this.priceCents,
      this.imageUrl,
      this.stock - quantity,
      this.colorGroup,
      this.careLevel,
    );
  }
}
