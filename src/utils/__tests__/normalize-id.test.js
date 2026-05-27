import { normalizeId } from "../normalize-id.js";

describe("normalizeId()", () => {
  // ─────────────────────────────────────────────
  // Valores primitivos y nulos
  // ─────────────────────────────────────────────
  it("debe retornar null si el valor es null", () => {
    expect(normalizeId(null)).toBeNull();
  });

  it("debe retornar undefined si el valor es undefined", () => {
    expect(normalizeId(undefined)).toBeUndefined();
  });

  it("debe retornar strings sin modificar", () => {
    expect(normalizeId("hello")).toBe("hello");
  });

  it("debe retornar números sin modificar", () => {
    expect(normalizeId(42)).toBe(42);
  });

  it("debe retornar booleanos sin modificar", () => {
    expect(normalizeId(true)).toBe(true);
  });

  // ─────────────────────────────────────────────
  // Fechas
  // ─────────────────────────────────────────────
  it("debe convertir Date a string ISO", () => {
    const date = new Date("2024-01-15T10:00:00.000Z");
    expect(normalizeId(date)).toBe("2024-01-15T10:00:00.000Z");
  });

  // ─────────────────────────────────────────────
  // Objetos con _id
  // ─────────────────────────────────────────────
  it("debe renombrar _id a id en un objeto plano", () => {
    const obj = { _id: "abc123", name: "Test" };
    const result = normalizeId(obj);
    expect(result).toHaveProperty("id", "abc123");
    expect(result).not.toHaveProperty("_id");
  });

  it("debe omitir el campo __v", () => {
    const obj = { _id: "abc123", name: "Test", __v: 0 };
    const result = normalizeId(obj);
    expect(result).not.toHaveProperty("__v");
  });

  it("debe procesar objetos anidados recursivamente", () => {
    const obj = {
      _id: "parent123",
      child: { _id: "child123", value: "test" }
    };
    const result = normalizeId(obj);
    expect(result.id).toBe("parent123");
    expect(result.child.id).toBe("child123");
  });

  // ─────────────────────────────────────────────
  // Arrays
  // ─────────────────────────────────────────────
  it("debe procesar arreglos normalizando cada elemento", () => {
    const arr = [
      { _id: "id1", name: "A" },
      { _id: "id2", name: "B" }
    ];
    const result = normalizeId(arr);
    expect(result[0].id).toBe("id1");
    expect(result[1].id).toBe("id2");
    expect(result[0]).not.toHaveProperty("_id");
  });

  it("debe retornar arreglo vacío si se pasa arreglo vacío", () => {
    expect(normalizeId([])).toEqual([]);
  });

  // ─────────────────────────────────────────────
  // ObjectId simulado (BSON)
  // ─────────────────────────────────────────────
  it("debe convertir objectId con toHexString a string", () => {
    const fakeObjectId = { toHexString: () => "507f1f77bcf86cd799439011" };
    expect(normalizeId(fakeObjectId)).toBe("507f1f77bcf86cd799439011");
  });

  it("debe convertir objectId con _bsontype a string", () => {
    const fakeObjectId = { _bsontype: "ObjectId", toString: () => "507f1f77bcf86cd799439011" };
    const obj = { _id: "abc", ref: fakeObjectId };
    const result = normalizeId(obj);
    expect(typeof result.ref).toBe("string");
  });

  // ─────────────────────────────────────────────
  // Objeto con toObject() (Mongoose document)
  // ─────────────────────────────────────────────
  it("debe llamar toObject() si el objeto lo implementa", () => {
    const mongooseDoc = {
      toObject: () => ({ _id: "mongo123", name: "Doc", __v: 0 })
    };
    const result = normalizeId(mongooseDoc);
    expect(result.id).toBe("mongo123");
    expect(result.name).toBe("Doc");
    expect(result).not.toHaveProperty("__v");
  });
});
