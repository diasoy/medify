import React, { useEffect, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, usePage, router } from "@inertiajs/react";
import formatRupiah from "@/utils/formatRupiah";
import useDebounce from "@/utils/useDebounce";
import Pagination from "@/Components/Pagination";

const ProductsCustomer = ({ products, categories }) => {
  const { props } = usePage();
  const [isInitialMount, setIsInitialMount] = useState(true);

  const initialCategoryId = props.ziggy?.query?.category_id || "";
  const initialSearch = props.ziggy?.query?.search || "";

  const { data, setData } = useForm({
    category_id: initialCategoryId,
    search: initialSearch,
  });

  const debouncedSearch = useDebounce(data.search, 500);

  // Modify the useEffect to prevent overriding pagination
  useEffect(() => {
    // Skip initial mount to prevent redirect when loading a page with parameters
    if (isInitialMount) {
      setIsInitialMount(false);
      return;
    }

    const params = {};

    if (debouncedSearch !== "") {
      params.search = debouncedSearch;
    }

    if (data.category_id !== "") {
      params.category_id = data.category_id;
    }

    // Preserve the current page when filtering
    if (props.ziggy?.query?.page) {
      params.page = 1; // Reset to page 1 when filters change
    }

    router.get(route("products.index"), params, {
      preserveState: true,
      replace: true,
    });
  }, [debouncedSearch, data.category_id]);

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setData("category_id", selectedCategory);
  };

  const handlePageChange = (url) => {
    // Extract just the pagination parameter from the URL
    const urlObj = new URL(url);
    const page = urlObj.searchParams.get("page");

    // Create parameters object with current filters
    const params = {
      page: page,
      search: data.search || undefined,
      category_id: data.category_id || undefined,
    };

    // Use visit instead of get to avoid interference with the useEffect
    router.visit(url, {
      data: {}, // No additional data needed
      preserveScroll: true,
      preserveState: true,
      replace: false, // Don't replace the history entry
    });
  };

  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight">Products Ready</h2>
      }
    >
      <Head title="Products" />
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
            <div className="w-full sm:w-1/2">
              <select
                className="select select-bordered w-full max-w-xs"
                value={data.category_id}
                onChange={handleCategoryChange}
              >
                <option value="">All Categories</option>
                {categories?.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-full sm:w-1/2">
              <input
                type="text"
                placeholder="Search products..."
                className="input input-bordered w-full max-w-xs"
                value={data.search}
                onChange={(e) => setData("search", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.data.length > 0 ? (
              products.data.map((product) => (
                <div key={product.id} className="card bg-base-100 shadow-md">
                  <figure>
                    <img
                      src={`/storage/${product.linkImage}`}
                      alt={product.title}
                      className="w-full h-48 object-cover"
                    />
                  </figure>
                  <div className="card-body">
                    <h2 className="card-title">{product.title}</h2>
                    <p className="text-sm text-gray-500">
                      {product.category?.name || "N/A"}
                    </p>
                    <p className="text-lg font-bold">
                      {formatRupiah(product.price.toString())}
                    </p>
                    <div className="flex w-full justify-between mt-4">
                      <button
                        className="btn btn-primary w-24"
                        onClick={() =>
                          router.visit(route("products.show", product.id))
                        }
                      >
                        View
                      </button>
                      <button
                        className="btn btn-success w-24"
                        onClick={() =>
                          router.post(route("cart.store"), {
                            product_id: product.id,
                            quantity: 1,
                          })
                        }
                      >
                        Buy
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center col-span-full">No products found.</p>
            )}
          </div>
          <Pagination links={products.links} onPageChange={handlePageChange} />
        </div>
      </div>
    </AuthenticatedLayout>
  );
};

export default ProductsCustomer;
