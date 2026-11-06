const { randomBytes, scryptSync } = require('node:crypto');

if (!process.stdin.isTTY || !process.stdin.setRawMode) {
  console.error('Ejecuta este comando desde una terminal interactiva.');
  process.exit(1);
}

process.stdout.write('Contraseña del administrador (entrada oculta): ');
process.stdin.setRawMode(true);
process.stdin.setEncoding('utf8');
process.stdin.resume();

let password = '';
process.stdin.on('data', (key) => {
  if (key === '\u0003') process.exit(1);
  if (key === '\r' || key === '\n') {
    process.stdin.setRawMode(false);
    process.stdin.pause();
    const salt = randomBytes(16).toString('base64url');
    const hash = scryptSync(password, salt, 64).toString('base64url');
    process.stdout.write(`\nADMIN_PASSWORD_HASH=${salt}:${hash}\n`);
    return;
  }
  if (key === '\u007f' || key === '\b') {
    password = password.slice(0, -1);
    return;
  }
  if (key >= ' ') password += key;
});
