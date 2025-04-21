<?php

use App\Http\Controllers\CategoryController;
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
    Route::get('/category', [CategoryController::class, 'index'])->name('category.index'); // List
    Route::get('/category/create', [CategoryController::class, 'create'])->name('category.create'); // Create Form
    Route::post('/category', [CategoryController::class, 'store'])->name('category.store'); // Store
    Route::get('/category/{id}/edit', [CategoryController::class, 'edit'])->name('category.edit'); // Edit Form
    Route::put('/category/{id}', [CategoryController::class, 'update'])->name('category.update'); // Update
    Route::delete('/category/{id}', [CategoryController::class, 'destroy'])->name('category.destroy'); // Delete
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
    Route::get('/products', function () {
        return Inertia::render('Products/Products');
    })->name('products');
    Route::get('/cart', function () {
        return Inertia::render('Cart/Cart');
    })->name('cart');
});

// Profile routes
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
