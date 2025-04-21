import React, { useEffect, useState } from "react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";

const CategoryModal = ({
    isOpen,
    onClose,
    onSubmit,
    initialData = {},
    title,
}) => {
    const [isAnimating, setIsAnimating] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [data, setData] = useState(initialData);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            setTimeout(() => setIsAnimating(true), 10);
        } else {
            setIsAnimating(false);
            const timer = setTimeout(() => setIsVisible(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(data);
    };

    if (!isVisible) return null;

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ${
                isAnimating ? "opacity-100" : "opacity-0"
            }`}
            onClick={onClose}
        >
            <div
                className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full mx-4 transition-all duration-300 transform ${
                    isAnimating
                        ? "scale-100 translate-y-0"
                        : "scale-95 translate-y-4"
                }`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="text-center mb-5">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {title}
                    </h3>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <InputLabel htmlFor="name" value="Category Name" />
                        <TextInput
                            id="name"
                            type="text"
                            name="name"
                            value={data.name || ""}
                            className="mt-1 block w-full"
                            onChange={handleChange}
                            required
                        />
                        <InputError
                            message={data.errors?.name}
                            className="mt-2"
                        />
                    </div>

                    <div className="flex justify-end gap-4 mt-5">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn btn-outline hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary text-white hover:bg-blue-700 transition-colors duration-200"
                        >
                            {title}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CategoryModal;
