"use client";

import { useState, useEffect } from "react";
import {
  Button,
  Badge,
  Avatar,
  AvatarFallback,
  AvatarImage,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Separator,
} from "@/components/ui";
import { Icons } from "@/components/common/icons";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useSupabase } from "@/providers/supabase-provider";
import { useCategoryHierarchy } from "@/hooks/useCategories";
import { useCartStore } from "@/stores/cart-store";
import { useProductVariant } from "@/hooks/useProducts";
import React from "react";
import { useCartCount, useCartItems, useRemoveFromCart } from "@/hooks/useCart";

const staticNavigation = [{ name: "Home", href: "/" }];

interface CartItemProps {
  variantId: number;
  quantity: number;
  onRemove: () => void;
}

const CartItemPreview: React.FC<CartItemProps> = ({
  variantId,
  quantity,
  onRemove,
}) => {
  const { data: variant, isLoading } = useProductVariant(variantId);

  if (isLoading) {
    return (
      <div className="flex items-center gap-3 animate-pulse">
        <div className="w-12 h-12 bg-gray-200 rounded-md flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="h-4 bg-gray-200 rounded mb-1" />
          <div className="h-3 bg-gray-200 rounded w-2/3" />
        </div>
        <div className="w-6 h-6 bg-gray-200 rounded" />
      </div>
    );
  }

  if (!variant) {
    return (
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gray-100 rounded-md flex-shrink-0 flex items-center justify-center">
          <Icons.shoe className="w-6 h-6 text-gray-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">
            Product (ID: {variantId})
          </p>
          <p className="text-xs text-muted-foreground">
            Qty: {quantity} • $0.00
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 hover:bg-red-50 hover:text-red-600"
          onClick={onRemove}
        >
          <Icons.x className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  const productName = variant.product?.name || "Product";
  const price = variant.price_offset
    ? (variant.product?.base_price || 0) + variant.price_offset
    : variant.product?.base_price || 0;
  const imageUrl = variant.product?.product_images?.[0]?.image_url;
  const size = variant.size;
  const color = variant.color_name;

  return (
    <div className="flex items-center gap-3 group">
      <div className="w-12 h-12 bg-gray-100 rounded-md flex-shrink-0 flex items-center justify-center relative overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={productName}
            width={48}
            height={48}
            className="w-full h-full object-cover rounded-md"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Icons.shoe className="w-6 h-6 text-gray-400" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate" title={productName}>
          {productName}
        </p>
        <p className="text-xs text-muted-foreground">
          {size && `Size: ${size} • `}
          {color && `Color: ${color} • `}
          Qty: {quantity} • ${price.toFixed(2)}
        </p>
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:text-red-600"
        onClick={onRemove}
      >
        <Icons.x className="h-4 w-4" />
      </Button>
    </div>
  );
};

export const ShopHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { user, supabase } = useSupabase();
  const { data: categories, isLoading: categoriesLoading } =
    useCategoryHierarchy();

  const guestItems = useCartStore((state) => state.getGuestItems());
  const guestItemCount = useCartStore((state) => state.getGuestItemCount());
  const removeGuestItem = useCartStore((state) => state.removeGuestItem);

  const { data: userCartCount = 0 } = useCartCount();
  const { data: userCartItems = [] } = useCartItems();
  const removeFromCartMutation = useRemoveFromCart();

  const totalItems = user ? userCartCount : guestItemCount;
  const displayItems = user ? userCartItems : guestItems;

  const handleRemoveItem = (itemId?: number, variantId?: number) => {
    if (user && itemId) {
      removeFromCartMutation.mutate({ itemId });
    } else if (!user && variantId) {
      removeGuestItem(variantId);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [mounted]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (!mounted) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <Icons.shoe className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold text-gray-900">Soppir</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-9 h-9 bg-gray-100 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-200",
        isScrolled ? "bg-white/95 backdrop-blur-md shadow-md" : "bg-white"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Icons.shoe className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-gray-900">Soppir</span>
            </Link>

            <div className="hidden lg:flex relative">
              <NavigationMenu>
                <NavigationMenuList>
                  {staticNavigation.map((item) => (
                    <NavigationMenuItem key={item.name}>
                      <NavigationMenuLink
                        href={item.href}
                        className={cn(
                          navigationMenuTriggerStyle(),
                          "bg-transparent hover:bg-accent/50"
                        )}
                      >
                        {item.name}
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  ))}

                  {!categoriesLoading &&
                    categories?.map((category) =>
                      category.children && category.children.length > 0 ? (
                        <NavigationMenuItem key={category.id}>
                          <NavigationMenuTrigger className="bg-transparent hover:bg-accent/50">
                            {category.name}
                          </NavigationMenuTrigger>
                          <NavigationMenuContent>
                            <div className="w-[500px] p-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2 mb-2">
                                  <NavigationMenuLink
                                    href={`/category/${category.slug}`}
                                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground border border-border"
                                  >
                                    <div className="text-sm font-medium leading-none">
                                      All {category.name}
                                    </div>
                                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                      Browse all items in {category.name}
                                    </p>
                                  </NavigationMenuLink>
                                </div>
                                {category.children.map((subCategory) => (
                                  <NavigationMenuLink
                                    key={subCategory.id}
                                    href={`/category/${subCategory.slug}`}
                                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                  >
                                    <div className="text-sm font-medium leading-none">
                                      {subCategory.name}
                                    </div>
                                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                      {subCategory.description ||
                                        `Shop ${subCategory.name}`}
                                    </p>
                                  </NavigationMenuLink>
                                ))}
                              </div>
                            </div>
                          </NavigationMenuContent>
                        </NavigationMenuItem>
                      ) : (
                        <NavigationMenuItem key={category.id}>
                          <NavigationMenuLink
                            href={`/category/${category.slug}`}
                            className={cn(
                              navigationMenuTriggerStyle(),
                              "bg-transparent hover:bg-accent/50"
                            )}
                          >
                            {category.name}
                          </NavigationMenuLink>
                        </NavigationMenuItem>
                      )
                    )}
                </NavigationMenuList>
                <NavigationMenuViewport className="origin-top-center relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 md:w-[var(--radix-navigation-menu-viewport-width)]" />
              </NavigationMenu>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="hidden md:flex">
              <Icons.search className="w-4 h-4 mr-2" />
              Search
            </Button>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={user?.user_metadata?.avatar_url} />
                      <AvatarFallback className="text-xs">
                        {user?.user_metadata?.full_name?.[0] ||
                          user?.email?.[0] ||
                          "U"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:inline">
                      {user?.user_metadata?.full_name?.split(" ")[0] ||
                        "Account"}
                    </span>
                    <Icons.chevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">
                      {user?.user_metadata?.full_name || "User"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <Icons.user className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/orders">
                      <Icons.shoppingBag className="mr-2 h-4 w-4" />
                      Orders
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/wishlist">
                      <Icons.heart className="mr-2 h-4 w-4" />
                      Wishlist
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <Icons.logout className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </div>
            )}

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="relative">
                  <Icons.shoppingBag className="w-5 h-5" />
                  {totalItems > 0 && (
                    <Badge
                      className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center"
                      variant="destructive"
                    >
                      {totalItems > 99 ? "99+" : totalItems}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="end">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">Shopping Cart</h4>
                    {totalItems > 0 && (
                      <span className="text-sm text-muted-foreground">
                        {totalItems} item{totalItems !== 1 ? "s" : ""}
                      </span>
                    )}
                  </div>

                  {totalItems === 0 ? (
                    <div className="text-center py-8">
                      <Icons.shoppingBag className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground mb-4">
                        Your cart is empty
                      </p>
                      <Link href="/">
                        <Button size="sm">Continue Shopping</Button>
                      </Link>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-3 max-h-60 overflow-y-auto">
                        {displayItems && displayItems.length > 0 ? (
                          displayItems.slice(0, 5).map((item) => {
                            if (user) {
                              // User cart item - has 'id' and 'variant_id'
                              const userItem = item as {
                                id: number;
                                variant_id: number;
                                quantity: number;
                              };
                              return (
                                <CartItemPreview
                                  key={userItem.id}
                                  variantId={userItem.variant_id}
                                  quantity={userItem.quantity}
                                  onRemove={() =>
                                    handleRemoveItem(userItem.id, undefined)
                                  }
                                />
                              );
                            } else {
                              // Guest cart item - has 'variantId' and 'addedAt'
                              const guestItem = item as {
                                variantId: number;
                                quantity: number;
                                addedAt: string;
                              };
                              return (
                                <CartItemPreview
                                  key={`${guestItem.variantId}-${guestItem.addedAt}`}
                                  variantId={guestItem.variantId}
                                  quantity={guestItem.quantity}
                                  onRemove={() =>
                                    handleRemoveItem(
                                      undefined,
                                      guestItem.variantId
                                    )
                                  }
                                />
                              );
                            }
                          })
                        ) : (
                          <div className="text-center py-4">
                            <p className="text-sm text-muted-foreground">
                              No items in cart
                            </p>
                          </div>
                        )}

                        {displayItems && displayItems.length > 5 && (
                          <div className="text-center py-2">
                            <p className="text-xs text-muted-foreground">
                              +{displayItems.length - 5} more item
                              {displayItems.length - 5 !== 1 ? "s" : ""}
                            </p>
                          </div>
                        )}
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        <Link href="/checkout" className="w-full">
                          <Button size="sm" className="w-full">
                            Checkout ({totalItems} item
                            {totalItems !== 1 ? "s" : ""})
                          </Button>
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              </PopoverContent>
            </Popover>

            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Icons.menu className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="lg:hidden border-t bg-white">
            <nav className="py-4 space-y-2">
              {staticNavigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-primary transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              {!categoriesLoading &&
                categories?.map((category) => (
                  <div key={category.id}>
                    <Link
                      href={`/category/${category.slug}`}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-primary transition-colors font-medium"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {category.name}
                    </Link>
                    {category.children && category.children.length > 0 && (
                      <div className="ml-4">
                        {category.children.map((subCategory) => (
                          <Link
                            key={subCategory.id}
                            href={`/category/${subCategory.slug}`}
                            className="block px-4 py-1 text-sm text-gray-600 hover:bg-gray-50 hover:text-primary transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {subCategory.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
