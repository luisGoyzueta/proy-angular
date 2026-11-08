export function getAllowedOrigin(): string {
  const origin = process.env.FRONTEND_URL;

  if (!origin && process.env.NODE_ENV === 'production') {
    throw new Error('FRONTEND_URL es obligatorio en producción');
  }

  return origin ?? 'http://localhost:4200';
}
