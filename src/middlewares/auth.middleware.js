import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

function getTokenFromHeader(req) {
  const header = req.headers.authorization || "";
  if (!header.startsWith("Bearer ")) return "";
  return header.slice(7);
}

export function authMiddleware(req, _res, next) {
  const token = getTokenFromHeader(req);
  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = {
      id: payload.sub,
      email: payload.email,
      role: payload.role || "user"
    };
  } catch (_error) {
    req.user = null;
  }

  return next();
}

export function requireAuth(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }
  return next();
}

export function requireAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin role required" });
  }
  return next();
}

export function requireOwnership(getOwnerId) {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    try {
      const ownerId = await getOwnerId(req);
      if (!ownerId) {
        return res.status(404).json({ message: "Resource not found" });
      }

      if (ownerId.toString() !== req.user.id) {
        return res.status(403).json({ message: "Access denied" });
      }

      return next();
    } catch (error) {
      return next(error);
    }
  };
}