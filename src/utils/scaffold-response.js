export function scaffoldResponse(res, moduleName, action) {
  return res.status(501).json({
    message: "Scaffolding endpoint",
    module: moduleName,
    action,
    status: "not_implemented"
  });
}
