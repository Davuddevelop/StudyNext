import fs from 'fs';
import { exec } from 'child_process';
exec('npx vite build', (error, stdout, stderr) => {
    const output = (error ? error.message + '\n' : '') + stdout + '\n' + stderr;
    fs.writeFileSync('clean_build_log.txt', output);
});
