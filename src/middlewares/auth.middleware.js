import jwt from "jsonwebtoken";

function getTokenFromHeader(req) {
  const header = req.headers.authorization || "";
  if (!header.startsWith("Bearer ")) return "";
  return header.slice(7);
}

export function authMiddleware(req, _res, next) {
  // Scaffolding auth parser: lightweight JWT extraction for route guards.
  const token = getTokenFromHeader(req);
  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || "dev-secret");
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
