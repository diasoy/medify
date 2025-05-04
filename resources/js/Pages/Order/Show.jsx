import React from "react";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Show({ order, auth }) {
  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight">Order Details</h2>
      }
    >
      <Head title={`Order #${order.id}`} />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="overflow-hidden shadow-xl sm:rounded-lg">
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-2xl py-4 font-semibold mb-2">
                  Order Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p>
                      <strong>Order ID:</strong> {order.id}
                    </p>
                    <p>
                      <strong>Date:</strong>{" "}
                      {new Date(order.created_at).toLocaleString()}
                    </p>
                    <p>
                      <strong>Total:</strong>{" "}
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                      }).format(order.total_payment)}
                    </p>
                  </div>
                  <div>
                    <p>
                      <strong>Shipping Status:</strong>
                      <span
                        className={`badge ml-2 ${getShippingStatusColor(
                          order.shipping_status
                        )}`}
                      >
                        {order.shipping_status}
                      </span>
                    </p>
                    <p>
                      <strong>Shipping Address:</strong>{" "}
                      {order.shipping_address}
                    </p>
                  </div>
                </div>
              </div>

              {order.payment_status === "success" && (
                <div className="mb-6 p-4 border border-green-200 bg-green-50 rounded">
                  <h4 className="font-semibold text-green-800">
                    Payment Successful
                  </h4>
                  <p className="text-green-700">
                    Thank you! Your payment has been received and your order is
                    being processed.
                    {order.shipping_status === "pending" &&
                      " We'll notify you when your order ships."}
                  </p>
                </div>
              )}

              {auth.user.role === "admin" &&
                order.payment_status === "success" &&
                order.shipping_status === "pending" && (
                  <div className="mb-6 p-4 border border-gray-200 bg-gray-50 rounded">
                    <h4 className="font-semibold">Admin Actions</h4>
                    <div className="mt-2">
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => {
                          alert(
                            "Shipping functionality would be implemented here"
                          );
                        }}
                      >
                        Mark as Shipped
                      </button>
                    </div>
                  </div>
                )}
            </div>
          </div>
          <div className="mt-8">
            <button className="btn" onClick={() => window.history.back()}>
              Back to Orders
            </button>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}

const getShippingStatusColor = (status) => {
  switch (status) {
    case "delivered":
      return "badge-success";
    case "shipped":
      return "badge-info";
    case "pending":
      return "badge-warning";
    case "cancelled":
      return "badge-error";
    default:
      return "badge-ghost";
  }
};
