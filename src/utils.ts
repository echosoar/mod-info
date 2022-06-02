import { ChildProcess, exec as cpExec, ExecException } from 'child_process';
import { IVersion } from './interface';
export const exec = (options: {
  cmd: string;
  baseDir?: string;
  timeout?: number
}): Promise<string | ExecException> => {
  const { cmd, baseDir, timeout } = options;
  return new Promise((resolved, rejected) => {
    let timeoutHandler;
    let execProcess: ChildProcess;
    if (timeout) {
      timeoutHandler = setTimeout(() => {
        if (execProcess?.kill) {
          execProcess.kill();
        }
        rejected('timeout');
      }, timeout)
    }
    
    execProcess = cpExec(
      cmd,
      {
        cwd: baseDir,
      },
      (err, result) => {
        clearTimeout(timeoutHandler);
        if (err) {
          return rejected(err);
        }
        resolved(result);
      }
    );
    execProcess.stdout.on('data', data => {});
  });
};

export const formatVersion = (version: string): IVersion => {
  const versionParts = version.replace(/[^\d\.]/g, '').split('.');
  const versionInfo: IVersion = {
    version,
    major: +(versionParts[0] || 0),
    minor: +(versionParts[1] || 0),
    pacth: +(versionParts[2] || 0),
    tag: ['beta', 'alpha'].find(tag => version.includes(tag)),
    score: 0,
  }
  versionInfo.score = versionInfo.major * 1e12 + versionInfo.minor * 1e6 + versionInfo.pacth;
  return versionInfo;
}

export const matchVersion = (version: IVersion, matchRule: string) => {
  const rule = matchRule.replace(/[^\d\.]/g, '').split('.');
  if (rule[0] && version.major !== +rule[0]) {
    return false;
  }
  if (rule[1] && version.minor !== +rule[1]) {
    return false;
  }
  if (rule[2] && version.pacth !== +rule[2]) {
    return false;
  }
  return true;
}