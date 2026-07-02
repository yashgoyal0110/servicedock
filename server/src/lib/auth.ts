import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import { env } from '../env.js'

const SALT_ROUNDS = 10
const TOKEN_TTL = '7d'

export type JwtPayload = {
  /** Internal User.id */
  sub: string
  /** External User.userId used as the FK across the schema */
  userId: string
}

export function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, SALT_ROUNDS)
}

export function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash)
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: TOKEN_TTL })
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, env.JWT_SECRET) as JwtPayload
}
