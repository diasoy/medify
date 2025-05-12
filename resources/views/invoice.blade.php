<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>Invoice #{{ $order->id }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 14px;
            line-height: 1.5;
            color: #333;
        }

        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }

        .header {
            margin-bottom: 30px;
            border-bottom: 1px solid #ddd;
            padding-bottom: 20px;
        }

        .invoice-title {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 10px;
        }

        .info {
            margin-bottom: 20px;
        }

        .shipping-address {
            background-color: #f5f5f5;
            padding: 10px;
            margin-bottom: 20px;
            border-radius: 5px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }

        table th,
        table td {
            padding: 10px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }

        table th {
            background-color: #f5f5f5;
        }

        .text-right {
            text-align: right;
        }

        .total-row {
            font-weight: bold;
        }

        .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 12px;
            color: #777;
        }

        .status {
            display: inline-block;
            padding: 5px 10px;
            border-radius: 4px;
            font-weight: bold;
        }

        .status-success {
            background-color: #d1f7c4;
            color: #2e7d32;
        }

        .status-pending {
            background-color: #fff8e1;
            color: #ff8f00;
        }

        .status-shipped {
            background-color: #e0f7fa;
            color: #0277bd;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">
            <div class="invoice-title">INVOICE</div>
            <div class="info">
                <p><strong>Order ID:</strong> {{ $order->id }}</p>
                <p><strong>Date:</strong> {{ date('Y-m-d H:i:s', strtotime($order->created_at)) }}</p>
                <p>
                    <strong>Shipping Status:</strong>
                    <span class="status status-{{ $order->shipping_status }}">
                        {{ ucfirst($order->shipping_status) }}
                    </span>
                </p>
                <p>
                    <strong>Payment Status:</strong>
                    <span class="status status-{{ $order->payment_status }}">
                        {{ ucfirst($order->payment_status) }}
                    </span>
                </p>
            </div>
        </div>

        <div class="shipping-address">
            <strong>Shipping Address:</strong><br>
            {{ $order->shipping_address }}
        </div>

        <h3>Order Items</h3>
        <table>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Product</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Subtotal</th>
                </tr>
            </thead>
            <tbody>
                @if(count($order->items) > 0)
                @foreach($order->items as $index => $item)
                <tr>
                    <td>{{ $index + 1 }}</td>
                    <td>
                        @if($item->product)
                        {{ $item->product->title }}
                        @else
                        <em>Product deleted</em>
                        @endif
                    </td>
                    <td>{{ $item->quantity }}</td>
                    <td>Rp {{ number_format($item->price, 0, ',', '.') }}</td>
                    <td>Rp {{ number_format($item->price * $item->quantity, 0, ',', '.') }}</td>
                </tr>
                @endforeach
                @else
                <tr>
                    <td colspan="5" style="text-align: center; color: #999;">No items found</td>
                </tr>
                @endif
            </tbody>
            <tfoot>
                <tr class="total-row">
                    <td colspan="4" class="text-right">Total</td>
                    <td>Rp {{ number_format($order->total_payment, 0, ',', '.') }}</td>
                </tr>
            </tfoot>
        </table>

        <div class="footer">
            <p>Thank you for your purchase!</p>
            <p>Generated on {{ $date }}</p>
        </div>
    </div>
</body>

</html>