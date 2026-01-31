import React, { useState } from "react";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { Select } from "../components/Select";
import { apiFetch } from "../utils/api";
import { useCart } from "../contexts/CartContext";
import { useToast } from "../contexts/ToastContext";

const steps = ["Address", "Shipping", "Payment"] as const;

export const Checkout: React.FC = () => {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: "",
    address: "",
    city: "",
    shipping: "Premium",
    payment: "Stripe"
  });
  const { items } = useCart();
  const { notify } = useToast();

  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const handleOrder = async () => {
    try {
      await apiFetch("/api/orders", {
        method: "POST",
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.product.id,
            variantId: item.product.variants?.[0]?.id,
            quantity: item.quantity
          })),
          shippingAddress: `${form.name}, ${form.address}, ${form.city}`,
          shippingMethod: form.shipping,
          paymentMethod: form.payment
        })
      });
      notify("Order placed successfully", "success");
    } catch (error) {
      notify("Order failed. Please try again.", "error");
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-12">
      <h1 className="text-3xl font-semibold">Checkout</h1>
      <div className="mt-6 flex items-center gap-4">
        {steps.map((label, index) => (
          <div key={label} className="flex items-center gap-3 text-sm">
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-full border ${
                step >= index
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-200 text-slate-400"
              }`}
            >
              {index + 1}
            </span>
            <span className={step >= index ? "text-slate-900" : "text-slate-400"}>
              {label}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-card dark:border-slate-800 dark:bg-slate-900">
        {step === 0 && (
          <div className="grid gap-6">
            <Input
              label="Full name"
              value={form.name}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, name: event.target.value }))
              }
            />
            <Input
              label="Address"
              value={form.address}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, address: event.target.value }))
              }
            />
            <Input
              label="City"
              value={form.city}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, city: event.target.value }))
              }
            />
          </div>
        )}
        {step === 1 && (
          <div className="grid gap-6">
            <Select
              label="Shipping method"
              value={form.shipping}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, shipping: event.target.value }))
              }
            >
              <option>Premium</option>
              <option>Express</option>
              <option>Standard</option>
            </Select>
            <p className="text-sm text-slate-500">
              Premium shipping includes white-glove handling and tracking.
            </p>
          </div>
        )}
        {step === 2 && (
          <div className="grid gap-6">
            <Select
              label="Payment method"
              value={form.payment}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, payment: event.target.value }))
              }
            >
              <option>Stripe</option>
              <option>Apple Pay</option>
              <option>PayPal</option>
            </Select>
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800">
              Stripe elements placeholder. Add your keys to enable payments.
            </div>
          </div>
        )}
        <div className="mt-8 flex items-center justify-between">
          <Button
            variant="secondary"
            onClick={() => setStep((prev) => Math.max(0, prev - 1))}
            disabled={step === 0}
          >
            Back
          </Button>
          {step < steps.length - 1 ? (
            <Button onClick={() => setStep((prev) => prev + 1)}>Continue</Button>
          ) : (
            <Button onClick={handleOrder}>Place order · ${total.toFixed(2)}</Button>
          )}
        </div>
      </div>
    </div>
  );
};
