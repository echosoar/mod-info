export interface IResult {
  tips: string[];
  version: string;
  update: boolean;
}

export interface IVersion {
  version: string;
  major: number;
  minor: number;
  pacth: number;
  tag?: string;
  score: number;
}

export type ILevelConfig = 'major' | 'minor' | 'patch';
export interface IConfig {
  level?: ILevelConfig[];
  timeout?: number;
  registry?: string;
  ignoreInformalVersion?: boolean;
}

export interface ITipRule {
  match?: string|string[];
  ignore?: string|string[];
  tip?: string;
}