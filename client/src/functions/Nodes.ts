export interface ExpressionNode {}

/**
 * Number node with the value
 * @author eduardo-ruiz-garay
 */
class NumberNode implements ExpressionNode {
  constructor(public value: number) {}
}

/**
 * String nnode with the value
 * @author eduardo-ruiz-garay
 */
class StringNode implements ExpressionNode {
  constructor(public value: string) {}
}

/**
 * Reference node with the reference value
 * @author eduardo-ruiz-garay
 */
class ReferenceNode implements ExpressionNode {
  constructor(public ref: string) {}
}

/**
 * Operation node for expressions
 * @author eduardo-ruiz-garay
 */
class OperationNode<ExpressionNode> {
  constructor(
    public left: ExpressionNode,
    public op: string,
    public right: ExpressionNode
  ) {}
}

/**
 * Function node for the function and expression node
 * @author eduardo-ruiz-garay
 */
class FunctionCallNode<ExpressionNode> {
  constructor(public func: string, public expressions: ExpressionNode[]) {}
}

/**
 * Formula node with the expression
 * @author eduardo-ruiz-garay
 */
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
