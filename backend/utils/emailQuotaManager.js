/**
 * Email Quota Manager
 * Handles daily email quota tracking and enforcement for organizers
 */

import supabase from '../database/db.js';

/**
 * Get today's date in organizer's timezone
 * @param {string} timezone - IANA timezone string (e.g. 'America/New_York'), defaults to Asia/Manila (PH)
 * @returns {string} - Date in YYYY-MM-DD format
 */
function getTodayInTimezone(timezone = 'Asia/Manila') {
  try {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-CA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      timeZone: timezone,
    });
    return formatter.format(now);
  } catch (e) {
    // Invalid timezone, fallback to Asia/Manila (PH)
    try {
      const formatter = new Intl.DateTimeFormat('en-CA', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        timeZone: 'Asia/Manila',
      });
      return formatter.format(new Date());
    } catch (e2) {
      // Final fallback to UTC
      return new Date().toISOString().split('T')[0];
    }
  }
}

export const emailQuotaManager = {
  /**
   * Get remaining daily email quota for an organizer
   * @param {string} organizerId - Organization ID
   * @returns {Promise<{remaining: number, limit: number, sent: number, canSend: boolean}>}
   */
  async getQuotaStatus(organizerId) {
    try {
      // Get organizer's current plan and email quota
      const { data: organizer, error: orgError } = await supabase
        .from('organizers')
        .select(`
          organizerId,
          emailsSentToday,
          dailyEmailQuota,
          lastEmailResetDate,
          timezone,
          currentPlanId,
          plan:plans!currentPlanId(limits)
        `)
        .eq('organizerId', organizerId)
        .single();

      if (orgError) throw new Error(`Failed to fetch organizer: ${orgError.message}`);
      if (!organizer) throw new Error('Organizer not found');

      // If no active plan, return 0 quota
      if (!organizer.currentPlanId) {
        return {
          remaining: 0,
          limit: 0,
          sent: 0,
          canSend: false,
          quotaStatus: '0/0',
          noPlan: true,
        };
      }

      // Get quota from plan limits
      const planLimits = organizer.plan?.limits || {};
      const dailyLimit = parseInt(planLimits.email_quota_per_day) || 500;

      // Get today's date in organizer's timezone
      const today = getTodayInTimezone(organizer.timezone || 'Asia/Manila');

      // Reset counter if day changed (in organizer's timezone)
      let emailsSent = organizer.emailsSentToday || 0;
      
      if (organizer.lastEmailResetDate && organizer.lastEmailResetDate !== today) {
        // Day has changed, reset counter
        const { error: updateError } = await supabase
          .from('organizers')
          .update({
            emailsSentToday: 0,
            lastEmailResetDate: today,
            dailyEmailQuota: dailyLimit,
          })
          .eq('organizerId', organizerId);

        if (updateError) {
          console.error('Failed to reset email quota:', updateError);
        }
        emailsSent = 0;
      }

      const remaining = Math.max(0, dailyLimit - emailsSent);
      
      return {
        remaining,
        limit: dailyLimit,
        sent: emailsSent,
        canSend: remaining > 0,
        quotaStatus: `${emailsSent}/${dailyLimit}`,
      };
    } catch (error) {
      console.error('Error getting quota status:', error);
      throw error;
    }
  },

  /**
   * Check if organizer can send emails
   * @param {string} organizerId - Organization ID
   * @param {number} count - Number of emails to send (default 1)
   * @returns {Promise<{canSend: boolean, message: string, quotaStatus: string}>}
   */
  async canSendEmails(organizerId, count = 1) {
    try {
      const status = await this.getQuotaStatus(organizerId);
      
      if (status.remaining < count) {
        return {
          canSend: false,
          message: `Daily email limit reached (${status.sent}/${status.limit}). Upgrade your plan for more emails.`,
          quotaStatus: status.quotaStatus,
          needsUpgrade: true,
        };
      }

      return {
        canSend: true,
        message: `Quota available: ${status.remaining} emails remaining`,
        quotaStatus: status.quotaStatus,
        needsUpgrade: false,
      };
    } catch (error) {
      console.error('Error checking email quota:', error);
      throw error;
    }
  },

  /**
   * Record email(s) sent for quota tracking
   * @param {string} organizerId - Organization ID
   * @param {number} count - Number of emails sent (default 1)
   * @param {boolean} isCustom - Whether a custom SMTP was used (skips quota reduction)
   * @returns {Promise<void>}
   */
  async recordEmailSent(organizerId, count = 1, isCustom = false) {
    try {
      if (isCustom) {
        console.log(`[Quota] Sent via Custom SMTP. Skipping quota reduction for org ${organizerId}`);
        return;
      }
      // Get organizer to get their timezone
      const { data: organizer, error: fetchError } = await supabase
        .from('organizers')
        .select('emailsSentToday, lastEmailResetDate, timezone, currentPlanId, plan:plans!currentPlanId(limits)')
        .eq('organizerId', organizerId)
        .single();

      if (fetchError) throw fetchError;

      const today = getTodayInTimezone(organizer.timezone || 'Asia/Manila');
      const planLimits = organizer.plan?.limits || {};
      const dailyLimit = parseInt(planLimits.email_quota_per_day) || 500;

      let emailsSent = organizer.emailsSentToday || 0;
      
      // Reset if needed
      if (organizer.lastEmailResetDate && organizer.lastEmailResetDate !== today) {
        emailsSent = 0;
      }

      const newCount = emailsSent + count;

      // Update organizer record
      const { error: updateError } = await supabase
        .from('organizers')
        .update({
          emailsSentToday: newCount,
          lastEmailResetDate: today,
          updated_at: new Date().toISOString(),
        })
        .eq('organizerId', organizerId);

      if (updateError) throw updateError;

      // Record in tracking table
      const { error: trackingError } = await supabase
        .from('email_quota_tracking')
        .upsert({
          organizerId,
          trackingDate: today,
          emailsSent: newCount,
          emailLimit: dailyLimit,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'organizerId,trackingDate' });

      if (trackingError) {
        console.error('Warning: Failed to record in tracking table:', trackingError);
      }
    } catch (error) {
      console.error('Error recording email sent:', error);
      throw error;
    }
  },

  /**
   * Get email quota audit/history for an organizer
   * @param {string} organizerId - Organization ID
   * @param {number} days - Number of past days to retrieve (default 30)
   * @returns {Promise<array>}
   */
  async getQuotaHistory(organizerId, days = 30) {
    try {
      // Get organizer's timezone
      const { data: organizer, error: orgError } = await supabase
        .from('organizers')
        .select('timezone')
        .eq('organizerId', organizerId)
        .single();

      if (orgError) throw orgError;

      const today = getTodayInTimezone(organizer?.timezone || 'UTC');
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      const startDateStr = startDate.toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('email_quota_tracking')
        .select('*')
        .eq('organizerId', organizerId)
        .gte('trackingDate', startDateStr)
        .order('trackingDate', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching quota history:', error);
      throw error;
    }
  },

  /**
   * Update organizer's daily quota based on their current plan
   * (Call this when subscription plan changes)
   * @param {string} organizerId - Organization ID
   * @returns {Promise<void>}
   */
  async syncQuotaWithPlan(organizerId) {
    try {
      const { data: organizer, error } = await supabase
        .from('organizers')
        .select('currentPlanId, plan:plans!currentPlanId(limits)')
        .eq('organizerId', organizerId)
        .single();

      if (error) throw error;

      const planLimits = organizer.plan?.limits || {};
      const dailyQuota = parseInt(planLimits.email_quota_per_day) || 500;

      await supabase
        .from('organizers')
        .update({
          dailyEmailQuota: dailyQuota,
          updated_at: new Date().toISOString(),
        })
        .eq('organizerId', organizerId);
    } catch (error) {
      console.error('Error syncing quota with plan:', error);
      throw error;
    }
  },
};

export default emailQuotaManager;
