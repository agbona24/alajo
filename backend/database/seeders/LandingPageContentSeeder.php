<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\LandingPageContent;

class LandingPageContentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $contents = [
            // Hero Section
            ['section' => 'hero', 'key' => 'badge_text', 'value' => 'Join 10,000+ Happy Savers', 'type' => 'text', 'order' => 1],
            ['section' => 'hero', 'key' => 'title_line1', 'value' => 'Your Money, Your Future', 'type' => 'text', 'order' => 2],
            ['section' => 'hero', 'key' => 'title_line2', 'value' => 'Na Digital Ajo!', 'type' => 'text', 'order' => 3],
            ['section' => 'hero', 'key' => 'subtitle1', 'value' => 'Small small, e go plenty! Save with your people, track every kobo, and achieve your dreams.', 'type' => 'text', 'order' => 4],
            ['section' => 'hero', 'key' => 'subtitle2', 'value' => 'Whether na new phone, school fees, rent, or owambe money - Alajo get you covered. Traditional ajo meet modern tech. No wahala, just results! 💪', 'type' => 'text', 'order' => 5],
            ['section' => 'hero', 'key' => 'cta_primary', 'value' => 'Start Saving Now', 'type' => 'text', 'order' => 6],
            ['section' => 'hero', 'key' => 'cta_secondary', 'value' => 'See How It Works', 'type' => 'text', 'order' => 7],
            ['section' => 'hero', 'key' => 'trust_1', 'value' => '100% Secure', 'type' => 'text', 'order' => 8],
            ['section' => 'hero', 'key' => 'trust_2', 'value' => 'Bank-Level Encryption', 'type' => 'text', 'order' => 9],
            ['section' => 'hero', 'key' => 'trust_3', 'value' => 'Instant Withdrawals', 'type' => 'text', 'order' => 10],

            // Stats
            ['section' => 'stats', 'key' => 'stat1_number', 'value' => '10,000+', 'type' => 'text', 'order' => 1],
            ['section' => 'stats', 'key' => 'stat1_label', 'value' => 'Active Savers', 'type' => 'text', 'order' => 2],
            ['section' => 'stats', 'key' => 'stat2_number', 'value' => '₦2.5B+', 'type' => 'text', 'order' => 3],
            ['section' => 'stats', 'key' => 'stat2_label', 'value' => 'Total Savings', 'type' => 'text', 'order' => 4],
            ['section' => 'stats', 'key' => 'stat3_number', 'value' => '500+', 'type' => 'text', 'order' => 5],
            ['section' => 'stats', 'key' => 'stat3_label', 'value' => 'Active Groups', 'type' => 'text', 'order' => 6],
            ['section' => 'stats', 'key' => 'stat4_number', 'value' => '99.9%', 'type' => 'text', 'order' => 7],
            ['section' => 'stats', 'key' => 'stat4_label', 'value' => 'Success Rate', 'type' => 'text', 'order' => 8],

            // Features
            ['section' => 'features', 'key' => 'section_title', 'value' => 'Everything Wey You Need', 'type' => 'text', 'order' => 1],
            ['section' => 'features', 'key' => 'section_subtitle', 'value' => 'All the tools to make your savings journey sweet', 'type' => 'text', 'order' => 2],
            ['section' => 'features', 'key' => 'feature1_icon', 'value' => '👥', 'type' => 'text', 'order' => 3],
            ['section' => 'features', 'key' => 'feature1_title', 'value' => 'Group Savings (Ajo)', 'type' => 'text', 'order' => 4],
            ['section' => 'features', 'key' => 'feature1_desc', 'value' => 'Join or create ajo groups with your people. Rotate contributions and collect big when na your turn!', 'type' => 'text', 'order' => 5],
            ['section' => 'features', 'key' => 'feature2_icon', 'value' => '💰', 'type' => 'text', 'order' => 6],
            ['section' => 'features', 'key' => 'feature2_title', 'value' => 'Personal Savings', 'type' => 'text', 'order' => 7],
            ['section' => 'features', 'key' => 'feature2_desc', 'value' => 'Create multiple savings plans for different goals. Daily, weekly, or monthly - you choose!', 'type' => 'text', 'order' => 8],
            ['section' => 'features', 'key' => 'feature3_icon', 'value' => '📱', 'type' => 'text', 'order' => 9],
            ['section' => 'features', 'key' => 'feature3_title', 'value' => 'Daily Collections', 'type' => 'text', 'order' => 10],
            ['section' => 'features', 'key' => 'feature3_desc', 'value' => 'Get reminders. Pay from anywhere. Your collector tracks everything for you. E simple die!', 'type' => 'text', 'order' => 11],
            ['section' => 'features', 'key' => 'feature4_icon', 'value' => '📊', 'type' => 'text', 'order' => 12],
            ['section' => 'features', 'key' => 'feature4_title', 'value' => 'Smart Tracking', 'type' => 'text', 'order' => 13],
            ['section' => 'features', 'key' => 'feature4_desc', 'value' => 'See where every kobo dey go. Beautiful charts, instant updates, full transparency.', 'type' => 'text', 'order' => 14],
            ['section' => 'features', 'key' => 'feature5_icon', 'value' => '🔒', 'type' => 'text', 'order' => 15],
            ['section' => 'features', 'key' => 'feature5_title', 'value' => 'Secure Wallet', 'type' => 'text', 'order' => 16],
            ['section' => 'features', 'key' => 'feature5_desc', 'value' => 'Bank-level security. Your money dey safe. Withdraw anytime you need am.', 'type' => 'text', 'order' => 17],
            ['section' => 'features', 'key' => 'feature6_icon', 'value' => '🎯', 'type' => 'text', 'order' => 18],
            ['section' => 'features', 'key' => 'feature6_title', 'value' => 'Goal Setting', 'type' => 'text', 'order' => 19],
            ['section' => 'features', 'key' => 'feature6_desc', 'value' => 'Set targets, track progress, celebrate wins! Every milestone na achievement.', 'type' => 'text', 'order' => 20],

            // How It Works
            ['section' => 'how_it_works', 'key' => 'section_title', 'value' => 'How E Dey Work', 'type' => 'text', 'order' => 1],
            ['section' => 'how_it_works', 'key' => 'section_subtitle', 'value' => 'Start saving in just 3 simple steps', 'type' => 'text', 'order' => 2],
            ['section' => 'how_it_works', 'key' => 'step1_number', 'value' => '1', 'type' => 'text', 'order' => 3],
            ['section' => 'how_it_works', 'key' => 'step1_title', 'value' => 'Create Account', 'type' => 'text', 'order' => 4],
            ['section' => 'how_it_works', 'key' => 'step1_desc', 'value' => 'Sign up with your phone number. E dey take less than 2 minutes. No long thing!', 'type' => 'text', 'order' => 5],
            ['section' => 'how_it_works', 'key' => 'step2_number', 'value' => '2', 'type' => 'text', 'order' => 6],
            ['section' => 'how_it_works', 'key' => 'step2_title', 'value' => 'Choose Your Plan', 'type' => 'text', 'order' => 7],
            ['section' => 'how_it_works', 'key' => 'step2_desc', 'value' => 'Join existing ajo group or create personal savings plan. You fit do both sef!', 'type' => 'text', 'order' => 8],
            ['section' => 'how_it_works', 'key' => 'step3_number', 'value' => '3', 'type' => 'text', 'order' => 9],
            ['section' => 'how_it_works', 'key' => 'step3_title', 'value' => 'Start Saving', 'type' => 'text', 'order' => 10],
            ['section' => 'how_it_works', 'key' => 'step3_desc', 'value' => 'Make contributions, track your progress, and watch your money grow. E dey sweet!', 'type' => 'text', 'order' => 11],

            // Testimonials
            ['section' => 'testimonials', 'key' => 'section_title', 'value' => 'Wetin People Dey Talk', 'type' => 'text', 'order' => 1],
            ['section' => 'testimonials', 'key' => 'section_subtitle', 'value' => 'Hear from our happy savers', 'type' => 'text', 'order' => 2],
            ['section' => 'testimonials', 'key' => 'testimonial1_avatar', 'value' => '👩‍💼', 'type' => 'text', 'order' => 3],
            ['section' => 'testimonials', 'key' => 'testimonial1_name', 'value' => 'Chioma Okafor', 'type' => 'text', 'order' => 4],
            ['section' => 'testimonials', 'key' => 'testimonial1_role', 'value' => 'Small Business Owner', 'type' => 'text', 'order' => 5],
            ['section' => 'testimonials', 'key' => 'testimonial1_text', 'value' => 'This app don change my life! I save ₦500 everyday with my market women group. Last month, I collect ₦75,000 when na my turn. I use am expand my business. God bless Alajo!', 'type' => 'text', 'order' => 6],
            ['section' => 'testimonials', 'key' => 'testimonial2_avatar', 'value' => '👨‍🎓', 'type' => 'text', 'order' => 7],
            ['section' => 'testimonials', 'key' => 'testimonial2_name', 'value' => 'Ibrahim Musa', 'type' => 'text', 'order' => 8],
            ['section' => 'testimonials', 'key' => 'testimonial2_role', 'value' => 'University Student', 'type' => 'text', 'order' => 9],
            ['section' => 'testimonials', 'key' => 'testimonial2_text', 'value' => 'My guy, this thing too dey work! Me and my roommates save ₦1000 daily. In 3 months, I get money buy new laptop for school. The tracking system na correct something.', 'type' => 'text', 'order' => 10],
            ['section' => 'testimonials', 'key' => 'testimonial3_avatar', 'value' => '👩‍⚕️', 'type' => 'text', 'order' => 11],
            ['section' => 'testimonials', 'key' => 'testimonial3_name', 'value' => 'Blessing Adewale', 'type' => 'text', 'order' => 12],
            ['section' => 'testimonials', 'key' => 'testimonial3_role', 'value' => 'Nurse', 'type' => 'text', 'order' => 13],
            ['section' => 'testimonials', 'key' => 'testimonial3_text', 'value' => 'Security na number one for me. With this app, I fit track every kobo. The daily reminders dey help me stay consistent. I don already save ₦200,000 in 6 months!', 'type' => 'text', 'order' => 14],

            // CTA
            ['section' => 'cta', 'key' => 'title', 'value' => 'Ready to Start Your Journey?', 'type' => 'text', 'order' => 1],
            ['section' => 'cta', 'key' => 'subtitle', 'value' => 'Join thousands of Nigerians building wealth, one naira at a time', 'type' => 'text', 'order' => 2],
            ['section' => 'cta', 'key' => 'button_text', 'value' => 'Create Free Account', 'type' => 'text', 'order' => 3],
            ['section' => 'cta', 'key' => 'subtext', 'value' => 'No credit card required • Start with ₦500', 'type' => 'text', 'order' => 4],

            // Footer
            ['section' => 'footer', 'key' => 'tagline', 'value' => 'Save Small Small, Prosper Big Big', 'type' => 'text', 'order' => 1],
            ['section' => 'footer', 'key' => 'description', 'value' => 'The modern way to save with your people. Built for Nigerians, by Nigerians.', 'type' => 'text', 'order' => 2],
            ['section' => 'footer', 'key' => 'copyright', 'value' => '© 2024 Alajo. All rights reserved. Built with ❤️ in Nigeria.', 'type' => 'text', 'order' => 3],
        ];

        foreach ($contents as $content) {
            LandingPageContent::updateOrCreate(
                [
                    'section' => $content['section'],
                    'key' => $content['key'],
                ],
                [
                    'value' => $content['value'],
                    'type' => $content['type'],
                    'order' => $content['order'],
                    'is_active' => true,
                ]
            );
        }

        $this->command->info('Landing page content seeded successfully!');
    }
}
