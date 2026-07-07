// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer').themes.github;
const darkCodeTheme = require('prism-react-renderer').themes.dracula;

/** @type {import('@docusaurus/types').Config} */
const config = {
    title: 'Strux Framework',
    tagline: 'Modern, Attribute-Based PHP Framework',
    favicon: 'img/favicon.png',

    // Set the production url of your site here
    url: 'https://strux-docs.netlify.com',
    baseUrl: '/',

    organizationName: 'strux-php',
    projectName: 'strux-framework',

    onBrokenLinks: 'warn',
    // onBrokenMarkdownLinks: 'warn',

    i18n: {
        defaultLocale: 'en',
        locales: ['en'],
    },

    presets: [
        [
            'classic',
            /** @type {import('@docusaurus/preset-classic').Options} */
            ({
                docs: {
                    sidebarPath: require.resolve('./sidebars.js'),
                    editUrl: 'https://github.com/jbstrap/strux-docs/tree/main/',
                    remarkPlugins: [
                        [require('remark-github-blockquote-alert').default, {}],
                    ],
                },
                theme: {
                    customCss: require.resolve('./src/css/custom.css'),
                },
            }),
        ],
    ],

    themeConfig:
        /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
        ({
            announcementBar: {
                id: 'support_us',
                content: '🚀 We’re taking Strux to the next level, and we need your help. <a target="_blank" rel="noopener noreferrer" href="/support">Become a sponsor</a> today! 🚀',
                backgroundColor: 'var(--ifm-color-primary)',
                textColor: '#ffffff',
                isCloseable: true,
            },
            image: 'img/docusaurus-social-card.jpg',
            navbar: {
                title: 'Strux Framework',
                logo: {
                    alt: 'Strux Logo',
                    src: 'img/logo.png',
                },
                items: [
                    {
                        type: 'docSidebar',
                        sidebarId: 'tutorialSidebar',
                        position: 'right',
                        label: 'Documentation',
                    },
                    {
                        to: '/blog',
                        position: 'right',
                        label: 'Blog',
                    },
                    {
                        to: '/community',
                        position: 'right',
                        label: 'Community',
                    },
                    {
                        to: '/support',
                        position: 'right',
                        label: 'Support',
                    },
                    {
                        href: 'https://github.com/jbstrap/strux-framework',
                        label: 'GitHub',
                        position: 'right',
                    },
                ],
            },
            footer: {
                style: 'dark',
                links: [
                    {
                        title: 'Docs',
                        items: [
                            {
                                label: 'Getting Started',
                                to: '/docs/intro',
                            },
                        ],
                    },
                    {
                        title: 'Community',
                        items: [
                            {
                                label: 'Stack Overflow',
                                href: 'https://stackoverflow.com/questions/tagged/docusaurus',
                            },
                        ],
                    },
                ],
                copyright: `Copyright © ${new Date().getFullYear()} Strux Framework.`,
            },
            prism: {
                theme: lightCodeTheme,
                darkTheme: darkCodeTheme,
                additionalLanguages: ['php', 'json', 'bash']
            },
            algolia: {
                appId: 'DXG8S3BFN4',
                apiKey: '6108d3a1a6f6032227de3eacd9e48963',
                indexName: 'strux_framework',
                contextualSearch: true,
            },
        }),
};

module.exports = config;