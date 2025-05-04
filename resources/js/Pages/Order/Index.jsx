import React, { useEffect, useState } from "react";
import { usePage } from "@inertiajs/react";
import OrderAdmin from "@/Admin/OrderAdmin";
import OrderCustomer from "@/Customer/OrderCustomer";
import { Head } from "@inertiajs/react";
import axios from "axios";

export default function Index() {
  const { auth, userRole, orders, error } = usePage().props;
  const role = userRole || auth.user.role;
  const [localOrders, setLocalOrders] = useState(orders);

  // useEffect(() => {
  //   if (!orders || !orders.data) return;

  //   const pendingOrders = orders.data.filter(
  //     (order) => order.payment_status === "pending"
  //   );

  //   if (pendingOrders.length === 0) return;

  //   const checkPendingOrders = async () => {
  //     const updatedOrders = [...orders.data];
  //     let hasChanges = false;

  //     for (const pendingOrder of pendingOrders) {
  //       try {
  //         const response = await axios.get(`/order/status/${pendingOrder.id}`);
  //         if (response.data.success && response.data.order) {
  //           const orderIndex = updatedOrders.findIndex(
  //             (o) => o.id === pendingOrder.id
  //           );
  //           if (
  //             orderIndex >= 0 &&
  //             updatedOrders[orderIndex].payment_status !==
  //               response.data.order.payment_status
  //           ) {
  //             updatedOrders[orderIndex] = response.data.order;
  //             hasChanges = true;
  //           }
  //         }
  //       } catch (error) {
  //         console.error(`Error checking order ${pendingOrder.id}:`, error);
  //       }
  //     }

  //     if (hasChanges) {
  //       setLocalOrders({
  //         ...orders,
  //         data: updatedOrders,
  //       });
  //     }
  //   };

  //   checkPendingOrders();

  //   const intervalId = setInterval(checkPendingOrders, 15000);

  //   return () => {
  //     if (intervalId) {
  //       clearInterval(intervalId);
  //     }
  //   };
  // }, [orders]);

  if (error) {
    return (
      <>
        <Head title="Order Error" />
        <div className="flex items-center justify-center h-screen">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <strong>Error:</strong> {error}
          </div>
        </div>
      </>
    );
  }

  const ordersToUse = localOrders || orders;

  if (role === "admin") {
    return <OrderAdmin orders={ordersToUse} />;
  }

  if (role === "customer") {
    return <OrderCustomer orders={ordersToUse} />;
  }

  return (
    <>
      <Head title="Unauthorized" />
      <div className="flex items-center justify-center h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Error:</strong> You don't have permission to access this page.
        </div>
      </div>
    </>
  );
}
