import { apiResponse } from "../api-response.js";

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("apiResponse()", () => {
  it("debe llamar res.status() con el código proporcionado", () => {
    const res = mockRes();
    apiResponse(res, { status: 201, message: "Creado", data: { id: 1 } });
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it("debe llamar res.json() con message y data", () => {
    const res = mockRes();
    const data = { id: 1, name: "Test" };
    apiResponse(res, { status: 200, message: "OK", data });
    expect(res.json).toHaveBeenCalledWith({ message: "OK", data });
  });

  it("debe usar status 200 por defecto", () => {
    const res = mockRes();
    apiResponse(res, { message: "OK" });
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("debe usar message 'OK' por defecto", () => {
    const res = mockRes();
    apiResponse(res, { status: 200 });
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: "OK" }));
  });

  it("debe pasar data null cuando no se proporciona data", () => {
    const res = mockRes();
    apiResponse(res, { status: 200, message: "OK" });
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ data: null }));
  });

  it("debe funcionar con data como arreglo", () => {
    const res = mockRes();
    const data = [{ id: 1 }, { id: 2 }];
    apiResponse(res, { status: 200, message: "OK", data });
    expect(res.json).toHaveBeenCalledWith({ message: "OK", data });
  });

  it("debe retornar el resultado de res.json()", () => {
    const res = mockRes();
    res.json.mockReturnValue("json_result");
    const result = apiResponse(res, { status: 200, message: "OK", data: null });
    expect(result).toBe("json_result");
  });
});
