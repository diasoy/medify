<!DOCTYPE html>
<html>

<head>
    <title>Order #{{ $order->id }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 14px;
            line-height: 1.5;
        }

        .header {
            text-align: center;
            margin-bottom: 30px;
        }

        .invoice-title {
            font-size: 24px;
            font-weight: bold;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        table th,
        table td {
            border: 1px solid #ddd;
            padding: 8px;
        }

        table th {
            background-color: #f2f2f2;
            text-align: left;
        }

        .total-row {
            font-weight: bold;
        }

        .info-section {
            margin-bottom: 20px;
        }
    </style>
</head>

<body>
    <div class="header">
        <div class="invoice-title">INVOICE</div>
        <p>Order ID: {{ $order->id }}</p>
        <p>Date: {{ date('Y-m-d H:i', strtotime($order->created_at)) }}</p>
    </div>

    <div class="info-section">
        <h3>Shipping Information</h3>
        <p>{{ $order->shipping_address }}</p>
    </div>

    <div class="info-section">
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
                @foreach($order->items as $index => $item)
                <tr>
                    <td>{{ $index + 1 }}</td>
                    <td>{{ $item->product ? $item->product->title : 'Product deleted' }}</td>
                    <td>{{ $item->quantity }}</td>
                    <td>{{ 'Rp ' . number_format($item->price, 0, ',', '.') }}</td>
                    <td>{{ 'Rp ' . number_format($item->price * $item->quantity, 0, ',', '.') }}</td>
                </tr>
                @endforeach
            </tbody>
            <tfoot>
                <tr class="total-row">
                    <td colspan="4" style="text-align: right;">Total</td>
                    <td>{{ 'Rp ' . number_format($order->total_payment, 0, ',', '.') }}</td>
                </tr>
            </tfoot>
        </table>
    </div>

    <div class="info-section">
        <p><strong>Payment Status:</strong> {{ ucfirst($order->payment_status) }}</p>
        <p><strong>Shipping Status:</strong> {{ ucfirst($order->shipping_status) }}</p>
    </div>
</body>

</html>