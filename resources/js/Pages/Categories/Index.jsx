import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import { MdDelete, MdEdit, MdAdd } from "react-icons/md";
import Pagination from "@/Components/Pagination";
import AlertDelete from "@/Components/AlertDelete";
import { usePage } from "@inertiajs/react";
import NotFound from "@/Components/NotFound";
import { Link } from "@inertiajs/react";

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export default function Index({ categories }) {
  const { auth } = usePage().props;
  const user = auth?.user || {};

  const [showAlert, setShowAlert] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  const handlePageChange = (url) => {
    router.get(url, {}, { preserveScroll: true });
  };

  const handleDeleteClick = (categoryId) => {
    setSelectedCategoryId(categoryId);
    setShowAlert(true);
  };

  const handleConfirmDelete = () => {
    if (selectedCategoryId) {
      router.delete(route("categories.destroy", selectedCategoryId), {
        preserveScroll: true,
      });
    }
    setShowAlert(false);
    setSelectedCategoryId(null);
  };

  const handleCancelDelete = () => {
    setShowAlert(false);
    setSelectedCategoryId(null);
  };

  if (!user || user.role !== "admin") {
    return <NotFound />;
  }

  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight">
          Category Management
        </h2>
      }
    >
      <Head title="Category" />

      <div className="overflow-x-auto mt-6 max-w-7xl mx-auto">
        <div className="flex justify-end mb-4">
          <Link href={route("categories.create")} className="btn btn-primary">
            <MdAdd size={18} />
            Add New Category
          </Link>
        </div>

        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Name</th>
              <th>Created On</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories?.data?.length > 0 ? (
              categories.data.map((category) => (
                <tr key={category.id}>
                  <td>{category.name}</td>
                  <td>{formatDate(category.created_at)}</td>
                  <td className="flex gap-2 justify-center">
                    <Link
                      href={route("categories.edit", category.id)}
                      className="btn btn-warning"
                    >
                      <MdEdit />
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDeleteClick(category.id)}
                      className="btn btn-error"
                    >
                      <MdDelete />
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center py-4">
                  No categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {categories?.links && categories.links.length > 3 && (
          <div className="mt-4">
            <Pagination
              links={categories.links}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>

      <AlertDelete
        description="Are you sure you want to delete this category? Deleting this category will also remove all products associated with it."
        isOpen={showAlert}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </AuthenticatedLayout>
  );
}
