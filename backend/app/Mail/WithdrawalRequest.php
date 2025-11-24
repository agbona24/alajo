<?php

namespace App\Mail;

use App\Models\Withdrawal;
use App\Models\Setting;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class WithdrawalRequest extends Mailable
{
    use SerializesModels;

    public Withdrawal $withdrawal;
    public string $appName;

    /**
     * Create a new message instance.
     */
    public function __construct(Withdrawal $withdrawal)
    {
        $this->withdrawal = $withdrawal;
        $this->appName = Setting::get('app_name', config('app.name'));
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Withdrawal Request Received - ' . $this->appName,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.withdrawal-request',
            with: [
                'withdrawal' => $this->withdrawal,
                'user' => $this->withdrawal->user,
                'plan' => $this->withdrawal->savingsPlan,
                'bankAccount' => $this->withdrawal->bankAccount,
                'appName' => $this->appName,
            ],
        );
    }

    /**
     * Get the attachments for the message.
     */
    public function attachments(): array
    {
        return [];
    }
}
