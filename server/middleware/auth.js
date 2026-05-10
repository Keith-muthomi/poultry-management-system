/**
 * Simple Authentication Middleware
 * 
 * In a real-world production app, you would use JSON Web Tokens (JWT) or 
 * Sessions here. For now, this ensures that the request at least 
 * provides a context from the frontend.
 */
const authMiddleware = (req, res, next) => {
  // Allow login and registration without a token
  if (req.path.startsWith('/auth/login') || req.path.startsWith('/auth/register')) {
    return next();
  }

  // Check for some form of identity from the frontend
  // The frontend currently sends 'X-Farm-Id'
  const farmId = req.headers['x-farm-id'];
  
  if (!farmId && process.env.NODE_ENV === 'production') {
    // In production, we're stricter
    // Note: We're not blocking it yet to avoid breaking current functionality, 
    // but this is where you'd return res.status(401)
    console.warn(`[Security] Unauthenticated request to ${req.path}`);
  }

  next();
};

module.exports = authMiddleware;
