type Sheet = String;
type ID = String;
type Payload = Update;
type Publisher = String;
type Update = String;

// redef as recursive type?
type Column = String;

type Argument = {
	publisher: Publisher;
	sheet: Sheet;
	id: ID;
	payload: Payload;
};

type Result = {
	success: Boolean;
	message: String;
	value: Array<Argument>;
};

type Ref = {
	column: Column;
	row: Number;
};

// redef as recursive type?
type Expression = String;

type Formula = {
	expression: Expression;
};

type Term = Number | String | Formula;

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
};
