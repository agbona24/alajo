<?php

namespace App\Mail;

use App\Models\Contribution;
use App\Models\Setting;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PaymentConfirmation extends Mailable
{
    use SerializesModels;

    public Contribution $contribution;
    public string $appName;

    /**
     * Create a new message instance.
     */
    public function __construct(Contribution $contribution)
    {
        $this->contribution = $contribution;
        $this->appName = Setting::get('app_name', config('app.name'));
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Payment Confirmed - ' . $this->appName,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.payment-confirmation',
            with: [
                'contribution' => $this->contribution,
                'user' => $this->contribution->user,
                'plan' => $this->contribution->savingsPlan,
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
