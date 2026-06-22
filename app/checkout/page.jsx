'use client';

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { BsPencil } from 'react-icons/bs';
import { TbTruckDelivery } from 'react-icons/tb';
import { RiCoupon3Line } from 'react-icons/ri';
import { CiLock } from 'react-icons/ci';
import { useCart } from '../Context/CartContext';
import { useRouter } from 'next/navigation';
import { Country, State } from 'country-state-city';
import QRCode from 'qrcode';
import './checkout.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.bitcoinbutik.com';
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#32325d',
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': { color: '#aab7c4' },
    },
    invalid: { color: '#fa755a', iconColor: '#fa755a' },
  },
};

const LightningPaymentModal = ({ paymentData, onSuccess, onClose, onExpire }) => {
  const [status, setStatus] = useState('unpaid');
  const [secondsLeft, setSecondsLeft] = useState(600);
  const pollRef = useRef(null);
  const timerRef = useRef(null);

  const paymentId = paymentData?.paymentId;
  const checkoutUrl = paymentData?.checkoutUrl;

  useEffect(() => {
    setSecondsLeft(paymentData?.ttl || 600);
    timerRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(timerRef.current);
          onExpire?.();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    if (!paymentId) return;
    let attempts = 0;
    pollRef.current = setInterval(async () => {
      attempts++;
      if (attempts > 200) {
        clearInterval(pollRef.current);
        onExpire?.();
        return;
      }
      try {
        const res = await axios.get(`${API_URL}/api/speed/payment/${paymentId}/status`);
        if (res.data.isPaid) {
          clearInterval(pollRef.current);
          clearInterval(timerRef.current);
          setStatus('paid');
          setTimeout(() => onSuccess(res.data), 1200);
        }
      } catch (_) { }
    }, 3000);
    return () => clearInterval(pollRef.current);
  }, [paymentId]);

  const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="Checkout-modal-content"
        style={{ maxWidth: 420, width: '95%' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close-btn" onClick={onClose}>×</button>

        {status === 'paid' ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>⚡✅</div>
            <h2 style={{ color: '#28a745' }}>Payment Confirmed!</h2>
            <p>Your Bitcoin Lightning payment was received.</p>
          </div>
        ) : (
          <>
            <h2 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
              ⚡ Pay with Lightning
            </h2>

            <div style={{
              textAlign: 'center',
              fontSize: '1.5rem',
              fontWeight: 600,
              color: secondsLeft < 60 ? '#dc3545' : '#f7931a',
              marginBottom: '1rem'
            }}>
              ⏱ {formatTime(secondsLeft)}
            </div>

            <div style={{
              background: '#f8f9fa',
              borderRadius: 8,
              padding: '0.75rem',
              textAlign: 'center',
              marginBottom: '1.5rem'
            }}>
              <div style={{ fontWeight: 600, fontSize: '1.2rem' }}>
                ${paymentData?.amount?.toFixed(2)} USD
              </div>
            </div>


            <a href={checkoutUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'block',
                textAlign: 'center',
                background: '#f7931a',
                color: '#fff',
                padding: '0.9rem',
                borderRadius: 8,
                fontWeight: 600,
                fontSize: '1rem',
                textDecoration: 'none',
                marginBottom: '1rem'
              }}
            >
              ⚡ Open Payment Page
            </a>

            <p style={{
              textAlign: 'center',
              color: '#6c757d',
              fontSize: '0.85rem',
              marginBottom: '1rem'
            }}>
              Payment page khulegi — wahan Lightning ya On-chain se pay karo.
              Yeh window automatically update hogi payment ke baad.
            </p>

            <p style={{
              textAlign: 'center',
              color: '#6c757d',
              fontSize: '0.82rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem'
            }}>
              <span style={{
                width: 8, height: 8,
                borderRadius: '50%',
                background: '#f7931a',
                display: 'inline-block',
                animation: 'pulse 1.5s infinite'
              }} />
              Waiting for payment...
            </p>
          </>
        )}
      </div>
    </div>
  );
};

// ─── Main Checkout Form ────────────────────────────────────────────────────
const CheckoutForm = () => {
  const router = useRouter();
  const { cartItems, subtotal, updateQuantity, removeFromCart, clearCart } = useCart();
  const stripe = useStripe();
  const elements = useElements();

  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);

  const [activeCoupons, setActiveCoupons] = useState([]);
  const [couponsAvailable, setCouponsAvailable] = useState(true);
  const allCountries = Country.getAllCountries();

  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    country: 'US',
    streetAddress1: '',
    streetAddress2: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
    paymentMethod: 'card', // 'card' | 'lightning'
  });

  const [activeModal, setActiveModal] = useState(null);
  const [note, setNote] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [shippingInfo, setShippingInfo] = useState({ country: 'US', state: '', city: '', zip: '' });
  const [billingStates, setBillingStates] = useState([]);
  const [shippingModalStates, setShippingModalStates] = useState([]);

  // Lightning payment state
  const [lightningPaymentData, setLightningPaymentData] = useState(null);
  const [showLightningModal, setShowLightningModal] = useState(false);

  // Load active coupons
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/coupons/active`, { timeout: 5000 });
        if (res.data?.success) setActiveCoupons(res.data.coupons || []);
        else setCouponsAvailable(false);
      } catch {
        setCouponsAvailable(false);
        setActiveCoupons([]);
      }
    };
    fetchCoupons();
  }, []);

  useEffect(() => {
    const states = State.getStatesOfCountry(formData.country);
    setBillingStates(states);
    if (states.length > 0 && !states.some((s) => s.isoCode === formData.state)) {
      setFormData((prev) => ({ ...prev, state: states[0].isoCode }));
    } else if (states.length === 0) {
      setFormData((prev) => ({ ...prev, state: '' }));
    }
  }, [formData.country]);

  useEffect(() => {
    const states = State.getStatesOfCountry(shippingInfo.country);
    setShippingModalStates(states);
    if (states.length > 0 && !states.some((s) => s.isoCode === shippingInfo.state)) {
      setShippingInfo((prev) => ({ ...prev, state: states[0].isoCode }));
    } else if (states.length === 0) {
      setShippingInfo((prev) => ({ ...prev, state: '' }));
    }
  }, [shippingInfo.country]);

  const shippingCost = 0;
  const taxRate = 0;
  const calculatedTax = (subtotal + shippingCost) * taxRate;
  const total = subtotal + shippingCost + calculatedTax;
  const finalTotal = appliedCoupon ? total - appliedCoupon.discountAmount : total;

  const handleFormChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const handleShippingInfoChange = (e) =>
    setShippingInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const openModal = (name) => setActiveModal(name);
  const closeModal = () => setActiveModal(null);

  const handleSaveNote = (e) => {
    e.preventDefault();
    closeModal();
    alert('Note saved!');
  };

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) { alert('Please enter a coupon code'); return; }
    setCouponLoading(true);
    try {
      const res = await axios.post(
        `${API_URL}/api/coupons/validate`,
        { code: couponCode, orderAmount: subtotal },
        { timeout: 5000 }
      );
      if (res.data.success) {
        const c = res.data.coupon;
        let disc = 0;
        if (c.discountType === 'percentage') {
          disc = (subtotal * c.discountValue) / 100;
          if (c.maxDiscountAmount && disc > c.maxDiscountAmount) disc = c.maxDiscountAmount;
        } else if (c.discountType === 'fixed') {
          disc = Math.min(c.discountValue, subtotal);
        }
        setAppliedCoupon({ ...c, discountAmount: disc });
        alert(`Coupon "${c.code}" applied! You saved $${disc.toFixed(2)}`);
        setCouponCode('');
        closeModal();
      } else {
        alert('❌ Invalid or expired coupon code.');
      }
    } catch (err) {
      if (err.response?.status === 404) {
        alert('❌ Coupon service is currently unavailable.');
      } else {
        alert(`❌ ${err.response?.data?.message || 'Invalid coupon code'}`);
      }
      setAppliedCoupon(null);
    } finally {
      setCouponLoading(false);
    }
  };

  const handleCalculateShipping = (e) => {
    e.preventDefault();
    let cost = 15;
    const country = allCountries.find((c) => c.isoCode === shippingInfo.country);
    const state = State.getStateByCodeAndCountry(shippingInfo.state, shippingInfo.country);
    if (shippingInfo.country === 'US' && state?.name === 'California') cost = 10;
    else if (shippingInfo.country === 'CA') cost = 25;
    else if (shippingInfo.country === 'GB') cost = 30;
    alert(`Shipping: $${cost.toFixed(2)} for ${shippingInfo.city}, ${state?.name || country?.name}`);
    closeModal();
  };

  const validateForm = () => {
    for (const f of ['firstName', 'lastName', 'email', 'streetAddress1', 'city', 'zip', 'phone']) {
      if (!formData[f].trim()) {
        alert(`Please fill in the ${f.replace(/([A-Z])/g, ' $1').toLowerCase()} field.`);
        return false;
      }
    }
    if (billingStates.length > 0 && !formData.state) {
      alert('Please select a state.');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      alert('Please enter a valid email.');
      return false;
    }
    if (!/^[\d\s\-+()]+$/.test(formData.phone)) {
      alert('Please enter a valid phone number.');
      return false;
    }
    return true;
  };

  // Build shared customer info and items payload
  const buildPayload = () => {
    const selCountry = allCountries.find((c) => c.isoCode === formData.country);
    const selState = State.getStateByCodeAndCountry(formData.state, formData.country);
    const browserId =
      (typeof window !== 'undefined' &&
        (localStorage.getItem('browserId') || sessionStorage.getItem('browserId'))) ||
      `browser_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return {
      browserId,
      customerInfo: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        country: formData.country,
        streetAddress1: formData.streetAddress1,
        streetAddress2: formData.streetAddress2 || '',
        city: formData.city,
        state: formData.state,
        zip: formData.zip,
        phone: formData.phone,
        countryName: selCountry?.name || 'Unknown',
        stateName: selState?.name || formData.state,
      },
      items: cartItems.map((item) => ({
        id: item.id || item.productId || item.cartId,
        productId: item.productId || item.id || item.cartId,
        name: item.name,
        image: item.image,
        price: parseFloat(item.price) || 0,
        quantity: parseInt(item.quantity) || 1,
        size: item.size,
      })),
      appliedCoupons: appliedCoupon ? [appliedCoupon.code] : [],
      note: note || '',
    };
  };

  // ── Stripe payment flow ──────────────────────────────────────────────────
  const handleStripePayment = async () => {
    if (!stripe || !elements) {
      alert('❌ Payment system loading. Please wait.');
      return;
    }

    const cardEl = elements.getElement(CardNumberElement);
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardEl,
      billing_details: {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        address: {
          line1: formData.streetAddress1,
          line2: formData.streetAddress2 || null,
          city: formData.city,
          state: formData.state,
          postal_code: formData.zip,
          country: formData.country,
        },
      },
    });

    if (error) {
      setPaymentStatus({ status: 'error', message: error.message });
      return;
    }

    const amountInCents = Math.round(parseFloat(finalTotal) * 100);
    if (!amountInCents || amountInCents <= 0) {
      alert('❌ Invalid payment amount.');
      return;
    }

    const payload = buildPayload();
    const response = await axios.post(
      `${API_URL}/api/payment`,
      {
        amount: amountInCents,
        id: paymentMethod.id,
        paymentMethodId: paymentMethod.id,
        ...payload,
        appliedCoupons: payload.appliedCoupons,
        appliedCoupon: appliedCoupon,
      },
      { headers: { 'Content-Type': 'application/json' } }
    );

    if (response.data.success) {
      setPaymentStatus({
        status: 'success',
        paymentId: response.data.paymentId,
        amount: response.data.amount,
        customerEmail: response.data.customerEmail || formData.email,
        orderId: response.data.orderId,
        orderNumber: response.data.orderNumber,
        method: 'card',
      });
      clearCart();
      setAppliedCoupon(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setPaymentStatus({
        status: 'error',
        message: response.data.message || 'Payment failed. Please try again.',
      });
    }
  };

  // ── Lightning (Speed) payment flow ───────────────────────────────────────
  const handleLightningPayment = async () => {
    const payload = buildPayload();
    const response = await axios.post(
      `${API_URL}/api/speed/payment`,
      {
        amount: parseFloat(finalTotal.toFixed(2)),
        ...payload,
      },
      { headers: { 'Content-Type': 'application/json' } }
    );

    if (response.data.success) {
      // ✅ Speed checkout page pe redirect karo
      window.open(response.data.checkoutUrl, '_blank');

      // Poll karte raho payment status ke liye
      setLightningPaymentData(response.data);
      setShowLightningModal(true);
    } else {
      setPaymentStatus({
        status: 'error',
        message: response.data.message || 'Lightning payment creation failed.',
      });
    }
  };

  // ── Unified submit handler ───────────────────────────────────────────────
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) { alert('❌ Your cart is empty!'); return; }
    if (!validateForm()) return;

    setIsProcessing(true);
    setPaymentStatus(null);

    try {
      if (formData.paymentMethod === 'lightning') {
        await handleLightningPayment();
      } else {
        await handleStripePayment();
      }
    } catch (serverError) {
      setPaymentStatus({
        status: 'error',
        message: serverError.response?.data?.message || 'A server error occurred.',
      });
    }

    setIsProcessing(false);
  };

  // Lightning success callback
  const handleLightningSuccess = (data) => {
    setShowLightningModal(false);
    setPaymentStatus({
      status: 'success',
      paymentId: lightningPaymentData.paymentId,
      amount: lightningPaymentData.targetAmount,
      targetCurrency: lightningPaymentData.targetCurrency,
      customerEmail: formData.email,
      orderId: lightningPaymentData.orderId,
      orderNumber: lightningPaymentData.orderNumber,
      method: 'lightning',
    });
    clearCart();
    setAppliedCoupon(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ── Success screen ───────────────────────────────────────────────────────
  if (paymentStatus?.status === 'success') {
    const isLightning = paymentStatus.method === 'lightning';
    return (
      <div className="checkout-container">
        <div className="payment-success-message">
          <h2>{isLightning ? '⚡ Lightning Payment Complete!' : '🎉 Order Complete!'}</h2>
          <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Thank you for your purchase!</p>
          <div className="success-details-box">
            <p><strong>Payment ID:</strong> {paymentStatus.paymentId}</p>
            <p><strong>Order ID:</strong> {paymentStatus.orderId || 'N/A'}</p>
            {paymentStatus.orderNumber && (
              <p><strong>Order Number:</strong> {paymentStatus.orderNumber}</p>
            )}
            {isLightning ? (
              <p>
                <strong>Amount:</strong>{' '}
                {paymentStatus.amount?.toLocaleString()} {paymentStatus.targetCurrency}
              </p>
            ) : (
              <p>
                <strong>Amount:</strong> ${(paymentStatus.amount / 100).toFixed(2)} USD
              </p>
            )}
            <p><strong>📧 Confirmation:</strong> {paymentStatus.customerEmail}</p>
            <p><strong>📅 Date:</strong> {new Date().toLocaleDateString()}</p>
          </div>
          <p style={{ fontSize: '1rem', opacity: 0.9, marginBottom: '1.5rem' }}>
            A confirmation email has been sent.
          </p>
          <button className="continue-btn" onClick={() => router.push('/')}>
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const isLightningSelected = formData.paymentMethod === 'lightning';

  return (
    <div className="checkout-container">
      {/* Lightning payment modal */}
      {showLightningModal && lightningPaymentData && (
        <LightningPaymentModal
          paymentData={lightningPaymentData}
          onSuccess={handleLightningSuccess}
          onClose={() => setShowLightningModal(false)}
          onExpire={() => {
            setShowLightningModal(false);
            alert('⏱ Invoice expired. Please place the order again.');
          }}
        />
      )}

      <form className="checkout-form" onSubmit={handlePlaceOrder}>

        {/* ── Billing Details ── */}
        <div className="billing-details">
          <h1>Billing details</h1>
          <div className="form-row-split">
            <div className="form-group">
              <label htmlFor="firstName">First name *</label>
              <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleFormChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last name *</label>
              <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleFormChange} required />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="email">Email address *</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleFormChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="country">Country / Region *</label>
            <select id="country" name="country" value={formData.country} onChange={handleFormChange} required>
              {allCountries.map((c) => <option key={c.isoCode} value={c.isoCode}>{c.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="streetAddress1">Street address *</label>
            <input type="text" id="streetAddress1" name="streetAddress1" placeholder="House number and street name" value={formData.streetAddress1} onChange={handleFormChange} required />
            <input type="text" id="streetAddress2" name="streetAddress2" placeholder="Apartment, suite, unit, etc. (optional)" value={formData.streetAddress2} onChange={handleFormChange} style={{ marginTop: '10px' }} />
          </div>
          <div className="form-group">
            <label htmlFor="city">Town / City *</label>
            <input type="text" id="city" name="city" value={formData.city} onChange={handleFormChange} required />
          </div>
          <div className="form-row-split">
            <div className="form-group">
              <label htmlFor="state">State / Province *</label>
              {billingStates.length > 0 ? (
                <select id="state" name="state" value={formData.state} onChange={handleFormChange} required>
                  <option value="">Select a state</option>
                  {billingStates.map((s) => <option key={s.isoCode} value={s.isoCode}>{s.name}</option>)}
                </select>
              ) : (
                <input type="text" id="state" name="state" value={formData.state} onChange={handleFormChange} placeholder="Enter state/province" required />
              )}
            </div>
            <div className="form-group">
              <label htmlFor="zip">ZIP Code *</label>
              <input type="text" id="zip" name="zip" value={formData.zip} onChange={handleFormChange} required />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="phone">Phone *</label>
            <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleFormChange} required />
          </div>
        </div>

        {/* ── Order Details ── */}
        <div className="order-details">
          <div className="order-items">
            <h2>Your Order</h2>
            {cartItems.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', background: '#f8f9fa', borderRadius: '10px', color: '#6c757d' }}>
                <p style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>🛒 Your cart is empty</p>
                <p>Add some items to get started!</p>
              </div>
            ) : (
              cartItems.map((item) => (
                <div key={item.cartId} className="checkout-cart-item">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="checkout-item-image"
                    onError={(e) => { e.target.src = '/default-image.jpg'; }}
                  />
                  <div className="checkout-item-details">
                    <h4>{item.name}</h4>
                    {item.size && <p>Size: {item.size}</p>}
                    <div className="checkout-quantity-controls">
                      <span>Qty:</span>
                      <button type="button" onClick={() => updateQuantity(item.cartId, -1)} disabled={item.quantity <= 1}>-</button>
                      <span>{item.quantity}</span>
                      <button type="button" onClick={() => updateQuantity(item.cartId, 1)}>+</button>
                    </div>
                  </div>
                  <div className="checkout-item-price-section">
                    <p className="checkout-item-price">${(item.price * item.quantity).toFixed(2)}</p>
                    <button type="button" onClick={() => removeFromCart(item.cartId)} className="remove-item-btn">Remove</button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* ── Order Summary ── */}
          <div className="order-summary-box">
            <div className="order-summary-header">
              <div className="summary-icon-item" onClick={() => openModal('note')}><BsPencil /><span>Note</span></div>
              <div className="summary-icon-item" onClick={() => openModal('shipping')}><TbTruckDelivery /><span>Shipping</span></div>
              <div className="summary-icon-item" onClick={() => openModal('coupon')}><RiCoupon3Line /><span>Coupon</span></div>
            </div>
            <div className="order-summary-line"><span>Subtotal ({cartItems.length} items)</span><span>${subtotal.toFixed(2)}</span></div>
            <div className="order-summary-line"><span>Shipping</span><span>${shippingCost.toFixed(2)}</span></div>
            <div className="order-summary-line"><span>Tax ({taxRate * 100}%)</span><span>${calculatedTax.toFixed(2)}</span></div>
            {appliedCoupon && (
              <div className="order-summary-line coupon-discount" style={{ color: '#28a745' }}>
                <span>💰 Discount ({appliedCoupon.code})</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>-${appliedCoupon.discountAmount.toFixed(2)}</span>
                  <button
                    type="button"
                    onClick={() => { setAppliedCoupon(null); alert('Coupon removed'); }}
                    style={{ background: 'transparent', border: 'none', color: '#dc3545', cursor: 'pointer', fontSize: '0.9rem', textDecoration: 'underline' }}
                  >Remove</button>
                </div>
              </div>
            )}
            <div className="order-summary-line total" style={{ borderTop: '2px solid #dee2e6', paddingTop: '1rem', marginTop: '1rem', fontSize: '1.2rem', fontWeight: 'bold' }}>
              <span>Total</span><span>${finalTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* ── Payment Methods ── */}
          <div className="payment-information">
            <h2>Payment information</h2>

            {/* Card option */}
            <div className={`payment-method ${formData.paymentMethod === 'card' ? 'selected' : ''}`}>
              <input
                type="radio"
                id="card"
                name="paymentMethod"
                value="card"
                checked={formData.paymentMethod === 'card'}
                onChange={handleFormChange}
              />
              <label htmlFor="card">💳 Credit / Debit Card</label>
            </div>

            {formData.paymentMethod === 'card' && (
              <div className="card-details-form">
                <div className="form-group">
                  <label>Card Details</label>
                  <div className="card-input-container">
                    <div className="card-input-row">
                      <CardNumberElement options={CARD_ELEMENT_OPTIONS} />
                    </div>
                    <div className="card-input-row-split">
                      <div className="card-input-half"><CardExpiryElement options={CARD_ELEMENT_OPTIONS} /></div>
                      <div className="card-input-half"><CardCvcElement options={CARD_ELEMENT_OPTIONS} /></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Lightning option */}
            <div className={`payment-method ${formData.paymentMethod === 'lightning' ? 'selected' : ''}`}
              style={{ marginTop: '0.75rem', border: formData.paymentMethod === 'lightning' ? '2px solid #f7931a' : undefined }}
            >
              <input
                type="radio"
                id="lightning"
                name="paymentMethod"
                value="lightning"
                checked={formData.paymentMethod === 'lightning'}
                onChange={handleFormChange}
              />
              <label htmlFor="lightning" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>⚡</span>
                <span>Bitcoin Lightning (Speed)</span>
                <span style={{
                  background: '#f7931a',
                  color: '#fff',
                  fontSize: '0.7rem',
                  padding: '2px 6px',
                  borderRadius: 4,
                  fontWeight: 600,
                  marginLeft: 4,
                }}>INSTANT</span>
              </label>
            </div>

            {formData.paymentMethod === 'lightning' && (
              <div style={{
                background: '#fffbf0',
                border: '1px solid #f7931a33',
                borderRadius: 8,
                padding: '0.75rem 1rem',
                marginTop: '0.5rem',
                fontSize: '0.875rem',
                color: '#6c757d',
              }}>
                <p style={{ margin: 0, display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <span>⚡</span>
                  <span>
                    A Lightning invoice will be shown after you click "Place Order".
                    Scan with any Lightning wallet (Wallet of Satoshi, Phoenix, Muun, etc.).
                    Payment confirms in seconds — no fees, no delays.
                  </span>
                </p>
              </div>
            )}

            {/* Error */}
            {paymentStatus?.status === 'error' && (
              <div style={{ background: '#f8d7da', color: '#721c24', padding: '1rem', borderRadius: '5px', margin: '1rem 0', border: '1px solid #f5c6cb' }}>
                ❌ {paymentStatus.message}
              </div>
            )}

            <p className="privacy-notice">
              <CiLock /> Your personal data will be used to process your order, support your experience throughout this website, and for other purposes described in our{' '}
              <a href="/privacy" target="_blank" rel="noopener noreferrer">privacy policy</a>.
            </p>

            {/* Submit button */}
            <button
              type="submit"
              className="place-order-btn"
              disabled={
                isProcessing ||
                (formData.paymentMethod === 'card' && (!stripe || !elements)) ||
                cartItems.length === 0
              }
              style={{
                opacity: (isProcessing || cartItems.length === 0) ? 0.6 : 1,
                cursor: (isProcessing || cartItems.length === 0) ? 'not-allowed' : 'pointer',
                background: isLightningSelected ? '#f7931a' : undefined,
              }}
            >
              {isProcessing
                ? isLightningSelected
                  ? '⚡ Creating Lightning Invoice...'
                  : '🔄 Processing Payment...'
                : cartItems.length === 0
                  ? 'Add items to cart'
                  : isLightningSelected
                    ? `⚡ Pay ${finalTotal.toFixed(2)} USD with Lightning`
                    : `💳 Place order $${finalTotal.toFixed(2)}`}
            </button>
          </div>
        </div>
      </form>

      {/* ── Modals ── */}
      {activeModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="Checkout-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={closeModal}>×</button>

            {activeModal === 'note' && (
              <form onSubmit={handleSaveNote}>
                <h2>📝 Add a Note</h2>
                <textarea
                  className="modal-textarea"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Add special instructions..."
                  rows="5"
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '5px', resize: 'vertical' }}
                />
                <button type="submit" className="modal-btn">Save Note</button>
              </form>
            )}

            {activeModal === 'shipping' && (
              <form onSubmit={handleCalculateShipping}>
                <h2>🚛 Calculate Shipping</h2>
                <select name="country" value={shippingInfo.country} onChange={handleShippingInfoChange} className="modal-input" style={{ marginBottom: '1rem' }}>
                  {allCountries.map((c) => <option key={c.isoCode} value={c.isoCode}>{c.name}</option>)}
                </select>
                {shippingModalStates.length > 0 ? (
                  <select name="state" value={shippingInfo.state} onChange={handleShippingInfoChange} className="modal-input" style={{ marginBottom: '1rem' }}>
                    <option value="">Select a state</option>
                    {shippingModalStates.map((s) => <option key={s.isoCode} value={s.isoCode}>{s.name}</option>)}
                  </select>
                ) : (
                  <input type="text" name="state" value={shippingInfo.state} onChange={handleShippingInfoChange} placeholder="State/Province" className="modal-input" style={{ marginBottom: '1rem' }} />
                )}
                <input type="text" name="city" value={shippingInfo.city} onChange={handleShippingInfoChange} placeholder="City" className="modal-input" style={{ marginBottom: '1rem' }} />
                <input type="text" name="zip" value={shippingInfo.zip} onChange={handleShippingInfoChange} placeholder="ZIP / Postal Code" className="modal-input" style={{ marginBottom: '1rem' }} />
                <button type="submit" className="modal-btn">Update Shipping</button>
              </form>
            )}

            {activeModal === 'coupon' && (
              <form onSubmit={handleApplyCoupon}>
                <h2>🎫 Enter Coupon Code</h2>
                <input
                  type="text"
                  className="modal-input"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="Enter your coupon code"
                  disabled={couponLoading}
                  style={{ marginBottom: '1rem', textTransform: 'uppercase' }}
                />
                {couponsAvailable && activeCoupons.length > 0 && (
                  <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '5px', marginBottom: '1rem', fontSize: '0.9rem' }}>
                    <p><strong>Available Coupons:</strong></p>
                    {activeCoupons.map((c) => (
                      <p key={c.code}>
                        • {c.code} — {c.discountType === 'percentage' ? `${c.discountValue}% off` : `$${c.discountValue} off`}
                        {c.description && ` (${c.description})`}
                      </p>
                    ))}
                  </div>
                )}
                <button type="submit" className="modal-btn" disabled={couponLoading}>
                  {couponLoading ? 'Validating...' : 'Apply Coupon'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Pulse animation for Lightning status dot */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.3); }
        }
      `}</style>
    </div>
  );
};

export default function CheckoutPage() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}