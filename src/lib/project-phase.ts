// The catalogue is public; authentication gates private business management.
// Cloud writes remain separately controlled until the workspace stage is enabled.
export const AUTH_ENABLED = process.env.ESAN_AUTH_ENABLED === 'true';
export const CLOUD_ENABLED = AUTH_ENABLED && process.env.ESAN_CLOUD_ENABLED === 'true';
