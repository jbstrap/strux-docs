import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import CodeBlock from '@theme/CodeBlock';

import styles from './index.module.css';

// The "Slick" code snippet to display on the homepage
const codeSnippet = `<?php

use Strux\\Component\\Attributes\\Route;
use Strux\\Component\\Http\\Response;
use Strux\\Component\\Http\\Controller\\Web\\Controller;

class HomeController extends Controller
{
    #[Route(path: '/', methods: ['GET'], name: 'home')]
    public function index(): Response
    {
        return $this->json([
            'framework' => 'Strux',
            'status'    => 'Blazingly Fast 🚀'
        ]);
    }
}`;

function HomepageHeader() {
    const {siteConfig} = useDocusaurusContext();
    return (
        <header className={clsx('hero', styles.heroBanner)}>
            <div className="container">
                <div className="row">
                    {/* Left Column: Text */}
                    <div className="col col--6" style={{ textAlign: 'left', alignSelf: 'center' }}>
                        <h1 className="hero__title">
                            The <span style={{ color: 'var(--ifm-color-primary)' }}>Elegant</span> PHP Framework.
                        </h1>
                        <p className="hero__subtitle">
                            Strux combines the robustness of modern standards with the simplicity of attribute-based design. Build robust web applications with less configuration.
                        </p>
                        <div className={styles.buttons}>
                            <Link
                                className="button button--primary button--lg"
                                to="/docs/intro">
                                Get Started
                            </Link>
                            <Link
                                className="button button--secondary button--lg"
                                to="/docs/routing"
                                style={{ marginLeft: '1rem' }}>
                                View Documentation
                            </Link>
                        </div>
                    </div>

                    {/* Right Column: Code Snippet */}
                    <div className="col col--6" style={{ marginTop: '2rem' }}>
                        <div className={styles.codeWindow}>
                            <div className={styles.codeHeader}>
                                <span className={styles.dot} style={{background:'#ff5f56'}}></span>
                                <span className={styles.dot} style={{background:'#ffbd2e'}}></span>
                                <span className={styles.dot} style={{background:'#27c93f'}}></span>
                                <span className={styles.filename}>src/Controllers/Web/HomeController.php</span>
                            </div>
                            <CodeBlock language="php">
                                {codeSnippet}
                            </CodeBlock>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

function Feature({title, description, icon}) {
    return (
        <div className={clsx('col col--4')}>
            <div className="feature-card margin-bottom--lg" style={{ height: '100%' }}>
                <div className="text--center">
                    <span style={{ fontSize: '3rem' }}>{icon}</span>
                </div>
                <div className="text--center padding-horiz--md">
                    <h3>{title}</h3>
                    <p>{description}</p>
                </div>
            </div>
        </div>
    );
}

export default function Home() {
    const {siteConfig} = useDocusaurusContext();
    return (
        <Layout
            title={`Home`}
            description="Strux Framework - Modern PHP Development">
            <HomepageHeader />
            <main>
                <div className="container" style={{ padding: '4rem 0' }}>
                    <div className="row">
                        <Feature
                            title="Attribute Driven"
                            icon="✨"
                            description="Define Routes, Middleware, and Form validations directly in your classes using native PHP 8 Attributes."
                        />
                        <Feature
                            title="Zero Configuration"
                            icon="⚡"
                            description="Automatic dependency injection and registry discovery. Focus on your code, not the config files."
                        />
                        <Feature
                            title="Object-Oriented Forms"
                            icon="📝"
                            description="A powerful abstraction for Forms and Validation. Type-safe, reusable, and self-contained form logic."
                        />
                    </div>
                </div>
            </main>
        </Layout>
    );
}