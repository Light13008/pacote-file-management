const pacote = require('pacote');
const fs = require('fs');
const path = require('path');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

// Store package history in a JSON file
const HISTORY_FILE = path.join(__dirname, 'package-history.json');

// Initialize or load package history
function getPackageHistory() {
  try {
    return JSON.parse(fs.readFileSync(HISTORY_FILE));
  } catch {
    return {
      installations: [],
      deletions: [],
      lastUpdated: null
    };
  }
}

// Save package history
function savePackageHistory(history) {
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2));
}

// Get the current dependency tree
async function getDependencyTree() {
  try {
    const { stdout } = await exec('npm list --json');
    return JSON.parse(stdout);
  } catch (error) {
    console.error('Error getting dependency tree:', error);
    return null;
  }
}

// Compare two dependency trees to find changes
function findPackageChanges(oldTree, newTree) {
  const oldDeps = oldTree?.dependencies || {};
  const newDeps = newTree?.dependencies || {};
  
  const added = Object.keys(newDeps).filter(pkg => !oldDeps[pkg]);
  const removed = Object.keys(oldDeps).filter(pkg => !newDeps[pkg]);
  
  return { added, removed };
}

async function installPackage(packageName) {
  try {
    // Get initial dependency tree
    const oldTree = await getDependencyTree();

    // Fetch the package manifest
    const manifest = await pacote.manifest('./');
    console.log(manifest);
    console.log(`\nFetching manifest for ${packageName}@${manifest.version}`);

    // Get the package tarball
    const tarball = await pacote.tarball.file(packageName, path.join(__dirname, `${packageName}.tgz`));
    console.log(`Downloaded tarball to ${tarball}`);

    // Extract the package tarball
    await exec(`tar -xzf ${packageName}.tgz -C node_modules`);
    console.log(`Extracted ${packageName} to node_modules`);

    // Update package.json
    const packageJsonPath = path.join(__dirname, 'package.json');
    const packageJson = require(packageJsonPath);
    packageJson.dependencies = packageJson.dependencies || {};
    packageJson.dependencies[packageName] = `^${manifest.version}`;
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

    // Get new dependency tree
    const newTree = await getDependencyTree();
    const changes = findPackageChanges(oldTree, newTree);

    // Update history
    const history = getPackageHistory();
    history.installations.push({
      package: packageName,
      version: manifest.version,
      date: new Date().toISOString()
    });
    history.lastUpdated = new Date().toISOString();
    savePackageHistory(history);

    // Display changes
    console.log('\n=== Package Changes ===');
    console.log('Newly installed packages:', changes.added.join(', '));
    if (changes.removed.length > 0) {
      console.log('Removed packages:', changes.removed.join(', '));
    }

    // Display installation history
    console.log('\n=== Recent Installations ===');
    history.installations.slice(-5).forEach(install => {
      console.log(`- ${install.package}@${install.version} (${new Date(install.date).toLocaleString()})`);
    });

    // Display dependency tree
    console.log('\n=== Current Dependency Tree ===');
    await exec('npm list --depth=2', { stdio: 'inherit' });

    return packageName;
  } catch (error) {
    console.error('Error installing package:', error);
    throw error;
  }
}

async function main() {
  const packagesToInstall = process.argv.slice(2);
  console.log('Packages to install:', packagesToInstall);

  if (packagesToInstall.length === 0) {
    console.log('No packages specified for installation.');
    return;
  }

  const installedPackages = [];

  for (const packageName of packagesToInstall) {
    const installedPackage = await installPackage(packageName);
    installedPackages.push(installedPackage);
  }
}

main();