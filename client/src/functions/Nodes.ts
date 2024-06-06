class NumberNode {
  constructor(public value: number) {}
}

class StringNode {
  constructor(public value: string) {}
}

class ReferenceNode {
  constructor(public ref: string) {}
}

class OperationNode {
  constructor(public left: any, public op: string, public right: any) {}
}

class FunctionCallNode {
  constructor(public func: string, public args: any[]) {}
}

class FormulaNode {
  constructor(public expr: any) {}
}

default export NumberNode, StringNode;