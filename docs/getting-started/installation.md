---
title: Installation
slug: /installation
description: Getting started with the Strux Framework.
---

## Installation

This guide walks you through installing and configuring the **Strux Framework** so you can start building applications quickly and correctly.

---

## Requirements

Before installing Strux, ensure your environment meets the following requirements:

- **PHP >= 8.1**
- **Composer** (PHP dependency manager)
- **PDO PHP Extension** (required for database support)
- **MBString PHP Extension**
- **XML PHP Extension**

:::tip Recommended
While not strictly required, enabling the **APCu** extension is highly recommended for high-performance caching in production environments.
:::

---

## Installing via Composer

The fastest and recommended way to create a new Strux application is via Composer.

```bash
composer create-project strux/strux-app my-new-app
````

This command will:

* Download the Strux application skeleton
* Install all framework dependencies
* Set up the default directory structure

After installation, navigate into your project:

```bash
cd my-new-app
```

---

## Manual Installation (Advanced)

If you want to integrate Strux into an existing project or build from scratch, you can require the framework directly:

```bash
composer require strux/framework
```

---

## Directory Structure

After installation, your project will have the following structure:

| Directory    | Description                                                         |
| ------------ | ------------------------------------------------------------------- |
| `bin/`       | Console executable for running CLI commands                         |
| `etc/`       | Configuration files (database, mail, auth, cache, etc.)             |
| `src/`       | Application source code (Controllers, Models, Services, Registries) |
| `var/`       | Cache, logs, compiled files (**must be writable**)                  |
| `templates/` | View templates (Plates or Twig)                                     |
| `web/`       | Public web root (contains `index.php` and assets)                   |

---

## Web Server Configuration

Strux uses a **front-controller pattern**. Your web server must point to the `web/` directory as the document root.

---

### Built-in PHP Server (Development)

For local development, you can use PHP’s built-in server.

```bash
cd web
php -S localhost:8000
```

Or from the project root using Strux’s CLI helper:

```bash
php bin/console run
```

Then visit:

```
http://localhost:8000
```

---

### Apache

Strux includes an `.htaccess` file in the `web/` directory to handle URL rewriting.

Make sure **mod_rewrite** is enabled.

#### Virtual Host Example

```apache
<VirtualHost *:80>
    ServerName my-app.local
    DocumentRoot "/path/to/my-new-app/web"

    <Directory "/path/to/my-new-app/web">
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

---

### Nginx

For Nginx, configure the front controller like this:

```nginx
server {
    listen 80;
    server_name my-app.local;
    root /path/to/my-new-app/web;

    index index.php;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/var/run/php/php8.1-fpm.sock; # Adjust PHP version
    }
}
```

---

## Environment Configuration

Strux uses **`.env` files** to manage environment-specific settings such as database credentials and debug flags.

### Create the `.env` File

```bash
cp .env.example .env
```

### Configure Environment Variables

```env
APP_ENV=local
APP_DEBUG=true

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_DATABASE=strux_db
DB_USERNAME=root
DB_PASSWORD=secret
```

:::danger Security Note
Never commit your `.env` file to version control.
Ensure `.env` is listed in your `.gitignore`.
:::

---

## Verifying Installation

### Web Check

1. Start your web server
2. Visit your application URL
3. You should see the **“Welcome to Strux”** page

---

### CLI Check

Verify that the CLI is working:

```bash
php bin/console
```

You should see a list of available commands.

---

## Next Steps

Once installed, continue with:

* **Configuration** → `/configuration`
* **Service Registries** → `/registries`
* **Routing & Controllers**
* **Dependency Injection** → `/dependency-injection`

---

Strux is now installed and ready.
You can begin building clean, decoupled, and scalable PHP applications 🚀