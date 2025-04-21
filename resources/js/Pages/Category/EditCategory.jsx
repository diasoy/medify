import React, { useState } from "react";
import { useForm, router } from "@inertiajs/react";
import CategoryModal from "./CategoryModal";

export default function EditCategory({ category }) {
    const { data, setData, put, processing, errors } = useForm({
        name: category.name,
    });

    const [isModalOpen, setIsModalOpen] = useState(true);

    const handleSubmit = (formData) => {
        setData(formData);
        put(route("category.update", category.id), {
            onSuccess: () => setIsModalOpen(false),
        });
    };

    const handleClose = () => {
        setIsModalOpen(false);
        router.visit(route("category.index"));
    };

    return (
        <CategoryModal
            isOpen={isModalOpen}
            onClose={handleClose}
            onSubmit={handleSubmit}
            initialData={{ name: data.name, errors }}
            title="Edit Category"
        />
    );
}
