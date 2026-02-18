import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-01-28.clover",
    typescript: true,
});

/** Precio mensual del plan Standard (crear en Stripe Dashboard y copiar aquí) */
export const STRIPE_STANDARD_PRICE_ID =
    process.env.STRIPE_STANDARD_PRICE_ID ?? "price_PLACEHOLDER";
