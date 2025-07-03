interface IConstraint {
  constraint: string;
  property: string;
}
export interface IExceptionRes {
  message: IConstraint[];
}
export interface ITargetConstructor {
  resource: string;
}
