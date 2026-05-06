// Future integration stubs — wire real clients here when backend is ready.
// Each export keeps an API shape close to the real provider so swapping is a drop-in.

import type { NeonDesignConfig, QuoteRequest } from "@/lib/types";

export const iyzico = {
  // TODO: createCheckout(payload) → { token, url }
  async createCheckout(_payload: { amount: number; config: NeonDesignConfig }) {
    return { ok: false, reason: "not-implemented" as const };
  },
};

export const paytr = {
  // TODO: createIframeToken(...)
  async createIframeToken(_payload: { amount: number }) {
    return { ok: false, reason: "not-implemented" as const };
  },
};

export const param = {
  async createPayment(_payload: { amount: number }) {
    return { ok: false, reason: "not-implemented" as const };
  },
};

export const stripe = {
  async createCheckoutSession(_payload: { amount: number; currency: string }) {
    return { ok: false, reason: "not-implemented" as const };
  },
};

export const whatsappApi = {
  // Manual flow — wa.me link generated client side; this stub is for server-side notification later.
  async notifyOrder(_q: QuoteRequest) {
    return { ok: false };
  },
};

export const emailApi = {
  async sendQuote(_q: QuoteRequest) {
    return { ok: false };
  },
};

export const supabaseStub = {
  // TODO: real client when Lovable Cloud is enabled.
  async saveOrder(_q: QuoteRequest) {
    return { ok: false };
  },
};
