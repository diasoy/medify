import React from "react";
const DashboardCustomer = ({ totalOrders, completedOrders }) => {
  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="p-6 shadow-2xl sm:rounded-lg">
            <h3 className="text-lg font-semibold text-primary mb-4">
              Your Total Orders
            </h3>
            <p className="text-3xl font-bold">{totalOrders}</p>
          </div>
          <div className="p-6 shadow-2xl sm:rounded-lg">
            <h3 className="text-lg font-semibold text-primary mb-4">
              Your Completed Orders
            </h3>
            <p className="text-3xl font-bold">{completedOrders}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCustomer;
