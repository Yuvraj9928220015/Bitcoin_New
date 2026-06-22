'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { Country, State } from 'country-state-city';
import axios from 'axios';
import './bitcoin-xnatalie.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.bitcoinbutik.com';
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const CATEGORIES = [
  'Women Pendant',
  'Men Pendant',
  'Rings',
  'Earring',
  'Bracelet',
];

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#32325d',
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '15px',
      '::placeholder': { color: '#aab7c4' },
    },
    invalid: { color: '#fa755a', iconColor: '#fa755a' },
  },
};

/* ─────────────────────────────────────
   SVG jewelry icons per category
───────────────────────────────────── */
const JEWELRY_SVG = {
  silver: {
    'Women Pendant': (
      <svg width="52" height="52" viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg">
        <rect width="52" height="52" fill="#F0F0F0" rx="8" />
        <circle cx="26" cy="30" r="10" fill="none" stroke="#808080" strokeWidth="2" />
        <path d="M26 8 L26 18" stroke="#808080" strokeWidth="2" />
        <path d="M22 12 Q26 8 30 12" fill="none" stroke="#808080" strokeWidth="1.5" />
      </svg>
    ),
    'Men Pendant': (
      <svg width="52" height="52" viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg">
        <rect width="52" height="52" fill="#F0F0F0" rx="8" />
        <polygon points="26,16 34,36 18,36" fill="none" stroke="#808080" strokeWidth="2" />
        <path d="M26 8 L26 14" stroke="#808080" strokeWidth="2" />
      </svg>
    ),
    Rings: (
      <svg width="52" height="52" viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg">
        <rect width="52" height="52" fill="#F0F0F0" rx="8" />
        <circle cx="26" cy="28" r="11" fill="none" stroke="#808080" strokeWidth="4" />
        <polygon points="26,10 29,17 23,17" fill="#808080" />
      </svg>
    ),
    Earring: (
      <svg width="52" height="52" viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg">
        <rect width="52" height="52" fill="#F0F0F0" rx="8" />
        <circle cx="18" cy="15" r="3" fill="none" stroke="#808080" strokeWidth="1.5" />
        <path d="M18 18 Q14 28 18 36" fill="none" stroke="#808080" strokeWidth="1.5" />
        <circle cx="18" cy="38" r="4" fill="none" stroke="#808080" strokeWidth="1.5" />
        <circle cx="34" cy="15" r="3" fill="none" stroke="#808080" strokeWidth="1.5" />
        <path d="M34 18 Q30 28 34 36" fill="none" stroke="#808080" strokeWidth="1.5" />
        <circle cx="34" cy="38" r="4" fill="none" stroke="#808080" strokeWidth="1.5" />
      </svg>
    ),
    Bracelet: (
      <svg width="52" height="52" viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg">
        <rect width="52" height="52" fill="#F0F0F0" rx="8" />
        <ellipse cx="26" cy="26" rx="18" ry="10" fill="none" stroke="#808080" strokeWidth="3" />
        <circle cx="26" cy="16" r="3" fill="#808080" />
      </svg>
    ),
  },
  gold: {
    'Women Pendant': (
      <svg width="52" height="52" viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg">
        <rect width="52" height="52" fill="#FDF6E3" rx="8" />
        <circle cx="26" cy="30" r="10" fill="none" stroke="#D4A017" strokeWidth="2" />
        <path d="M26 8 L26 18" stroke="#D4A017" strokeWidth="2" />
        <path d="M22 12 Q26 8 30 12" fill="none" stroke="#D4A017" strokeWidth="1.5" />
      </svg>
    ),
    'Men Pendant': (
      <svg width="52" height="52" viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg">
        <rect width="52" height="52" fill="#FDF6E3" rx="8" />
        <polygon points="26,16 34,36 18,36" fill="none" stroke="#D4A017" strokeWidth="2" />
        <path d="M26 8 L26 14" stroke="#D4A017" strokeWidth="2" />
      </svg>
    ),
    Rings: (
      <svg width="52" height="52" viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg">
        <rect width="52" height="52" fill="#FDF6E3" rx="8" />
        <circle cx="26" cy="28" r="11" fill="none" stroke="#D4A017" strokeWidth="4" />
        <polygon points="26,10 29,17 23,17" fill="#D4A017" />
      </svg>
    ),
    Earring: (
      <svg width="52" height="52" viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg">
        <rect width="52" height="52" fill="#FDF6E3" rx="8" />
        <circle cx="18" cy="15" r="3" fill="none" stroke="#D4A017" strokeWidth="1.5" />
        <path d="M18 18 Q14 28 18 36" fill="none" stroke="#D4A017" strokeWidth="1.5" />
        <circle cx="18" cy="38" r="4" fill="none" stroke="#D4A017" strokeWidth="1.5" />
        <circle cx="34" cy="15" r="3" fill="none" stroke="#D4A017" strokeWidth="1.5" />
        <path d="M34 18 Q30 28 34 36" fill="none" stroke="#D4A017" strokeWidth="1.5" />
        <circle cx="34" cy="38" r="4" fill="none" stroke="#D4A017" strokeWidth="1.5" />
      </svg>
    ),
    Bracelet: (
      <svg width="52" height="52" viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg">
        <rect width="52" height="52" fill="#FDF6E3" rx="8" />
        <ellipse cx="26" cy="26" rx="18" ry="10" fill="none" stroke="#D4A017" strokeWidth="3" />
        <circle cx="26" cy="16" r="3" fill="#D4A017" />
      </svg>
    ),
  },
};

/* ─────────────────────────────────────
   Main Inner Component (needs Stripe hooks)
   FIX: Renamed from 'xnatalie' → 'BitcoinNatalieForm'
───────────────────────────────────── */
function BitcoinNatalieForm() {
  const stripe = useStripe();
  const elements = useElements();
  const allCountries = Country.getAllCountries();

  /* View: 'select' | 'checkout' | 'success' */
  const [view, setView] = useState('select');

  /* Selection form */
  const [silverCat, setSilverCat] = useState('');
  const [goldCat, setGoldCat] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState(1);

  /* Billing form */
  const [billing, setBilling] = useState({
    firstName: '',
    lastName: '',
    email: '',
    country: 'IN',
    streetAddress1: '',
    streetAddress2: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [paymentResult, setPaymentResult] = useState(null);

  /* Derived */
  const unitPrice = parseFloat(price) || 0;
  const selectedItems = [
    silverCat && { metal: 'Silver', category: silverCat },
    goldCat && { metal: 'Gold', category: goldCat },
  ].filter(Boolean);
  const subtotal = selectedItems.length * unitPrice * quantity;

  /* ── Billing states ── */
  const billingStates = State.getStatesOfCountry(billing.country);

  const handleBillingChange = (e) =>
    setBilling((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  /* ── Proceed to checkout ── */
  const handleProceed = (e) => {
    e.preventDefault();
    if (!silverCat && !goldCat) {
      alert('Please select at least one category (Silver or Gold).');
      return;
    }
    if (!price || unitPrice <= 0) {
      alert('Please enter a valid price.');
      return;
    }
    setView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /* ── Validate billing ── */
  const validateBilling = () => {
    const required = ['firstName', 'lastName', 'email', 'streetAddress1', 'city', 'zip', 'phone'];
    for (const f of required) {
      if (!billing[f].trim()) {
        alert(`Please fill in the ${f.replace(/([A-Z])/g, ' $1').toLowerCase()} field.`);
        return false;
      }
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(billing.email)) {
      alert('Please enter a valid email.');
      return false;
    }
    return true;
  };

  /* ── Place order ── */
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!validateBilling()) return;
    if (!stripe || !elements) {
      alert('Payment system is loading. Please wait.');
      return;
    }

    setIsProcessing(true);
    setPaymentError(null);

    try {
      const cardEl = elements.getElement(CardNumberElement);
      const selCountry = allCountries.find((c) => c.isoCode === billing.country);
      const selState = State.getStateByCodeAndCountry(billing.state, billing.country);

      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardEl,
        billing_details: {
          name: `${billing.firstName} ${billing.lastName}`,
          email: billing.email,
          phone: billing.phone,
          address: {
            line1: billing.streetAddress1,
            line2: billing.streetAddress2 || null,
            city: billing.city,
            state: selState?.isoCode || billing.state,
            postal_code: billing.zip,
            country: billing.country,
          },
        },
      });

      if (error) {
        setPaymentError(error.message);
        setIsProcessing(false);
        return;
      }

      const amountInCents = Math.round(subtotal * 100);
      if (amountInCents <= 0) {
        alert('Invalid payment amount.');
        setIsProcessing(false);
        return;
      }

      const browserId =
        (typeof window !== 'undefined' &&
          (localStorage.getItem('browserId') || sessionStorage.getItem('browserId'))) ||
        `browser_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const response = await axios.post(
        `${API_URL}/api/payment`,
        {
          amount: amountInCents,
          id: paymentMethod.id,
          paymentMethodId: paymentMethod.id,
          browserId,
          items: selectedItems.map((item, idx) => ({
            id: `bxn-${item.metal.toLowerCase()}-${idx}`,
            name: `${item.metal} ${item.category}`,
            price: unitPrice,
            quantity: quantity,
            metal: item.metal,
            category: item.category,
            description,
          })),
          customerInfo: {
            firstName: billing.firstName,
            lastName: billing.lastName,
            email: billing.email,
            country: billing.country,
            streetAddress1: billing.streetAddress1,
            streetAddress2: billing.streetAddress2 || '',
            city: billing.city,
            state: billing.state,
            zip: billing.zip,
            phone: billing.phone,
            countryName: selCountry?.name || 'Unknown',
            stateName: selState?.name || billing.state,
          },
          note: description || '',
        },
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (response.data.success) {
        setPaymentResult({
          paymentId: response.data.paymentId,
          orderId: response.data.orderId,
          amount: response.data.amount,
          email: response.data.customerEmail || billing.email,
        });
        setView('success');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (response.data.requiresAction && response.data.clientSecret) {
        const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(
          response.data.clientSecret
        );
        if (confirmError) {
          setPaymentError(confirmError.message);
        } else if (paymentIntent.status === 'succeeded') {
          setPaymentResult({
            paymentId: paymentIntent.id,
            orderId: response.data.orderId,
            amount: paymentIntent.amount,
            email: billing.email,
          });
          setView('success');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          setPaymentError(`Payment failed: ${paymentIntent.status}`);
        }
      } else {
        setPaymentError(response.data.message || 'Payment failed. Please try again.');
      }
    } catch (err) {
      setPaymentError(err.response?.data?.message || 'A server error occurred.');
    }

    setIsProcessing(false);
  };

  /* ────────── SUCCESS VIEW ────────── */
  if (view === 'success') {
    return (
      <div className="bxn-page">
        <div className="bxn-header">
          <h1 className="bxn-title">
            <span className="title-gold">Custom jewelry</span>
          </h1>
          <p className="bxn-subtitle">Luxury Jewelry Collection</p>
        </div>

        <div className="success-card">
          <div className="success-icon">✓</div>
          <h2 className="success-heading">Order Complete!</h2>
          <p className="success-sub">Thank you for your purchase.</p>
          <div className="success-details">
            <div className="detail-row">
              <span>Payment ID</span>
              <span>{paymentResult.paymentId}</span>
            </div>
            <div className="detail-row">
              <span>Order ID</span>
              <span>{paymentResult.orderId || '—'}</span>
            </div>
            <div className="detail-row">
              <span>Amount</span>
              <span>${(paymentResult.amount / 100).toFixed(2)}</span>
            </div>
            <div className="detail-row">
              <span>Confirmation</span>
              <span>{paymentResult.email}</span>
            </div>
            <div className="detail-row">
              <span>Date</span>
              <span>{new Date().toLocaleDateString()}</span>
            </div>
          </div>
          <a href="/" className="continue-btn">Continue Shopping</a>
        </div>
      </div>
    );
  }

  /* ────────── CHECKOUT VIEW ────────── */
  if (view === 'checkout') {
    return (
      <div className="bxn-page">
        <div className="bxn-header">
          <h1 className="bxn-title">
            <span className="title-gold">Custom jewelry</span>
          </h1>
          <p className="bxn-subtitle">Luxury Jewelry Collection</p>
        </div>

        <button className="back-btn" onClick={() => setView('select')}>
          ← Back to Selection
        </button>

        <form className="checkout-layout" onSubmit={handlePlaceOrder}>
          {/* ── LEFT: Billing + Payment ── */}
          <div className="checkout-left">
            {/* Billing */}
            <div className="checkout-card">
              <h2 className="card-title">Billing Details</h2>
              <div className="billing-grid">
                <div className="billing-group">
                  <label>First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={billing.firstName}
                    onChange={handleBillingChange}
                    required
                  />
                </div>
                <div className="billing-group">
                  <label>Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={billing.lastName}
                    onChange={handleBillingChange}
                    required
                  />
                </div>
                <div className="billing-group billing-full">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={billing.email}
                    onChange={handleBillingChange}
                    required
                  />
                </div>
                <div className="billing-group billing-full">
                  <label>Country / Region *</label>
                  <select name="country" value={billing.country} onChange={handleBillingChange}>
                    {allCountries.map((c) => (
                      <option key={c.isoCode} value={c.isoCode}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="billing-group billing-full">
                  <label>Street Address *</label>
                  <input
                    type="text"
                    name="streetAddress1"
                    placeholder="House number and street name"
                    value={billing.streetAddress1}
                    onChange={handleBillingChange}
                    required
                  />
                  <input
                    type="text"
                    name="streetAddress2"
                    placeholder="Apartment, suite, unit (optional)"
                    value={billing.streetAddress2}
                    onChange={handleBillingChange}
                    style={{ marginTop: '8px' }}
                  />
                </div>
                <div className="billing-group">
                  <label>City *</label>
                  <input
                    type="text"
                    name="city"
                    value={billing.city}
                    onChange={handleBillingChange}
                    required
                  />
                </div>
                <div className="billing-group">
                  <label>ZIP Code *</label>
                  <input
                    type="text"
                    name="zip"
                    value={billing.zip}
                    onChange={handleBillingChange}
                    required
                  />
                </div>
                <div className="billing-group billing-full">
                  <label>State / Province *</label>
                  {billingStates.length > 0 ? (
                    <select name="state" value={billing.state} onChange={handleBillingChange}>
                      <option value="">Select a state</option>
                      {billingStates.map((s) => (
                        <option key={s.isoCode} value={s.isoCode}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      name="state"
                      value={billing.state}
                      onChange={handleBillingChange}
                      placeholder="Enter state/province"
                    />
                  )}
                </div>
                <div className="billing-group billing-full">
                  <label>Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={billing.phone}
                    onChange={handleBillingChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="checkout-card" style={{ marginTop: '1rem' }}>
              <h2 className="card-title">Payment Information</h2>
              <div className="billing-group" style={{ marginBottom: '0.75rem' }}>
                <label>Card Number</label>
                <div className="stripe-input-box">
                  <CardNumberElement options={CARD_ELEMENT_OPTIONS} />
                </div>
              </div>
              <div className="billing-grid">
                <div className="billing-group">
                  <label>Expiry Date</label>
                  <div className="stripe-input-box">
                    <CardExpiryElement options={CARD_ELEMENT_OPTIONS} />
                  </div>
                </div>
                <div className="billing-group">
                  <label>CVC</label>
                  <div className="stripe-input-box">
                    <CardCvcElement options={CARD_ELEMENT_OPTIONS} />
                  </div>
                </div>
              </div>

              {paymentError && (
                <div className="payment-error">❌ {paymentError}</div>
              )}

              <p className="privacy-note">
                🔒 Your personal data will be used to process your order as described in our
                privacy policy.
              </p>
            </div>
          </div>

          {/* ── RIGHT: Order Summary ── */}
          <div className="checkout-right">
            <div className="checkout-card">
              <h2 className="card-title">Your Order</h2>

              {selectedItems.map((item) => (
                <div key={`${item.metal}-${item.category}`} className="order-item-row">
                  <div className="item-thumb">
                    {JEWELRY_SVG[item.metal.toLowerCase()]?.[item.category]}
                  </div>
                  <div className="item-info">
                    <p className="item-name">{item.category}</p>
                    <p className="item-meta">
                      <span className={`metal-badge badge-${item.metal.toLowerCase()}`}>
                        {item.metal}
                      </span>
                      &nbsp; Qty: {quantity}
                      {description && (
                        <span className="item-desc">
                          {description.substring(0, 40)}{description.length > 40 ? '…' : ''}
                        </span>
                      )}
                    </p>
                  </div>
                  <p className="item-price">${(unitPrice * quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="checkout-card summary-totals">
              <div className="total-line">
                <span>Subtotal ({selectedItems.length} items)</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="total-line">
                <span>Shipping</span>
                <span>$0.00</span>
              </div>
              <div className="total-line">
                <span>Tax (0%)</span>
                <span>$0.00</span>
              </div>
              <div className="total-line grand-total">
                <span>Total</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              type="submit"
              className="place-order-btn"
              disabled={isProcessing || !stripe || !elements}
            >
              {isProcessing
                ? '🔄 Processing Payment...'
                : !stripe || !elements
                ? 'Loading...'
                : `💳 Place Order — $${subtotal.toFixed(2)}`}
            </button>
          </div>
        </form>
      </div>
    );
  }

  /* ────────── SELECT VIEW (default) ────────── */
  return (
    <div className="bxn-page" suppressHydrationWarning>
      <div className="bxn-header">
        <h1 className="bxn-title">
            <span className="title-gold">Custom jewelry</span>
        </h1>
        <p className="bxn-subtitle">Luxury Jewelry Collection</p>
      </div>

      <form className="select-form" onSubmit={handleProceed} suppressHydrationWarning>
        {/* Metal selectors */}
        <div className="metal-row">
          <div className="metal-card silver-card">
            <div className="metal-label">
              <span className="metal-dot dot-silver" />
              Silver
            </div>
            <select value={silverCat} onChange={(e) => setSilverCat(e.target.value)}>
              <option value="">— Select Category —</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {silverCat && (
              <div className="preview-icon">
                {JEWELRY_SVG.silver[silverCat]}
              </div>
            )}
          </div>

          <div className="metal-card gold-card">
            <div className="metal-label">
              <span className="metal-dot dot-gold" />
              Gold
            </div>
            <select value={goldCat} onChange={(e) => setGoldCat(e.target.value)}>
              <option value="">— Select Category —</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {goldCat && (
              <div className="preview-icon">
                {JEWELRY_SVG.gold[goldCat]}
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="form-field">
          <label className="field-label">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter product description or special instructions..."
            rows={3}
          />
        </div>

        {/* Price + Quantity */}
        <div className="price-row">
          <div className="form-field">
            <label className="field-label">Price (USD)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          <div className="form-field">
            <label className="field-label">Quantity</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            />
          </div>
        </div>

        <button type="submit" className="pay-btn">
          Proceed to Pay
          {subtotal > 0 && ` — $${subtotal.toFixed(2)}`}
        </button>
      </form>
    </div>
  );
}

/* ─────────────────────────────────────
   Page wrapper (wraps with Stripe Elements)
   FIX: Renamed from 'xnatalie' → 'XnatalePage'
        Inner component correctly references 'BitcoinNatalieForm'
───────────────────────────────────── */
export default function XnatalePage() {
  return (
    <Elements stripe={stripePromise}>
      <BitcoinNatalieForm />
    </Elements>
  );
}