# Product & Engineering Roadmap - neon-tasarim-dunyasi

This roadmap outlines the milestones for developing the Mudita LED Neon customizer into a fully transactional e-commerce platform.

---

## Milestone 1: Editor Polish & Canvas Enhancement (Weeks 1-2)

- **Goal**: Perfect the Canvas interactions and responsive UI.
- **Tasks**:
  - Implement direct drag-and-resize handles on the selected canvas layers.
  - Implement dynamic canvas alignment guides (smart guidelines for centering and snapping layers relative to each other).
  - Add user room background upload (drag-and-drop a photo of your wall to preview the neon sign).
  - Verify and improve mobile touch-drag capabilities for layers.

## Milestone 2: E-commerce Integration & Checkout (Weeks 3-4)

- **Goal**: Enable seamless orders and checkouts.
- **Tasks**:
  - Implement cart synchronization with LocalStorage/Session.
  - Integrate a reliable local payment gateway (e.g. iyzico API for Turkish credit cards).
  - Create order management server routes using TanStack Start's Nitro backend.
  - Set up email notifications for new orders and designer-approved preview confirmations.

## Milestone 3: Security & Performance Audits (Week 5)

- **Goal**: Guarantee product safety and ultra-fast page loads.
- **Tasks**:
  - Perform deep testing on SVG sanitization to prevent XSS.
  - Optimize font-loading strategies (local caching or Google Fonts preloading).
  - Set up CDN caching strategies on Cloudflare for faster edge execution.
  - Configure staging and production environments on Cloudflare.

## Milestone 4: Admin Dashboard & Order Previews (Week 6)

- **Goal**: Operations backend.
- **Tasks**:
  - Simple secure admin dashboard to view orders.
  - Export custom designs directly to vector SVG/PDF formats suitable for production/laser-cut machinery.
  - Allow admin to upload "final design confirmation preview" for the user to approve.
