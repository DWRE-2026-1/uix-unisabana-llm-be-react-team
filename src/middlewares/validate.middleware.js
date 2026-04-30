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
      return next(new Error(message || "Validation error"));
    }
    return next();
  };
}
