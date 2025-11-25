<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LandingPageContent;

class LandingPageController extends Controller
{
    /**
     * Get all landing page content organized by section
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $sections = ['hero', 'stats', 'features', 'how_it_works', 'testimonials', 'cta', 'footer'];

        $content = [];

        foreach ($sections as $section) {
            $sectionContent = LandingPageContent::getBySection($section);

            // Convert the collection to an array with key-value pairs
            $content[$section] = $sectionContent->mapWithKeys(function ($item) {
                return [$item->key => $item->value];
            })->toArray();
        }

        return response()->json([
            'success' => true,
            'data' => $content
        ]);
    }

    /**
     * Get content for a specific section
     *
     * @param string $section
     * @return \Illuminate\Http\JsonResponse
     */
    public function getSection($section)
    {
        $validSections = ['hero', 'stats', 'features', 'how_it_works', 'testimonials', 'cta', 'footer'];

        if (!in_array($section, $validSections)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid section'
            ], 404);
        }

        $sectionContent = LandingPageContent::getBySection($section);

        // Convert to key-value pairs
        $content = $sectionContent->mapWithKeys(function ($item) {
            return [$item->key => $item->value];
        })->toArray();

        return response()->json([
            'success' => true,
            'data' => $content
        ]);
    }

    /**
     * Get a single content item
     *
     * @param string $section
     * @param string $key
     * @return \Illuminate\Http\JsonResponse
     */
    public function getContent($section, $key)
    {
        $content = LandingPageContent::getContent($section, $key);

        if ($content === null) {
            return response()->json([
                'success' => false,
                'message' => 'Content not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $content
        ]);
    }
}
