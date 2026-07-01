function AddBeat({ side }) {
  return (
    <svg
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-4 h-4"
      transform={`rotate(${side === "left" ? "0" : "270"})`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 4.5l-15 15m0 0h11.25m-11.25 0V8.25"
      />
    </svg>
  );
}
export default AddBeat;
