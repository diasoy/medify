import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import { MdDelete } from "react-icons/md";
import Pagination from "@/Components/Pagination";
import formatDate from "@/utils/formatdate";
import AlertDelete from "@/Components/AlertDelete";
import { usePage } from "@inertiajs/react";
import NotFound from "@/Components/NotFound";

export default function Customer({ users }) {
  const user = usePage().props.auth.user;

  const [showAlert, setShowAlert] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const handlePageChange = (url) => {
    router.get(url, {}, { preserveScroll: true });
  };

  const handleDeleteClick = (userId) => {
    setSelectedUserId(userId);
    setShowAlert(true);
  };

  const handleConfirmDelete = () => {
    if (selectedUserId) {
      router.delete(route("customer.destroy", selectedUserId), {
        preserveScroll: true,
      });
    }
    setShowAlert(false);
    setSelectedUserId(null);
  };

  const handleCancelDelete = () => {
    setShowAlert(false);
    setSelectedUserId(null);
  };

  // Role badge component
  const RoleBadge = ({ role }) => {
    const badgeClass =
      role === "admin"
        ? "badge badge-primary text-white font-medium"
        : "badge badge-info text-white font-medium";

    return <span className={badgeClass}>{role}</span>;
  };

  if (user.role === "admin") {
    return (
      <AuthenticatedLayout
        header={
          <h2 className="text-xl font-semibold leading-tight">Customer</h2>
        }
      >
        <Head title="Customer" />

        <div className="overflow-x-auto mt-6 max-w-7xl mx-auto">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th>Nama</th>
                <th>Email</th>
                <th>Role</th>
                <th>Dibuat pada</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.data.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <RoleBadge role={user.role} />
                  </td>
                  <td>{formatDate(user.created_at)}</td>
                  <td className="flex gap-2 justify-center">
                    <button
                      onClick={() => handleDeleteClick(user.id)}
                      className="btn btn-error"
                    >
                      <MdDelete />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <Pagination links={users.links} onPageChange={handlePageChange} />
        </div>

        <AlertDelete
          description="Are you sure you want to delete this user?"
          isOpen={showAlert}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      </AuthenticatedLayout>
    );
  } else {
    return <NotFound />;
  }
}
