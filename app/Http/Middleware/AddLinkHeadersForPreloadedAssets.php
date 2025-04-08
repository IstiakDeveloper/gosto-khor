<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Vite;
use Symfony\Component\HttpFoundation\Response;

class AddLinkHeadersForPreloadedAssets
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        if (app()->environment('local')) {
            return $response;
        }

        if (method_exists($response->headers, 'preload')) {
            if (Vite::manifestHash()) {
                // Preload CSS
                $response->headers->preload(
                    Vite::asset('resources/js/app.tsx'),
                    ['as' => 'script', 'type' => 'module']
                );

                // Add more preloaded assets if needed
            }
        }

        return $response;
    }
}
