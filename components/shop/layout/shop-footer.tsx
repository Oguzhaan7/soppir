import { Icons } from "@/components/common/icons";
import Link from "next/link";

export const ShopFooter = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Icons.shoe className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">Soppir</span>
            </div>
            <p className="text-gray-400 text-sm">
              Your premium destination for quality footwear. Step into
              excellence with our curated collection.
            </p>
            <div className="flex space-x-4">
              <Link
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Icons.facebook className="w-5 h-5" />
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Icons.twitter className="w-5 h-5" />
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Icons.instagram className="w-5 h-5" />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Shop</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/shop"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?category=men"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Men&apos;s Shoes
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?category=women"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Women&apos;s Shoes
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?category=kids"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Kids&apos; Shoes
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?sale=true"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Sale
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/contact"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link
                  href="/returns"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Returns
                </Link>
              </li>
              <li>
                <Link
                  href="/size-guide"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Size Guide
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Account</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/profile"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  My Profile
                </Link>
              </li>
              <li>
                <Link
                  href="/orders"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Order History
                </Link>
              </li>
              <li>
                <Link
                  href="/wishlist"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Wishlist
                </Link>
              </li>
              <li>
                <Link
                  href="/address"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Addresses
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <Icons.truck className="w-4 h-4" />
                <span>Free Shipping</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icons.return className="w-4 h-4" />
                <span>Easy Returns</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icons.shield className="w-4 h-4" />
                <span>Secure Payment</span>
              </div>
            </div>

            <div className="text-sm text-gray-400">
              © 2025 Soppir. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
