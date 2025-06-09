export interface CheckoutStep {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface CheckoutFormData {
  shippingAddress: ShippingAddress;
  billingAddress?: ShippingAddress;
  sameAsBilling: boolean;
  shippingMethod: "standard" | "express" | "overnight";
  paymentMethod: "stripe";
}
