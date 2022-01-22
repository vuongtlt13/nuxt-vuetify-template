<?php

namespace Vuongdq\NuxtVuetifyTemplate;

use Illuminate\Support\ServiceProvider;

class NuxtVuetifyTemplateServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap the application services.
     *
     * @return void
     */
    public function boot()
    {
        $this->loadViewsFrom(__DIR__ . '/../views', 'nuxt-vuetify-template');
    }

    /**
     * Register the application services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->singleton('ViewProcessor', function ($app) {
            return new ViewProcessor();
        });
    }
}
