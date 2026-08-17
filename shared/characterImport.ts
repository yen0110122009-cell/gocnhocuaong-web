import type { AppConfig } from "./study";

export function replaceCharacterConflicts(
  existing: AppConfig["characters"],
  incoming: AppConfig["characters"],
): AppConfig["characters"] {
  const incomingIds = new Set(incoming.map((character) => character.id));
  const incomingNames = new Set(incoming.map((character) => character.name.trim().toLocaleLowerCase()));
  return existing.filter((character) => {
    const sameId = incomingIds.has(character.id);
    const sameName = incomingNames.has(character.name.trim().toLocaleLowerCase());
    return !sameId && !sameName;
  });
}

export function mergeImportedCharacters(
  existing: AppConfig["characters"],
  incoming: AppConfig["characters"],
  mode: "skip" | "replace",
): AppConfig["characters"] {
  if (mode === "replace") {
    return [...replaceCharacterConflicts(existing, incoming), ...incoming];
  }
  return [...existing, ...incoming];
}
