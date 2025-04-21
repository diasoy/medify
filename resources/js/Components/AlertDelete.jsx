import React, { useEffect, useState } from "react";

const AlertDelete = ({ description, isOpen, onConfirm, onCancel }) => {
    const [isAnimating, setIsAnimating] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

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

    if (!isVisible) return null;

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ${
                isAnimating ? "opacity-100" : "opacity-0"
            }`}
            onClick={onCancel}
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
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                        <svg
                            className="h-10 w-10 text-red-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        Delete Confirmation
                    </h3>
                    <div className="mt-2">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {description}
                        </p>
                    </div>
                </div>

                <div className="flex justify-center gap-4 mt-5">
                    <button
                        onClick={onCancel}
                        className="btn btn-outline hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="btn btn-error text-white hover:bg-red-700 transition-colors duration-200"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AlertDelete;
