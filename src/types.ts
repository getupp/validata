export type Contract<T> = {
  [P in keyof T]: ContractProperty<T[P]>;
};

export type Result<T> = ValueResult<T> | IssueResult;

export interface ValueResult<T> {
  value: T;
}

export function isValue<T>(result: Result<T> | undefined): result is ValueResult<T> {
  return !!result && result.hasOwnProperty('value');
}

export function isIssue<T>(result: Result<T> | undefined): result is IssueResult {
  return !!result && (result as IssueResult).issues !== undefined;
}

export function exists<T>(value: T | undefined): value is T {
  return value !== undefined;
}

export type Path = string | number | symbol;

export class Issue {
  static from(value: any, reason: string) {
    return new Issue([], value, reason);
  }

  static fromChild(path: Path, value: any, reason: string) {
    return new Issue([path], value, reason);
  }

  private constructor(
    readonly path: Path[],
    readonly value: any,
    readonly reason: string,
  ) { }

  nest(parent: Path): Issue {
    return new Issue(
      [parent, ...this.path],
      this.value,
      this.reason,
    );
  }
}

export interface IssueResult {
  issues: Issue[];
}

export interface ContractProperty<T> {
  process(value: any): Result<T> | undefined;
}
