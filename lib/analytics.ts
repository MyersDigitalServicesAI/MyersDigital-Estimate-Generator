// lib/analytics.ts
'use client';

import posthog from 'posthog-js';

let initialized = false;

export function initAnalytics() {
  if (typeof window === 'undefined' || initialized) return;

  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com';

  if (!key) {
    console.warn('PostHog key not found - analytics disabled');
    return;
  }

  try {
    posthog.init(key, {
      api_host: host,
      capture_pageview: true,
      capture_pageleave: true,
      autocapture: false, // Manual tracking for better control
    });

    initialized = true;
    console.log('✅ Analytics initialized');
  } catch (error) {
    console.error('Failed to initialize analytics:', error);
  }
}

export function track(
  event: string,
  properties?: Record<string, unknown>
) {
  if (!initialized) {
    console.warn('Analytics not initialized');
    return;
  }

  try {
    posthog.capture(event, properties);
  } catch (error) {
    console.error('Failed to track event:', error);
  }
}

export function identifyUser(userId: string, traits?: Record<string, unknown>) {
  if (!initialized) return;

  try {
    posthog.identify(userId, traits);
  } catch (error) {
    console.error('Failed to identify user:', error);
  }
}

// Predefined events for type safety
export const EVENTS = {
  // Estimate events
  ESTIMATE_STARTED: 'estimate_started',
  ESTIMATE_GENERATED: 'estimate_generated',
  ESTIMATE_SAVED: 'estimate_saved',
  ESTIMATE_DOWNLOADED: 'estimate_downloaded',
  ESTIMATE_EMAILED: 'estimate_emailed',
  
  // User events
  USER_SIGNED_UP: 'user_signed_up',
  USER_SIGNED_IN: 'user_signed_in',
  USER_SIGNED_OUT: 'user_signed_out',
  
  // Pricing events
  PRICING_FETCHED: 'pricing_fetched',
  PRICING_FAILED: 'pricing_failed',
} as const;
