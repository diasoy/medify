import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import Pagination from "@/Components/Pagination";
import AlertDelete from "@/Components/AlertDelete";
import formatRupiah from "@/utils/formatRupiah";

const ProductsAdmin = ({ products }) => {
  const [showAlert, setShowAlert] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

  const handleDeleteClick = (productId) => {
    setSelectedProductId(productId);
    setShowAlert(true);
  };

  const handlePageChange = (url) => {
    router.get(url, {}, { preserveScroll: true });
  };

  const handleConfirmDelete = () => {
    if (selectedProductId) {
      router.delete(route("products.destroy", selectedProductId), {
        preserveScroll: true,
      });
    }
    setShowAlert(false);
    setSelectedProductId(null);
  };

  const handleCancelDelete = () => {
    setShowAlert(false);
    setSelectedProductId(null);
  };

  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight">
          Product Management
        </h2>
      }
    >
      <Head title="Products" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="flex justify-end mb-4">
            <Link href={route("products.create")} className="btn btn-primary">
              Add New Product
            </Link>
          </div>
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Gambar</th>
                <th>Title</th>
                <th>Category</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products?.data?.length > 0 ? (
                products.data.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <img
                        src={`/storage/${product.linkImage}`}
                        alt={product.title}
                        className="w-16 h-16 object-cover"
                      />
                    </td>
                    <td>{product.title}</td>
                    <td>{product.category?.name || "N/A"}</td>
                    <td>{formatRupiah(product.price)}</td>
                    <td className="flex gap-2">
                      <Link
                        href={route("products.edit", product.id)}
                        className="btn btn-warning"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteClick(product.id)}
                        className="btn btn-error"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <Pagination links={products.links} onPageChange={handlePageChange} />
        </div>
      </div>

      <AlertDelete
        description="Are you sure you want to delete this product?"
        isOpen={showAlert}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </AuthenticatedLayout>
  );
};

export default ProductsAdmin;
