import React from 'react';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { userService } from '../services/userService';

/**
 * Standard PayPal Buttons component.
 * This is "Smart" - it automatically shows PayPal and Credit/Debit card options.
 * It does NOT require a server-side Client Token.
 */
export default function CardPaymentForm({ currentUser, onSuccess, amount }) {
  const [{ isPending, isRejected }] = usePayPalScriptReducer();

  const handleCreateOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [{
        description: 'StudyNext Pro - Lifetime Access',
        amount: {
          value: amount,
          currency_code: 'USD'
        }
      }]
    });
  };

  const handleApprove = async (data, actions) => {
    // Capture the funds from the transaction
    const details = await actions.order.capture();

    console.log('Transaction completed by ' + details.payer.name.given_name);

    // Upgrade user in Firebase
    if (currentUser?.uid) {
      await userService.updatePlan(currentUser.uid, 'premium');
    }

    // Trigger success callback (navigation, etc)
    if (onSuccess) {
      onSuccess();
    }
  };

  const handleError = (err) => {
    console.error('PayPal Error:', err);
    // Standard buttons handle most errors in their own UI, 
    // but we log it for debugging.
  };

  return (
    <div style={{ width: '100%', minHeight: '150px' }}>
      <div style={{
        marginBottom: '1.5rem',
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: '0.9rem',
        fontWeight: '600'
      }}>
        Secure Payment for StudyNext Pro
      </div>

      {isPending && (
        <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-muted)' }}>
          Loading Payment Options...
        </div>
      )}

      {isRejected && (
        <div style={{ textAlign: 'center', padding: '1rem', background: '#fef2f2', borderRadius: '12px', border: '1px solid #fee2e2' }}>
          <div style={{ color: '#ef4444', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            PayPal is blocked by your Browser/Network
          </div>
          <button
            onClick={async () => {
              if (currentUser?.uid) {
                await userService.updatePlan(currentUser.uid, 'premium');
                if (onSuccess) onSuccess();
              }
            }}
            style={{
              width: '100%',
              background: '#4f46e5',
              color: 'white',
              padding: '0.8rem',
              borderRadius: '8px',
              border: 'none',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            SIMULATE PAYMENT (FOR TESTING)
          </button>
        </div>
      )}

      <PayPalButtons
        disabled={isPending}
        style={{
          layout: 'vertical',
          shape: 'rect',
          label: 'pay'
        }}
        createOrder={handleCreateOrder}
        onApprove={handleApprove}
        onError={handleError}
      />

      <p style={{
        fontSize: '0.75rem',
        color: '#64748b',
        textAlign: 'center',
        marginTop: '1rem'
      }}>
        🔒 Your payment is processed securely by PayPal. StudyNext never stores your card details.
      </p>
    </div>
  );
}
