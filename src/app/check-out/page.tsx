"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCart } from "../../../utils/cartUtils";
import { Loader } from "@/components/loader";
import { CheckoutPage } from "@/components/ui/checkOutPage";
import { CartItem } from "../types/product";

export default function Checkout() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const items = getCart();
    setCartItems(items);
    setIsLoading(false);

    if (items.length === 0) {
      router.push("/products");
    }
  }, [router]);

  if (isLoading) {
    return <Loader />;
  }

  if (cartItems.length === 0) {
    return null;
  }

  return <CheckoutPage />;
}
