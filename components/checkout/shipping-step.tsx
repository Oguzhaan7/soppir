"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addressSchema } from "@/lib/validations/checkout";
import { CheckoutFormData } from "@/types/checkout.types";
import {
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Card,
  CardContent,
} from "@/components/ui";
import { Icons } from "@/components/common/icons";
import { z } from "zod";

type AddressFormData = z.infer<typeof addressSchema>;
type ShippingMethodType = "standard" | "express" | "overnight";

interface ShippingStepProps {
  formData: Partial<CheckoutFormData>;
  updateFormData: (data: Partial<CheckoutFormData>) => void;
  onNext: () => void;
}

export const ShippingStep = ({
  formData,
  updateFormData,
  onNext,
}: ShippingStepProps) => {
  const [shippingMethod, setShippingMethod] = useState<ShippingMethodType>(
    formData.shippingMethod || "standard"
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: formData.shippingAddress || {},
    mode: "onChange",
  });

  const onSubmit = (data: AddressFormData) => {
    updateFormData({
      shippingAddress: data,
      shippingMethod,
    });
    onNext();
  };

  const shippingOptions = [
    {
      id: "standard" as const,
      name: "Standard Shipping",
      description: "5-7 business days",
      price: 9.99,
      icon: Icons.truck,
    },
    {
      id: "express" as const,
      name: "Express Shipping",
      description: "2-3 business days",
      price: 19.99,
      icon: Icons.truck,
    },
    {
      id: "overnight" as const,
      name: "Overnight Shipping",
      description: "Next business day",
      price: 39.99,
      icon: Icons.truck,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Shipping Information
        </h2>
        <p className="text-gray-600">
          Enter your shipping address and select delivery method
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              {...register("firstName")}
              className={errors.firstName ? "border-red-500" : ""}
            />
            {errors.firstName && (
              <p className="text-sm text-red-500 mt-1">
                {errors.firstName.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              {...register("lastName")}
              className={errors.lastName ? "border-red-500" : ""}
            />
            {errors.lastName && (
              <p className="text-sm text-red-500 mt-1">
                {errors.lastName.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              {...register("phone")}
              className={errors.phone ? "border-red-500" : ""}
            />
            {errors.phone && (
              <p className="text-sm text-red-500 mt-1">
                {errors.phone.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            {...register("address")}
            className={errors.address ? "border-red-500" : ""}
          />
          {errors.address && (
            <p className="text-sm text-red-500 mt-1">
              {errors.address.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              {...register("city")}
              className={errors.city ? "border-red-500" : ""}
            />
            {errors.city && (
              <p className="text-sm text-red-500 mt-1">{errors.city.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="state">State</Label>
            <Input
              id="state"
              {...register("state")}
              className={errors.state ? "border-red-500" : ""}
            />
            {errors.state && (
              <p className="text-sm text-red-500 mt-1">
                {errors.state.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="zipCode">ZIP Code</Label>
            <Input
              id="zipCode"
              {...register("zipCode")}
              className={errors.zipCode ? "border-red-500" : ""}
            />
            {errors.zipCode && (
              <p className="text-sm text-red-500 mt-1">
                {errors.zipCode.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="country">Country</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="US">United States</SelectItem>
              <SelectItem value="CA">Canada</SelectItem>
              <SelectItem value="GB">United Kingdom</SelectItem>
            </SelectContent>
          </Select>
          <input type="hidden" {...register("country")} value="US" />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Shipping Method</h3>
          <div className="grid grid-cols-1 gap-3">
            {shippingOptions.map((option) => (
              <Card
                key={option.id}
                className={`cursor-pointer transition-colors ${
                  shippingMethod === option.id
                    ? "border-blue-500 ring-1 ring-blue-500"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setShippingMethod(option.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="shipping"
                      value={option.id}
                      checked={shippingMethod === option.id}
                      onChange={(e) =>
                        setShippingMethod(e.target.value as ShippingMethodType)
                      }
                      className="text-blue-600"
                    />
                    <option.icon className="w-5 h-5 text-gray-400" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900">
                          {option.name}
                        </h4>
                        <span className="font-medium text-gray-900">
                          ${option.price.toFixed(2)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        {option.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={!isValid} className="px-8">
            Continue to Payment
            <Icons.arrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </form>
    </div>
  );
};
