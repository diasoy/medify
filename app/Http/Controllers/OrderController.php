<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Cart;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Midtrans\Config;
use Midtrans\Snap;
use Midtrans\Notification;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Barryvdh\DomPDF\Facade\Pdf;

class OrderController extends Controller
{
    use AuthorizesRequests;
    public function index()
    {
        $user = Auth::user();

        try {
            if ($user->role === 'customer') {
                $orders = Order::where('user_id', $user->id)->paginate(5);
            } else {
                $orders = Order::with('user')->paginate(5);
            }

            Log::info('Orders loaded:', ['count' => $orders->count(), 'role' => $user->role]);

            return Inertia::render('Order/Index', [
                'orders' => $orders
            ]);
        } catch (\Exception $e) {
            Log::error('Order loading error: ' . $e->getMessage());

            return Inertia::render('Order/Index', [
                'orders' => [],
                'error' => 'Failed to load orders: ' . $e->getMessage()
            ]);
        }
    }

    public function show($id)
    {
        $order = Order::with('user')->find($id);

        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        return Inertia::render('Order/Show', [
            'order' => $order
        ]);
    }

    public function updateShippingStatus($orderId, Request $request)
    {
        try {
            $order = Order::find($orderId);

            if (!$order) {
                return response()->json(['success' => false, 'message' => 'Order not found'], 404);
            }

            $validatedData = $request->validate([
                'shipping_status' => 'required|in:pending,shipped,delivered',
            ]);

            $order->shipping_status = $validatedData['shipping_status'];
            $order->save();

            Log::info('Order shipping status updated', [
                'order_id' => $orderId,
                'shipping_status' => $order->shipping_status,
            ]);

            return response()->json([
                'success' => true,
                'order' => $order
            ]);
        } catch (\Exception $e) {
            Log::error('Update shipping status error', ['error' => $e->getMessage()]);
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function checkout(Request $request)
    {
        Config::$serverKey = config('midtrans.server_key');
        Config::$isProduction = config('midtrans.is_production');
        Config::$isSanitized = config('midtrans.is_sanitized');
        Config::$is3ds = config('midtrans.is_3ds');

        $cartItems = Cart::with('product')->where('user_id', Auth::id())->get();
        $totalPrice = $cartItems->sum(function ($item) {
            return $item->product->price * $item->quantity;
        });

        $transactionDetails = [
            'order_id' => 'ORDER-' . uniqid(),
            'gross_amount' => $totalPrice,
        ];

        $itemDetails = $cartItems->map(function ($item) {
            return [
                'id' => $item->product->id,
                'price' => $item->product->price,
                'quantity' => $item->quantity,
                'name' => $item->product->title,
            ];
        })->toArray();

        $customerDetails = [
            'first_name' => Auth::user()->name,
            'email' => Auth::user()->email,
            'phone' => $request->phone_number,
            'address' => $request->address,
        ];

        $payload = [
            'transaction_details' => $transactionDetails,
            'item_details' => $itemDetails,
            'customer_details' => $customerDetails,
            'callbacks' => [
                'finish' => route('order.index'),
                'error' => route('order.index'),
                'pending' => route('order.index'),
            ],
        ];

        try {
            $snapToken = Snap::getSnapToken($payload);

            $order = Order::create([
                'id' => $transactionDetails['order_id'],
                'user_id' => Auth::id(),
                'total_price' => $totalPrice,
                'total_payment' => $totalPrice,
                'payment_status' => 'pending',
                'payment_method' => 'midtrans',
                'shipping_address' => $request->address,
                'shipping_status' => 'pending',
            ]);

            Cart::where('user_id', Auth::id())->delete();

            return response()->json(['snapToken' => $snapToken]);
        } catch (\Exception $e) {
            Log::error('Midtrans checkout error: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function handleNotification(Request $request)
    {
        Log::info('Midtrans notification received', ['raw_input' => $request->all()]);

        Config::$serverKey = config('midtrans.server_key');
        Config::$isProduction = config('midtrans.is_production');
        Config::$isSanitized = config('midtrans.is_sanitized');
        Config::$is3ds = config('midtrans.is_3ds');

        try {
            $notificationBody = file_get_contents('php://input');
            Log::info('Raw notification body', ['body' => $notificationBody]);

            $notification = new Notification();

            $transactionStatus = $notification->transaction_status;
            $paymentType = $notification->payment_type;
            $orderId = $notification->order_id;
            $fraudStatus = $notification->fraud_status;
            $grossAmount = $notification->gross_amount;

            Log::info('Midtrans Notification Processed', [
                'transaction_status' => $transactionStatus,
                'payment_type' => $paymentType,
                'order_id' => $orderId,
                'fraud_status' => $fraudStatus,
                'gross_amount' => $grossAmount
            ]);

            $order = Order::find($orderId);

            if (!$order) {
                Log::error('Order not found for ID: ' . $orderId);
                return response()->json(['message' => 'Order not found'], 404);
            }

            if ($transactionStatus == 'capture') {
                if ($paymentType == 'credit_card') {
                    if ($fraudStatus == 'challenge') {
                        $order->payment_status = 'challenge';
                    } else {
                        $order->payment_status = 'success';
                    }
                } else {
                    $order->payment_status = 'success';
                }
            } elseif ($transactionStatus == 'settlement') {
                $order->payment_status = 'success';
            } elseif ($transactionStatus == 'pending') {
                $order->payment_status = 'pending';
            } elseif (
                $transactionStatus == 'deny' ||
                $transactionStatus == 'expire' ||
                $transactionStatus == 'cancel'
            ) {
                $order->payment_status = 'failed';
            }

            $order->save();

            Log::info('Order payment status updated', [
                'order_id' => $orderId,
                'payment_status' => $order->payment_status,
            ]);

            return response()->json(['message' => 'Notification handled successfully']);
        } catch (\Exception $e) {
            Log::error('Midtrans Notification Handling Error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'message' => 'Notification handling failed',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function checkTransactionStatus($orderId)
    {
        Config::$serverKey = config('midtrans.server_key');
        Config::$isProduction = config('midtrans.is_production');

        try {
            $status = \Midtrans\Transaction::status($orderId);
            Log::info('Transaction status check', ['order_id' => $orderId, 'status' => $status]);

            $order = Order::find($orderId);
            if (!$order) {
                return ['success' => false, 'message' => 'Order not found'];
            }

            if (is_object($status) && ($status->transaction_status == 'settlement' || $status->transaction_status == 'capture')) {
                $order->payment_status = 'success';
                $order->save();
                return ['success' => true, 'status' => 'success'];
            } elseif (is_object($status) && $status->transaction_status == 'pending') {
                $order->payment_status = 'pending';
                $order->save();
                return ['success' => true, 'status' => 'pending'];
            } elseif (is_object($status) && in_array($status->transaction_status, ['deny', 'expire', 'cancel'])) {
                $order->payment_status = 'failed';
                $order->save();
                return ['success' => true, 'status' => 'failed'];
            }

            return is_object($status)
                ? ['success' => true, 'status' => $status->transaction_status]
                : ['success' => false, 'message' => 'Invalid status response'];
        } catch (\Exception $e) {
            Log::error('Transaction status check error', ['error' => $e->getMessage()]);
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }

    public function getOrderStatus($orderId)
    {
        try {
            $order = Order::find($orderId);

            if (!$order) {
                return response()->json(['success' => false, 'message' => 'Order not found'], 404);
            }

            if ($order->payment_status == 'pending') {
                $statusCheck = $this->checkTransactionStatus($orderId);
                if ($statusCheck['success']) {
                    $order = Order::find($orderId);
                }
            }

            return response()->json([
                'success' => true,
                'order' => $order
            ]);
        } catch (\Exception $e) {
            Log::error('Get order status error', ['error' => $e->getMessage()]);
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }
}
