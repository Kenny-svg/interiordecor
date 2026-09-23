import type { Metadata } from "next";
import { CheckoutForm } from "@/app/checkout/CheckoutForm";
import { Container, Eyebrow } from "@/components/ui";

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <Container className="py-12 sm:py-16">
      <Eyebrow>Checkout</Eyebrow>
      <h1 className="mt-4 max-w-2xl font-display text-5xl text-ink sm:text-6xl">
        Place the order.
      </h1>
      <p className="mt-6 max-w-xl text-lg leading-8 text-ink-soft">
        We read it as a letter. Availability, delivery in Lagos, and how to
        settle in naira come after — not on this page.
      </p>
      <div className="mt-12">
        <CheckoutForm />
      </div>
    </Container>
  );
}
