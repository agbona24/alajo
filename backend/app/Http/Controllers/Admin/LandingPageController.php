<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\LandingPageContent;
use Illuminate\Http\Request;

class LandingPageController extends Controller
{
    /**
     * Display landing page content grouped by section
     */
    public function index()
    {
        $sections = [
            'hero' => 'Hero Section',
            'stats' => 'Statistics',
            'features' => 'Features',
            'how_it_works' => 'How It Works',
            'testimonials' => 'Testimonials',
            'cta' => 'Call to Action',
            'footer' => 'Footer'
        ];

        $contentBySection = [];
        foreach ($sections as $key => $label) {
            $contentBySection[$key] = [
                'label' => $label,
                'items' => LandingPageContent::where('section', $key)
                    ->orderBy('order')
                    ->get()
            ];
        }

        return view('admin.landing-page.index', compact('contentBySection', 'sections'));
    }

    /**
     * Show edit form for a section
     */
    public function editSection($section)
    {
        $sections = [
            'hero' => 'Hero Section',
            'stats' => 'Statistics',
            'features' => 'Features',
            'how_it_works' => 'How It Works',
            'testimonials' => 'Testimonials',
            'cta' => 'Call to Action',
            'footer' => 'Footer'
        ];

        if (!isset($sections[$section])) {
            return redirect()->route('admin.landing-page.index')
                ->with('error', 'Invalid section');
        }

        $contents = LandingPageContent::where('section', $section)
            ->orderBy('order')
            ->get();

        return view('admin.landing-page.edit-section', [
            'section' => $section,
            'sectionLabel' => $sections[$section],
            'contents' => $contents
        ]);
    }

    /**
     * Update section content
     */
    public function updateSection(Request $request, $section)
    {
        $request->validate([
            'contents' => 'required|array',
            'contents.*.id' => 'required|exists:landing_page_contents,id',
            'contents.*.value' => 'required|string',
            'contents.*.is_active' => 'sometimes|boolean',
        ]);

        foreach ($request->contents as $contentData) {
            $content = LandingPageContent::find($contentData['id']);
            if ($content && $content->section === $section) {
                $content->update([
                    'value' => $contentData['value'],
                    'is_active' => $contentData['is_active'] ?? true,
                ]);
            }
        }

        return redirect()->route('admin.landing-page.edit-section', $section)
            ->with('success', 'Section content updated successfully!');
    }

    /**
     * Edit individual content item
     */
    public function edit($id)
    {
        $content = LandingPageContent::findOrFail($id);
        return view('admin.landing-page.edit', compact('content'));
    }

    /**
     * Update individual content item
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'value' => 'required|string',
            'is_active' => 'sometimes|boolean',
            'order' => 'sometimes|integer',
        ]);

        $content = LandingPageContent::findOrFail($id);
        $content->update([
            'value' => $request->value,
            'is_active' => $request->has('is_active'),
            'order' => $request->order ?? $content->order,
        ]);

        return redirect()->route('admin.landing-page.edit-section', $content->section)
            ->with('success', 'Content updated successfully!');
    }

    /**
     * Toggle content active status
     */
    public function toggleActive($id)
    {
        $content = LandingPageContent::findOrFail($id);
        $content->update(['is_active' => !$content->is_active]);

        return back()->with('success', 'Content status updated successfully!');
    }
}
