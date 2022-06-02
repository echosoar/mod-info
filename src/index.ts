import { IConfig, IResult, IVersion, ITipRule } from "./interface";
import { tmpdir } from 'os';
import { join } from 'path';
import { existsSync, readFileSync, writeFileSync, mkdirSync} from 'fs';
import { exec, formatVersion, matchVersion } from "./utils";
export default async (moduleName: string, currentVersion: string, options?: IConfig): Promise<IResult> => {
  const { level, timeout, ignoreInformalVersion, registry } = {
    level: ['major', 'minor', 'patch'],
    timeout: 24 * 60 * 60 * 1000,
    ignoreInformalVersion: true,
    registry: '',
    ...options,
  }

  const curVersion = formatVersion(currentVersion);
  const cacheDir = join(tmpdir(), `npmModInfoCache`);
  if (!existsSync(cacheDir)) {
    mkdirSync(cacheDir, 0o777)
  }
  const cacheFile = join(cacheDir, `${(moduleName + '_' + currentVersion).replace(/[^\w]/g, '_')}_cache.json`);
  let cache: { time: number, value: IResult };
  if (existsSync(cacheFile)) {
    cache = JSON.parse(readFileSync(cacheFile, 'utf-8'));
  }

  if (cache?.time && (Date.now() - cache.time < timeout)) {
    return cache.value;
  }

  let npmCmd = `npm`;
  if (registry) {
    npmCmd = `npm --registry=${registry}`;
  } else  if (process.env.LANG === 'zh_CN.UTF-8') {
    npmCmd = 'npm --registry=https://registry.npmmirror.com';
  }

  let result: IResult = {
    update: false,
    tips: [],
    version: '',
  }

  try {
    const data = await exec({
      cmd: `${npmCmd} view ${moduleName} --json`,
      baseDir: process.env.HOME,
      timeout: 2000
    });
  
    const { versions, 'module-info-tips': tipRules = [] } = JSON.parse(data as string);
  
    let filterVersions: IVersion[] = versions.map(formatVersion).filter((version: IVersion) => {
      if (ignoreInformalVersion && version.tag) {
        return;
      }
  
      // patch: major and minor is same and minor is diff
      if (level.includes('patch')) {
        if (version.major === curVersion.major && version.minor === curVersion.minor && version.pacth > curVersion.pacth) {
          return true;
        }
      }
  
      // minor: major is same and minor is diff
      if (level.includes('minor')) {
        if (version.major === curVersion.major && version.minor > curVersion.minor) {
          return true;
        }
      }
  
      // major: only check major diff
      if (level.includes('major')) {
        if (version.major > curVersion.major) {
          return true;
        }
      }
    });
  
    filterVersions = filterVersions.sort((aVer: IVersion, bVer: IVersion) => {
      return bVer.score - aVer.score;
    });
  
    let update = false;
    let newVersion;
    if (filterVersions.length) {
      update = true;
      newVersion = filterVersions[0].version;
    }
  
    const tips = tipRules.filter((rule: ITipRule) => {
      if (!rule?.tip) {
        return false;
      }
      const ignore = [].concat(rule.ignore || []).find(rule => matchVersion(curVersion, rule));
      if (ignore) {
        return false;
      }
      const match = [].concat(rule.match || []).find(rule => matchVersion(curVersion, rule));
      if (match) {
        return true;
      }
      return false;
    });
  
    result = {
      update,
      version: newVersion,
      tips: tips.map((rule: ITipRule) => rule.tip),
    }
  } catch {
    //
  }
  writeFileSync(cacheFile, JSON.stringify({ time: Date.now(), value: result }))
  return result;
}