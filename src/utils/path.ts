import os from 'os'
import path from 'path'

export const folderName = 'qk';
export const localAppDataPath = process.env.LOCALAPPDATA || os.homedir();
export const defaultDirPath = path.join(localAppDataPath, folderName);
export const defaultDataPath = path.join(defaultDirPath, 'data.json');

