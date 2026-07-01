import { useEffect } from "react";

function isEditableTarget(el) {
  if (!el) return false;
  const tag = el.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  if (el.isContentEditable) return true;
  return false;
}

// shortcuts: Array<{ key, ctrlOrCmd?, shift?, handler, preventDefault?, allowInEditable? }>
export default function useKeyboardShortcuts(shortcuts, deps = []) {
  useEffect(() => {
    function onKeyDown(event) {
      for (const def of shortcuts) {
        if (event.key.toLowerCase() !== def.key.toLowerCase()) continue;
        const hasCtrl = event.ctrlKey || event.metaKey;
        if (!!def.ctrlOrCmd !== hasCtrl) continue;
        if (!!def.shift !== event.shiftKey) continue;
        if (isEditableTarget(event.target) && !def.allowInEditable) continue;

        if (def.preventDefault !== false) event.preventDefault();
        def.handler();
        return;
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
