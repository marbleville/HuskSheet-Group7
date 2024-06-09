export interface ExpressionNode {}

class NumberNode implements ExpressionNode {
  constructor(public value: number) {}
}

class StringNode implements ExpressionNode {
  constructor(public value: string) {}
}

class ReferenceNode implements ExpressionNode {
  constructor(public ref: string) {}
}

class OperationNode<Type extends ExpressionNode> implements ExpressionNode {
  constructor(public left: Type, public op: string, public right: Type) {}
}

class FunctionCallNode<Type extends ExpressionNode> implements ExpressionNode {
  constructor(public func: string, public args: Type[]) {}
}

class FormulaNode<Type extends ExpressionNode> implements ExpressionNode {
  constructor(public expr: Type) {}
}

export {
  NumberNode,
  StringNode,
  ReferenceNode,
  OperationNode,
  FunctionCallNode,
  FormulaNode,
};
