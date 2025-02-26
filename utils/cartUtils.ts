import { CartItem, StrapiProduct } from "@/app/types/product";

export const addToCart = (product: StrapiProduct, quantity: number) => {
  const cart: CartItem[] = JSON.parse(localStorage.getItem("cart") || "[]");

  const existingItemIndex = cart.findIndex((item) => item.id === product.id);

  if (existingItemIndex > -1) {
    cart[existingItemIndex].quantity += quantity;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.pricing,
      quantity: quantity,
      image: product.image?.url || "/placeholder.svg",
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  // Dispatch a storage event to notify other components
  window.dispatchEvent(new Event("storage"));
};

export const getCart = (): CartItem[] => {
  return JSON.parse(localStorage.getItem("cart") || "[]");
};

export const updateCartItemQuantity = (id: number, quantity: number) => {
  const cart: CartItem[] = getCart();
  const itemIndex = cart.findIndex((item) => item.id === id);

  if (itemIndex > -1) {
    cart[itemIndex].quantity = quantity;
    if (quantity <= 0) {
      cart.splice(itemIndex, 1);
    }
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  // Dispatch a storage event to notify other components
  window.dispatchEvent(new Event("storage"));
};

export const removeFromCart = (id: number) => {
  const cart: CartItem[] = getCart();
  const updatedCart = cart.filter((item) => item.id !== id);
  localStorage.setItem("cart", JSON.stringify(updatedCart));
  // Dispatch a storage event to notify other components
  window.dispatchEvent(new Event("storage"));
};
