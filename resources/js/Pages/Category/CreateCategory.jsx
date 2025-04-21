import React, { useState } from "react";
import { useForm, router } from "@inertiajs/react";
import CategoryModal from "./CategoryModal";

export default function CreateCategory() {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
    });

    const [isModalOpen, setIsModalOpen] = useState(true);

    const handleSubmit = (formData) => {
        setData(formData);
        post(route("category.store"), {
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
            title="Create Category"
        />
    );
}
