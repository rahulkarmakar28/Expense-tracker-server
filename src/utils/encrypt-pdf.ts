import { writeFileSync } from 'fs';
import { execSync } from 'child_process';

export function encryptPDF(buffer: Uint8Array, password: string, outPath: string): void {
  const tmpInput = '/tmp/temp.pdf';
  const tmpOutput = outPath;

  writeFileSync(tmpInput, buffer);

  execSync(`qpdf --encrypt ${password} ${password} 256 -- ${tmpInput} ${tmpOutput}`);
}
