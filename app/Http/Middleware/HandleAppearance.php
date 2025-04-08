<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class HandleAppearance
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->hasCookie('appearance')) {
            $appearance = $request->cookie('appearance');
            config(['appearance.theme' => $appearance]);
        }

        if ($request->hasCookie('sidebar_state')) {
            $sidebarState = $request->cookie('sidebar_state');
            config(['appearance.sidebar_state' => $sidebarState]);
        }

        return $next($request);
    }
}
