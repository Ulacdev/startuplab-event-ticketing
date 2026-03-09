import supabase from '../database/db.js';
import { logAudit } from '../utils/auditLogger.js';

/**
 * List promotions for an event
 */
export const listPromotions = async (req, res) => {
    try {
        const { eventId } = req.params;
        if (!eventId) return res.status(400).json({ error: 'eventId required' });

        const { data, error } = await supabase
            .from('promotions')
            .select('*')
            .eq('eventId', eventId)
            .order('created_at', { ascending: false });

        if (error) return res.status(500).json({ error: error.message });
        return res.json(data || []);
    } catch (err) {
        return res.status(500).json({ error: err?.message || 'Unexpected error' });
    }
};

/**
 * Get promotion by code for an event
 */
export const validatePromotion = async (req, res) => {
    try {
        const { eventId, code } = req.body;
        if (!eventId || !code) return res.status(400).json({ error: 'eventId and code required' });

        const normalizedCode = String(code).trim().toUpperCase();

        const { data: promo, error } = await supabase
            .from('promotions')
            .select('*')
            .eq('eventId', eventId)
            .eq('code', normalizedCode)
            .eq('isActive', true)
            .maybeSingle();

        if (error) return res.status(500).json({ error: error.message });
        if (!promo) return res.status(404).json({ error: 'Invalid promotion code' });

        // Check usage limit
        if (promo.maxUses && promo.currentUses >= promo.maxUses) {
            return res.status(400).json({ error: 'Promotion code has reached its usage limit' });
        }

        // Check dates
        const now = new Date();
        if (promo.validFrom && new Date(promo.validFrom) > now) {
            return res.status(400).json({ error: 'Promotion code is not yet active' });
        }
        if (promo.validUntil && new Date(promo.validUntil) < now) {
            return res.status(400).json({ error: 'Promotion code has expired' });
        }

        return res.json(promo);
    } catch (err) {
        return res.status(500).json({ error: err?.message || 'Unexpected error' });
    }
};

/**
 * Upsert (Create or Update) promotion
 */
export const upsertPromotion = async (req, res) => {
    try {
        const { promotionId, eventId, code, discountType, discountValue, maxUses, validFrom, validUntil, isActive } = req.body;

        if (!eventId || !code) return res.status(400).json({ error: 'eventId and code required' });

        const payload = {
            eventId,
            code: String(code).trim().toUpperCase(),
            discountType: discountType || 'PERCENTAGE',
            discountValue: Number(discountValue) || 0,
            maxUses: maxUses !== undefined ? (maxUses === null ? null : Number(maxUses)) : undefined,
            validFrom: validFrom || null,
            validUntil: validUntil || null,
            isActive: isActive !== undefined ? !!isActive : true,
            updated_at: new Date().toISOString()
        };

        let result;
        if (promotionId) {
            result = await supabase
                .from('promotions')
                .update(payload)
                .eq('promotionId', promotionId)
                .select('*')
                .single();
        } else {
            result = await supabase
                .from('promotions')
                .insert(payload)
                .select('*')
                .single();
        }

        if (result.error) return res.status(500).json({ error: result.error.message });

        await logAudit({
            actionType: promotionId ? 'PROMOTION_UPDATED' : 'PROMOTION_CREATED',
            details: { promotionId: result.data.promotionId, eventId, code: payload.code },
            req
        });

        return res.json(result.data);
    } catch (err) {
        return res.status(500).json({ error: err?.message || 'Unexpected error' });
    }
};

/**
 * Delete promotion
 */
export const deletePromotion = async (req, res) => {
    try {
        const { promotionId } = req.params;
        if (!promotionId) return res.status(400).json({ error: 'promotionId required' });

        const { error } = await supabase
            .from('promotions')
            .delete()
            .eq('promotionId', promotionId);

        if (error) return res.status(500).json({ error: error.message });

        await logAudit({
            actionType: 'PROMOTION_DELETED',
            details: { promotionId },
            req
        });

        return res.json({ message: 'Promotion deleted' });
    } catch (err) {
        return res.status(500).json({ error: err?.message || 'Unexpected error' });
    }
};
