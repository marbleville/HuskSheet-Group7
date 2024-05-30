type Sheet = string;
type ID = string;
type Payload = Update;
type Publisher = string;
type Update = string;
type username = string;
type password = string;

type Column = string;

type RegisterArgument = {
  id: ID;
  username: username;
  password: password;
};

type Argument = {
  publisher: Publisher;
  sheet: Sheet;
  id: ID;
  payload: Payload;
};

type Result = {
  success: Boolean;
  message: string;
  value: Array<Argument>;
};

type RegisterResult = {
  success: Boolean;
  message: string;
  value: Array<RegisterArgument>;
  time: Number;
};

type Ref = {
  column: Column;
  row: Number;
};

// redef as recursive type?
type Expression = string;

type Formula = {
  expression: Expression;
};

type Term = Number | string | Formula;

type Fun = "IF" | "SUM" | "MIN" | "AVG" | "MAX" | "CONCAT" | "DEBUG";

type Operation =
  | "+"
  | "-"
  | "*"
  | "/"
  | "<"
  | ">"
  | "="
  | "<>"
  | "&"
  | "|"
  | ":";

export type {
  Sheet,
  ID,
  Payload,
  Publisher,
  Update,
  Column,
  Argument,
  Result,
  Ref,
  Expression,
  Formula,
  Term,
  Fun,
  Operation,
  RegisterArgument,
  RegisterResult,
};
