const fs = require('fs');
const https = require('https');
const path = require('path');

const packagePath = path.resolve(__dirname, '..', 'package.json');
const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

const registryHost = 'registry.npmjs.org';

function fetchPackageInfo(name) {
  const encodedName = name.charAt(0) === '@' ? `@${encodeURIComponent(name.slice(1))}` : encodeURIComponent(name);
  const options = {
    hostname: registryHost,
    path: `/${encodedName}`,
    method: 'GET',
    headers: {
      'Accept': 'application/vnd.npm.install-v1+json'
    }
  };

  return new Promise((resolve) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            resolve(null);
          }
        } else {
          resolve(null);
        }
      });
    });

    req.on('error', () => resolve(null));
    req.end();
  });
}

function extractBaseVersion(version) {
  if (!version) return '';
  const cleaned = version.replace(/^[~^><=v\s]+/, '');
  return cleaned;
}

async function checkDependency(name, version) {
  if (!version || version === '*') {
    console.warn(`⚠ WARNING: Dependency ${name} is unpinned. Consider specifying a version.`);
    return;
  }

  const info = await fetchPackageInfo(name);
  if (!info || !info.versions) {
    console.warn(`⚠ WARNING: Dependency ${name}@${version} does not exist on npm.`);
    return;
  }

  const baseVersion = extractBaseVersion(version);
  const exactMatch = info.versions[version] || info.versions[baseVersion];

  if (!exactMatch) {
    console.warn(`⚠ WARNING: Dependency ${name}@${version} does not exist on npm.`);
  }
}

async function run() {
  const allDeps = {
    ...(pkg.dependencies || {}),
    ...(pkg.devDependencies || {})
  };

  for (const [name, version] of Object.entries(allDeps)) {
    await checkDependency(name, version);
  }
}

run();
