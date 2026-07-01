const SCHEMA_VERSION = 1;
const STORAGE_KEY = 'drumlab_state';
const PERSIST_KEYS = ['patterns', 'instruments', 'tempo', 'repeatAmount', 'isEditMode', 'areStrokesRevealed'];

export function loadState() {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (!serialized) return undefined;
    const data = JSON.parse(serialized);
    if (data.schemaVersion !== SCHEMA_VERSION) return undefined;
    return Object.fromEntries(PERSIST_KEYS.map((k) => [k, data[k]]));
  } catch {
    return undefined;
  }
}

export function saveState(playerState) {
  try {
    const data = { schemaVersion: SCHEMA_VERSION };
    PERSIST_KEYS.forEach((k) => { data[k] = playerState[k]; });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // storage quota exceeded or private browsing — fail silently
  }
}

export function exportJSON(playerState) {
  const data = { schemaVersion: SCHEMA_VERSION };
  PERSIST_KEYS.forEach((k) => { data[k] = playerState[k]; });
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `drumlab-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importJSON(json) {
  const data = JSON.parse(json);
  if (data.schemaVersion !== SCHEMA_VERSION) {
    throw new Error(`Unsupported schema version: ${data.schemaVersion}`);
  }
  return Object.fromEntries(PERSIST_KEYS.map((k) => [k, data[k]]));
}
