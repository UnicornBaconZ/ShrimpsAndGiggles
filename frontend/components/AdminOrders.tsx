'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  deleteOrder,
  fetchOrders,
  formatPrice,
  updateOrderStatus,
} from '../lib/api';
import { OrderStatus, OrderView, ORDER_STATUSES } from '../lib/types';

/** Tailwind classes for each status pill. */
const statusStyles: Record<OrderStatus, string> = {
  pending: 'bg-sand-200 text-moss-700',
  packed: 'bg-tide-100 text-tide-500',
  shipped: 'bg-coral-300/40 text-coral-600',
  delivered: 'bg-moss-500/20 text-moss-700',
  cancelled: 'bg-sand-100 text-moss-400 line-through',
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? '—'
    : d.toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
      });
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<OrderView[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setOrders(await fetchOrders());
    } catch (err) {
      const detail = err instanceof Error ? err.message : String(err);
      setError(
        `Could not load orders (${detail}). Confirm the backend is running on port 3001 and has been restarted with the latest code.`,
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const stats = useMemo(() => {
    const live = (orders ?? []).filter((o) => o.status !== 'cancelled');
    return {
      count: orders?.length ?? 0,
      revenueCents: live.reduce((sum, o) => sum + o.totalCents, 0),
      shrimp: live.reduce(
        (sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0),
        0,
      ),
    };
  }, [orders]);

  const handleStatus = async (id: string, status: OrderStatus) => {
    setBusyId(id);
    try {
      const updated = await updateOrderStatus(id, status);
      setOrders((prev) =>
        (prev ?? []).map((o) => (o.id === id ? updated : o)),
      );
    } catch {
      setError('Failed to update that order. Please try again.');
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (id: string) => {
    setBusyId(id);
    try {
      await deleteOrder(id);
      setOrders((prev) => (prev ?? []).filter((o) => o.id !== id));
      setPendingDelete(null);
    } catch {
      setError('Failed to delete that order. Please try again.');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-bold text-moss-700">
            🦐 The Shrimp Room
          </h1>
          <p className="mt-1 text-sm text-moss-500">
            Private orders dashboard — not linked anywhere on the site.
          </p>
        </div>
        <button
          onClick={load}
          className="rounded-full bg-moss-500 px-5 py-2 text-sm font-semibold text-sand-50 shadow-soft transition-transform hover:scale-105"
        >
          ↻ Refresh
        </button>
      </header>

      {/* Summary tiles */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          { label: 'Orders', value: String(stats.count), icon: '📦' },
          { label: 'Revenue', value: formatPrice(stats.revenueCents), icon: '💰' },
          { label: 'Shrimp sold', value: String(stats.shrimp), icon: '🦐' },
        ].map((tile, i) => (
          <div
            key={tile.label}
            className="flex animate-fade-up items-center gap-4 rounded-2xl bg-white p-5 shadow-soft ring-1 ring-sand-200"
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-tide-100 text-2xl">
              {tile.icon}
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-moss-400">
                {tile.label}
              </p>
              <p className="font-display text-2xl font-bold text-moss-700">
                {tile.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {error && (
        <div className="mt-6 rounded-2xl bg-coral-300/20 p-4 text-sm text-coral-600">
          {error}
        </div>
      )}

      {/* Orders */}
      <div className="mt-8 space-y-4">
        {loading ? (
          <p className="py-10 text-center text-moss-500">Loading orders…</p>
        ) : orders && orders.length === 0 ? (
          <p className="py-10 text-center text-moss-500">
            No orders yet. Go place one in the store! 🌿
          </p>
        ) : (
          (orders ?? []).map((order, i) => {
            const isOpen = expandedId === order.id;
            const isBusy = busyId === order.id;
            return (
              <div
                key={order.id}
                className="animate-fade-up rounded-2xl bg-white shadow-soft ring-1 ring-sand-200"
                style={{ animationDelay: `${Math.min(i, 10) * 0.04}s` }}
              >
                <div className="flex flex-wrap items-center gap-4 p-4">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-moss-700">
                      {order.customerName}{' '}
                      <span className="font-mono text-xs text-moss-400">
                        #{order.id.slice(0, 8)}
                      </span>
                    </p>
                    <p className="truncate text-xs text-moss-400">
                      {order.customerEmail} · {formatDate(order.createdAt)}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyles[order.status]}`}
                  >
                    {order.status}
                  </span>

                  <span className="font-display text-lg font-bold text-coral-500">
                    {formatPrice(order.totalCents)}
                  </span>

                  <select
                    value={order.status}
                    disabled={isBusy}
                    onChange={(e) =>
                      handleStatus(order.id, e.target.value as OrderStatus)
                    }
                    aria-label={`Set status for order ${order.id.slice(0, 8)}`}
                    className="rounded-xl border border-sand-200 bg-sand-50 px-2 py-1 text-sm capitalize text-moss-600 outline-none focus:border-moss-400 disabled:opacity-50"
                  >
                    {ORDER_STATUSES.map((s) => (
                      <option key={s} value={s} className="capitalize">
                        {s}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => setExpandedId(isOpen ? null : order.id)}
                    className="rounded-full px-3 py-1 text-sm font-medium text-moss-500 hover:text-moss-700"
                    aria-expanded={isOpen}
                  >
                    {isOpen ? 'Hide' : 'Details'}
                  </button>

                  {pendingDelete === order.id ? (
                    <span className="flex items-center gap-2 text-sm">
                      <button
                        onClick={() => handleDelete(order.id)}
                        disabled={isBusy}
                        className="rounded-full bg-coral-500 px-3 py-1 font-semibold text-white disabled:opacity-50"
                      >
                        {isBusy ? 'Deleting…' : 'Confirm'}
                      </button>
                      <button
                        onClick={() => setPendingDelete(null)}
                        className="rounded-full px-2 py-1 text-moss-500 hover:text-moss-700"
                      >
                        Cancel
                      </button>
                    </span>
                  ) : (
                    <button
                      onClick={() => setPendingDelete(order.id)}
                      className="rounded-full border border-coral-300 px-3 py-1 text-sm font-medium text-coral-500 transition-colors hover:bg-coral-300/20"
                    >
                      Delete
                    </button>
                  )}
                </div>

                {isOpen && (
                  <div className="border-t border-sand-200 px-4 py-4 text-sm">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-moss-400">
                          Ship to
                        </p>
                        <p className="mt-1 text-moss-600">
                          {order.shippingAddress.formatted}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-moss-400">
                          Items
                        </p>
                        <ul className="mt-1 space-y-1 text-moss-600">
                          {order.items.map((item) => (
                            <li
                              key={item.productId}
                              className="flex justify-between gap-4"
                            >
                              <span>
                                {item.quantity} × {item.productName}
                              </span>
                              <span className="font-medium">
                                {formatPrice(item.subtotalCents)}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
