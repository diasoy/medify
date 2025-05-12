<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Receipt</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }

        .header {
            text-align: center;
            margin-bottom: 30px;
        }

        .logo {
            font-size: 24px;
            font-weight: bold;
            color: #4F46E5;
        }

        .invoice-info {
            margin-bottom: 20px;
            padding: 15px;
            background-color: #f9fafb;
            border-radius: 5px;
        }

        .invoice-info p {
            margin: 5px 0;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }

        th,
        td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }

        th {
            background-color: #f3f4f6;
        }

        .total-row {
            font-weight: bold;
            background-color: #f3f4f6;
        }

        .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 14px;
            color: #6b7280;
        }

        .status {
            display: inline-block;
            padding: 5px 10px;
            border-radius: 4px;
            font-weight: bold;
        }

        .success {
            background-color: #d1fae5;
            color: #065f46;
        }

        .pending {
            background-color: #fef3c7;
            color: #92400e;
        }

        .shipped {
            background-color: #dbeafe;
            color: #1e40af;
        }
    </style>
</head>

<body>
    <div class="header">
        <div class="logo">Medify</div>
        <h1>Order Receipt</h1>
    </div>

    <div class="invoice-info">
        <p><strong>Order ID:</strong> {{ $order->id }}</p>
        <p><strong>Order Date:</strong> {{ \Carbon\Carbon::parse($order->created_at)->format('F d, Y h:i A') }}</p>
        <p><strong>Customer:</strong> {{ $order->user->name }}</p>
        <p><strong>Email:</strong> {{ $order->user->email }}</p>
        <p><strong>Shipping Address:</strong> {{ $order->shipping_address }}</p>
        <p>
            <strong>Payment Status:</strong>
            <span class="status {{ $order->payment_status === 'success' ? 'success' : 'pending' }}">
                {{ ucfirst($order->payment_status) }}
            </span>
        </p>
        <p>
            <strong>Shipping Status:</strong>
            <span class="status {{ $order->shipping_status === 'shipped' ? 'shipped' : 'pending' }}">
                {{ ucfirst($order->shipping_status) }}
            </span>
        </p>
    </div>

    <h2>Order Items</h2>
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
    </div>
</body>

</html>