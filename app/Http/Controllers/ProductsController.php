<?php

namespace App\Http\Controllers;

use App\Models\Products;

use Illuminate\Http\Request;

class ProductsController extends Controller
{
    //
    public function show($id)
    {
        // Fetch the product by ID
        $product = Products::findOrFail($id);

        // Return the product details view
        return view('products.show', compact('product'));
    }
}
