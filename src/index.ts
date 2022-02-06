import { IConfig, IResult } from "./interface";
import { tmpdir } from 'os';
import { join } from 'path';
import { existsSync, readFileSync } from 'fs';
import { exec } from "./utils";
export default async (moduleName: string, currentVersion: string, options?: IConfig): Promise<IResult> => {
  const { level, timeout } = {
    level: ['major', 'minor', 'patch'],
    timeout: 24 * 60 * 60 * 1000,
    ...options,
  }

  console.log('level', level);
  const cacheFile = join(tmpdir(), `modInfo_${moduleName.replace(/[^\w]/g, '_')}_cache.json`);
  let cache: IResult & { time: number };
  if (existsSync(cacheFile)) {
    cache = JSON.parse(readFileSync(cacheFile, 'utf-8'));
  }

  if (cache?.time && Date.now() - cache.time < timeout) {
    return cache;
  }

  let npmCmd = `npm`;
  if (process.env.LANG === 'zh_CN.UTF-8') {
    npmCmd = 'npm --registry=https://registry.npmmirror.com';
  }

  const data = await exec({
    cmd: `${npmCmd} view ${moduleName} dist-tags --json`,
    baseDir: process.env.HOME
  });

  console.log('data', data);

}