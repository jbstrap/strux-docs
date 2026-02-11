---
title: Service Registries
slug: /registries
description: Binding services and configuring the container.
---

## Introduction

Service Registries are the **bootstrapping backbone** of a Strux application.

They define **how services are created, configured, and wired together** before a request is ever handled. If the Dependency Injection container is the *engine*, then Service Registries are the *assembly line* that builds it.

In Strux, **nothing magical happens implicitly**:
- Every service exists because a registry bound it
- Every integration point is explicit
- Every dependency is intentional

---

## What Is a Service Registry?

A **Service Registry** is a class responsible for:

- Binding services into the DI container
- Configuring third-party libraries
- Registering event listeners
- Attaching global middleware
- Performing application boot logic

Registries are discovered automatically and executed during the **application bootstrap lifecycle**.

---

## Registry Lifecycle

Registries operate in **two distinct phases**:

### 1. Build Phase (`build()`)

- Runs **before** the application starts
- Used to **bind services into the container**
- No HTTP context exists yet

```php
public function build(): void
{
    $this->container->singleton(Foo::class, fn () => new Foo());
}
````

### 2. Init Phase (`init()`)

* Runs **after** the application is constructed
* The `Application` instance is available
* Used for runtime wiring (middleware, routes, listeners)

```php
public function init(Application $app): void
{
    $app->addMiddleware(LogRequests::class);
}
```

---

## Registry Discovery

Strux automatically discovers registries from:

```
src/Registry/*.php
```

It supports **both named and anonymous registries**, allowing flexible organization.

Discovery rules:

1. If a file returns an object → treated as an anonymous registry
2. Otherwise → Strux looks for `App\Registry\{Filename}`

---

## Creating a Standard Registry

A standard registry extends:

```php
Strux\Bootstrapping\Registry\ServiceRegistry
```

### Example: `src/Registry/AppRegistry.php`

```php
namespace App\Registry;

use Strux\Bootstrapping\Registry\ServiceRegistry;
use Strux\Foundation\App;
use App\Services\PaymentService;

class AppRegistry extends ServiceRegistry
{
    public function build(): void
    {
        // Singleton binding
        $this->container->singleton(PaymentService::class, function () {
            return new PaymentService(env('STRIPE_KEY'));
        });

        // Simple value binding
        $this->container->bind('app.version', fn () => '1.0.0');
    }

    public function init(App $app): void
    {
        $app->addMiddleware(\App\Http\Middleware\LogRequests::class);
    }
}
```

---

## Anonymous Registries

Anonymous registries allow **quick setup without naming overhead**.

They are especially useful for:

* Feature-specific bindings
* Experimental services
* Package-level configuration

### Example: `src/Registry/LazyServices.php`

```php
use Strux\Bootstrapping\Registry\ServiceRegistry;

return new class extends ServiceRegistry {

    public function build(): void
    {
        $this->container->singleton('lazy.service', fn () => new \stdClass());
    }

    public function init(\Strux\Foundation\App $app): void
    {
        // Optional boot logic
    }
};
```

---

## Registering Registries Manually

Although auto-discovery is preferred, registries can also be registered manually.

### Example: `web/index.php`

```php
$app = App::create(ROOT_PATH);

$app->addRegistry(new class extends ServiceRegistry {
    public function build(): void
    {
        $this->container->bind('quick.binding', fn () => true);
    }
});

$app->run();
```

This is ideal for:

* Prototypes
* Single-file apps
* Testing environments

---

## Dependency Injection Inside Registries

Registries automatically receive:

* The **DI container**
* The **Config service**

If not provided via constructor, they are resolved using `ContainerBridge`.

```php
protected ?ContainerInterface $container;
protected ?Config $config;
```

This allows registries to:

* Read configuration values
* Bind conditionally based on environment

```php
if ($this->config->get('app.env') === 'production') {
    // Production-only bindings
}
```

---

## Core Registries

Strux ships with a set of **core registries** that are always loaded:

```php
protected array $coreRegistries = [
    LogRegistry::class,
    DatabaseRegistry::class,
    AuthRegistry::class,
    HttpRegistry::class,
    RouteRegistry::class,
    ViewRegistry::class,
    EventRegistry::class,
    MiddlewareRegistry::class,
    InfrastructureRegistry::class,
];
```

These provide:

* Logging
* Database access
* Authentication
* Routing
* Views
* Events
* Middleware
* Low-level infrastructure

---

## Container Injection for Anonymous Registries

Anonymous registries bypass constructor injection.

To handle this, Strux:

* Uses reflection
* Injects the container manually if needed

This ensures anonymous and named registries behave **identically**.

---

## Common Use Cases

### 1. Interface Binding

```php
$this->container->bind(
    MailerInterface::class,
    SmtpMailer::class
);
```

---

### 2. Singleton Services

```php
$this->container->singleton(CacheInterface::class, function () {
    return new CacheDriver();
});
```

---

### 3. Third-Party Libraries

```php
$this->container->singleton(StripeClient::class, function () {
    return new StripeClient(env('STRIPE_SECRET'));
});
```

---

### 4. Event Listener Registration

```php
$events = $this->container->get(EventDispatcher::class);

$events->addListener(
    UserRegistered::class,
    [$this->container->get(SendWelcomeEmail::class), 'handle']
);
```

👉 See **Events documentation** → `/events`

---

### 5. Global Middleware

```php
$app->addMiddleware(CsrfMiddleware::class);
```

👉 See **Middleware documentation** → `/middleware`

---

## Best Practices

### 1. One Concern per Registry

❌ Bad:

```php
class EverythingRegistry extends ServiceRegistry { ... }
```

✅ Good:

```php
AuthRegistry
QueueRegistry
CacheRegistry
```

---

### 2. Bind Interfaces, Not Implementations

```php
$this->container->bind(
    UserRepositoryInterface::class,
    UserRepository::class
);
```

---

### 3. Avoid Heavy Logic in `init()`

`init()` should only:

* Wire things together
* Register listeners or middleware

Never:

* Query databases
* Perform I/O
* Execute business logic

---

### 4. Use Config, Not `env()`

```php
$driver = $this->config->get('cache.default');
```

---

## How Registries Fit the Big Picture

```
Bootstrap
  └── AppRegistry::build()
        ├── Core Registries
        └── User Registries
  └── AppRegistry::init()
        ├── Middleware
        ├── Events
        └── Runtime Wiring
```

Registries are the **foundation** upon which:

* Dependency Injection
* Events
* Middleware
* Controllers
  are all built.

---

## Related Documentation

* **Dependency Injection** → `/dependency-injection`
* **Configuration** → `/configuration`
* **Events & Listeners** → `/events`
* **Middleware** → `/middleware`
* **Caching** → `/cache`

---

## Summary

Service Registries provide:

* Explicit service wiring
* Predictable boot order
* Clean separation of concerns
* First-class DI integration
* Support for both named and anonymous classes

They are the **central nervous system** of a Strux application.

Mastering registries means mastering Strux itself.