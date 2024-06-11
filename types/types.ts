type Sheet = string;
type ID = string;
type Payload = Update;
type Publisher = string;
type Update = string;

type Column = string;

type Argument = {
	publisher: Publisher;
	sheet: Sheet;
	id: ID;
	payload: Payload;
};

type Result = {
	success: Boolean;
	message: string | null;
	value: Array<Argument>;
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


// Represents data stored in the sheet as a mapping of REF:TERM pairs. 
export interface SheetDataMap {
  [ref: string]: string;
};


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
