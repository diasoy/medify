<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>Invoice #{{ $order->id }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 12px;
            line-height: 1.4;
        }

        .header {
            text-align: center;
            margin-bottom: 30px;
        }

        .invoice-info {
            margin-bottom: 20px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }

        th,
        td {
            padding: 8px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }

        th {
            background-color: #f3f3f3;
        }

        .total-row {
            font-weight: bold;
            background-color: #f3f3f3;
        }

        .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 11px;
            color: #777;
        }
    </style>
</head>

<body>
    <div class="header">
        <h1>Medify - Invoice</h1>
        <h2>Order #{{ $order->id }}</h2>
    </div>

    <div class="invoice-info">
        <p><strong>Order Date:</strong> {{ \Carbon\Carbon::parse($order->created_at)->format('F d, Y h:i A') }}</p>
        <p><strong>Customer:</strong> {{ $order->user->name }}</p>
        <p><strong>Email:</strong> {{ $order->user->email }}</p>
        <p><strong>Shipping Address:</strong> {{ $order->shipping_address }}</p>
        <p><strong>Payment Status:</strong> {{ ucfirst($order->payment_status) }}</p>
        <p><strong>Shipping Status:</strong> {{ ucfirst($order->shipping_status) }}</p>
    </div>

    <h3>Order Items</h3>
    <table>
        <thead>
            <tr>
                <th>#</th>
                <th>Product</th>
                <th>Quantity</th>
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
                <td>{{ number_format($item->price, 0, ',', '.') }}</td>
                <td>{{ number_format($item->price * $item->quantity, 0, ',', '.') }}</td>
            </tr>
            @endforeach
        </tbody>
        <tfoot>
            <tr>
                <td colspan="4" style="text-align: right;"><strong>Subtotal</strong></td>
                <td>{{ number_format($order->total_price, 0, ',', '.') }}</td>
            </tr>
            <tr>
                <td colspan="4" style="text-align: right;"><strong>Tax (11%)</strong></td>
                <td>{{ number_format($order->getTaxAmount(), 0, ',', '.') }}</td>
            </tr>
            <tr class="total-row">
                <td colspan="4" style="text-align: right;"><strong>Total Payment</strong></td>
                <td>{{ number_format($order->total_payment, 0, ',', '.') }}</td>
            </tr>
        </tfoot>
    </table>

    <div>
        <h3>Thank you for your purchase!</h3>
        <p>If you have any questions about your order, please contact our customer support.</p>
    </div>

    <div class="footer">
        <p>© {{ date('Y') }} Medify. All rights reserved.</p>
        <p>Generated on {{ $date }}</p>
    </div>
</body>

</html>