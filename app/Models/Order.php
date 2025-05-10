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

    // Remove UUID auto-generation
    // protected static function boot() {
    //     parent::boot();
    //     static::creating(function ($model) {
    //         if (empty($model->id)) {
    //             $model->id = (string) Str::uuid();
    //         }
    //     });
    // }

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
}
