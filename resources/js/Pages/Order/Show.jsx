import React from "react";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import axios from "axios";
import { useState } from "react";
import { router } from "@inertiajs/react";

export default function Show({ order, auth }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPDF = () => {
    setIsDownloading(true);

    axios
      .get(`/order/${order.id}/pdf`, { responseType: "blob" })
      .then((response) => {
        const blob = new Blob([response.data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `order-${order.id}.pdf`);
        document.body.appendChild(link);
        link.click();

        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
        setIsDownloading(false);
      })
      .catch((error) => {
        console.error("Error downloading PDF:", error);
        alert("Failed to download PDF. Please try again.");
        setIsDownloading(false);
      });
  };

  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight">Order Details</h2>
      }
    >
      <Head title={`Order #${order.id}`} />

      <div className="py-12">
        <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-base-100 shadow-xl rounded-xl p-8">
            {/* Nota Header */}
            <div className="mb-8 border-b pb-4 flex flex-col md:flex-row md:justify-between md:items-center">
              <div>
                <h3 className="text-2xl font-bold mb-2">INVOICE</h3>
                <p className="text-sm text-gray-500">
                  <strong>Order ID:</strong> {order.id}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Date Time:</strong>{" "}
                  {new Date(order.created_at).toLocaleString()}
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <p>
                  <strong>Shipping Status:</strong>{" "}
                  <span
                    className={`badge ml-2 ${getShippingStatusColor(
                      order.shipping_status
                    )}`}
                  >
                    {order.shipping_status}
                  </span>
                </p>
              </div>
            </div>

            {/* Shipping Info */}
            <div className="mb-8">
              <h4 className="font-semibold mb-1">Shipping Address</h4>
              <div className="bg-base-200 rounded p-3">
                <p className="mb-0">{order.shipping_address}</p>
              </div>
            </div>

            {/* Order Items Table */}
            <div className="mb-8">
              <h4 className="font-semibold mb-2">Order Items</h4>
              <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Product</th>
                      <th>Qty</th>
                      <th>Price</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items && order.items.length > 0 ? (
                      order.items.map((item, idx) => (
                        <tr key={item.id}>
                          <td>{idx + 1}</td>
                          <td>
                            {item.product ? (
                              item.product.title
                            ) : (
                              <span className="italic text-gray-400">
                                Product deleted
                              </span>
                            )}
                          </td>
                          <td>{item.quantity}</td>
                          <td>
                            {new Intl.NumberFormat("id-ID", {
                              style: "currency",
                              currency: "IDR",
                            }).format(item.price)}
                          </td>
                          <td>
                            {new Intl.NumberFormat("id-ID", {
                              style: "currency",
                              currency: "IDR",
                            }).format(item.price * item.quantity)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="text-center text-gray-400">
                          No items found
                        </td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot>
                    <tr>
                      <th colSpan={4} className="text-right">
                        Total
                      </th>
                      <th>
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                        }).format(order.total_payment)}
                      </th>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Payment/Shipping Status */}
            {order.payment_status === "success" && (
              <div className="mb-6 alert alert-success">
                <span>
                  <strong>Payment Successful!</strong> Thank you, your payment
                  has been received and your order is being processed.
                  {order.shipping_status === "pending" &&
                    " We'll notify you when your order ships."}
                </span>
              </div>
            )}

            {auth.user.role === "admin" &&
              order.payment_status === "success" &&
              order.shipping_status === "pending" && (
                <div className="mb-6 alert alert-info">
                  <div className="flex items-center justify-between w-full">
                    <span>
                      <strong>Admin Actions:</strong> Mark this order as shipped
                      if ready.
                    </span>
                    <button
                      className={`btn btn-primary btn-sm ${
                        isUpdating ? "loading" : ""
                      }`}
                      onClick={() => {
                        setIsUpdating(true);
                        axios
                          .patch(`/order/${order.id}/shipping`, {
                            shipping_status: "shipped",
                          })
                          .then((response) => {
                            if (response.data.success) {
                              router.reload();
                            } else {
                              alert(
                                "Error updating status: " +
                                  response.data.message
                              );
                              setIsUpdating(false);
                            }
                          })
                          .catch((error) => {
                            console.error(
                              "Error updating shipping status:",
                              error
                            );
                            alert(
                              "Failed to update shipping status. Please try again."
                            );
                            setIsUpdating(false);
                          });
                      }}
                      disabled={isUpdating}
                    >
                      {isUpdating ? "Updating..." : "Mark as Shipped"}
                    </button>
                  </div>
                </div>
              )}

            <div className="mt-8 flex justify-end">
              <button
                className={`btn btn-secondary ${
                  isDownloading ? "loading" : ""
                }`}
                onClick={handleDownloadPDF}
                disabled={isDownloading}
              >
                {isDownloading ? "Downloading..." : "Download PDF"}
              </button>
              <button className="btn" onClick={() => window.history.back()}>
                Back to Orders
              </button>
            </div>
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
