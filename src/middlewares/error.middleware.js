export function notFoundMiddleware(_req, res, _next) {
  res.status(404).json({ message: "Route not found" });
}

export function errorMiddleware(error, _req, res, _next) {
  const statusCode = error.statusCode || 500;
  const payload = {
    message: error.message || "Internal server error"
  };

  if (error.code) {
    payload.code = error.code;
  }
  if (error.details) {
    payload.details = error.details;
  }

  res.status(statusCode).json(payload);
}
