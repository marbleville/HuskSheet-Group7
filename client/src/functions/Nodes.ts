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

class OperationNode<ExpressionNode> {
  constructor(
    public left: ExpressionNode,
    public op: string,
    public right: ExpressionNode
  ) {}
}

class FunctionCallNode<ExpressionNode> {
  constructor(public func: string, public expressions: ExpressionNode[]) {}
}

class FormulaNode<ExpressionNode> {
  constructor(public expression: ExpressionNode) {}
}

export {
  NumberNode,
  StringNode,
  ReferenceNode,
  OperationNode,
  FunctionCallNode,
  FormulaNode,
};
