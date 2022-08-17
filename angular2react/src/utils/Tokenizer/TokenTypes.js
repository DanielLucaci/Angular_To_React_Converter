import State from "./State";

let tokenTypes = [
  // Identifier
  {
    name: "identifier",
    states: [State.State1],
  },
  // Number
  {
    name: "number",
    states: [State.State30, State.State32, State.State33],
  },
  // Operator
  {
    name: "operator",
    states: [
      State.State2, State.State3, State.State4,
      State.State5, State.State6, State.State7,
      State.State8, State.State9, State.State10,
      State.State11, State.State12, State.State13,
      State.State14, State.State15, State.State16,
      State.State17, State.State18, State.State19,
      State.State20, State.State21, State.State22,
      State.State23, State.State24,
    ],
  },
  // Separator
  {
    name: "separator",
    states: [State.State25],
  },
  // String
  {
    name: "string",
    states: [State.State27],
  },
];

export default tokenTypes;
