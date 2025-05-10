import React, { useState, useEffect } from "react";
import { Head, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Pagination from "@/Components/Pagination";
import axios from "axios";

const OrderCustomer = ({ orders }) => {
  const [orderData, setOrderData] = useState(orders.data);
  const [loadingOrders, setLoadingOrders] = useState({});

  const handlePageChange = (url) => {
    router.get(url, {}, { preserveScroll: true });
  };

  useEffect(() => {
    const pendingOrders = orderData.filter(
      (order) => order.payment_status === "pending"
    );
    if (pendingOrders.length > 0) {
      checkPendingOrders();
    }
  }, []);

  const checkOrderStatus = async (orderId) => {
    setLoadingOrders((prev) => ({ ...prev, [orderId]: true }));

    try {
      const response = await axios.get(`/order/status/${orderId}`);

      if (response.data.success) {
        setOrderData((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId
              ? { ...order, payment_status: response.data.order.payment_status }
              : order
          )
        );
      }
    } catch (error) {
      console.error(`Failed to check status for order ${orderId}:`, error);
    } finally {
      setLoadingOrders((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  const checkPendingOrders = async () => {
    const pendingOrders = orderData.filter(
      (order) => order.payment_status === "pending"
    );

    const newLoadingState = {};
    pendingOrders.forEach((order) => {
      newLoadingState[order.id] = true;
    });
    setLoadingOrders(newLoadingState);

    // Check status for all pending orders
    const checkPromises = pendingOrders.map((order) =>
      axios
        .get(`/order/status/${order.id}`)
        .then((response) => {
          if (response.data.success) {
            return { id: order.id, data: response.data.order };
          }
          return null;
        })
        .catch((error) => {
          console.error(`Failed to check status for order ${order.id}:`, error);
          return null;
        })
    );

    const results = await Promise.all(checkPromises);

    // Update orders based on results
    const updatedOrders = [...orderData];
    results.forEach((result) => {
      if (result) {
        const index = updatedOrders.findIndex(
          (order) => order.id === result.id
        );
        if (index !== -1) {
          updatedOrders[index] = {
            ...updatedOrders[index],
            payment_status: result.data.payment_status,
          };
        }
      }
    });

    setOrderData(updatedOrders);
    setLoadingOrders({});
  };

  return (
    <AuthenticatedLayout
      header={
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold leading-tight">Your Orders</h2>
          {orderData.some((order) => order.payment_status === "pending") && (
            <button
              className="btn btn-sm btn-outline"
              onClick={checkPendingOrders}
            >
              Refresh Orders
            </button>
          )}
        </div>
      }
    >
      <Head title="Your Orders" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Total Payment</th>
                    <th>Payment Status</th>
                    <th>Shipping Status</th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {orderData.map((order) => (
                    <tr key={order.id}>
                      <td>{order.id}</td>
                      <td>
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                        }).format(order.total_payment)}
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <span
                            className={`badge ${getPaymentStatusColor(
                              order.payment_status
                            )}`}
                          >
                            {order.payment_status}
                          </span>
                          {order.payment_status === "pending" && (
                            <button
                              className="btn btn-xs btn-ghost btn-circle"
                              onClick={() => checkOrderStatus(order.id)}
                              disabled={loadingOrders[order.id]}
                            >
                              {loadingOrders[order.id] ? (
                                <svg
                                  className="animate-spin h-4 w-4"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                >
                                  <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                  ></circle>
                                  <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                  ></path>
                                </svg>
                              ) : (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                  />
                                </svg>
                              )}
                            </button>
                          )}
                        </div>
                      </td>
                      <td>
                        <span
                          className={`badge ${getShippingStatusColor(
                            order.shipping_status
                          )}`}
                        >
                          {order.shipping_status}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => router.get(`/order/${order.id}`)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {orderData.length === 0 && (
                <div className="text-center py-4">
                  <p>You haven't placed any orders yet</p>
                </div>
              )}

              <Pagination
                links={orders.links}
                className="mt-6"
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
};

const getPaymentStatusColor = (status) => {
  switch (status) {
    case "success":
      return "badge-success";
    case "pending":
      return "badge-warning";
    case "failed":
      return "badge-error";
    case "expired":
      return "badge-error";
    case "cancelled":
      return "badge-error";
    case "challenge":
      return "badge-info";
    case "settlement":
      return "badge-success";
    default:
      return "badge-ghost";
  }
};

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

export default OrderCustomer;
