export function apiResponse(res, { status = 200, message = "OK", data = null }) {
  return res.status(status).json({ message, data });
}
