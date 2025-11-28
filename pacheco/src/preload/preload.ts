import { contextBridge, ipcRenderer } from 'electron';
import fs from 'fs';

contextBridge.exposeInMainWorld('pachecoAPI', {
  loadFile: (filePath: string) => {
    try {
      return fs.readFileSync(filePath, 'utf-8');
    } catch (err) {
      console.error('load failed', err);
      return '';
    }
  },
  openDialog: async (): Promise<string[]> => {
    const result = await ipcRenderer.invoke('open-dialog');
    return result as string[];
  },
});
