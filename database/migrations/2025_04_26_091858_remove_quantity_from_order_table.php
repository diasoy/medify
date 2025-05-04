<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class RemoveQuantityFromOrderTable extends Migration
{
    public function up()
    {
        Schema::table('order', function (Blueprint $table) {
            $table->dropColumn('quantity');
        });
    }

    public function down()
    {
        Schema::table('order', function (Blueprint $table) {
            $table->integer('quantity')->nullable();
        });
    }
}
