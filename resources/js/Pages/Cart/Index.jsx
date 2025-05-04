import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import formatRupiah from "@/utils/formatRupiah";
import axios from "axios";

export default function Index({ cartItems, totalPrice }) {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [address, setAddress] = useState("");
  const [houseMarker, setHouseMarker] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleCheckout = async () => {
    try {
      const response = await axios.post(route("checkout"), {
        address,
        house_marker: houseMarker,
        phone_number: phoneNumber,
      });

      const { snapToken } = response.data;

      window.snap.pay(snapToken, {
        onSuccess: function (result) {
          alert("Payment successful!");
          window.location.reload();
        },
        onPending: function (result) {
          alert("Payment pending!");
        },
        onError: function (result) {
          alert("Payment failed!");
        },
      });
    } catch (error) {
      console.error("Checkout failed:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  const handleQuantityChange = (id, quantity) => {
    if (quantity < 1) {
      setItemToDelete(id);
      setShowDeleteConfirmation(true);
    } else {
      updateCartQuantity(id, quantity);
    }
  };

  const updateCartQuantity = (id, quantity) => {
    router.put(route("cart.update", { cart: id }), { quantity });
  };

  const confirmDeleteItem = () => {
    if (itemToDelete) {
      updateCartQuantity(itemToDelete, 0);
      setShowDeleteConfirmation(false);
      setItemToDelete(null);
    }
  };

  const cancelDeleteItem = () => {
    setShowDeleteConfirmation(false);
    setItemToDelete(null);
  };

  const taxRate = 0.11;
  const taxAmount = Math.round(totalPrice * taxRate);
  const totalWithTax = totalPrice + taxAmount;

  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight">Your Cart</h2>
      }
    >
      <Head title="Cart" />
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {cartItems.length > 0 ? (
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-2xl mb-6 text-primary">
                  Shopping Cart
                </h2>
                <div className="overflow-x-auto">
                  <table className="table table-zebra w-full">
                    <thead>
                      <tr className="bg-base-200">
                        <th className="text-base text-primary-focus">
                          Product
                        </th>
                        <th className="text-base text-primary-focus">Price</th>
                        <th className="text-base text-primary-focus">
                          Quantity
                        </th>
                        <th className="text-base text-primary-focus text-right">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {cartItems.map((item) => (
                        <tr key={item.id} className="hover">
                          <td className="font-medium">{item.product.title}</td>
                          <td>
                            <span className="badge badge-ghost badge-lg">
                              {formatRupiah(item.product.price)}
                            </span>
                          </td>
                          <td>
                            <div className="join">
                              <button
                                className="btn btn-sm btn-primary join-item"
                                onClick={() =>
                                  handleQuantityChange(
                                    item.id,
                                    item.quantity - 1
                                  )
                                }
                              >
                                -
                              </button>
                              <span className="btn btn-sm join-item btn-disabled bg-base-100 text-base-content">
                                {item.quantity}
                              </span>
                              <button
                                className="btn btn-sm btn-primary join-item"
                                onClick={() =>
                                  handleQuantityChange(
                                    item.id,
                                    item.quantity + 1
                                  )
                                }
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td className="text-right font-bold text-primary">
                            {formatRupiah(item.product.price * item.quantity)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-base-200">
                        <th
                          colSpan="3"
                          className="text-base text-right text-primary-focus"
                        >
                          Total Amount (incl. Tax)
                        </th>
                        <th className="text-right text-lg text-primary font-bold">
                          {formatRupiah(totalWithTax)}
                        </th>
                      </tr>
                    </tfoot>
                    <tfoot>
                      <tr className="bg-base-200">
                        <th
                          colSpan="3"
                          className="text-base text-right text-primary-focus"
                        >
                          Tax (11%)
                        </th>
                        <th className="text-right text-lg text-primary font-bold">
                          {formatRupiah(taxAmount)}
                        </th>
                      </tr>
                    </tfoot>
                  </table>
                </div>
                <div className="card-actions justify-center my-6">
                  <div className="w-full max-w-lg">
                    <div className="form-control mb-4">
                      <label className="label">
                        <span className="label-text">Address</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Enter your address"
                        className="input input-bordered w-full"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      />
                    </div>
                    <div className="form-control mb-4">
                      <label className="label">
                        <span className="label-text">
                          House Marker (e.g., 'Blue Gate')
                        </span>
                      </label>
                      <input
                        type="text"
                        placeholder="Enter house marker"
                        className="input input-bordered w-full"
                        value={houseMarker}
                        onChange={(e) => setHouseMarker(e.target.value)}
                      />
                    </div>
                    <div className="form-control mb-4">
                      <label className="label">
                        <span className="label-text">Phone Number</span>
                      </label>
                      <input
                        type="number"
                        placeholder="Enter your phone number"
                        className="input input-bordered w-full"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                      />
                    </div>
                    <button
                      className="btn btn-primary btn-lg w-full"
                      onClick={handleCheckout}
                    >
                      Checkout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body items-center text-center">
                <h2 className="card-title text-2xl text-primary mb-4">
                  Your Cart
                </h2>
                <div className="text-lg text-secondary mb-6">
                  Your cart is empty.
                </div>
                <div className="card-actions">
                  <button
                    className="btn btn-primary btn-lg"
                    onClick={() => router.visit(route("products.index"))}
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <dialog className={`modal ${showDeleteConfirmation ? "modal-open" : ""}`}>
        <div className="modal-box">
          <h3 className="font-bold text-lg text-error">Remove Item</h3>
          <p className="py-4">
            Are you sure you want to remove this item from your cart?
          </p>
          <div className="modal-action">
            <button className="btn btn-error" onClick={confirmDeleteItem}>
              Yes, remove it
            </button>
            <button className="btn btn-outline" onClick={cancelDeleteItem}>
              Cancel
            </button>
          </div>
        </div>
        <form
          method="dialog"
          className="modal-backdrop"
          onClick={cancelDeleteItem}
        >
          <button>close</button>
        </form>
      </dialog>
    </AuthenticatedLayout>
  );
}
