import { TextDecoder, TextEncoder } from "node:util";
import "@testing-library/jest-dom";

// jsdom não expõe TextEncoder/TextDecoder globalmente; react-router-dom
// depende deles em tempo de import.
if (typeof globalThis.TextEncoder === "undefined") {
  globalThis.TextEncoder = TextEncoder as unknown as typeof globalThis.TextEncoder;
}
if (typeof globalThis.TextDecoder === "undefined") {
  globalThis.TextDecoder = TextDecoder as unknown as typeof globalThis.TextDecoder;
}
