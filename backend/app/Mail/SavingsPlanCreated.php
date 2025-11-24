<?php

namespace App\Mail;

use App\Models\SavingsPlan;
use App\Models\Setting;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class SavingsPlanCreated extends Mailable
{
    use SerializesModels;

    public SavingsPlan $plan;
    public string $appName;

    /**
     * Create a new message instance.
     */
    public function __construct(SavingsPlan $plan)
    {
        $this->plan = $plan;
        $this->appName = Setting::get('app_name', config('app.name'));
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'New Savings Plan Created - ' . $this->appName,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.savings-plan-created',
            with: [
                'plan' => $this->plan,
                'user' => $this->plan->user,
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
