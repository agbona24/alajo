<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAjoGroupRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'contribution_amount' => ['required', 'numeric', 'min:100'],
            'group_size' => ['required', 'integer', 'min:3', 'max:50'],
            'rotation_type' => ['required', 'in:daily,weekly,biweekly,monthly'],
            'selection_method' => ['required', 'in:sequential,random,bid'],
            'start_date' => ['required', 'date', 'after_or_equal:today'],
            'auto_reminders' => ['boolean'],
            'require_approval' => ['boolean'],
            'settings' => ['nullable', 'array'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Please provide a name for your Ajo group',
            'contribution_amount.required' => 'Contribution amount is required',
            'contribution_amount.min' => 'Contribution amount must be at least ₦100',
            'group_size.min' => 'Group must have at least 3 members',
            'group_size.max' => 'Group cannot exceed 50 members',
            'start_date.after_or_equal' => 'Start date cannot be in the past',
        ];
    }
}
