/**
 * Check if the app is running in demo mode.
 * Works on both server and client (NEXT_PUBLIC_ prefix).
 */
export function isDemoMode(): boolean {
  return process.env.NEXT_PUBLIC_DEMO_MODE === "true";
}
