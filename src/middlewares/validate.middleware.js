export function validate(schema) {
  return (req, _res, next) => {
    if (!schema) return next();
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query
    });
    if (!result.success) {
      const message = result.error.issues.map((issue) => issue.message).join(", ");
      const error = new Error(message || "Validation error");
      error.statusCode = 400;
      error.code = "validation_error";
      return next(error);
    }
    return next();
  };
}
