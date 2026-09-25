import { fetchProducts } from '../../lib/api';
import StoreCatalog from '../../components/StoreCatalog';
import WaveDivider from '../../components/WaveDivider';
import { Product } from '../../lib/types';

export const metadata = {
  title: 'Store — Shrimps & Giggles',
};

// Always fetch fresh stock from the API on each request.
export const dynamic = 'force-dynamic';

export default async function StorePage() {
  let products: Product[] = [];
  let error: string | null = null;

  try {
    products = await fetchProducts();
  } catch {
    error =
      'We could not reach the shrimp tank. Make sure the backend API is running on port 3001.';
  }

  return (
    <>
      <section className="bg-gradient-to-b from-tide-100 to-sand-50">
        <div className="mx-auto max-w-6xl px-6 py-16 text-center">
          <h1 className="animate-fade-up font-display text-4xl font-bold text-moss-700">
            Meet the colony
          </h1>
          <p
            className="mt-3 animate-fade-up text-moss-500"
            style={{ animationDelay: '0.1s' }}
          >
            Pick your colours, choose how many, and we will pack them for a safe
            live journey. Priced per shrimp.
          </p>
        </div>
        <WaveDivider fill="#faf6ef" />
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        {error ? (
          <div className="rounded-3xl bg-coral-300/20 p-8 text-center text-coral-600">
            {error}
          </div>
        ) : (
          <StoreCatalog products={products} />
        )}
      </section>
    </>
  );
}
