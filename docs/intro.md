---
title: Introduction
description: Welcome to the Strux Framework documentation.
sidebar_position: 1
---

# Strux Framework

**A lightweight, attribute-driven PHP framework for modern web development.**

Strux abstracts complex backend tasks into **clean, object-oriented interfaces** while staying fast, minimal, and developer-friendly.
Built for PHP 8.4+, it embraces modern language features without unnecessary overhead.

---

## Why Strux?

> [!INFO]
> Strux focuses on **developer ergonomics**, **explicit configuration**, and **modern PHP patterns** — without sacrificing performance.

**Attribute-Based Routing** — Define routes directly inside your controllers using PHP attributes (`#[Route]`, `#[RouteGroup]`).

**Active Record ORM** — Lightweight, expressive models with attribute-defined schemas, relationships (`#[OwnedBy]`, `#[OwnedByMany]`), JSON queries, and caching.

**Smart Forms** — Object-oriented, attribute-driven form creation with auto-binding to requests, models, or arrays; built-in validation and rendering.

**Attribute-Driven Auth** — Sentinels, policies, permissions, roles, email verification, and password recovery — all configured through PHP attributes.

**Multi-Database Support** — MySQL, MariaDB, PostgreSQL, SQLite, SQL Server, and Oracle with a unified query builder that handles dialect differences automatically.

**Built-in Services** — Validation (`#[Validate]`), model lifecycle events, middleware, mailer, migrations, CLI commands, and session management.

---

## Get Started in Minutes

> [!TIP]
> You will need **PHP 8.1+** and **Composer** installed.

### Create a New Project

```bash
composer create-project strux/strux-app my-new-app
```

### Run the Development Server

```bash
cd my-new-app
php bin/console run
```

Open your browser and visit:

```
http://localhost:8000
```

Your Strux application is now running.

---

## How Strux Works

Strux follows a **convention-over-configuration** approach with zero boilerplate:

- **Controllers** define routes and actions via PHP attributes — no separate routing file needed
- **Models** define their database schema and relationships through attributes — migrations are generated automatically
- **Services** are resolved automatically through the dependency injection container
- **Auth** is managed through sentinels and policies — pluggable, testable, and attribute-driven
- **Everything stays close to your code**, not hidden in YAML or XML config files

---

## What's Next?

| Topic | Description |
|-------|-------------|
| [Getting Started](getting-started/installation.md) | Install, configure, and scaffold a new application |
| [Database Layer](database/introduction.md) | Connections, drivers, and configuration |
| [Schema Attributes](database/attributes.md) | Define your database schema with PHP attributes |
| [ORM Models](orm/models.mdx) | Querying, relationships, events, and more |
| [Query Builder](orm/query-builder.mdx) | Fluent SQL without raw strings |
| [Auth System](security/auth-intro.md) | Authentication, authorization, roles, and policies |
| [Controllers](core/controllers.md) | Routing, request handling, responses |
| [Middleware](core/middleware.mdx) | Request filtering and guards |
| [Views](views/twig.md) | Twig templating |

---

## Philosophy

> [!INFO]
> Strux is designed to be **simple, explicit, and modern** — without sacrificing performance or developer experience.

Strux gives you control without forcing ceremony — ideal for APIs, web apps, and internal tools alike.
