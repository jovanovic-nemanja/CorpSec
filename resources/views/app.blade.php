<!DOCTYPE html>
<html lang="{{config('config.system.locale') ?? 'en'}}" dir="ltr">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <!-- Tell the browser to be responsive to screen width -->
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="description" content="Application by KodeMint">
        <meta name="author" content="KodeMint">
        <title>{{ config('config.basic.app_name') }}</title>
        <link rel="apple-touch-icon" sizes="180x180" href="{{ config('config.assets.icon_180') ?? config('config.assets.icon') }}">
        <link rel="icon" type="image/png" sizes="32x32" href="{{ config('config.assets.icon_32') ?? config('config.assets.favicon') }}">
        <link rel="icon" type="image/png" sizes="16x16" href="{{ config('config.assets.icon_16') ?? config('config.assets.favicon') }}">
        <link rel="shortcut icon" href="{{ config('config.assets.favicon') }}">
        <link rel="manifest" href="/site.webmanifest">
        <meta name="apple-mobile-web-app-title" content="{{ config('config.basic.app_name') }}">
        <meta name="application-name" content="{{ config('config.basic.app_name') }}">
        <link href="{{ mix('/css/style.css') }}" rel="stylesheet">
        <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
        <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
        <!--[if lt IE 9]>
            <script src="/js/html5shiv.js"></script>
            <script src="/js/respond.min.js"></script>
        <![endif]-->
    </head>
    <body>
        <div id="root">
            <router-view></router-view>
        </div>
        <script src="/js/env"></script>
        <script src="/js/lang"></script>
        <script src="{{ mix('js/app.js') }}"></script>
    </body>
</html>
