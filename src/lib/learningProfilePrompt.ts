import type { LearningProfile } from "../types/class";

// `LearningProfile.prompt` é `unknown` no tipo (JSON livre no backend), mas
// tem um formato conhecido no seed (docs/API.md Apêndice B). Lido de forma
// defensiva — nunca lançar se o shape não bater.
export interface LearningProfileAdaptations {
  simplifyText: boolean;
  glossary: boolean;
  tts: boolean;
  microtasks: boolean;
  visualStructure: boolean;
  highContrast: boolean;
  largeFont: boolean;
  screenReader: boolean;
}

export interface LearningProfilePrompt {
  code?: string;
  kind?: string;
  combines?: string[];
  adaptations?: LearningProfileAdaptations;
  instructions?: string;
}

export function parseProfilePrompt(prompt: unknown): LearningProfilePrompt | null {
  if (!prompt || typeof prompt !== "object") return null;
  return prompt as LearningProfilePrompt;
}

export function getProfileCode(profile: LearningProfile): string | undefined {
  const code = parseProfilePrompt(profile.prompt)?.code;
  return typeof code === "string" ? code : undefined;
}
