import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";

export default function Edit({ product, categories }) {
    const [form, setForm] = useState({
        title: product.title,
        slug: product.slug,
        price: product.price,
        description: product.description,
        category_id: product.category_id,
        linkImage: product.linkImage,
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        router.put(route("products.update", product.id), form, {
            onError: (err) => setErrors(err),
        });
    };

    return (
        <AuthenticatedLayout header={<h2>Edit Product</h2>}>
            <Head title="Edit Product" />
            <form
                onSubmit={handleSubmit}
                className="space-y-4 max-w-4xl mx-auto"
            >
                {/* Same fields as Create.jsx */}
                <button type="submit" className="btn btn-primary">
                    Update
                </button>
            </form>
        </AuthenticatedLayout>
    );
}
