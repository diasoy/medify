<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::paginate(5);
        return Inertia::render('Category/Category', [
            'categories' => $categories,
        ]);
    }

    public function create()
    {
        return Inertia::render('Category/CreateCategory');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:categories',
        ]);

        Category::create($request->only('name'));

        return redirect()->route('category.index')->with('success', 'Category created successfully.');
    }
    public function edit($id)
    {
        $category = Category::findOrFail($id);

        return Inertia::render('Category/EditCategory', [
            'category' => $category,
        ]);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:categories,name,' . $id,
        ]);

        $category = Category::findOrFail($id);
        $category->update($request->only('name'));

        return redirect()->route('category.index')->with('success', 'Category updated successfully.');
    }

    public function destroy($id)
    {
        $category = Category::findOrFail($id);

        if ($category->products()->count() > 0) {
            return redirect()->route('category.index')->with('error', 'Cannot delete category with associated products.');
        }

        $category->delete();

        return redirect()->route('category.index')->with('success', 'Category deleted successfully.');
    }
}
