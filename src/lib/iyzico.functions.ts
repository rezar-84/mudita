import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";
import Iyzipay from "iyzipay";

// Initialize Iyzipay client
// Uses sandbox credentials by default if production env vars are not set
const getIyzipayInstance = () => {
  const apiKey = process.env.IYZICO_API_KEY || "sandbox-API_KEY";
  const secretKey = process.env.IYZICO_SECRET_KEY || "sandbox-SECRET_KEY";
  const baseUrl = process.env.IYZICO_BASE_URL || "https://sandbox-api.iyzipay.com";

  return new Iyzipay({
    apiKey: apiKey,
    secretKey: secretKey,
    uri: baseUrl,
  });
};

const iyzicoInitSchema = z.object({
  orderId: z.string().uuid(),
  totalPrice: z.number().min(1),
  callbackUrl: z.string().url(),
  buyer: z.object({
    id: z.string(),
    name: z.string(),
    surname: z.string(),
    email: z.string().email(),
    phone: z.string(),
    address: z.string(),
    city: z.string(),
    country: z.string().default("Turkey"),
    zipCode: z.string().optional(),
    ip: z.string().default("127.0.0.1"),
  }),
  items: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      category: z.string().default("Neon Sign"),
      price: z.number(),
    }),
  ),
});

export const iyzicoInitCheckoutForm = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => iyzicoInitSchema.parse(i))
  .handler(async ({ data }) => {
    const iyzipay = getIyzipayInstance();

    const requestBody = {
      locale: "tr",
      conversationId: data.orderId,
      price: data.totalPrice.toString(),
      paidPrice: data.totalPrice.toString(),
      currency: "TRY",
      basketId: data.orderId,
      paymentGroup: "PRODUCT",
      callbackUrl: data.callbackUrl,
      enabledInstallments: [1, 2, 3, 6, 9],
      buyer: {
        id: data.buyer.id,
        name: data.buyer.name,
        surname: data.buyer.surname,
        gsmNumber: data.buyer.phone.startsWith("+") ? data.buyer.phone : `+90${data.buyer.phone}`,
        email: data.buyer.email,
        identityNumber: "11111111111", // Default/mock TC No for iyzico requirements
        lastLoginDate: new Date().toISOString().slice(0, 19).replace("T", " "),
        registrationDate: new Date().toISOString().slice(0, 19).replace("T", " "),
        registrationAddress: data.buyer.address,
        ip: data.buyer.ip,
        city: data.buyer.city,
        country: data.buyer.country,
        zipCode: data.buyer.zipCode || "34000",
      },
      shippingAddress: {
        contactName: `${data.buyer.name} ${data.buyer.surname}`,
        city: data.buyer.city,
        country: data.buyer.country,
        address: data.buyer.address,
        zipCode: data.buyer.zipCode || "34000",
      },
      billingAddress: {
        contactName: `${data.buyer.name} ${data.buyer.surname}`,
        city: data.buyer.city,
        country: data.buyer.country,
        address: data.buyer.address,
        zipCode: data.buyer.zipCode || "34000",
      },
      basketItems: data.items.map((item) => ({
        id: item.id,
        name: item.name,
        category1: item.category,
        itemType: "PHYSICAL",
        price: item.price.toString(),
      })),
    };

    return new Promise<{
      token: string;
      checkoutFormContent: string;
      paymentPageUrl: string;
    }>((resolve, reject) => {
      iyzipay.checkoutFormInitialize.create(requestBody, (err: any, result: any) => {
        if (err) {
          console.error("[Iyzico Error]:", err);
          reject(new Error("Ödeme sistemi başlatılamadı."));
        } else if (result.status === "failure") {
          console.error("[Iyzico Failure]:", result);
          reject(new Error(result.errorMessage || "Ödeme işlemi başarısız."));
        } else {
          resolve({
            token: result.token,
            checkoutFormContent: result.checkoutFormContent,
            paymentPageUrl: result.paymentPageUrl,
          });
        }
      });
    });
  });

export const iyzicoRetrievePaymentResult = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({ token: z.string() }).parse(i))
  .handler(async ({ data }) => {
    const iyzipay = getIyzipayInstance();

    return new Promise<{
      paymentStatus: string;
      paymentId: string;
      orderId: string;
      paidPrice: string;
      installment: number;
    }>((resolve, reject) => {
      iyzipay.checkoutForm.retrieve({ token: data.token }, (err: any, result: any) => {
        if (err) {
          console.error("[Iyzico Error]:", err);
          reject(new Error("Ödeme sonucu doğrulanamadı."));
        } else if (result.status === "failure") {
          console.error("[Iyzico Failure]:", result);
          reject(new Error(result.errorMessage || "Ödeme doğrulama hatası."));
        } else {
          resolve({
            paymentStatus: result.paymentStatus, // 'SUCCESS' or others
            paymentId: result.paymentId,
            orderId: result.basketId,
            paidPrice: result.paidPrice,
            installment: result.installment,
          });
        }
      });
    });
  });
