<?php

use App\Helpers\CurrencyHelper;

if (!function_exists('currency')) {
    /**
     * Format amount with currency settings.
     *
     * @param float|int $amount
     * @param bool $showSymbol
     * @return string
     */
    function currency($amount, $showSymbol = true)
    {
        return CurrencyHelper::format($amount, $showSymbol);
    }
}

if (!function_exists('currency_symbol')) {
    /**
     * Get currency symbol.
     *
     * @return string
     */
    function currency_symbol()
    {
        return CurrencyHelper::symbol();
    }
}

if (!function_exists('currency_code')) {
    /**
     * Get currency code.
     *
     * @return string
     */
    function currency_code()
    {
        return CurrencyHelper::code();
    }
}

if (!function_exists('currency_settings')) {
    /**
     * Get all currency settings.
     *
     * @return array
     */
    function currency_settings()
    {
        return CurrencyHelper::settings();
    }
}
