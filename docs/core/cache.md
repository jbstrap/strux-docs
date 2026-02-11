---
title: Caching
slug: /cache
description: Improving performance with the PSR-16 caching system.
---

## Introduction

Caching is one of the most effective ways to improve application performance.
By storing frequently accessed data in memory or on disk, Strux reduces database load and response times.

Strux provides a unified caching API that adheres to the **PSR-16 (Simple Cache)** standard, allowing you to switch cache backends without changing your application code.

:::info
All cache drivers implement `Psr\SimpleCache\CacheInterface`.
:::

---

## Configuration

The cache configuration lives in `src/Config/Cache.php`. Read the [Configuration](/docs/configuration) documentation for more details on how configuration works in Strux.

Here's how the default configuration looks:

```php
use Strux\Component\Config\ConfigInterface;

class Cache implements ConfigInterface
{
    /**
     * @inheritDoc
     */
    public function toArray(): array
    {
        return [
            /*
            |--------------------------------------------------------------------------
            | Default Cache Store
            |--------------------------------------------------------------------------
            |
            | This option controls the default cache store that will be used by the
            | framework. This store is used when another store is not specified.
            | Supported: "filesystem", "array", "apcu"
            |
            */
            'default' => env('CACHE_DRIVER', 'filesystem'),

            /*
            |--------------------------------------------------------------------------
            | Cache Stores
            |--------------------------------------------------------------------------
            |
            | Here you may define all the cache "stores" for your application as
            | well as their drivers. You may even define multiple stores for the
            | same cache driver to group types of cached data.
            |
            */
            'stores' => [
                'filesystem' => [
                    'driver' => 'filesystem',
                    'path' => env('CACHE_FILESYSTEM_PATH', ROOT_PATH . '/var/cache/simple'), // From your previous Cache.php
                    'salt' => env('CACHE_SALT', 'YOUR_APP_SPECIFIC_SALT_FILESYSTEM'), // Driver-specific salt if needed
                ],

                'array' => [
                    'driver' => 'array',
                    'salt' => env('CACHE_SALT', 'YOUR_APP_SPECIFIC_SALT_ARRAY'), // Less relevant for an array but for consistency
                    // 'serialize' => false, // Array driver usually stores data as is
                ],

                'apcu' => [
                    'driver' => 'apcu',
                    // APCu keys are global. A prefix helps avoid collisions with other apps or parts of your src.
                    'prefix' => env('CACHE_APCU_PREFIX', 'app_cache_'),
                    'salt' => env('CACHE_APCU_SALT', 'YOUR_APP_SPECIFIC_SALT_APCU'), // For key hashing consistency,
                    // APCu TTL is handled per entry. No global TTL setting here.
                ]
            ],

            /*
            |--------------------------------------------------------------------------
            | Global Cache Key Prefix (Optional)
            |--------------------------------------------------------------------------
            | This global prefix can be used by drivers if they don't have a more specific one.
            | For APCu, the 'prefix' in the store etc is generally preferred.
            */
            'prefix' => env('CACHE_GLOBAL_PREFIX', 'myapp_core_cache_')
        ];
    }
}
```

:::tip
In most cases, you only need to configure caching through your `.env` file.
:::

---

### Setting the Default Driver

```env
CACHE_DRIVER=filesystem
````

Supported values:

* `filesystem`
* `apcu`
* `array`

The selected driver will be used automatically whenever `CacheInterface` is resolved.

---

## Supported Drivers

| Driver       | Description                                    | Best For                         |
| ------------ | ---------------------------------------------- | -------------------------------- |
| `filesystem` | Stores cache entries as files on disk          | General use, large datasets      |
| `apcu`       | Uses APCu shared memory                        | High-performance, transient data |
| `array`      | Stores items in memory for the current request | Testing, disabling cache         |

---

## Dependency Injection

Strux automatically injects the cache into controllers, services, and other container-managed classes.

### Controller Example

```php
use Psr\SimpleCache\CacheInterface;
use Strux\Component\Http\Response;
use Strux\Component\Http\Controller\Web\Controller;

class DashboardController extends Controller
{
    public function index(CacheInterface $cache): Response
    {
        $cachedData = $cache->get('dashboard_stats');
    }
}
```

### Service Example

```php
class UserStatsService
{
    public function __construct(
        private readonly CacheInterface $cache
    ) {}
}
```

---

## Resolving the Cache Manually

In addition to dependency injection, you may resolve the cache manually.

### Using the Helper

```php
$cache = cache(); // Returns CacheInterface
$cache->set('key', 'value');
```

### Via the Container

```php
use Psr\SimpleCache\CacheInterface;

/** @var CacheInterface $cache */
$cache = container(CacheInterface::class);
$cache->set('key', 'value');
```

### Via ContainerBridge

```php
use Psr\SimpleCache\CacheInterface;

/** @var CacheInterface $cache */
$cache = ContainerBridge::get(CacheInterface::class);
$cache->set('key', 'value');
```

---

## Retrieving Items

Use `get()` to retrieve an item from the cache. It will return `null` if the key does not exist.

```php
$value = $cache->get('key');
```

Provide a default value if the key does not exist:

```php
$value = $cache->get('key', 'default_value');
```

If you want to get multiple items at once, you can use the `getMultiple()` method and pass in an array of keys.
```php
$values = $cache->getMultiple(['key1', 'key2', 'key3']);
```

## Checking for item existence
Use `has()` to check if a key exists in the cache. It will return `true` if the key exists and `false` if it does not.

```php
if ($cache->has('key')) {
    // Key exists in cache
} else {
    // Key does not exist in cache
}
```

---

## Storing Items

Use `set()` to store an item in the cache.

### With TTL (seconds)

You can specify a time-to-live (TTL) in seconds for the cached item. After the TTL expires, the item will be automatically removed from the cache.
```php
$cache->set('user_stats_1', $stats, 600);
```

### Without TTL (until cleared)

You can also store items without a TTL, which will persist until they are explicitly removed or the cache is cleared.
```php
$cache->set('config_settings', $settings);
```

### Using DateInterval

You can also specify the TTL using a `DateInterval` object for more complex expiration times.
```php
$cache->set('token', $value, new DateInterval('PT15M'));
```
You can also set multiple items at once using the `setMultiple()` method.
```php
$cache->setMultiple([
    'key1' => 'value1',
    'key2' => 'value2',
], 300);
```

---

## Removing Items

If you need to remove a specific item from the cache, use the `delete()` method with the key.
```php
$cache->delete('key');
```

You can also delete multiple items at once using the `deleteMultiple()` method.
```php
$cache->deleteMultiple(['key1', 'key2', 'key3']);
```

### Clearing the Cache Store
To clear all items from the cache store, use the `clear()` method. This will remove all cached data, so use it with caution.
```php
$cache->clear();
```

---

## Cache Events

Strux dispatches events for major cache operations.
These events are useful for logging, debugging, or monitoring cache efficiency.

### Available Events

| Event          | Description              |
| -------------- | ------------------------ |
| `CacheHit`     | A cached value was found |
| `CacheMiss`    | A cache lookup failed    |
| `KeyWritten`   | A value was stored       |
| `KeyForgotten` | A value was deleted      |

:::info
Cache events are dispatched through the Strux event system and can be listened to like any other event.
Visit the [Events documentation](/events) for more details on how to create listeners and subscribe to events.
:::

---

### Example Listener

```php
use Psr\Log\LoggerInterface;
use Strux\Component\Cache\Events\CacheHit;
use Strux\Component\Cache\Events\CacheMiss;
use Strux\Component\Cache\Events\KeyWritten;

class LogCacheEvents
{
    public function __construct(
        protected ?LoggerInterface $logger = null
    )
    {
    }

    public function onHit(CacheHit $event): void
    {
        $this->logger?->info("[LogCacheEvents] Cache HIT: $event->key");
    }

    public function onMiss(CacheMiss $event): void
    {
        $this->logger?->info("[LogCacheEvents] Cache MISS: $event->key");
    }

    public function onWrite(KeyWritten $event): void
    {
        $this->logger?->info("[LogCacheEvents] Cache WRITE: $event->key (TTL: " . ($event->ttl ?? 'forever') . ")");
    }
}
```
### Register the listener in your service provider:
In your `build()` method, bind the listener class to the container so that dependencies (like `Logger`) are injected properly.
```php
public function build(): void
{
    // Bind the listener class so dependencies (Logger) are injected
    $this->container->singleton(LogCacheEvents::class, LogCacheEvents::class);
}
```
Then, in the `init()` method, resolve the listener and register it for the relevant cache events:
```php
public function init(Application $app): void
{
    /** @var EventDispatcher $events */
    $events = $this->container->get(EventDispatcher::class);

    // Resolve the listener
    /** @var LogCacheEvents $listener */
    $listener = $this->container->get(LogCacheEvents::class);

    // Register Listeners
    $events->addListener(CacheHit::class, [$listener, 'onHit']);
    $events->addListener(CacheMiss::class, [$listener, 'onMiss']);
    $events->addListener(KeyWritten::class, [$listener, 'onWrite']);
}
```

:::info
To read more about Service Registries and how to bind classes to the container, visit the [Dependency Injection](/docs/dependency-injection#service-registries) documentation.
:::

## Multiple Cache Stores

Strux supports multiple named cache stores internally. If you need to access a specific store (e.g., `apcu` for counters, `filesystem` for pages) explicitly, you can use the `store()` method on the concrete `Strux\Component\Cache\Cache` class.

```php
use Strux\Component\Cache\Cache;

public function index(Cache $cache)
{
    // Explicitly use Filesystem store
    $cache->store('filesystem')->get('key');
    
    // Explicitly use APCu store
    $cache->store('apcu')->set('key', 'value', 60);
}
```
:::warning Interface Polymorphism
The `store()` method is not part of `Psr\SimpleCache\CacheInterface`. To use it, type-hint the concrete `Strux\Component\Cache\Cache` class instead of the interface.
:::

---
# Unique Cache Keys
When caching data that depends on user input (like search results or pagination), the cache key must be unique to that input. Use `md5` or serialization to create a hash of the parameters.
```php
$key = 'search_' . md5(json_encode(['q' => $query, 'page' => $page]));
```
---

## Atomic Operations

While PSR-16 is intentionally simple:

* **APCu** operations are atomic and safe for concurrent access
* **Filesystem** caching may encounter race conditions under extreme load

---

## Best Practices

### 1. Check Cache *Before* Querying

❌ Bad:

```php
$users = User::all();
$cache->set('users', $users);
```

✅ Good:

```php
$users = $cache->get('users');

if ($users === null) {
    $users = User::all();
    $cache->set('users', $users, 300);
}
```

---

### 2. Use Unique Cache Keys

Cache keys must reflect **all inputs** that affect the result.

```php
$key = 'search_' . md5("q={$query}&page={$page}");
```

---

### 3. Cache Serializable Data Only

The filesystem driver serializes cached values.

Avoid caching:

* Active PDO connections
* Closures
* Resources

---

### 4. Prefer Short TTLs for User Data

User-specific data should expire quickly to prevent stale state and authorization issues.

---

## Related Documentation

* **Routing & Middleware** → `/routing`
* **Controllers** → `/controllers`
* **Dependency Injection** → `/container`
* **Events System** → `/events`

---

## Summary

The Strux caching system provides:

* PSR-16 compatibility
* Multiple cache backends
* Dependency injection support
* Cache events for observability
* Safe defaults with extensibility

Used correctly, caching dramatically improves performance while keeping your application code clean and portable.