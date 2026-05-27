import { promptsService } from "../prompts.service.js";
import { sendToOllama, streamFromOllama } from "../../../services/ollama.service.js";
import { sendToOpenAICompatible } from "../../../services/openai-compatible.service.js";
import { env } from "../../../config/env.js";

jest.mock("../../../services/ollama.service.js");
jest.mock("../../../services/openai-compatible.service.js");
jest.mock("../../../config/env.js", () => ({
  env: { LLM_DEFAULT_PROVIDER: "ollama", OLLAMA_MODEL: "llama3.1", OPENAI_MODEL: "gpt-4o-mini" }
}));

const ollamaResponse = {
  choices: [{ message: { content: "Respuesta de Ollama" } }]
};

const openaiResponse = {
  choices: [{ message: { content: "Respuesta de OpenAI" } }]
};

describe("promptsService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ─────────────────────────────────────────────
  // generate()
  // ─────────────────────────────────────────────
  describe("generate()", () => {
    it("debe usar ollama por defecto si no se especifica proveedor", async () => {
      sendToOllama.mockResolvedValue(ollamaResponse);

      const result = await promptsService.generate("Hola");

      expect(sendToOllama).toHaveBeenCalledWith([{ role: "user", content: "Hola" }]);
      expect(result).toEqual({ response: "Respuesta de Ollama", provider: "ollama" });
    });

    it("debe usar openai si se especifica como proveedor", async () => {
      sendToOpenAICompatible.mockResolvedValue(openaiResponse);

      const result = await promptsService.generate("Hola", "openai");

      expect(sendToOpenAICompatible).toHaveBeenCalledWith([{ role: "user", content: "Hola" }]);
      expect(result).toEqual({ response: "Respuesta de OpenAI", provider: "openai" });
    });

    it("debe usar ollama si se especifica explícitamente", async () => {
      sendToOllama.mockResolvedValue(ollamaResponse);

      const result = await promptsService.generate("Test prompt", "ollama");

      expect(sendToOllama).toHaveBeenCalled();
      expect(sendToOpenAICompatible).not.toHaveBeenCalled();
      expect(result.provider).toBe("ollama");
    });

    it("debe lanzar error si la respuesta no tiene contenido", async () => {
      sendToOllama.mockResolvedValue({ choices: [] });

      await expect(promptsService.generate("Test")).rejects.toThrow(
        "No se obtuvo respuesta del proveedor: ollama"
      );
    });

    it("debe lanzar error si choices es undefined", async () => {
      sendToOllama.mockResolvedValue({});

      await expect(promptsService.generate("Test")).rejects.toThrow(
        "No se obtuvo respuesta del proveedor: ollama"
      );
    });

    it("debe lanzar error si la respuesta de openai no tiene contenido", async () => {
      sendToOpenAICompatible.mockResolvedValue({ choices: [] });

      await expect(promptsService.generate("Test", "openai")).rejects.toThrow(
        "No se obtuvo respuesta del proveedor: openai"
      );
    });
  });

  // ─────────────────────────────────────────────
  // stream()
  // ─────────────────────────────────────────────
  describe("stream()", () => {
    it("debe llamar a streamFromOllama cuando el proveedor es ollama", async () => {
      streamFromOllama.mockResolvedValue(undefined);
      const onChunk = jest.fn();

      await promptsService.stream("Hola", "ollama", onChunk);

      expect(streamFromOllama).toHaveBeenCalledWith(
        [{ role: "user", content: "Hola" }],
        onChunk
      );
    });

    it("debe usar ollama por defecto en stream si no se especifica proveedor", async () => {
      streamFromOllama.mockResolvedValue(undefined);
      const onChunk = jest.fn();

      await promptsService.stream("Hola", undefined, onChunk);

      expect(streamFromOllama).toHaveBeenCalled();
      expect(sendToOpenAICompatible).not.toHaveBeenCalled();
    });

    it("debe hacer fallback a sendToOpenAICompatible y llamar onChunk cuando es openai", async () => {
      sendToOpenAICompatible.mockResolvedValue(openaiResponse);
      const onChunk = jest.fn();

      await promptsService.stream("Hola", "openai", onChunk);

      expect(sendToOpenAICompatible).toHaveBeenCalled();
      expect(onChunk).toHaveBeenCalledWith("Respuesta de OpenAI");
    });

    it("debe llamar onChunk con string vacío si openai no retorna contenido", async () => {
      sendToOpenAICompatible.mockResolvedValue({ choices: [] });
      const onChunk = jest.fn();

      await promptsService.stream("Test", "openai", onChunk);

      expect(onChunk).toHaveBeenCalledWith("");
    });
  });
});
