export function notFoundMiddleware(_req, res, _next) {
  res.status(404).json({ message: "Route not found" });
}

export function errorMiddleware(error, _req, res, _next) {
  res.status(error.statusCode || 500).json({
    message: error.message || "Internal server error"
  });
}
