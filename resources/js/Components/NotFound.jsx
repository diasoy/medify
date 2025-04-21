import React from "react";
import { Link } from "@inertiajs/react";

const NotFound = () => {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-red-600">404</h1>
                <p className="text-xl mt-4">
                    Oops! The page you are looking for does not exist.
                </p>
                <p className="mt-2">
                    It might have been moved or deleted.
                </p>
                <Link
                    href="/"
                    className="mt-6 inline-block px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
                >
                    Go Back to Home
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
