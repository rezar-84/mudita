
-- Lock down has_role EXECUTE to authenticated only (still needed by RLS policies)
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;

-- Admin-only maintenance policies for design_events (prune/correct logs)
CREATE POLICY "Admins can update design_events"
  ON public.design_events FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete design_events"
  ON public.design_events FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Admin-only update/delete for order_items
CREATE POLICY "Admins can update order_items"
  ON public.order_items FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete order_items"
  ON public.order_items FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Admin-only delete for orders
CREATE POLICY "Admins can delete orders"
  ON public.orders FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
