const { prisma } = require('../config/db');
const { generateToken, verifyToken } = require('../utils/jwt');
const { hashPassword, comparePassword } = require('../utils/password');

/**
 * Register user
 * @route POST /api/auth/register
 */
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ message: 'Email already in use' });

    const hashed = await hashPassword(password);
    const user = await prisma.user.create({
      data: { name: name || null, email, password: hashed },
      select: { id: true, name: true, email: true }
    });

    const token = generateToken(user.id);
    res.status(201).json({ user, token });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Login user
 * @route POST /api/auth/login
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const ok = await comparePassword(password, user.password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const token = generateToken(user.id);
    res.json({ user: { id: user.id, name: user.name, email: user.email }, token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Set httpOnly cookie with JWT token
 * @route POST /api/auth/set-cookie
 * @access Public (but requires valid token in body)
 */
const setCookie = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: 'Token is required' });
    }

    // Verify the token is valid before setting cookie
    try {
      const decoded = verifyToken(token);
      
      // Optional: Verify user still exists and is active
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: { id: true, isActive: true }
      });

      if (!user || !user.isActive) {
        return res.status(401).json({ message: 'Invalid or inactive user' });
      }

    } catch (error) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    // Set httpOnly cookie
    const cookieOptions = {
      httpOnly: true, // Cannot be accessed via JavaScript
      secure: process.env.NODE_ENV === 'production', // HTTPS only in production
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax', // Lax for development, strict for production
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
      path: '/', // Available for all routes
      // Don't set domain in development to allow localhost and 127.0.0.1
    };

    res.cookie('token', token, cookieOptions);

    // Enhanced logging for debugging
    console.log('🍪 Setting httpOnly cookie with options:', {
      ...cookieOptions,
      origin: req.headers.origin,
      userAgent: req.headers['user-agent']?.substring(0, 50) + '...',
      environment: process.env.NODE_ENV
    });

    res.json({
      success: true,
      message: 'Cookie set successfully',
      expiresIn: '7 days',
      cookieOptions: {
        httpOnly: cookieOptions.httpOnly,
        secure: cookieOptions.secure,
        sameSite: cookieOptions.sameSite,
        path: cookieOptions.path
      }
    });

  } catch (error) {
    console.error('Set cookie error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Validate httpOnly cookie token
 * @route GET /api/auth/validate
 * @access Private (requires httpOnly cookie)
 */
const validateToken = async (req, res) => {
  try {
    // Token is extracted by authMiddleware and user is attached to req
    // If we reach here, the token is valid
    
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        profilePicture: true,
        isActive: true,
        lastLoginAt: true,
        location: {
          select: {
            latitude: true,
            longitude: true,
            updatedAt: true,
          }
        }
      },
    });

    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'User not found or inactive' });
    }

    res.json({
      valid: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        profilePicture: user.profilePicture,
        location: user.location,
        lastLoginAt: user.lastLoginAt,
      }
    });

  } catch (error) {
    console.error('Token validation error:', error);
    res.status(401).json({ message: 'Token validation failed' });
  }
};

/**
 * Logout user and clear httpOnly cookie
 * @route POST /api/auth/logout
 * @access Private (requires httpOnly cookie)
 */
const logout = async (req, res) => {
  try {
    // Clear the httpOnly cookie
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      path: '/',
      // Don't set domain in development to allow localhost and 127.0.0.1
    });

    // Optional: Update user's last logout time
    if (req.user && req.user.id) {
      await prisma.user.update({
        where: { id: req.user.id },
        data: { 
          lastLoginAt: null, // or you could add a lastLogoutAt field
          deviceToken: null, // Clear device token for push notifications
        },
      });
    }

    res.json({ 
      success: true, 
      message: 'Logged out successfully' 
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Server error during logout' });
  }
};

/**
 * Refresh token (optional - for extending session)
 * @route POST /api/auth/refresh
 * @access Private (requires httpOnly cookie)
 */
const refreshToken = async (req, res) => {
  try {
    // Generate new token with extended expiry
    const newToken = generateToken(req.user.id);

    // Set new httpOnly cookie
    res.cookie('token', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/',
      // Don't set domain in development to allow localhost and 127.0.0.1
    });

    // Update last login time
    await prisma.user.update({
      where: { id: req.user.id },
      data: { lastLoginAt: new Date() },
    });

    res.json({ 
      success: true, 
      message: 'Token refreshed successfully',
      expiresIn: '7 days'
    });

  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({ message: 'Server error during token refresh' });
  }
};

/**
 * Get current user info (using httpOnly cookie)
 * @route GET /api/auth/me
 * @access Private (requires httpOnly cookie)
 */
const getCurrentUser = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        profilePicture: true,
        isActive: true,
        createdAt: true,
        lastLoginAt: true,
        location: {
          select: {
            latitude: true,
            longitude: true,
            accuracy: true,
            updatedAt: true,
          }
        },
        favoriteRoutes: {
          include: {
            route: {
              select: {
                id: true,
                routeName: true,
                routeNumber: true,
                startPoint: true,
                endPoint: true,
                color: true,
              }
            }
          }
        },
        notificationPreference: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);

  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  register,
  login,
  setCookie,
  validateToken,
  logout,
  refreshToken,
  getCurrentUser,
};
