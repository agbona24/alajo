<?php

namespace App\Helpers;

use App\Models\Setting;

class CurrencyHelper
{
    /**
     * Format amount with currency settings.
     */
    public static function format($amount, $showSymbol = true)
    {
        $symbol = Setting::get('currency_symbol', '₦');
        $position = Setting::get('currency_position', 'before');
        $thousandSeparator = Setting::get('thousand_separator', ',');
        $decimalSeparator = Setting::get('decimal_separator', '.');
        $decimalPlaces = (int) Setting::get('decimal_places', 2);

        // Format the number
        $formattedAmount = number_format(
            (float) $amount,
            $decimalPlaces,
            $decimalSeparator,
            $thousandSeparator
        );

        if (!$showSymbol) {
            return $formattedAmount;
        }

        // Add currency symbol based on position
        return $position === 'before'
            ? $symbol . $formattedAmount
            : $formattedAmount . $symbol;
    }

    /**
     * Get currency symbol.
     */
    public static function symbol()
    {
        return Setting::get('currency_symbol', '₦');
    }

    /**
     * Get currency code.
     */
    public static function code()
    {
        return Setting::get('default_currency', 'NGN');
    }

    /**
     * Get all currency settings.
     */
    public static function settings()
    {
        return [
            'symbol' => self::symbol(),
            'code' => self::code(),
            'position' => Setting::get('currency_position', 'before'),
            'thousand_separator' => Setting::get('thousand_separator', ','),
            'decimal_separator' => Setting::get('decimal_separator', '.'),
            'decimal_places' => (int) Setting::get('decimal_places', 2),
        ];
    }
}
