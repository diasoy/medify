<?php

namespace App\Http\Controllers;

use App\Models\Products;
use Illuminate\Http\Request;
use App\Models\Category;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class ProductsController extends Controller
{
    public function index(Request $request)
    {
        $query = Products::query();

        if ($request->has('category_id') && $request->category_id !== '') {
            $query->where('category_id', $request->category_id);
        }

        if ($request->has('search') && $request->search !== '') {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'like', '%' . $request->search . '%')
                    ->orWhere('description', 'like', '%' . $request->search . '%');
            });
        }

        $products = $query->with('category')->paginate(5)->withQueryString();
        $categories = Category::all();

        if (auth()->user()->role === 'admin') {
            return Inertia::render('Products/Index', [
                'products' => $products,
                'categories' => $categories,
                'filters' => $request->only(['search', 'category_id']),
            ]);
        } else {
            return Inertia::render('Products/Index', [
                'products' => $products,
                'categories' => $categories,
                'filters' => $request->only(['search', 'category_id']),
            ]);
        }
    }

    public function create()
    {
        $categories = Category::all();
        return Inertia::render('Products/Create', [
            'categories' => $categories,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'required|string|unique:products,slug',
            'price' => 'required|numeric',
            'description' => 'required|string',
            'category_id' => 'required|exists:categories,id',
            'linkImage' => 'required|image|mimes:jpeg,png,jpg|max:1024',
        ]);

        $imagePath = null;
        if ($request->hasFile('linkImage')) {
            $image = $request->file('linkImage');
            $imageName = uniqid() . '.' . $image->getClientOriginalExtension();
            $imagePath = $image->storeAs('products', $imageName, 'public');
        }

        Products::create([
            'title' => $request->title,
            'slug' => $request->slug,
            'price' => $request->price,
            'description' => $request->description,
            'category_id' => $request->category_id,
            'linkImage' => $imagePath,
        ]);

        return redirect()->route('products.index')->with('success', 'Product created successfully.');
    }

    public function update(Request $request, $id)
    {
        $product = Products::findOrFail($id);

        $request->validate([
            'title' => 'required',
            'slug' => 'required|unique:products,slug,' . $id,
            'price' => 'required|numeric',
            'description' => 'required',
            'category_id' => 'required|exists:categories,id',
            'linkImage' => 'nullable|image|mimes:jpeg,png,jpg|max:1024',
        ]);

        $data = $request->except('linkImage');

        if ($request->hasFile('linkImage')) {
            if ($product->linkImage && Storage::disk('public')->exists($product->linkImage)) {
                Storage::disk('public')->delete($product->linkImage);
            }

            $image = $request->file('linkImage');
            $imageName = uniqid() . '.' . $image->getClientOriginalExtension();
            $data['linkImage'] = $image->storeAs('products', $imageName, 'public');
        }

        $product->update($data);

        return redirect()->route('products.index')->with('success', 'Product updated successfully.');
    }

    public function show($id)
    {
        $product = Products::with('category')->findOrFail($id);

        return Inertia::render('Products/Show', [
            'product' => $product,
        ]);
    }

    public function edit(Products $product)
    {
        $categories = Category::all();
        return Inertia::render('Products/Edit', [
            'product' => $product,
            'categories' => $categories,
        ]);
    }

    public function destroy($id)
    {
        $product = Products::findOrFail($id);

        if ($product->linkImage && Storage::disk('public')->exists($product->linkImage)) {
            Storage::disk('public')->delete($product->linkImage);
        }

        $product->delete();

        return redirect()->route('products.index')->with('success', 'Product deleted successfully.');
    }

    public function getProductsByCategory($categoryId)
    {
        $products = Products::where('category_id', $categoryId)->with('category')->get();
        return response()->json($products);
    }

    public function getProductById($id)
    {
        $product = Products::with('category')->findOrFail($id);
        return response()->json($product);
    }
}
