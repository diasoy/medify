import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const DashboardAdmin = ({
  totalOrders,
  completedOrders,
  totalRevenue,
  totalCustomers,
  totalCategories,
  totalProducts,
  monthlyOrders,
}) => {
  const stats = [
    { label: "Total Orders", value: totalOrders },
    { label: "Completed Orders", value: completedOrders },
    {
      label: "Total Revenue",
      value: new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(totalRevenue),
    },
    { label: "Total Customers", value: totalCustomers },
    { label: "Total Categories", value: totalCategories },
    { label: "Total Products", value: totalProducts },
  ];

  const allMonths = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const chartData = {
    labels: allMonths,
    datasets: monthlyOrders.datasets.map((dataset) => ({
      ...dataset,
      data: allMonths.map((month) => {
        const index = monthlyOrders.labels.indexOf(month);
        return index !== -1 ? dataset.data[index] : 0;
      }),
    })),
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Monthly Orders",
      },
    },
  };

  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="p-6 shadow-2xl sm:rounded-lg">
              <h3 className="text-lg font-semibold text-primary mb-4">
                {stat.label}
              </h3>
              <p className="text-3xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="p-6 shadow-2xl sm:rounded-lg">
          <h3 className="text-lg font-semibold text-primary mb-4">
            Monthly Orders
          </h3>
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;
