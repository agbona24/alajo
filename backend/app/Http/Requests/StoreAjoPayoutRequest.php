<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAjoPayoutRequest extends FormRequest
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
            'member_id' => ['required', 'integer', 'exists:ajo_members,id'],
            'cycle_number' => ['required', 'integer', 'min:1'],
            'scheduled_date' => ['sometimes', 'date', 'after_or_equal:today'],
            'notes' => ['nullable', 'string', 'max:1000'],
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
            'member_id.required' => 'Please select a member for the payout',
            'member_id.exists' => 'Selected member does not exist',
            'cycle_number.required' => 'Cycle number is required',
            'cycle_number.min' => 'Cycle number must be at least 1',
            'scheduled_date.after_or_equal' => 'Scheduled date cannot be in the past',
        ];
    }
}
