import crypto from 'node:crypto';
import { MercadoPagoConfig } from 'mercadopago';
/**
 * MercadoPago client + webhook helpers, ported from the Next.js app's
 * src/lib/mercadopago.ts. Env is read directly from process.env (guarded)
 * because the shared env.ts is reserved and does not (yet) validate MP vars.
 */
export const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;
export const MP_WEBHOOK_SECRET = process.env.MP_WEBHOOK_SECRET;
/**
 * Base URL used for MercadoPago back/redirect URLs. Prefers APP_URL, falls
 * back to NEXT_PUBLIC_APP_URL (carried over from the Next.js app), then to a
 * localhost default for dev.
 */
export const APP_URL = process.env.APP_URL ??
    process.env.NEXT_PUBLIC_APP_URL ??
    'http://localhost:5173';
export const mercadopago = new MercadoPagoConfig({
    accessToken: MP_ACCESS_TOKEN ?? '',
});
export const mapMercadoPagoStatus = (status) => {
    switch (status) {
        case 'authorized':
            return 'ACTIVE';
        case 'cancelled':
            return 'CANCELLED';
        case 'paused':
            return 'INACTIVE';
        case 'expired':
        case 'finished':
            return 'EXPIRED';
        default:
            return 'PENDING';
    }
};
const firstHeader = (value) => {
    if (Array.isArray(value)) {
        return value[0] ?? null;
    }
    return value ?? null;
};
const firstQuery = (value) => {
    if (Array.isArray(value)) {
        return typeof value[0] === 'string' ? value[0] : null;
    }
    return typeof value === 'string' ? value : null;
};
/**
 * Verify a MercadoPago webhook signature.
 *
 * MP signs each request with HMAC-SHA256 over the manifest
 *   `id:<dataId>;request-id:<x-request-id>;ts:<ts>;`
 * where `dataId` is taken from the URL query (`?data.id=...`),
 * the request id from the `x-request-id` header, and ts from
 * `x-signature: ts=...,v1=...`.
 *
 * The manifest is built entirely from headers + the query string, so the
 * raw request body is NOT required — plain express.json() parsing is fine.
 *
 * If `secret` is not configured we return valid=true with a reason and log a
 * warning, so local dev (no tunnel/secret) still works — exactly like the
 * original Next.js implementation.
 */
export function verifyMercadoPagoSignature(req, secret) {
    if (!secret) {
        console.warn('[MP_WEBHOOK] MP_WEBHOOK_SECRET not configured — skipping verification');
        return { valid: true, reason: 'no-secret-configured' };
    }
    const sigHeader = firstHeader(req.headers['x-signature']);
    const requestId = firstHeader(req.headers['x-request-id']);
    if (!(sigHeader && requestId)) {
        return { valid: false, reason: 'missing-headers' };
    }
    const parts = Object.fromEntries(sigHeader.split(',').map((kv) => {
        const [k, v] = kv.split('=').map((s) => s.trim());
        return [k ?? '', v ?? ''];
    }));
    const ts = parts.ts;
    const v1 = parts.v1;
    if (!(ts && v1)) {
        return { valid: false, reason: 'malformed-signature' };
    }
    const dataId = firstQuery(req.query['data.id']) ?? firstQuery(req.query.id) ?? '';
    if (!dataId) {
        return { valid: false, reason: 'missing-data-id' };
    }
    const manifest = `id:${dataId};request-id:${requestId};ts:${ts};`;
    const computed = crypto
        .createHmac('sha256', secret)
        .update(manifest)
        .digest('hex');
    let valid = false;
    try {
        valid = crypto.timingSafeEqual(Buffer.from(computed, 'hex'), Buffer.from(v1, 'hex'));
    }
    catch {
        valid = false;
    }
    return valid ? { valid: true } : { valid: false, reason: 'signature-mismatch' };
}
/**
 * Fetch an authorized payment by id via the MP REST API. The v2 SDK doesn't
 * ship a client for `/authorized_payments/{id}` so we hit it directly. Used
 * inside the webhook handler for `subscription_authorized_payment` events.
 */
export async function fetchAuthorizedPayment(id) {
    if (!MP_ACCESS_TOKEN) {
        throw new Error('MP_ACCESS_TOKEN missing');
    }
    const res = await fetch(`https://api.mercadopago.com/authorized_payments/${id}`, {
        headers: { Authorization: `Bearer ${MP_ACCESS_TOKEN}` },
    });
    if (!res.ok) {
        const detail = await res.text().catch(() => '');
        throw new Error(`fetchAuthorizedPayment ${res.status}: ${detail}`);
    }
    return res.json();
}
//# sourceMappingURL=mercadopago.js.map