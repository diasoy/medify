<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class CartController extends Controller
{
    public function store(Request $request)
    {
        $cart = Cart::firstOrCreate(
            [
                'user_id' => Auth::id(),
                'product_id' => $request->product_id,
            ],
            ['quantity' => $request->quantity]
        );

        if (!$cart->wasRecentlyCreated) {
            $cart->increment('quantity', $request->quantity);
        }

        return back()->with('success', 'Product added to cart!');
    }

    public function index()
    {
        $cartItems = Cart::with('product')->where('user_id', Auth::id())->get();
        $totalPrice = $cartItems->sum(function ($item) {
            return $item->product->price * $item->quantity;
        });

        return inertia('Cart/Index', [
            'cartItems' => $cartItems,
            'totalPrice' => $totalPrice,
        ]);
    }

    public function update(Request $request, $id)
    {
        $cart = Cart::where('id', $id)->where('user_id', Auth::id())->firstOrFail();

        if ($request->quantity <= 0) {
            // If quantity is 0 or less, delete the item
            $cart->delete();
            return back()->with('success', 'Item removed from cart!');
        } else {
            // Otherwise update the quantity
            $cart->update(['quantity' => $request->quantity]);
            return back()->with('success', 'Cart updated!');
        }
    }

    public function destroy($id)
    {
        $cart = Cart::where('id', $id)->where('user_id', Auth::id())->firstOrFail();
        $cart->delete();

        return back()->with('success', 'Item removed from cart!');
    }
    public function updateShippingStatus(Request $request, $orderId)
    {
        try {
            $request->validate([
                'shipping_status' => 'required|string|in:pending,processing,shipped,delivered,cancelled'
            ]);

            $order = Order::find($orderId);

            if (!$order) {
                return response()->json([
                    'success' => false,
                    'message' => 'Order not found'
                ], 404);
            }

            // Only admins can update shipping status
            if (Auth::user()->role !== 'admin') {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized action'
                ], 403);
            }

            $order->update([
                'shipping_status' => $request->shipping_status
            ]);

            Log::info('Shipping status updated successfully', [
                'order_id' => $orderId,
                'shipping_status' => $request->shipping_status,
                'updated_by' => Auth::user()->id
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Shipping status updated successfully',
                'data' => $order
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to update shipping status: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to update shipping status',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
