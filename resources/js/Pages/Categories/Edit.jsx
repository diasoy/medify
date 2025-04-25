import React, { useState } from "react";
import AuthenticatedLayout from "@/Components/Layouts/AuthenticatedLayout";
import { Head, router, usePage } from "@inertiajs/react";

export default function Edit({ category }) {
    const [name, setName] = useState(category.name || "");
    const [errors, setErrors] = useState({});

    const handleSubmit = (e) => {
        e.preventDefault();
        router.put(
            route("categories.update", category.id),
            { name },
            {
                onError: (err) => setErrors(err),
            }
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight">
                    Edit Category
                </h2>
            }
        >
            <Head title="Edit Category" />

            <div className="max-w-4xl mx-auto mt-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium">
                            Category Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={`input input-bordered w-full ${
                                errors.name ? "input-error" : ""
                            }`}
                        />
                        {errors.name && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.name}
                            </p>
                        )}
                    </div>
                    <div className="flex justify-end">
                        <button type="submit" className="btn btn-primary">
                            Update
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
