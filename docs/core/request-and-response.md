---
title: Request & Response
slug: /http
description: Handling HTTP requests and generating responses in Strux.
---

# HTTP Layer

The HTTP layer is the boundary between your application and the outside world.

Strux provides:

- A powerful **Request** wrapper around PSR-7
- A developer-friendly **Response** builder
- Seamless integration with middleware and routing
- Full compatibility with PSR-7 and PSR-17

Strux embraces standards while providing a cleaner developer experience.

---

# Request

## Overview

`Strux\Component\Http\Request` is a convenience wrapper around:

```

Psr\Http\Message\ServerRequestInterface

````

It enhances PSR-7 with:

- Dot-notation input access
- Automatic type casting
- Sanitized input helpers
- File upload abstraction
- Route parameter access
- JSON body parsing
- AJAX / security helpers

It does **not replace PSR-7** — it enhances it.

---

## Basic Usage

You typically receive `Request` via dependency injection:

```php
use Strux\Component\Http\Request;

public function store(Request $request)
{
    $name = $request->input('name');
}
````

---

## Request Information

### Method

```php
$request->getMethod();
$request->method(); // alias
```

Check method:

```php
$request->is('post');
```

---

### URI & Path

```php
$request->getUri();
$request->getPath();
$request->path();
```

Check path pattern:

```php
$request->isPath('admin/*');
```

---

### Secure & AJAX Checks

```php
$request->isSecure();
$request->isAjax();
```

---

# Retrieving Input

## input()

Retrieve any request value (GET + POST merged):

```php
$request->input('email');
$request->input('page', 1, 'int');
```

Supports:

* Default values
* Type casting
* Dot notation

```php
$request->input('user.address.city');
```

---

## has()

```php
$request->has('email');
$request->has(['email', 'password']);
```

---

## query()

Access raw query parameters only:

```php
$request->query('page', 1, 'int');
```

---

## all()

```php
$request->all();
$request->allPost();
$request->allQuery();
```

---

# Type Casting

You can enforce types:

```php
$request->input('page', 1, 'int');
$request->input('active', false, 'bool');
```

Supported types:

* int
* float
* bool
* string
* array

---

# Sanitized Input

Strux includes a sanitization layer.

```php
$request->safe()->only(['email']);
$request->safeAll();
$request->safeAllPost();
$request->safeAllQuery();
```

This protects against common XSS and injection issues.

---

# JSON Requests

Automatically decode JSON payloads:

```php
$data = $request->getJson();

if ($data) {
    $email = $data->email;
}
```

Behavior:

* Reads body stream
* Rewinds if seekable
* Returns `null` on failure
* Logs JSON decode errors

---

# Headers

```php
$request->headers();
$request->header('Authorization');
```

Returns:

* `null` if not present
* `string` if single value
* `array` if multiple values

---

# Cookies

```php
$request->cookie('session_id');
$request->cookies();
```

---

# Server Parameters

```php
$request->server('HTTP_HOST');
$request->getServerParams();
```

---

# Route Parameters

Route parameters are stored as PSR-7 attributes.

```php
$request->routeParam('id');
$request->routeParams();
```

Middleware can also modify attributes:

```php
$request->withAttribute('user', $user);
```

---

# File Uploads

Retrieve uploaded files:

```php
$file = $request->file('avatar');
```

Supports:

* Single file
* Multiple files (array)

Check existence:

```php
$request->hasFile('avatar');
```

Files are wrapped in `Strux\Component\Http\UploadedFile`.

---

# Referrer

```php
$request->getRefer();
$request->getReferrer();
```

Safely validates the `Referer` header.

---

# PSR-7 Passthrough

You can access underlying PSR-7 behavior:

```php
$request->getParsedBody();
$request->withParsedBody($data);
$request->getAttributes();
```

Strux preserves immutability when modifying the request.

---

# Response

## Overview

`Strux\Component\Http\Response` is a developer-friendly response builder.

It allows you to:

* Set content
* Set status codes
* Manage headers
* Return JSON
* Redirect
* Control caching
* Convert to PSR-7

---

## Basic Usage

```php
use Strux\Component\Http\Response;

return new Response('Hello World');
```

---

## Status Codes

```php
$response->setStatusCode(404);
```

Valid range:

```
100 – 598
```

Invalid codes throw `InvalidArgumentException`.

---

## Headers

```php
$response->setHeader('Content-Type', 'text/html');
$response->addHeader('X-Debug', 'true');
```

Headers are normalized automatically.

---

# JSON Responses

```php
return (new Response())
    ->json(['message' => 'Success'], 200);
```

Automatically:

* Sets `Content-Type: application/json`
* Encodes safely using `JSON_THROW_ON_ERROR`
* Returns 500 if encoding fails

---

# Redirects

```php
return (new Response())->redirect('/login');
```

Defaults to 302.

Custom status:

```php
->redirect('/dashboard', 301);
```

---

# Cache Control

## Disable Cache

```php
$response->noCache();
```

Sets:

* Cache-Control
* Pragma
* Expires

---

## Custom Cache Headers

```php
$response->setCache([
    'etag' => 'abc123',
    'max_age' => 3600,
    'private' => true,
]);
```

Options:

* etag
* last_modified
* max_age
* s_maxage
* private
* web

---

## Last Modified

```php
$response->setLastModified(new DateTime());
```

Automatically formats to GMT.

---

# Content

```php
$response->setContent('<h1>Hello</h1>');
```

---

# Converting to PSR-7

Strux converts the custom response to PSR-7 internally:

```php
$response->toPsr7Response($streamFactory);
```

This ensures:

* Full PSR compatibility
* Middleware interoperability
* Clean separation of framework and transport layer

---

# Request vs Response Philosophy

| Request           | Response           |
| ----------------- | ------------------ |
| Immutable wrapper | Mutable builder    |
| PSR-7 based       | Converted to PSR-7 |
| Data retrieval    | Output generation  |
| Input safety      | Output control     |

---

# Best Practices

### 1. Always Type Cast Input

```php
$page = $request->input('page', 1, 'int');
```

---

### 2. Never Trust Raw Input

Use:

* Sanitization
* Validation
* Explicit casting

---

### 3. Return Response Objects

```php
return new Response('OK');
```

Or JSON:

```php
return (new Response())->json($data);
```

---

### 4. Use Proper Status Codes

* 200 → Success
* 201 → Created
* 204 → No Content
* 400 → Bad Request
* 401 → Unauthorized
* 403 → Forbidden
* 404 → Not Found
* 422 → Validation Error
* 500 → Server Error

---

# Related Documentation

* **Middleware** → `/middleware`
* **Routing** → `/routing`
* **Controllers** → `/controllers`
* **Events** → `/events`
* **Service Registries** → `/registries`

---

# Summary

The Strux HTTP layer provides:

* PSR-7 compatibility
* Clean input handling
* Built-in sanitization
* Developer-friendly response building
* Proper HTTP caching support
* Seamless middleware integration

It combines modern PHP standards with practical developer ergonomics — giving you both power and clarity.