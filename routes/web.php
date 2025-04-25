<?php

use App\Http\Controllers\CartController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductsController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserController;
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

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

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
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
    Route::post('/cart', [CartController::class, 'store'])->name('cart.store');
    Route::put('/cart/{cart}', [CartController::class, 'update'])->name('cart.update'); // Changed to PUT
    Route::delete('/cart/{cart}', [CartController::class, 'destroy'])->name('cart.destroy');
});
// Miscellaneous routes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/guest', function () {
        return Inertia::render('Guest/Guest');
    })->name('guest');
    Route::get('/creation', function () {
        return Inertia::render('Creation/Creation');
    })->name('creation');
    Route::get('/shipping', function () {
        return Inertia::render('ShippingOrder/ShippingOrder');
    })->name('shipping');
});

// Profile routes
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
