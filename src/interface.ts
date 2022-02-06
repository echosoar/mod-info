export interface IResult {
  tips: string[];
  version: IVersion;
  update: boolean;
}

export interface IVersion {
  major: number;
  minor: number;
  pacth: number;
}

export type ILevelConfig = 'major' | 'minor' | 'patch';
export interface IConfig {
  level?: ILevelConfig[];
  timeout?: number;
}