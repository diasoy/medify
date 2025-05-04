import React, { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import axios from "axios";

export default function Checkout({ cartItems, total }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [snapToken, setSnapToken] = useState(null);
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    const midtransScriptUrl =
      process.env.NODE_ENV === "production"
        ? "https://app.sandbox.midtrans.com/snap/snap.js"
        : "https://app.sandbox.midtrans.com/snap/snap.js";

    const midtransClientKey = process.env.MIX_MIDTRANS_CLIENT_KEY;

    let scriptTag = document.createElement("script");
    scriptTag.src = midtransScriptUrl;
    scriptTag.setAttribute("data-client-key", midtransClientKey);

    document.body.appendChild(scriptTag);

    return () => {
      document.body.removeChild(scriptTag);
    };
  }, []);

  const handleCheckout = async () => {
    if (!address) {
      setError("Please enter your shipping address");
      return;
    }
    if (!phoneNumber) {
      setError("Please enter your phone number");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("/checkout", {
        address,
        phone_number: phoneNumber,
      });

      if (response.data.snapToken) {
        setSnapToken(response.data.snapToken);
        setOrderId(response.data.orderId);
      }
      if (response.data.error) {
        setError(response.data.error);
      }
    } catch (error) {
      setError(
        "An error occurred while processing your order. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = () => {
    if (snapToken) {
      window.snap.pay(snapToken, {
        onSuccess: function (result) {
          console.log("Payment Success:", result);
          router.get(`/order/${orderId}`, {}, { preserveScroll: true });
        },
        onPending: function (result) {
          console.log("Payment Pending:", result);
          router.get(`/order/${orderId}`, {}, { preserveScroll: true });
        },
        onError: function (result) {
          console.log("Payment Error:", result);
          setError("Payment failed. Please try again.");
        },
        onClose: function () {
          console.log("Payment Popup Closed");
        },
      });
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Checkout</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Shipping Address
        </label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Phone Number
        </label>
        <input
          type="text"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
        />
      </div>
      <button
        onClick={handleCheckout}
        disabled={loading}
        className={`w-full py-2 px-4 bg-blue-600 text-white rounded-md ${
          loading ? "opacity-50" : ""
        }`}
      >
        {loading ? "Processing..." : "Checkout"}
      </button>
      {snapToken && (
        <button
          onClick={handlePayment}
          className="w-full mt-4 py-2 px-4 bg-green-600 text-white rounded-md"
        >
          Pay Now
        </button>
      )}
    </div>
  );
}
