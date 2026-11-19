const fs = require('node:fs/promises');
const path = require('node:path');
const { tmpdir } = require('node:os');
const { createHash } = require('node:crypto');
const { execFileSync } = require('node:child_process');

const project = path.resolve(__dirname, '..');
const runtime = path.join(project, 'src-tauri', 'runtime');
const cache = path.join(tmpdir(), 'windowsill-tauri-build');
const gitVersion = '2.56.1';
const gitArchive = `MinGit-${gitVersion}-64-bit.zip`;
const gitDigest = '4a92850b6e917da4fd010669b614b55dccf5b0ec333a534cc4be4700dfefdafd';
const gitFiles = [
  'LICENSE.txt',
  ...['git.exe', 'libiconv-2.dll', 'libintl-8.dll', 'libpcre2-8-0.dll', 'zlib1.dll'].map(file => `ucrt64/bin/${file}`),
  'ucrt64/share/git-core/templates',
  'ucrt64/share/licenses/gettext-runtime',
  'ucrt64/share/licenses/libiconv',
  'ucrt64/share/licenses/pcre2',
  'usr/share/licenses/zlib',
];
const gitUrl = `https://github.com/git-for-windows/git/releases/download/v${gitVersion}.windows.1/${gitArchive}`;
const nodeLicenseDigest = '5888dbb9a1d2b18f2c3e6c5f6af1b39de658372b402a0577b002777f14c62ace';

async function checksum(file) {
  const bytes = await fs.readFile(file).catch(error => {
    if (error.code !== 'ENOENT') throw error;
    return null;
  });
  return bytes && createHash('sha256').update(bytes).digest('hex');
}

async function download(name, url, digest) {
  await fs.mkdir(cache, { recursive: true });
  const target = path.join(cache, name);
  if (await checksum(target) === digest) return target;
  execFileSync('curl.exe', ['--fail', '--location', '--retry', '2', '--output', target, url], { stdio: 'inherit' });
  if (await checksum(target) !== digest) throw Error(`${name} download checksum mismatch.`);
  return target;
}

async function copyChanged(source, destination) {
  await fs.cp(source, destination, {
    recursive: true,
    filter: async (input, output) => (await fs.stat(input)).isDirectory()
      || await checksum(input) !== await checksum(output),
  });
}

async function removeRuntimeDirectory(directory) {
  const resolved = await fs.realpath(directory).catch(error => {
    if (error.code !== 'ENOENT') throw error;
    return null;
  });
  if (!resolved) return;
  const expected = path.join(await fs.realpath(project), 'src-tauri', 'runtime', path.basename(directory));
  if (resolved.toLowerCase() !== expected.toLowerCase()) throw Error(`Unexpected staging directory: ${resolved}`);
  await fs.rm(resolved, { recursive: true, force: true });
}

async function prepareGit() {
  const git = path.join(runtime, 'git');
  const versionFile = path.join(git, '.windowsill-version');
  const manifest = `${gitDigest}\n${gitFiles.join('\n')}`;
  const version = await fs.readFile(versionFile, 'utf8').catch(() => '');
  if (version === manifest) return;

  const archive = await download(gitArchive, gitUrl, gitDigest);

  const staging = await fs.mkdtemp(path.join(runtime, 'git-'));
  try {
    execFileSync('tar.exe', ['-mx', '-f', archive, '-C', staging, ...gitFiles], { stdio: 'inherit' });
    await fs.access(path.join(staging, 'ucrt64', 'bin', 'git.exe'));
    await fs.writeFile(path.join(staging, '.windowsill-version'), manifest);
    await removeRuntimeDirectory(git);
    await fs.rename(staging, git);
  } finally {
    await removeRuntimeDirectory(staging);
  }
}

async function prepare() {
  if (process.argv.includes('--rust')) {
    const { builtinThemes } = require('../main/builtin-themes.js');
    const generated = path.join(project, 'src-tauri', 'gen');
    await fs.mkdir(generated, { recursive: true });
    const asset = path.join(generated, 'rust-builtin-themes.json');
    const themes = JSON.stringify(builtinThemes);
    const existing = await fs.readFile(asset, 'utf8').catch(error => {
      if (error.code !== 'ENOENT') throw error;
      return '';
    });
    if (themes !== existing) await fs.writeFile(asset, themes);
    return;
  }
  if (process.platform !== 'win32' || process.arch !== 'x64') throw Error('The legacy build targets Windows x64.');
  await fs.mkdir(runtime, { recursive: true });
  await prepareGit();
  await copyChanged(path.join(project, 'main'), path.join(runtime, 'backend'));

  const modules = path.join(runtime, 'backend', 'node_modules');
  await fs.mkdir(path.join(modules, '@koromix'), { recursive: true });
  for (const dependency of ['koffi', '@koromix/koffi-win32-x64']) {
    await copyChanged(path.join(project, 'node_modules', dependency), path.join(modules, dependency));
  }
  const node = path.join(project, 'node_modules', 'node-win-x64');
  const nodeVersion = require(path.join(node, 'package.json')).version;
  await copyChanged(path.join(node, 'bin', 'node.exe'), path.join(runtime, 'node.exe'));
  const license = await download(`node-${nodeVersion}-LICENSE`, `https://raw.githubusercontent.com/nodejs/node/v${nodeVersion}/LICENSE`, nodeLicenseDigest);
  await copyChanged(license, path.join(runtime, 'NODE-LICENSE.txt'));
}

prepare().catch(error => { console.error(error.message); process.exitCode = 1; });
