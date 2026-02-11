---
title: Events
slug: /events
description: Decoupling application logic with the Event Dispatcher.
---

## Introduction

Events are a core building block for creating **decoupled**, **maintainable**, and **extensible** applications.
Instead of tightly coupling different parts of your system together, events allow components to **react to what happened** without needing to know *who triggered it* or *why*.

Strux provides a lightweight but powerful **event system built on top of PSR-14 (`psr/event-dispatcher`)**, ensuring standards compliance and long-term interoperability.

:::info
The Strux event system is fully PSR-14 compliant and uses:
- `Psr\EventDispatcher\EventDispatcherInterface`
- `Psr\EventDispatcher\ListenerProviderInterface`
- `Psr\EventDispatcher\StoppableEventInterface`
:::

---

## Why Use Events?

Events help you:

- Decouple domain logic from side effects
- Keep controllers and services small and focused
- Add new behavior without modifying existing code
- Easily hook into framework internals (cache, auth, queue, etc.)
- Defer work to background jobs

**Without events**, code often grows into large, tightly coupled services.
**With events**, your application becomes modular and easier to evolve.

---

## Core Concepts

### Event

An **event** is a simple object that represents *something that has happened*.

Examples:
- A user registered
- An order was placed
- A cache key was missed
- A job failed

Events are usually **immutable DTOs** and contain only relevant data.

---

### Listener

A **listener** reacts to an event.
It contains the logic that should run *when* an event occurs.

Multiple listeners can listen to the same event.

---

### Dispatcher

The **dispatcher** is responsible for:
1. Receiving an event
2. Resolving all listeners for that event
3. Executing listeners in sequence

---

### Listener Provider

The **listener provider** stores the mapping between:
- Event class → listeners

This design follows PSR-14 exactly and keeps responsibilities clean.

---

---
## Configuration
The configuration file for the event system is located at `src/Config/Events.php` and may look like this:

```php
namespace App\Config;

use App\Domain\General\Event\UserRegistered;
use App\Domain\General\Listener\SendWelcomeEmail;
use Strux\Component\Config\ConfigInterface;

class Events implements ConfigInterface
{
    /**
     * @inheritDoc
     */
    public function toArray(): array
    {
        return [
            /*
            |--------------------------------------------------------------------------
            | Event Listener
            |--------------------------------------------------------------------------
            |
            | The event listener mappings for the application. This array maps your
            | event classes to the listener classes that should be called when
            | that event is dispatched.
            |
            */
            'listeners' => [
                UserRegistered::class => [
                    SendWelcomeEmail::class,
                    // You can add more listeners for the same event here
                    // \App\Listener\AwardWelcomeBonus::class,
                ],

                // \App\Event\OrderPlaced::class => [
                //     \App\Listener\SendOrderConfirmation::class,
                //     \App\Listener\UpdateInventory::class,
                // ]
            ]
        ];
    }
}
```
---

## Dispatching Events

### Creating an Event Class

You may use the command line to generate an event class:

```bash
php bin/console new:event UserRegistered --domain=User
```
:::tip
After running the command, you will get a new event class in `src/Domain/User/Event/UserRegistered.php`.
:::

Events are plain PHP objects.

```php
namespace App\Events;

use App\Domain\Entity\User;

class UserRegistered
{
    public function __construct(
        public User $user
    ) {}
}
````

---

### Dispatching an Event

You can dispatch events using the `EventDispatcher` service.

```php
use Strux\Component\Events\EventDispatcher;
use App\Events\UserRegistered;

public function register(Request $request, EventDispatcher $dispatcher)
{
    $user = $this->userService->create($request->all());

    $dispatcher->dispatch(new UserRegistered($user));
}
```

---

## Listening to Events

### Creating a Listener Class

You can generate a listener class via the CLI:

```bash
php bin/console new:listener SendWelcomeEmail --domain=User
```

:::tip
After running the command, you will get a new listener class in `src/Domain/User/Listener/SendWelcomeEmail.php`.
:::

Listeners are regular classes with a `handle()` method.

```php
namespace App\Listeners;

use App\Events\UserRegistered;
use Psr\Log\LoggerInterface;

class SendWelcomeEmail
{
    public function __construct(
        protected LoggerInterface $logger
    ) {}

    public function handle(UserRegistered $event): void
    {
        $this->logger->info(
            "Sending welcome email to {$event->user->email}"
        );

        // Mail logic...
    }
}
```

---

### Registering Listeners

Listeners are typically registered in an **Event Registry** or the main `AppRegistry`.

```php
use Strux\Component\Events\EventDispatcher;
use App\Events\UserRegistered;
use App\Listeners\SendWelcomeEmail;

public function init(App $app): void
{
    /** @var EventDispatcher $events */
    $events = $this->container->get(EventDispatcher::class);

    $listener = $this->container->get(SendWelcomeEmail::class);

    $events->addListener(
        UserRegistered::class,
        [$listener, 'handle']
    );
}
```

---

### Using Closures as Listeners

For simple logic, you may register a closure directly.

```php
$events->addListener(UserRegistered::class, function (UserRegistered $event) {
    // Quick logic
});
```

---

## Event Propagation & Stoppable Events

Strux supports **event propagation control** via `StoppableEventInterface`.

### Creating a Stoppable Event

```php
use Psr\EventDispatcher\StoppableEventInterface;

class PaymentProcessed implements StoppableEventInterface
{
    private bool $stopped = false;

    public function stopPropagation(): void
    {
        $this->stopped = true;
    }

    public function isPropagationStopped(): bool
    {
        return $this->stopped;
    }
}
```

If any listener calls `stopPropagation()`, **no further listeners will run**.

---

## Event Dispatcher Internals

### Dispatch Flow

1. Event is passed to the dispatcher
2. Dispatcher asks the ListenerProvider for listeners
3. Listeners are executed in order
4. Propagation stops if requested
5. Event is returned

```php
$dispatcher->dispatch($event);
```

This design strictly follows PSR-14 behavior.

---

## Listener Inheritance Support

Strux allows listeners to react to **parent event types**.

```php
class DomainEvent {}
class UserRegistered extends DomainEvent {}
```

A listener registered for `DomainEvent` will receive `UserRegistered`.

This enables:

* Global logging
* Auditing
* Metrics
* Tracing

---

## Queued Event Listeners

For expensive operations, listeners can be **executed asynchronously** using the queue system.

### How It Works

* Listener execution is wrapped in a `CallQueuedListener` job
* Job is pushed to the queue
* Listener is resolved again inside the worker
* Dependencies are re-injected safely

```php
class CallQueuedListener extends Job
{
    public string $listenerClass;
    public object $event;

    public function handle(): void
    {
        $container = ContainerBridge::getContainer();
        $listener = $container->get($this->listenerClass);

        $listener->handle($this->event);
    }
}
```

:::note
Listeners may implement a `ShouldQueue` interface to indicate they should be queued. The `CallQueuedListener` job will handle the actual execution.

Jobs are not executed until they are added in the config file and the worker is running:

```bash
php bin/console queue:work
```

Read more in the [Queue](/docs/queue) Documentation.
:::

```php
namespace App\Domain\Identity\Listener;

use App\Domain\Identity\Event\UserRegistered;
use Psr\Log\LoggerInterface;
use Strux\Component\Queue\Queueable;

use Strux\Component\Queue\ShouldQueue;

class SendWelcomeEmail implements ShouldQueue
{
    public function __construct(
        private readonly LoggerInterface $logger
    ) {}

    public function handle(UserRegistered $event): void
    {
        $this->logger->info(
            "[Async Listener] Sending welcome email to: {$event->user->email}"
        );
    }
}
```

---

## Dependency Injection in Listeners

Listeners fully support constructor injection:

* Logger
* Mailer
* Repositories
* Services

```php
class AuditLogListener
{
    public function __construct(
        private AuditRepository $repo
    ) {}

    public function handle(object $event): void
    {
        $this->repo->record($event);
    }
}
```

---

## Events vs Middleware vs Jobs

| Tool          | Purpose                                  |
| ------------- | ---------------------------------------- |
| Events        | React to something that already happened |
| Middleware    | Intercept or block a request             |
| Jobs          | Execute work asynchronously              |
| Events + Jobs | Best for side effects                    |

---

## Framework Events

Strux internally uses events for:

* Cache hits & misses
* Authentication lifecycle
* Queue execution
* Error handling hooks

See:

* `/cache`
* `/queue`
* `/auth`

---

## Best Practices

### 1. Keep Events Simple

Events should:

* Be immutable
* Carry minimal data
* Avoid logic

---

### 2. One Responsibility per Listener

Avoid listeners that do *too much*.

❌ Bad:

* Sending emails
* Logging
* Updating analytics

✅ Good:

* One listener per responsibility

---

### 3. Prefer Asynchronous Listeners

If the listener:

* Sends email
* Writes files
* Calls external APIs

→ **Queue it**

---

### 4. Do Not Return Values from Listeners

Listeners should produce **side effects**, not results.

---

## Related Documentation

* **Caching & Cache Events** → `/cache`
* **Queue System** → `/queue`
* **Dependency Injection** → `/container`
* **Middleware** → `/middleware`

---

## Summary

The Strux event system provides:

* PSR-14 compliance
* Clean separation of concerns
* Dependency-injected listeners
* Optional async execution
* Safe event propagation control

Used correctly, events form the backbone of a scalable and maintainable Strux application.