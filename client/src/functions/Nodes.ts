export interface INode { }

class NumberNode implements INode {
  constructor(public value: number) {}
}

class StringNode implements INode {
  constructor(public value: string) {}
}

class ReferenceNode implements INode {
  constructor(public ref: string) {}
}

class OperationNode<Type extends INode> implements INode {
  constructor(public left: Type, public op: string, public right: Type) {}
}

class FunctionCallNode<Type extends INode> implements INode {
  constructor(public func: string, public args: Type[]) {}
}

class FormulaNode<Type extends INode> implements INode {

  constructor(public expr: Type) {}
}

export { NumberNode, StringNode, ReferenceNode, OperationNode, FunctionCallNode, FormulaNode };