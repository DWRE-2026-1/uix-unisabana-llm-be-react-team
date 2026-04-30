function normalizeValue(value) {
  if (value === null || value === undefined) return value;

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (typeof value === "object" && typeof value.toHexString === "function") {
    return value.toHexString();
  }

  if (typeof value === "object" && value._bsontype === "ObjectId") {
    return String(value);
  }

  if (
    typeof value === "object" &&
    Object.prototype.hasOwnProperty.call(value, "buffer") &&
    value.buffer?.type === "Buffer"
  ) {
    return Buffer.from(value.buffer.data).toString("hex");
  }

  if (Array.isArray(value)) {
    return value.map((item) => normalizeValue(item));
  }

  if (typeof value === "object") {
    const plain = typeof value.toObject === "function" ? value.toObject() : value;
    const output = {};

    for (const [key, item] of Object.entries(plain)) {
      if (key === "__v") continue;
      if (key === "_id") {
        output.id = String(item);
        continue;
      }
      if (item && typeof item === "object" && item._bsontype === "ObjectId") {
        output[key] = String(item);
        continue;
      }
      output[key] = normalizeValue(item);
    }

    return output;
  }

  return value;
}

export function normalizeId(data) {
  return normalizeValue(data);
}
