import PlayerControls from "./PlayerControls";
import { useEffect } from "react";
import { useToast } from "@chakra-ui/react";
import {
  createAudioCtx,
  resumeAudioCtx,
  ensureSamplesLoaded,
  start as schedulerStart,
  stop as schedulerStop,
} from "../services/audio.scheduler.js";
import Pattern from "./Pattern";
import AddCircle from "../svg-cmp/AddCircle";
import { useSelector, useDispatch, useStore } from "react-redux";
import {
  play as playAction,
  stop as stopAction,
  setPlaybackPosition,
  setSamplesStatus,
  undo,
  redo,
} from "../slices/player.slice.js";
import InstrumentsPicker from "./InstrumentsPicker";
import useKeyboardShortcuts from "../hooks/useKeyboardShortcuts.js";

export default function PatternPlayer() {
  const tempo = useSelector((state) => state.player.tempo);
  const isPlaying = useSelector((state) => state.player.isPlaying);
  const patterns = useSelector((state) => state.player.patterns);
  const isEditMode = useSelector((state) => state.player.isEditMode);
  const samplesStatus = useSelector((state) => state.player.samplesStatus);

  const dispatch = useDispatch();
  const store = useStore();
  const toast = useToast();

  useEffect(() => {
    createAudioCtx();

    function loadSamples() {
      dispatch(setSamplesStatus("loading"));
      ensureSamplesLoaded()
        .then(() => dispatch(setSamplesStatus("ready")))
        .catch(() => {
          dispatch(setSamplesStatus("error"));
          if (toast.isActive("samples-error")) return;
          toast({
            id: "samples-error",
            status: "error",
            duration: null,
            isClosable: true,
            render: ({ onClose }) => (
              <div className="flex items-center gap-4 rounded bg-red-600 px-4 py-3 text-white shadow-lg">
                <div>
                  <p className="font-semibold">Couldn&apos;t load drum sounds</p>
                  <p className="text-sm opacity-90">
                    Check your connection and try again.
                  </p>
                </div>
                <button
                  className="rounded bg-white/20 px-3 py-1 font-semibold hover:bg-white/30"
                  onClick={() => {
                    onClose();
                    loadSamples();
                  }}
                >
                  Retry
                </button>
              </div>
            ),
          });
        });
    }

    loadSamples();
    return () => schedulerStop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function play() {
    if (store.getState().player.samplesStatus !== "ready") return;
    // Resume synchronously on the gesture so the autoplay policy is satisfied.
    resumeAudioCtx();
    const { patterns, instruments, repeatAmount } = store.getState().player;
    dispatch(playAction());
    schedulerStart({
      patterns,
      instruments,
      repeatAmount,
      getTempo: () => store.getState().player.tempo,
      onStep: (position) => dispatch(setPlaybackPosition(position)),
      onEnd: () => stop(),
    });
  }

  function stop() {
    schedulerStop();
    dispatch(stopAction());
  }

  useKeyboardShortcuts(
    [
      { key: " ", handler: () => (isPlaying ? stop() : play()) },
      { key: "z", ctrlOrCmd: true, shift: false, handler: () => dispatch(undo()) },
      { key: "z", ctrlOrCmd: true, shift: true, handler: () => dispatch(redo()) },
    ],
    [isPlaying, samplesStatus]
  );

  return (
    <div className="relative h-screen max-w-3xl mx-auto flex flex-col">
      <div className="relative flex-1 overflow-scroll scroll-smooth no-scrollbar h-full px-1 pt-14">
        {patterns.map((pattern, index) => (
          <Pattern index={index} key={index} />
        ))}

        <div></div>
        {patterns.length < 4 && isEditMode && (
          <button
            onClick={() => dispatch({ type: "player/addPattern" })}
            className="block mx-auto hover:bg-slate-200/30 rounded relative"
          >
            <AddCircle />
          </button>
        )}
      </div>

      <PlayerControls
        play={play}
        stop={stop}
        isPlaying={isPlaying}
        tempo={tempo}
        samplesStatus={samplesStatus}
      />
    </div>
  );
}
