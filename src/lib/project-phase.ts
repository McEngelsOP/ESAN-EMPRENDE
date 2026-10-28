// Fase actual acordada: interfaz interna con datos ficticios y sin login.
// Reactivar al terminar la interfaz, antes de habilitar datos privados.
export const AUTH_ENABLED = process.env.ESAN_AUTH_ENABLED === 'true';
export const CLOUD_ENABLED = AUTH_ENABLED && process.env.ESAN_CLOUD_ENABLED === 'true';
