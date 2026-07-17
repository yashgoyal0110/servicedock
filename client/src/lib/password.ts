export const PASSWORD_RULES = [
  { label: 'At least 10 characters', test: (value: string) => value.length >= 10 },
  { label: 'One uppercase letter', test: (value: string) => /[A-Z]/.test(value) },
  { label: 'One lowercase letter', test: (value: string) => /[a-z]/.test(value) },
  { label: 'One number', test: (value: string) => /\d/.test(value) },
  { label: 'One symbol', test: (value: string) => /[^A-Za-z0-9]/.test(value) },
] as const

export const isStrongPassword = (value: string) =>
  PASSWORD_RULES.every((rule) => rule.test(value))
