# Integration Notes

## Current Status

The app currently has client-side placeholders for commercial integrations. The UI presents quote, checkout, WhatsApp, and contact flows, but real payment processing, file uploads, email sending, and order persistence are not wired.

Provider stubs live in `src/lib/integrations/index.ts`.

## Payment Providers

Prepared stubs:

- `iyzico.createCheckout`
- `paytr.createIframeToken`
- `param.createPayment`
- `stripe.createCheckoutSession`

Implementation requirements:

- Create checkout sessions on the server.
- Validate the cart/config server-side before charging.
- Store the order before redirecting or returning a payment token.
- Verify provider webhooks with server-side secrets.
- Never expose secret keys in client bundles.

## Quote Requests

Prepared stubs:

- `whatsappApi.notifyOrder`
- `emailApi.sendQuote`
- `supabaseStub.saveOrder`

The quote request type is `QuoteRequest` in `src/lib/types.ts`.

Recommended production flow:

1. Validate customer fields and design config server-side.
2. Persist the quote request and generated price breakdown.
3. Upload files to controlled object storage.
4. Notify staff by email, dashboard, or WhatsApp API.
5. Return a confirmation id to the customer.

## File Uploads

`/yukle` accepts `.png`, `.jpg`, `.jpeg`, `.svg`, and `.pdf` in the browser form and rejects files over 10 MB. The current form does not upload files to a server.

Before enabling real uploads:

- Add server-side MIME and extension validation.
- Scan or sanitize uploaded assets.
- Store files outside the public app bundle.
- Attach files to quote/order records.
- Define retention and deletion rules for customer files.

## WhatsApp

The app currently uses manual WhatsApp links for customer contact. If a WhatsApp Business API integration is added, keep message sending on the server and store provider delivery ids with the order or quote.

## Email

Email sending should run server-side. Include enough structured data for staff to reproduce a design:

- Customer fields.
- Price breakdown.
- Serialized design config.
- Uploaded file links.
- Customer notes.

## Persistence

Cart storage is local only. Production order and quote persistence should use a backend database or managed service. Avoid treating `localStorage` as a source of truth for payment, order, or fulfillment data.

