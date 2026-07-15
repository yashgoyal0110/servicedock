import { ZodError } from 'zod';
/**
 * Central error handler. Zod validation errors become 400s; everything else
 * is a 500 with the message logged server-side (Rule 12: fail loud).
 */
export function errorHandler(err, _req, res, 
// Express requires the 4-arg signature to treat this as an error handler.
_next) {
    if (err instanceof ZodError) {
        res.status(400).json({ error: 'Validation failed', details: err.flatten() });
        return;
    }
    console.error('Unhandled error:', err);
    const message = err instanceof Error ? err.message : 'Internal server error';
    res.status(500).json({ error: message });
}
//# sourceMappingURL=error.js.map