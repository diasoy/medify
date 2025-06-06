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
use App\Mail\OrderInvoice;
use Illuminate\Support\Facades\Mail;

class OrderController extends Controller
{
    use AuthorizesRequests;
    public function index()
    {
        $user = Auth::user();

        try {
            if ($user->role === 'customer') {
                $orders = Order::where('user_id', $user->id)
                    ->orderBy('created_at', 'desc')
                    ->paginate(5);
            } else {
                $orders = Order::with('user')
                    ->orderBy('created_at', 'desc')
                    ->paginate(5);
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
        $order = Order::with(['user', 'items.product'])->find($id);

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

        // Calculate tax (11%)
        $taxRate = 0.11;
        $taxAmount = round($totalPrice * $taxRate);
        $totalWithTax = $totalPrice + $taxAmount;

        $transactionDetails = [
            'order_id' => 'ORDER-' . uniqid(),
            'gross_amount' => $totalWithTax, // Use total with tax
        ];

        $itemDetails = $cartItems->map(function ($item) {
            return [
                'id' => $item->product->id,
                'price' => $item->product->price,
                'quantity' => $item->quantity,
                'name' => $item->product->title,
            ];
        })->toArray();

        // Add tax as an item
        $itemDetails[] = [
            'id' => 'TAX',
            'price' => $taxAmount,
            'quantity' => 1,
            'name' => 'Tax (11%)',
        ];

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
                'total_payment' => $totalWithTax, // Save total with tax
                'payment_status' => 'pending',
                'payment_method' => 'midtrans',
                'shipping_address' => $request->address,
                'shipping_status' => 'pending',
            ]);

            foreach ($cartItems as $cartItem) {
                $order->items()->create([
                    'product_id' => $cartItem->product_id,
                    'quantity' => $cartItem->quantity,
                    'price' => $cartItem->product->price
                ]);
            }

            // Clear the cart after creating order
            Cart::where('user_id', Auth::id())->delete();

            return response()->json(['snapToken' => $snapToken]);
        } catch (\Exception $e) {
            Log::error('Midtrans checkout error: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function handleNotification(Request $request)
    {
        Config::$serverKey = config('midtrans.server_key');
        Config::$isProduction = config('midtrans.is_production');
        Config::$isSanitized = config('midtrans.is_sanitized');
        Config::$is3ds = config('midtrans.is_3ds');

        try {
            $notificationBody = file_get_contents('php://input');

            $notification = new Notification();

            $transactionStatus = $notification->transaction_status;
            $paymentType = $notification->payment_type;
            $orderId = $notification->order_id;
            $fraudStatus = $notification->fraud_status;
            $grossAmount = $notification->gross_amount;

            $order = Order::find($orderId);

            if (!$order) {
                Log::error('Order not found for ID: ' . $orderId);
                return response()->json(['message' => 'Order not found'], 404);
            }

            $previousStatus = $order->payment_status;

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

            // Send email if payment status changed to success
            if ($order->payment_status === 'success' && $previousStatus !== 'success') {
                $this->sendOrderConfirmationEmail($order);
            }

            return response()->json(['message' => 'Notification handled successfully']);
        } catch (\Exception $e) {
            Log::error('Notification handling error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Notification handling failed',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    // Also update the checkTransactionStatus method to send email when payment becomes successful
    public function checkTransactionStatus($orderId)
    {
        Config::$serverKey = config('midtrans.server_key');
        Config::$isProduction = config('midtrans.is_production');

        try {
            $status = \Midtrans\Transaction::status($orderId);

            $order = Order::find($orderId);
            if (!$order) {
                return ['success' => false, 'message' => 'Order not found'];
            }

            $previousStatus = $order->payment_status;

            if (is_object($status) && ($status->transaction_status == 'settlement' || $status->transaction_status == 'capture')) {
                $order->payment_status = 'success';
                $order->save();

                // Send email if payment status changed to success
                if ($previousStatus !== 'success') {
                    $this->sendOrderConfirmationEmail($order);
                }

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

    // Add a new method to send the email
    private function sendOrderConfirmationEmail(Order $order)
    {
        try {
            // Make sure we have the full order with all relationships
            $order = Order::with(['user', 'items.product'])->find($order->id);

            // Send the invoice email
            Mail::to($order->user->email)
                ->send(new OrderInvoice($order));

            Log::info('Order confirmation email sent successfully', [
                'order_id' => $order->id,
                'user_email' => $order->user->email
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to send order confirmation email', [
                'order_id' => $order->id,
                'error' => $e->getMessage()
            ]);
        }
    }

    // Update the getOrderStatus method to also send email if status changes to success
    public function getOrderStatus($orderId)
    {
        try {
            $order = Order::find($orderId);

            if (!$order) {
                return response()->json(['success' => false, 'message' => 'Order not found'], 404);
            }

            $previousStatus = $order->payment_status;

            if ($order->payment_status == 'pending') {
                $statusCheck = $this->checkTransactionStatus($orderId);
                if ($statusCheck['success']) {
                    $order = Order::find($orderId);

                    // If status was changed to success by checkTransactionStatus, the email would have been sent there
                }
            }

            return response()->json([
                'success' => true,
                'order' => $order
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function generatePdf($id)
    {
        try {
            $order = Order::with(['user', 'items.product'])->findOrFail($id);

            if (Auth::user()->role !== 'admin' && Auth::id() !== $order->user_id) {
                return response()->json(['error' => 'Unauthorized'], 403);
            }

            Log::info('Starting PDF generation for order', [
                'order_id' => $id,
                'user_id' => Auth::id()
            ]);

            // Using the correct path to the invoice template
            $pdf = PDF::loadView('invoice', [
                'order' => $order,
                'date' => now()->format('Y-m-d H:i:s'),
            ]);

            Log::info('PDF generated successfully');

            return $pdf->download("order-{$order->id}.pdf");
        } catch (\Exception $e) {
            Log::error('PDF generation error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['error' => 'Failed to generate PDF: ' . $e->getMessage()], 500);
        }
    }
}
