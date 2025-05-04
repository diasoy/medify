import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

const Show = ({ product }) => {
  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight">Product Details</h2>
      }
    >
      <Head title={product.title} />
      <div className="py-12">
        <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
          <div className="shadow-md rounded-lg p-6">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/2">
                <img
                  src={`/storage/${product.linkImage}`}
                  alt={product.title}
                  className="w-full h-64 object-cover rounded-md"
                />
              </div>
              <div className="md:w-1/2 md:pl-6 mt-4 md:mt-0">
                <h1 className="text-2xl font-bold mb-4">{product.title}</h1>
                <p className="mb-2">
                  <strong>Category:</strong> {product.category?.name || "N/A"}
                </p>
                <p className="mb-2">
                  <strong>Price:</strong> Rp {product.price} ,-
                </p>
                <p className="mb-4">
                  <strong>Description:</strong> {product.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
};

export default Show;
