import type { CartItem } from "./product";

export interface OrderData {
  firstName: string;
  lastName: string;
  address: string;
  phone: string;
  email: string; // Changed from optional to required
  notes?: string;
  alternateAddress?: string;
  items: CartItem[];
  subtotal: number;
  total: number;
  Stattus: OrderStatus;
  orderNumber: string;
}

export type OrderStatus = "pending" | "processing" | "completed" | "cancelled";

export interface CheckoutFormData {
  firstName: string;
  lastName: string;
  address: string;
  phone: string;
  email: string; // Changed from optional to required
  notes?: string;
  useAlternateAddress: boolean;
  alternateAddress?: string;
}

export const ORDER_STATUS_FIELD = "Stattus";
