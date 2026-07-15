import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../env.js';
const SALT_ROUNDS = 10;
const TOKEN_TTL = '7d';
export function hashPassword(plain) {
    return bcrypt.hash(plain, SALT_ROUNDS);
}
export function verifyPassword(plain, hash) {
    return bcrypt.compare(plain, hash);
}
export function signToken(payload) {
    return jwt.sign(payload, env.JWT_SECRET, { expiresIn: TOKEN_TTL });
}
export function verifyToken(token) {
    return jwt.verify(token, env.JWT_SECRET);
}
//# sourceMappingURL=auth.js.map