import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Crown, Check, Cloud, Brain, Map, 
  Bell, Shield, Zap, Sparkles, History, Droplets, Activity,
  ArrowLeft
} from 'lucide-react';
import api from '../../api/client';
import toast from 'react-hot-toast';

export default function Premium() {
  const { user } = useAuth();
  const [billingCycle, setBillingCycle] = useState('monthly');

  const handlePayment = async (plan) => {
    if (plan.name === 'Free') return;

    try {
      const loadScript = () => new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      });

      const res = await loadScript();
      if (!res) {
        toast.error('Razorpay SDK failed to load. Are you online?');
        return;
      }

      const { data } = await api.post('/api/payments/razorpay/order');
      if (!data.success) {
        toast.error(data.error || 'Failed to create order');
        return;
      }

      const order = data.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'dummy_key',
        amount: order.amount,
        currency: order.currency,
        name: 'Aurora Weather',
        description: 'Premium Upgrade',
        order_id: order.id,
        handler: async function (response) {
          try {
            const verifyRes = await api.post('/api/payments/razorpay/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyRes.data.success) {
              toast.success('Payment successful! You are now premium.');
              setTimeout(() => {
                window.location.reload();
              }, 1500);
            } else {
              toast.error(verifyRes.data.error || 'Payment verification failed');
            }
          } catch (err) {
            console.error(err);
            toast.error('Payment verification failed');
          }
        },
        prefill: {
          name: user?.firstName || 'User',
          email: user?.email || '',
        },
        theme: {
          color: '#3B82F6',
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Something went wrong during payment initialization.');
    }
  };

  const features = [
    {
      icon: <Cloud className="w-5 h-5 text-blue-500" />,
      title: 'Unlimited Locations',
      description: 'Save and track unlimited locations',
    },
    {
      icon: <Brain className="w-5 h-5 text-purple-500" />,
      title: 'Advanced AI Insights',
      description: 'Get deeper AI-powered recommendations',
    },
    {
      icon: <Map className="w-5 h-5 text-green-500" />,
      title: 'Advanced Radar',
      description: 'High-resolution weather radar',
    },
    {
      icon: <Bell className="w-5 h-5 text-yellow-500" />,
      title: 'Priority Alerts',
      description: 'Get alerted before severe weather',
    },
    {
      icon: <Shield className="w-5 h-5 text-red-500" />,
      title: 'Offline Forecasts',
      description: 'Access weather data offline',
    },
    {
      icon: <Zap className="w-5 h-5 text-orange-500" />,
      title: 'Ad-Free Experience',
      description: 'Enjoy Aurora without interruptions',
    },
    {
      icon: <Droplets className="w-5 h-5 text-blue-400" />,
      title: 'Minute-by-Minute Rain',
      description: 'Hyperlocal precipitation forecasting',
    },
    {
      icon: <Activity className="w-5 h-5 text-rose-500" />,
      title: 'Health & Air Quality',
      description: 'Detailed AQI, pollen, and UV index',
    },
    {
      icon: <History className="w-5 h-5 text-indigo-500" />,
      title: 'Historical Data',
      description: 'Access past weather records & trends',
    },
  ];

  const plans = [
    {
      name: 'Free',
      price: '0',
      period: 'forever',
      features: [
        'Current weather',
        '7-day forecast',
        'Basic AI insights',
        '3 saved locations',
      ],
      buttonText: 'Current Plan',
      recommended: false,
    },
    {
      name: 'Premium',
      price: billingCycle === 'monthly' ? '9.99' : '99.99',
      period: billingCycle === 'monthly' ? '/month' : '/year',
      features: [
        'Everything in Free',
        'Unlimited locations',
        'Advanced AI insights',
        '30-day forecast',
        'Advanced radar',
        'Offline forecasts',
        'Priority alerts',
        'Ad-free experience',
        'Minute-by-minute rain',
        'Health & AQI indices',
        'Historical weather data',
      ],
      buttonText: 'Upgrade Now',
      recommended: true,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <Link 
          to="/dashboard" 
          className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </div>
      
      <div className="text-center mb-12">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-yellow-400 to-yellow-500 flex items-center justify-center">
            <Crown className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
          Upgrade to Premium
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-2xl mx-auto">
          Unlock the full potential of Aurora Weather with premium features
        </p>
      </div>

      {/* Billing Toggle */}
      <div className="flex justify-center mb-8">
        <div className="glass-card p-1 flex gap-1">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-6 py-2 rounded-xl transition-colors ${
              billingCycle === 'monthly'
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`px-6 py-2 rounded-xl transition-colors ${
              billingCycle === 'yearly'
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Yearly <span className="text-xs text-green-500">Save 20%</span>
          </button>
        </div>
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {plans.map((plan, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`glass-card p-8 relative ${
              plan.recommended ? 'border-2 border-yellow-400' : ''
            }`}
          >
            {plan.recommended && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-sm font-medium rounded-full">
                Recommended
              </div>
            )}
            
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold">{plan.name}</h3>
              <div className="mt-2">
                <span className="text-4xl font-bold">${plan.price}</span>
                <span className="text-gray-500">{plan.period}</span>
              </div>
            </div>

            <div className="space-y-3">
              {plan.features.map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>

            <button
              className={`w-full mt-6 py-3 rounded-xl font-medium transition-all ${
                plan.recommended
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:opacity-90'
                  : 'border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800'
              } ${plan.name === 'Free' ? 'opacity-75 cursor-not-allowed' : ''}`}
              disabled={plan.name === 'Free'}
              onClick={() => handlePayment(plan)}
            >
              {plan.buttonText}
            </button>
          </motion.div>
        ))}
      </div>

      {/* Features Grid */}
      <div>
        <h2 className="text-2xl font-bold text-center mb-8">
          Everything you get with Premium
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-6 text-center"
            >
              <div className="flex justify-center mb-3">{feature.icon}</div>
              <h3 className="font-semibold mb-1">{feature.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}