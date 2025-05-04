import React, { useState } from "react";
import { Head, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Create({ categories }) {
  const [form, setForm] = useState({
    title: "",
    slug: "",
    price: "",
    description: "",
    category_id: "",
    linkImage: null,
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "linkImage") {
      setForm({ ...form, [name]: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(form).forEach((key) => {
      formData.append(key, form[key]);
    });

    router.post(route("products.store"), formData, {
      onError: (err) => setErrors(err),
    });
  };

  return (
    <AuthenticatedLayout header={<h2>Create Product</h2>}>
      <Head title="Create Product" />
      <form
        onSubmit={handleSubmit}
        className="space-y-4 max-w-4xl mx-auto"
        encType="multipart/form-data"
      >
        <div>
          <label>Title</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            className="input input-bordered w-full"
          />
          {errors.title && <p className="text-red-500">{errors.title}</p>}
        </div>
        <div>
          <label>Slug</label>
          <input
            name="slug"
            value={form.slug}
            onChange={handleChange}
            className="input input-bordered w-full"
          />
          {errors.slug && <p className="text-red-500">{errors.slug}</p>}
        </div>
        <div>
          <label>Price</label>
          <input
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            className="input input-bordered w-full"
          />
          {errors.price && <p className="text-red-500">{errors.price}</p>}
        </div>
        <div>
          <label>Category</label>
          <select
            name="category_id"
            value={form.category_id}
            onChange={handleChange}
            className="select select-bordered w-full"
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.category_id && (
            <p className="text-red-500">{errors.category_id}</p>
          )}
        </div>
        <div>
          <label>Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="textarea textarea-bordered w-full"
          />
          {errors.description && (
            <p className="text-red-500">{errors.description}</p>
          )}
        </div>
        <div>
          <label>Image</label>
          <input
            type="file"
            name="linkImage"
            accept="image/jpeg,image/png,image/jpg"
            onChange={handleChange}
            className="file-input file-input-bordered w-full"
          />
          {errors.linkImage && (
            <p className="text-red-500">{errors.linkImage}</p>
          )}
        </div>
        <button type="submit" className="btn btn-primary">
          Save
        </button>
      </form>
    </AuthenticatedLayout>
  );
}
