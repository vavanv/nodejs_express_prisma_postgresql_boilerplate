import rateLimit from 'express-rate-limit';

const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'); // 15 min default
const max = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'); // 100 reqs default

// General rate limiter
const limiter = rateLimit({
  windowMs,
  max,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false,  // Disable the `X-RateLimit-*` headers
});

// Example: Stricter rate limiter for login endpoint
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 login requests per windowMs
  message: 'Too many login attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

export default limiter;
