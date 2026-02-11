---
title: Configuration
slug: /configuration
description: Managing application settings and environment variables.
---

## Introduction

Configuration is the backbone of any maintainable application. It defines **how your application behaves across environments** (development, testing, production) without changing code.

Strux provides a **robust, layered configuration system** that combines:

- Environment variables (`.env`)
- Object-oriented configuration classes
- Dot-notation access
- Runtime overrides
- Full dependency injection support

This approach keeps configuration **explicit, type-safe, and discoverable**, while remaining flexible.

---

## Configuration Philosophy

Strux follows a few core principles:

- **Environment-specific values belong in `.env`**
- **Application structure belongs in code**
- **Configuration is immutable by default, mutable when necessary**
- **Code-first, but environment-aware**

:::info
Configuration in Strux is loaded **once at boot time**, merged, normalized, and then accessed through a single `Config` service.
:::

---

## Environment Variables (`.env`)

### Purpose

The `.env` file stores **environment-specific and sensitive values**, such as:

- Database credentials
- API keys
- Debug flags
- Runtime modes

```env
APP_NAME="My Strux App"
APP_ENV=local
APP_DEBUG=true

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_DATABASE=app_db
DB_USERNAME=root
DB_PASSWORD=secret
````

---

### Accessing Environment Variables

Use the global `env()` helper:

```php
$debug = env('APP_DEBUG', false);
$dbConnection = env('DB_CONNECTION', 'sqlite');
```

Behavior:

* Automatically reads from `$_ENV` and `$_SERVER`
* Supports default values
* Casts booleans correctly (`true`, `false`, `1`, `0`)

---

## Configuration Classes

Instead of raw PHP arrays, Strux encourages **configuration classes**.

These live in:

```
src/Config/
```

Each class represents a **logical configuration domain**.

---

### Defining a Configuration Class

All configuration classes must implement:

```php
Strux\Component\Config\ConfigInterface
```

Example: `src/Config/App.php`

```php
namespace App\Config;

use Strux\Component\Config\ConfigInterface;

class App implements ConfigInterface
{
    public function toArray(): array
    {
        return [
            'name' => env('APP_NAME', 'Strux'),
            'env' => env('APP_ENV', 'production'),
            'debug' => (bool) env('APP_DEBUG', false),
            'timezone' => 'UTC',
        ];
    }
}
```

---

### Automatic Loading

Strux automatically:

1. Scans `src/Config/*.php`
2. Loads each file
3. Converts the filename into a **lowercase configuration key**

| File           | Access Key   |
| -------------- | ------------ |
| `App.php`      | `app.*`      |
| `Database.php` | `database.*` |
| `Cache.php`    | `cache.*`    |

---

### Accessing Configuration Values

Use the `Config` bridge:

```php
use Strux\Support\Bridge\Config;

$appName = Config::get('app.name');
$timezone = Config::get('app.timezone', 'UTC');
```

Supports:

* Dot notation
* Default values
* Type casting

```php
$debug = Config::get('app.debug', false, 'bool');
$port  = Config::get('server.port', 80, 'int');
```

---

## Anonymous Configuration Classes

For **quick overrides or small configs**, Strux supports anonymous config classes.

Example: `src/Config/custom.php`

```php
use Strux\Component\Config\ConfigInterface;

return new class implements ConfigInterface {
    public function toArray(): array
    {
        return [
            'api_key' => env('CUSTOM_API_KEY'),
            'timeout' => 30,
        ];
    }
};
```

Access it like any other config:

```php
$key = Config::get('custom.api_key');
```

---

## Configuration Merging & Precedence

Configuration is merged in this order:

1. Initial bootstrap configuration
2. Configuration classes (`src/Config`)
3. Environment variables (`$_ENV`, `$_SERVER`)

Rules:

* Class-based config **overrides array config**
* Later values overwrite earlier ones
* Environment variables always win when explicitly referenced via `env()`

---

## Runtime Configuration

Although configuration is mostly static, Strux allows runtime overrides.

### Setting Values

```php
Config::set('app.debug', true);
```

### Checking Existence

```php
if (Config::has('cache.default')) {
    // ...
}
```

### Removing Values

```php
Config::remove('feature.experimental');
```

---

## Array Access

The `Config` object implements `ArrayAccess`.

```php
$config['app.name'];
$config['cache.default'] = 'apcu';
unset($config['debug.toolbar']);
```

This is mostly useful for:

* Internal framework logic
* Low-level tooling

---

## Dependency Injection

The `Config` service is available via dependency injection.

```php
use Strux\Component\Config\Config;

class ExampleService
{
    public function __construct(
        private Config $config
    ) {}

    public function isDebug(): bool
    {
        return $this->config->get('app.debug', false, 'bool');
    }
}
```

---

## Configuration vs Environment Variables

| Use Case          | Use             |
| ----------------- | --------------- |
| Secrets           | `.env`          |
| App structure     | Config classes  |
| Defaults          | Config classes  |
| Runtime overrides | `Config::set()` |
| Feature flags     | Config classes  |

---

## Best Practices

### 1. Never Use `env()` Outside Config

❌ Bad:

```php
if (env('APP_DEBUG')) { ... }
```

✅ Good:

```php
if (Config::get('app.debug')) { ... }
```

---

### 2. Group Related Settings

❌ Bad:

```php
Config::get('mailer_host');
```

✅ Good:

```php
Config::get('mail.host');
```

---

### 3. Keep Config Logic Simple

Config classes may contain **light logic**, but avoid:

* Database access
* HTTP calls
* Service resolution

---

### 4. Prefer Explicit Defaults

Always define sane defaults:

```php
'timeout' => env('API_TIMEOUT', 30),
```

---

## Internal Implementation Overview

Internally, Strux:

* Loads config classes via filesystem scan
* Merges them into a single array
* Supports dot-notation traversal
* Allows type casting
* Implements `ArrayAccess`

This design keeps configuration:

* Fast
* Predictable
* Framework-agnostic

---

## Related Documentation

* **Dependency Injection** → `/dependency-injection`
* **Caching Configuration** → `/cache`
* **Queue Configuration** → `/queue`
* **Events & Event Registries** → `/events`

---

## Summary

The Strux configuration system provides:

* Environment-based configuration
* Object-oriented structure
* Automatic discovery
* Dependency injection support
* Runtime flexibility

Used correctly, it keeps your application **clean, secure, and environment-agnostic**.