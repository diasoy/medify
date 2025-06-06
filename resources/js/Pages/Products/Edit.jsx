import React, { useState, useRef } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";

export default function Edit({ product, categories }) {
  const [form, setForm] = useState({
    title: product.title,
    slug: product.slug,
    price: product.price,
    description: product.description,
    category_id: product.category_id,
    linkImage: null,
  });
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(
    product.linkImage ? `/storage/${product.linkImage}` : null
  );
  const fileInputRef = useRef();

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "linkImage" && files.length > 0) {
      const file = files[0];
      setForm({ ...form, linkImage: file });
      setImagePreview(URL.createObjectURL(file));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.keys(form).forEach((key) => {
      if (form[key] !== null) {
        formData.append(key, form[key]);
      }
    });

    formData.append("_method", "PUT");

    router.post(route("products.update", product.id), formData, {
      forceFormData: true,
      onError: (err) => setErrors(err),
      preserveScroll: true,
    });
  };

  return (
    <AuthenticatedLayout header={<h2>Edit Product</h2>}>
      <Head title="Edit Product" />
      <form onSubmit={handleSubmit} className="space-y-4 max-w-4xl mx-auto">
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className={`input input-bordered w-full ${
              errors.title ? "input-error" : ""
            }`}
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium">Slug</label>
          <input
            type="text"
            name="slug"
            value={form.slug}
            onChange={handleChange}
            className={`input input-bordered w-full ${
              errors.slug ? "input-error" : ""
            }`}
          />
          {errors.slug && (
            <p className="text-red-500 text-sm mt-1">{errors.slug}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium">Price</label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            className={`input input-bordered w-full ${
              errors.price ? "input-error" : ""
            }`}
          />
          {errors.price && (
            <p className="text-red-500 text-sm mt-1">{errors.price}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className={`textarea textarea-bordered w-full ${
              errors.description ? "input-error" : ""
            }`}
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium">Category</label>
          <select
            name="category_id"
            value={form.category_id}
            onChange={handleChange}
            className={`select select-bordered w-full ${
              errors.category_id ? "input-error" : ""
            }`}
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.category_id && (
            <p className="text-red-500 text-sm mt-1">{errors.category_id}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Product Image</label>
          {imagePreview && (
            <div className="mt-2 mb-4">
              <p className="text-sm text-gray-500 mb-2">Current Image:</p>
              <img
                src={imagePreview}
                alt="Product preview"
                className="w-40 h-40 object-cover border rounded-md"
              />
            </div>
          )}
          <input
            type="file"
            name="linkImage"
            onChange={handleChange}
            ref={fileInputRef}
            className={`file-input file-input-bordered w-full mt-2 ${
              errors.linkImage ? "file-input-error" : ""
            }`}
            accept="image/jpeg,image/png,image/jpg"
          />
          <p className="text-xs text-gray-500 mt-1">
            Supported formats: JPG, JPEG, PNG (max 1MB)
          </p>
          {errors.linkImage && (
            <p className="text-red-500 text-sm mt-1">{errors.linkImage}</p>
          )}
        </div>

        <div className="flex gap-4 mt-6">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => router.get(route("products.index"))}
          >
            Back
          </button>
          <button type="submit" className="btn btn-primary">
            Update
          </button>
        </div>
      </form>
    </AuthenticatedLayout>
  );
}
