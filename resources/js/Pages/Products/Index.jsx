import React from "react";
import { usePage } from "@inertiajs/react";
import ProductsAdmin from "@/Admin/ProductsAdmin";
import ProductsCustomer from "@/Customer/ProductsCustomer";

export default function Index({ products, categories }) {
  const { auth } = usePage().props;

  if (auth.user.role === "admin") {
    return <ProductsAdmin products={products} />;
  }

  if (auth.user.role === "customer") {
    return <ProductsCustomer products={products} categories={categories} />;
  }

  return <div>Unauthorized</div>;
}
