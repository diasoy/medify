<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\User;
use App\Models\Products;
use App\Models\Category;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $role = $user->role;

        if ($role === 'admin') {
            $totalOrders = Order::count();
            $totalRevenue = Order::where('shipping_status', 'delivered')->sum('total_payment');
            $totalCustomers = User::where('role', 'customer')->count();
            $totalCategories = Category::count();
            $totalProducts = Products::count();
            $completedOrders = Order::where('shipping_status', 'delivered')->count();

            $monthlyOrdersRaw = Order::selectRaw('MONTH(created_at) as month, COUNT(*) as count')
                ->groupBy('month')
                ->orderBy('month')
                ->get();

            $monthlyOrders = [
                'labels' => $monthlyOrdersRaw->pluck('month')->map(function ($month) {
                    return date('F', mktime(0, 0, 0, $month, 1));
                }),
                'datasets' => [
                    [
                        'label' => 'Orders',
                        'data' => $monthlyOrdersRaw->pluck('count'),
                        'backgroundColor' => 'rgba(75, 192, 192, 0.2)',
                        'borderColor' => 'rgba(75, 192, 192, 1)',
                        'borderWidth' => 1,
                    ],
                ],
            ];

            return Inertia::render('Dashboard', [
                'userRole' => $role,
                'totalOrders' => $totalOrders,
                'totalRevenue' => $totalRevenue,
                'totalCustomers' => $totalCustomers,
                'totalCategories' => $totalCategories,
                'totalProducts' => $totalProducts,
                'completedOrders' => $completedOrders,
                'monthlyOrders' => $monthlyOrders,
            ]);
        } elseif ($role === 'customer') {
            $totalOrders = Order::where('user_id', $user->id)->count();
            $completedOrders = Order::where('user_id', $user->id)
                ->where('shipping_status', 'delivered')
                ->count();

            return Inertia::render('Dashboard', [
                'userRole' => $role,
                'totalOrders' => $totalOrders,
                'completedOrders' => $completedOrders,
            ]);
        }

        abort(403, 'Unauthorized');
    }
}
