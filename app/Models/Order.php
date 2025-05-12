<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Order extends Model
{
    use HasFactory;

    // Disable auto-increment since we'll manually set order ID
    public $incrementing = false;

    // Change keyType to string since our order ID contains non-numeric characters
    protected $keyType = 'string';
    protected $table = 'order';

    protected $fillable = [
        'id', // Make sure 'id' is in fillable array
        'user_id',
        'product_id',
        'quantity',
        'total_price',
        'total_payment',
        'payment_status',
        'payment_method',
        'shipping_address',
        'shipping_status',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function product()
    {
        return $this->belongsTo(Products::class);
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    /**
     * Calculate the tax amount (11%)
     * 
     * @return float
     */
    public function getTaxAmount()
    {
        return round($this->total_price * 0.11);
    }

    /**
     * Check if the total_payment already includes tax
     * This helps with backward compatibility for older orders
     * 
     * @return bool
     */
    public function includesTax()
    {
        $withTax = $this->total_price + $this->getTaxAmount();
        // Allow for minor rounding differences
        return abs($this->total_payment - $withTax) < 10;
    }

    /**
     * Get the total amount with tax
     * 
     * @return float
     */
    public function getTotalWithTax()
    {
        if ($this->includesTax()) {
            return $this->total_payment;
        }
        return $this->total_price + $this->getTaxAmount();
    }
}
