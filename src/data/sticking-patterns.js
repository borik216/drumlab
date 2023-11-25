const uid = function () {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

const stickingPatterns = [
  {
    id: "1",
    display: "RLRL",
    sticking: [
      {hand: "R", instrument: "snare", instrumentIndex: 0, type: "ghost" },
      {hand: "L", instrument: "snare", instrumentIndex: 0, type: "ghost" },
      {hand: "R", instrument: "snare", instrumentIndex: 0, type: "ghost" },
      {hand: "L", instrument: "snare", instrumentIndex: 0, type: "ghost" },
    ],
  },
  {
    id: "2",
    display: "RRLL",
    sticking: [
      {hand: "R", instrument: "snare", instrumentIndex: 0, type: "ghost" },
      {hand: "R", instrument: "snare", instrumentIndex: 0, type: "ghost" },
      {hand: "L", instrument: "snare", instrumentIndex: 0, type: "ghost" },
      {hand: "L", instrument: "snare", instrumentIndex: 0, type: "ghost" },
    ],
  },
  {
    id: "3",
    display: "RLLR",
    sticking: [
      {hand: "R", instrument: "snare", instrumentIndex: 0, type: "ghost" },
      {hand: "L", instrument: "snare", instrumentIndex: 0, type: "ghost" },
      {hand: "L", instrument: "snare", instrumentIndex: 0, type: "ghost" },
      {hand: "R", instrument: "snare", instrumentIndex: 0, type: "ghost" },
    ],
  },
  {
    id: "4",
    display: "RRRL",
    sticking: [
      {hand: "R", instrument: "snare", instrumentIndex: 0, type: "ghost" },
      {hand: "R", instrument: "snare", instrumentIndex: 0, type: "ghost" },
      {hand: "R", instrument: "snare", instrumentIndex: 0, type: "ghost" },
      {hand: "L", instrument: "snare", instrumentIndex: 0, type: "ghost" },
    ],
  },
  {
    id: "5",
    display: "RLLL",
    sticking: [
      {hand: "R", instrument: "snare", instrumentIndex: 0, type: "ghost" },
      {hand: "L", instrument: "snare", instrumentIndex: 0, type: "ghost" },
      {hand: "L", instrument: "snare", instrumentIndex: 0, type: "ghost" },
      {hand: "L", instrument: "snare", instrumentIndex: 0, type: "ghost" },
    ],
  },
  {
    id: "6",
    display: "RRLR",
    sticking: [
      {hand: "R", instrument: "snare", instrumentIndex: 0, type: "ghost" },
      {hand: "R", instrument: "snare", instrumentIndex: 0, type: "ghost" },
      {hand: "L", instrument: "snare", instrumentIndex: 0, type: "ghost" },
      {hand: "R", instrument: "snare", instrumentIndex: 0, type: "ghost" },
    ],
  },
  {
    id: "7",
    display: "RLRR",
    sticking: [
      {hand: "R", instrument: "snare", instrumentIndex: 0, type: "ghost" },
      {hand: "L", instrument: "snare", instrumentIndex: 0, type: "ghost" },
      {hand: "R", instrument: "snare", instrumentIndex: 0, type: "ghost" },
      {hand: "R", instrument: "snare", instrumentIndex: 0, type: "ghost" },
    ],
  },
  {
    id: "8",
    display: "RRRR",
    sticking: [
      {hand: "R", instrument: "snare", instrumentIndex: 0, type: "ghost" },
      {hand: "R", instrument: "snare", instrumentIndex: 0, type: "ghost" },
      {hand: "R", instrument: "snare", instrumentIndex: 0, type: "ghost" },
      {hand: "R", instrument: "snare", instrumentIndex: 0, type: "ghost" },
    ],
  },
  {
    id: "9",
    display: "LRLR",
    sticking: [
      {hand: "L", instrument: "snare", instrumentIndex: 0, type: "ghost" },
      {hand: "R", instrument: "snare", instrumentIndex: 0, type: "ghost" },
      {hand: "L", instrument: "snare", instrumentIndex: 0, type: "ghost" },
      {hand: "R", instrument: "snare", instrumentIndex: 0, type: "ghost" },
    ],
  },
  {
    id: "10",
    display: "LLRR",
    sticking: [
      { hand: "L", instrument: "snare", instrumentIndex: 0, type: "ghost" },
      { hand: "L", instrument: "snare", instrumentIndex: 0, type: "ghost" },
      { hand: "R", instrument: "snare", instrumentIndex: 0, type: "ghost" },
      { hand: "R", instrument: "snare", instrumentIndex: 0, type: "ghost" },
    ],
  },
  {
    id: "11",
    display: "LRRL",
    sticking: [
      { hand: "L", instrument: "snare", instrumentIndex: 0, type: "ghost" },
      { hand: "R", instrument: "snare", instrumentIndex: 0, type: "ghost" },
      { hand: "R", instrument: "snare", instrumentIndex: 0, type: "ghost" },
      { hand: "L", instrument: "snare", instrumentIndex: 0, type: "ghost" },
    ],
  },
  {
    id: "12",
    display: "LLLR",
    sticking: [
      { hand: "L", instrument: "snare", instrumentIndex: 0, type: "ghost" },
      { hand: "L", instrument: "snare", instrumentIndex: 0, type: "ghost" },
      { hand: "L", instrument: "snare", instrumentIndex: 0, type: "ghost" },
      { hand: "R", instrument: "snare", instrumentIndex: 0, type: "ghost" },
    ],
  },
  {
    id: "13",
    display: "LLRL",
    sticking: [
      { hand: "L", instrument: "snare", instrumentIndex: 0, type: "ghost" },
      { hand: "L", instrument: "snare", instrumentIndex: 0, type: "ghost" },
      { hand: "R", instrument: "snare", instrumentIndex: 0, type: "ghost" },
      { hand: "L", instrument: "snare", instrumentIndex: 0, type: "ghost" },
    ],
  },
  {
    id: "14",
    display: "LRLL",
    sticking: [
      { hand: "L", instrument: "snare", instrumentIndex: 0, type: "ghost" },
      { hand: "R", instrument: "snare", instrumentIndex: 0, type: "ghost" },
      { hand: "L", instrument: "snare", instrumentIndex: 0, type: "ghost" },
      { hand: "L", instrument: "snare", instrumentIndex: 0, type: "ghost" },
    ],
  },
  {
    id: "15",
    display: "LLRL",
    sticking: [
      { hand: "L", instrument: "snare", instrumentIndex: 0, type: "ghost" },
      { hand: "L", instrument: "snare", instrumentIndex: 0, type: "ghost" },
      { hand: "R", instrument: "snare", instrumentIndex: 0, type: "ghost" },
      { hand: "L", instrument: "snare", instrumentIndex: 0, type: "ghost" },
    ],
  },
  {
    id: "16",
    display: "LLLL",
    sticking: [
      { hand: "L", instrument: "snare", instrumentIndex: 0, type: "ghost" },
      { hand: "L", instrument: "snare", instrumentIndex: 0, type: "ghost" },
      { hand: "L", instrument: "snare", instrumentIndex: 0, type: "ghost" },
      { hand: "L", instrument: "snare", instrumentIndex: 0, type: "ghost" },
    ],
  },
  {
    id: "17",
    display: "RRR",
    sticking: [
      { hand: "R", instrument: "snare", instrumentIndex: 0, type: "ghost" },
      { hand: "R", instrument: "snare", instrumentIndex: 0, type: "ghost" },
      { hand: "R", instrument: "snare", instrumentIndex: 0, type: "ghost" },
    ],
  },
  {
    id: "18",
    display: "RRL",
    sticking: [
      { hand: "R", instrument: "snare", instrumentIndex: 0, type: "ghost" },
      { hand: "R", instrument: "snare", instrumentIndex: 0, type: "ghost" },
      { hand: "L", instrument: "snare", instrumentIndex: 0, type: "ghost" },
    ],
  },
  {
    id: "19",
    display: "RLR",
    sticking: [
      { hand: "R", instrument: "snare", instrumentIndex: 0, type: "ghost" },
      { hand: "L", instrument: "snare", instrumentIndex: 0, type: "ghost" },
      { hand: "R", instrument: "snare", instrumentIndex: 0, type: "ghost" },
    ],
  },
  {
    id: "20",
    display: "RLL",
    sticking: [
      { hand: "R", instrument: "snare", instrumentIndex: 0, type: "ghost" },
      { hand: "L", instrument: "snare", instrumentIndex: 0, type: "ghost" },
      { hand: "L", instrument: "snare", instrumentIndex: 0, type: "ghost" },
    ],
  },
  {
    id: "21",
    display: "LLL",
    sticking: [
      { hand: "L", instrument: "snare", instrumentIndex: 0, type: "ghost" },
      { hand: "L", instrument: "snare", instrumentIndex: 0, type: "ghost" },
      { hand: "L", instrument: "snare", instrumentIndex: 0, type: "ghost" },
    ],
  },
  {
    id: "22",
    display: "LLR",
    sticking: [
      { hand: "L", instrument: "snare", instrumentIndex: 0, type: "ghost" },
      { hand: "L", instrument: "snare", instrumentIndex: 0, type: "ghost" },
      { hand: "R", instrument: "snare", instrumentIndex: 0, type: "ghost" },
    ],
  },
  {
    id: "23",
    display: "LRL",
    sticking: [
      { hand: "L", instrument: "snare", instrumentIndex: 0, type: "ghost" },
      { hand: "R", instrument: "snare", instrumentIndex: 0, type: "ghost" },
      { hand: "L", instrument: "snare", instrumentIndex: 0, type: "ghost" },
    ],
  },
  {
    id: "24",
    display: "LRR",
    sticking: [
      { hand: "L", instrument: "snare", instrumentIndex: 0, type: "ghost" },
      { hand: "R", instrument: "snare", instrumentIndex: 0, type: "ghost" },
      { hand: "R", instrument: "snare", instrumentIndex: 0, type: "ghost" },
    ],
  },
];

export default stickingPatterns