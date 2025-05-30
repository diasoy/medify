<?php

use App\Http\Controllers\CartController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductsController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\DashboardController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', [DashboardController::class, 'index'])->middleware(['auth', 'verified'])->name('dashboard');

// Customer routes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/customer', [UserController::class, 'index'])->name('customer');
    Route::delete('/customer/{id}', [UserController::class, 'destroy'])->name('customer.destroy');
});

// Category routes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('categories', CategoryController::class);
});

// Product routes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('products', ProductsController::class);
});

// Cart routes
Route::middleware(['auth'])->group(function () {
    Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
    Route::post('/cart', [CartController::class, 'store'])->name('cart.store');
    Route::put('/cart/{cart}', [CartController::class, 'update'])->name('cart.update');
    Route::delete('/cart/{cart}', [CartController::class, 'destroy'])->name('cart.destroy');

    Route::post('/cart/update-payment-status', [CartController::class, 'updatePaymentStatus'])->name('cart.updatePaymentStatus');
});

// Miscellaneous routes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/guest', function () {
        return Inertia::render('Guest/Guest');
    })->name('guest');
    Route::get('/creation', function () {
        return Inertia::render('Creation/Creation');
    })->name('creation');
});

// Profile routes
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

//Order routes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('order', OrderController::class);
    Route::get('/order/status/{orderId}', [OrderController::class, 'getOrderStatus'])
        ->name('order.status');
    // New route for updating shipping status
    Route::patch('/order/{orderId}/shipping', [OrderController::class, 'updateShippingStatus'])->name('order.shipping.update');
    Route::get('/order/{order}/pdf', [App\Http\Controllers\OrderController::class, 'generatePdf'])
        ->middleware(['auth'])
        ->name('order.pdf');
});

Route::post('/checkout', [OrderController::class, 'checkout'])->name('checkout');

// Midtrans notification handling (must be accessible without authentication)
Route::post('/midtrans/notification', [OrderController::class, 'handleNotification'])
    ->name('midtrans.notification')
    ->withoutMiddleware(['web', 'auth', 'csrf']);

require __DIR__ . '/auth.php';
