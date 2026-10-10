/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import { Minus, Plus, ShoppingCart, Loader, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import type { EventType, CreateOrderRequest, OrderType } from "../types/type";

interface OrderFormProps {
  products: EventType[];
  createOrder: (orderData: CreateOrderRequest) => Promise<OrderType>;
  loadingCreate: boolean;
  onSuccess: () => void;
  onCancel: () => void;
}

const formatRupiah = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

const OrderForm = ({
  products,
  createOrder,
  loadingCreate,
  onSuccess,
  onCancel,
}: OrderFormProps) => {
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [paymentMethod, setPaymentMethod] = useState("cash");

  const availableProducts = useMemo(
    () =>
      products.filter((item) => {
        const type = item.type?.trim().toLowerCase();
        return type === "food" || type === "drink";
      }),
    [products],
  );

  const cartItems = useMemo(
    () =>
      availableProducts
        .filter((item) => (quantities[item.ID] || 0) > 0)
        .map((item) => ({
          product: item,
          quantity: quantities[item.ID],
          price: Number(item.price) || 0,
          subtotal: (Number(item.price) || 0) * quantities[item.ID],
        })),
    [availableProducts, quantities],
  );

  const total = cartItems.reduce((sum, item) => sum + item.subtotal, 0);

  const updateQuantity = (productId: number, amount: number) => {
    setQuantities((previous) => {
      const quantity = Math.max(0, (previous[productId] || 0) + amount);

      return {
        ...previous,
        [productId]: quantity,
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      toast.error("Pilih minimal satu produk");
      return;
    }

    try {
      const orderData: CreateOrderRequest = {
        paymentMethod,
        items: cartItems.map((item) => ({
          eventId: item.product.ID,
          quantity: item.quantity,
        })),
      };

      const order = await createOrder(orderData);

      toast.success(`Order ${order.orderNumber} berhasil dibuat`);

      onSuccess();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error ||
          error?.response?.data?.message ||
          "Gagal membuat order",
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Metode Pembayaran
        </label>

        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10"
          required
        >
          <option value="cash">Cash / Tunai</option>
          <option value="qris">QRIS</option>
          <option value="transfer">Transfer Bank</option>
          <option value="debit">Kartu Debit</option>
          <option value="credit">Kartu Kredit</option>
        </select>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Product Catalog */}
        <section>
          <h3 className="mb-3 font-semibold text-slate-800">Pilih Produk</h3>

          <div className="max-h-[420px] space-y-3 overflow-y-auto pr-1">
            {availableProducts.length > 0 ? (
              availableProducts.map((product) => {
                const quantity = quantities[product.ID] || 0;

                return (
                  <div
                    key={product.ID}
                    className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 p-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-800">
                        {product.name}
                      </p>

                      <p className="mt-1 text-sm text-orange-600">
                        {formatRupiah(Number(product.price) || 0)}
                      </p>

                      <span className="mt-1 inline-block rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-500">
                        {product.type}
                      </span>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      {quantity > 0 && (
                        <>
                          <button
                            type="button"
                            onClick={() => updateQuantity(product.ID, -1)}
                            className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100"
                            aria-label={`Kurangi ${product.name}`}
                          >
                            <Minus size={15} />
                          </button>

                          <span className="w-5 text-center text-sm font-semibold">
                            {quantity}
                          </span>
                        </>
                      )}

                      <button
                        type="button"
                        onClick={() => updateQuantity(product.ID, 1)}
                        className="rounded-lg bg-orange-500 p-2 text-white hover:bg-orange-600"
                        aria-label={`Tambah ${product.name}`}
                      >
                        <Plus size={15} />
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
                Belum ada produk makanan atau minuman.
              </p>
            )}
          </div>
        </section>

        {/* Order Summary */}
        <section className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="mb-4 flex items-center gap-2">
            <ShoppingCart size={19} className="text-orange-500" />
            <h3 className="font-semibold text-slate-800">Ringkasan Order</h3>

            <span className="ml-auto rounded-full bg-orange-100 px-2 py-1 text-xs font-semibold text-orange-700">
              {cartItems.reduce((sum, item) => sum + item.quantity, 0)} item
            </span>
          </div>

          <div className="max-h-[300px] space-y-3 overflow-y-auto">
            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <div
                  key={item.product.ID}
                  className="flex items-start justify-between gap-3 border-b border-slate-200 pb-3"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-800">
                      {item.product.name}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {item.quantity} × {formatRupiah(item.price)}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <span className="text-sm font-semibold text-slate-800">
                      {formatRupiah(item.subtotal)}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        setQuantities((previous) => ({
                          ...previous,
                          [item.product.ID]: 0,
                        }))
                      }
                      className="rounded-md p-1 text-red-500 hover:bg-red-50"
                      aria-label={`Hapus ${item.product.name}`}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-10 text-center">
                <ShoppingCart
                  size={30}
                  className="mx-auto mb-2 text-slate-300"
                />
                <p className="text-sm text-slate-500">
                  Belum ada produk dipilih
                </p>
              </div>
            )}
          </div>

          <div className="mt-5 border-t border-slate-200 pt-4">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-slate-500">Total Pembayaran</span>

              <span className="text-xl font-bold text-orange-600">
                {formatRupiah(total)}
              </span>
            </div>
          </div>
        </section>
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          disabled={loadingCreate}
          className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
        >
          Batal
        </button>

        <button
          type="submit"
          disabled={loadingCreate || cartItems.length === 0}
          className="flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loadingCreate && <Loader size={17} className="animate-spin" />}

          {loadingCreate ? "Menyimpan Order..." : "Simpan Order"}
        </button>
      </div>
    </form>
  );
};

export default OrderForm;
