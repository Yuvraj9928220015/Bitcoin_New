'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
    const [email, setEmail] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(`Thank you for subscribing with: ${email}`);
        setEmail('');
    };

    return (
        <footer className={styles['footer-section']}>
            <div className={styles['footer-container']}>
                <div className={styles['footer-content']}>

                    {/* Brand Info */}
                    <div className={styles['footer-brand']}>
                        <Link href="/">
                            <img
                                src="/bitcoine.png"
                                alt="Bitcoin Jewellery Logo"
                                className={styles['footer-logo']}
                            />
                        </Link>
                        <div className={styles['footer-name']}>Bitcoin jewelry</div>
                        <p className={styles['footer-brand-tagline']}>Premier Name in Bitcoin jewelry</p>
                    </div>

                    {/* Useful Links */}
                    <div className={styles['footer-links']}>
                        <h3 className={styles['footer-section-title']}>Customer Links</h3>
                        <ul>
                            <li><Link href="/new-arrival">New Arrival</Link></li>
                            <li><Link href="/about">About Us</Link></li>
                            <li><Link href="/return">Return and Exchange Policy</Link></li>
                            <li><Link href="/faqs">FAQ's</Link></li>
                            <li><Link href="/privacy">Privacy Policy</Link></li>
                            <li><Link href="/contact">Contact Us</Link></li>
                        </ul>
                    </div>

                    <div className={styles['footer-links']}>
                        <h3 className={styles['footer-section-title']}>Home</h3>
                        <ul>
                            <li><Link href="/blog">Blog</Link></li>
                            <li><Link href="/terms">Terms and Conditions</Link></li>
                            <li><Link href="/care-instructions">Care Instructions</Link></li>
                            <li><Link href="/xnatalie">Custom jewelry</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div className={styles['footer-newsletter']}>
                        <h3 className={styles['footer-section-title']}>Subscribe Now</h3>
                        <p className={styles['footer-newsletter-text']}>
                            Register here for our newsletter to receive updates on new releases and discover how our jewelry can help you signal your Bitcoin Statement.
                        </p>
                        <div className={styles['newsletter-form']}>
                            <label htmlFor="email-input" className={styles['email-label']}>Email</label>
                            <input
                                id="email-input"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter Email"
                                required
                                className={styles['newsletter-input']}
                            />
                            <button onClick={handleSubmit} className={styles['newsletter-button']}>
                                Send
                            </button>
                        </div>
                    </div>

                </div>
            </div>

            {/* Hidden SEO link */}

            <a href="/all-products"
                style={{
                    position: "absolute",
                    left: "-9999px",
                    width: "1px",
                    height: "1px",
                    overflow: "hidden"
                }}
            >
                All Products
            </a>
        </footer>
    );
}