// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
    tutorialSidebar: [
        {
            type: 'category',
            label: 'Quick Start',
            collapsed: false,
            items: [
                { type: 'doc', id: 'intro', label: 'Introduction' },
                { type: 'doc', id: 'getting-started/installation', label: 'Installation' },
                { type: 'doc', id: 'getting-started/cli', label: 'Strux CLI' },
                { type: 'doc', id: 'database/migrations', label: 'Migrations' },
                { type: 'doc', id: 'getting-started/scaffolding', label: 'App Scaffolding' },
            ],
        },
        {
            type: 'category',
            label: 'Routing',
            collapsed: false,
            items: [
                { type: 'doc', id: 'routing/basic', label: 'Basic Routing' },
                { type: 'doc', id: 'routing/groups', label: 'Route Groups' },
                { type: 'doc', id: 'routing/dynamic', label: 'Dynamic Routing' },
                { type: 'doc', id: 'core/middleware', label: 'Middleware' },
                { type: 'doc', id: 'core/middleware-advanced', label: 'Advanced Middleware' },
            ],
        },
        {
            type: 'category',
            label: 'Request / Response',
            collapsed: false,
            items: [
                { type: 'doc', id: 'core/lifecycle', label: 'Request Life Cycle' },
                { type: 'doc', id: 'core/request', label: 'Request' },
                { type: 'doc', id: 'core/response', label: 'Response' },
                { type: 'doc', id: 'core/headers', label: 'Headers' },
                { type: 'doc', id: 'core/cors', label: 'CORS' },
            ],
        },
        {
            type: 'category',
            label: 'Config & Deployment',
            collapsed: false,
            items: [
                { type: 'doc', id: 'getting-started/environment', label: 'Application Env' },
                { type: 'doc', id: 'getting-started/deployment', label: 'Deployment' },
                { type: 'doc', id: 'core/error-handling', label: 'Error Handling' },
                { type: 'doc', id: 'core/dependency-injection', label: 'Dependency Injection' },
                { type: 'doc', id: 'core/registries', label: 'Service Registries' },
            ],
        },
        {
            type: 'category',
            label: 'Database',
            collapsed: false,
            items: [
                { type: 'doc', id: 'database/introduction', label: 'Introduction' },
                { type: 'doc', id: 'database/attributes', label: 'Schema Attributes' },
                { type: 'doc', id: 'database/migrations', label: 'Migrations Guide' },
            ],
        },
        {
            type: 'category',
            label: 'ORM',
            collapsed: false,
            items: [
                { type: 'doc', id: 'orm/models', label: 'Models' },
                { type: 'doc', id: 'orm/query-builder', label: 'Query Builder' },
                { type: 'doc', id: 'orm/relationships', label: 'Relationships' },
                { type: 'doc', id: 'orm/events', label: 'Events' },
                { type: 'doc', id: 'orm/validation', label: 'Validation' },
                { type: 'doc', id: 'orm/caching', label: 'Caching (Stash)' },
                { type: 'doc', id: 'orm/entity-builders', label: 'Entity Builders' },
                { type: 'doc', id: 'orm/pagination', label: 'Pagination' },
                { type: 'doc', id: 'orm/soft-deletes', label: 'Soft Deletes' },
                { type: 'doc', id: 'orm/transactions', label: 'Transactions' },
            ],
        },
        {
            type: 'category',
            label: 'Authentication',
            collapsed: false,
            items: [
                { type: 'doc', id: 'security/auth-intro', label: 'Introduction' },
                { type: 'doc', id: 'security/login', label: 'User Login' },
                { type: 'doc', id: 'security/signup', label: 'User Sign Up' },
                { type: 'doc', id: 'security/auth-user', label: 'Auth User' },
                { type: 'doc', id: 'security/protecting-routes', label: 'Protecting your routes' },
                { type: 'doc', id: 'security/roles', label: 'Roles/Permissions' },
            ],
        },
        {
            type: 'category',
            label: 'Sessions',
            collapsed: false,
            items: [
                { type: 'doc', id: 'core/sessions', label: 'Using Sessions' },
                { type: 'doc', id: 'core/flash', label: 'Session Flash' },
            ],
        },
        {
            type: 'category',
            label: 'Security',
            collapsed: false,
            items: [
                { type: 'doc', id: 'core/cookies', label: 'Cookies' },
                { type: 'doc', id: 'validation/validation', label: 'Validation' },
                { type: 'doc', id: 'security/auth-intro', label: 'Auth Introduction' },
                { type: 'doc', id: 'security/login', label: 'Login & Remember Me' },
                { type: 'doc', id: 'security/signup', label: 'Registration & Verification' },
                { type: 'doc', id: 'security/passwords', label: 'Password Recovery' },
                { type: 'doc', id: 'security/roles', label: 'Roles & Permissions' },
                { type: 'doc', id: 'security/protecting-routes', label: 'Protecting Routes' },
                { type: 'doc', id: 'security/auth-user', label: 'Custom User Model' },
            ],
        },
        {
            type: 'category',
            label: 'Utilities',
            collapsed: false,
            items: [
                { type: 'doc', id: 'utilities/forms', label: 'Forms' },
                { type: 'doc', id: 'core/mapper', label: 'Data Mapper' },
                { type: 'doc', id: 'utilities/events', label: 'Events' },
                { type: 'doc', id: 'utilities/http-client', label: 'Data Fetching' },
                { type: 'doc', id: 'core/cache', label: 'Caching' },
                { type: 'doc', id: 'utilities/mail', label: 'Mail' },
                { type: 'doc', id: 'utilities/filesystem', label: 'File System' },
                { type: 'doc', id: 'queue/queue', label: 'Queues/Jobs' },
            ],
        },
        {
            type: 'category',
            label: 'Scheduler',
            collapsed: false,
            items: [
                { type: 'doc', id: 'scheduler/scheduler', label: 'Task Scheduling' },
            ],
        },
        {
            type: 'category',
            label: 'Views',
            collapsed: false,
            items: [
                { type: 'doc', id: 'views/plates', label: 'PlatesPHP' },
                { type: 'doc', id: 'views/twig', label: 'Twig' },
            ],
        },
        {
            type: 'category',
            label: 'Building to scale',
            collapsed: false,
            items: [
                { type: 'doc', id: 'core/controllers', label: 'Controllers' },
                { type: 'doc', id: 'core/services', label: 'Services' },
            ],
        },
    ],
};

module.exports = sidebars;