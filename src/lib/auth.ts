export function expectedAdminToken() {
  // Keep it Edge-runtime compatible (middleware runs on Edge).
  // We store the raw password in an httpOnly cookie as the "token".
  return process.env.ADMIN_PASSWORD || "admin123";
}

export function isAdminToken(token: string | undefined | null) {
  if (!token) return false;
  return token === expectedAdminToken();
}
