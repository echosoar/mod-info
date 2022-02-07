import mi from '../src';
describe('index.test.ts', () => {
  it('same version', async () => {
    const info = await mi('test-mode-info', '1.2.4', { timeout: 0})
    expect(info.update).toBeFalsy();
    expect(info.tips.includes('0.x tip')).toBeFalsy();
    expect(info.tips.includes('1.x tip')).toBeTruthy();
    expect(info.tips.includes('x tip')).toBeTruthy();
  });

  it('patch small than version', async () => {
    const info = await mi('test-mode-info', '1.2.3', { timeout: 0})
    expect(info.update).toBeTruthy();
    expect(info.tips.includes('0.x tip')).toBeFalsy();
    expect(info.tips.includes('1.x tip')).toBeFalsy();
    expect(info.tips.includes('x tip')).toBeTruthy();
  });

  it('patch more than version', async () => {
    const info = await mi('test-mode-info', '1.2.5', { timeout: 0})
    expect(info.update).toBeFalsy();
    expect(info.tips.includes('0.x tip')).toBeFalsy();
    expect(info.tips.includes('1.x tip')).toBeTruthy();
    expect(info.tips.includes('x tip')).toBeTruthy();
  });

  it('minor small than version', async () => {
    const info = await mi('test-mode-info', '1.1.4', { timeout: 0})
    expect(info.update).toBeTruthy();
    expect(info.tips.includes('0.x tip')).toBeFalsy();
    expect(info.tips.includes('1.x tip')).toBeFalsy();
    // ignore *.1
    expect(info.tips.includes('x tip')).toBeFalsy();
  });

  

  it('minor small than version but only check patch', async () => {
    const info = await mi('test-mode-info', '1.1.4', { timeout: 0, level: ['patch']})
    // only 1.1.5 need update
    expect(info.update).toBeFalsy();
    expect(info.tips.includes('0.x tip')).toBeFalsy();
    expect(info.tips.includes('1.x tip')).toBeFalsy();
    // ignore *.1
    expect(info.tips.includes('x tip')).toBeFalsy();
  });

  it('minor more than version', async () => {
    const info = await mi('test-mode-info', '1.3.4', { timeout: 0})
    expect(info.update).toBeFalsy();
    expect(info.tips.includes('0.x tip')).toBeFalsy();
    expect(info.tips.includes('1.x tip')).toBeTruthy();
    expect(info.tips.includes('x tip')).toBeTruthy();
  });

  it('major small than version', async () => {
    const info = await mi('test-mode-info', '0.2.4', { timeout: 0})
    expect(info.update).toBeTruthy();
    expect(info.tips.includes('0.x tip')).toBeTruthy();
    expect(info.tips.includes('1.x tip')).toBeFalsy();
    expect(info.tips.includes('x tip')).toBeTruthy();
  });

  it('major small than version and ignore some tip', async () => {
    const info = await mi('test-mode-info', '0.1.4', { timeout: 0})
    expect(info.update).toBeTruthy();
    // ignore 0.*
    expect(info.tips.includes('0.x tip')).toBeFalsy();
    expect(info.tips.includes('1.x tip')).toBeFalsy();
    // ignore *.1
    expect(info.tips.includes('x tip')).toBeFalsy();
  });

  it('major small than version but only check patch', async () => {
    const info = await mi('test-mode-info', '0.1.4', { timeout: 0, level: ['patch']})
    // only 0.1.5 need update
    expect(info.update).toBeFalsy();
    expect(info.tips.includes('0.x tip')).toBeFalsy();
    expect(info.tips.includes('1.x tip')).toBeFalsy();
    // ignore *.1
    expect(info.tips.includes('x tip')).toBeFalsy();
  });

  it('major small than version but only check minor', async () => {
    const info = await mi('test-mode-info', '0.1.4', { timeout: 0, level: ['minor']})
    // only 0.2.3 need update
    expect(info.update).toBeFalsy();
    expect(info.tips.includes('0.x tip')).toBeFalsy();
    expect(info.tips.includes('1.x tip')).toBeFalsy();
    // ignore *.1
    expect(info.tips.includes('x tip')).toBeFalsy();
  });

  it('major more than version', async () => {
    const info = await mi('test-mode-info', '3.3.4', { timeout: 0})
    expect(info.update).toBeFalsy();
    expect(info.tips.includes('0.x tip')).toBeFalsy();
    expect(info.tips.includes('1.x tip')).toBeFalsy();
    expect(info.tips.includes('x tip')).toBeTruthy();
  });
});