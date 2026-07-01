const SCHEMA_VERSION = 2;
const STORAGE_KEY = 'drumlab_state';
const PERSIST_KEYS = ['patterns', 'instruments', 'tempo', 'repeatAmount', 'isEditMode', 'areStrokesRevealed'];

// v1 -> v2: beatDivisions (object) -> divisions (array); kicksAt/hhPedalsAt
// folded into divisions as limb-tagged events; count[] -> hiddenCounts[]
// (labels are now derived, only the `hidden` flags are real state);
// beat.index and note.instrumentIndex dropped (both fully derivable).
function migrateStateV1toV2(data) {
  const patterns = data.patterns.map((pattern) => ({
    ...pattern,
    beats: pattern.beats.map((beat) => {
      const divisions = Array.from({ length: beat.division }, () => []);
      Object.entries(beat.beatDivisions).forEach(([divIndex, notes]) => {
        notes.forEach((note) => {
          divisions[Number(divIndex)].push({
            limb: 'hand',
            instrument: note.instrument,
            hand: note.hand,
            type: note.type,
            stroke: note.stroke,
          });
        });
      });
      beat.kicksAt.forEach((pulseIndex) => {
        divisions[pulseIndex].push({ limb: 'leg', instrument: 'kick' });
      });
      beat.hhPedalsAt.forEach((pulseIndex) => {
        divisions[pulseIndex].push({ limb: 'leg', instrument: 'hh-pedal' });
      });
      return {
        division: beat.division,
        hiddenCounts: beat.count.map((c) => c.hidden),
        divisions,
      };
    }),
  }));
  return { ...data, patterns };
}

// Keyed by the version a migration converts FROM.
const MIGRATIONS = { 1: migrateStateV1toV2 };

function migrate(data) {
  while (data.schemaVersion < SCHEMA_VERSION) {
    const step = MIGRATIONS[data.schemaVersion];
    if (!step) return null;
    data = step(data);
    data.schemaVersion += 1;
  }
  return data;
}

export function loadState() {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (!serialized) return undefined;
    const data = migrate(JSON.parse(serialized));
    if (!data) return undefined;
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
  const parsed = JSON.parse(json);
  const data = migrate(parsed);
  if (!data) {
    throw new Error(`Unsupported schema version: ${parsed.schemaVersion}`);
  }
  return Object.fromEntries(PERSIST_KEYS.map((k) => [k, data[k]]));
}
