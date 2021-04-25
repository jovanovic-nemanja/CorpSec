SASS Cusomer relationship project.

KodeUI - Vue.js, Laravel, Bootstrap - SPA Admin Kit

1. composer install
2. .env.example to copy/paste as .env
3. npm install
4. npm run watch
5. php artisan key:generate
6. php artisan serve


Please add these lines in C:\xampp74\apache\conf\extra\httpd-vhosts.conf

##<VirtualHost local.csm:80>
    DocumentRoot "C:/xampp74/htdocs/corpNew/public"
    ServerName local.csm
    <Directory "C:/xampp74/htdocs/corpNew/public">
        Options All
        AllowOverride All
        Require all granted
    </Directory>
##</VirtualHost>

##<VirtualHost local.csm:443>
    DocumentRoot "C:/xampp74/htdocs/corpNew/public"
    ServerName local.csm
    SSLEngine on
    SSLCertificateFile "conf/ssl.crt/server.crt"
    SSLCertificateKeyFile "conf/ssl.key/server.key"
    <Directory "C:/xampp74/htdocs/corpNew/public">
        Options All
        AllowOverride All
        Require all granted
    </Directory>
##</VirtualHost>

##and add this line at end in this file C:\Windows\System32\drivers\etc\hosts

127.0.0.1   local.csm


##update these variables in env file


APP_URL=https://local.csm
BROWSERSYNC_PROXY_URL=local.csm

SESSION_DOMAIN=.local.csm
SANCTUM_STATEFUL_DOMAINS="local.csm,localhost,127.0.0.1,localhost:3000"

node version 14
npm version 6
