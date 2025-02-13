# Package Installation Tracker

A Node.js tool to track and manage npm package installations with detailed history tracking and dependency tree visualization.

## Features

- Track package installation history
- Monitor package changes (additions/removals)
- Display dependency trees
- Maintain installation logs
- Show recent installations
- Auto-update package.json

## Prerequisites

- Node.js (>= 14.0.0)
- npm (>= 6.0.0)

## Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd <your-repo-directory>
```

2. Install dependencies:
```bash
npm install
```

3. Create required files:
```bash
touch package-history.json
```

## Configuration

Make sure you have a `package.json` file with the following minimum configuration:

```json
{
  "name": "pacote-experiment",
  "version": "1.0.0",
  "description": "Experimenting with pacote package installation and tracking",
  "main": "index.js",
  "author": "Light13008",
  "dependencies": {
    "pacote": "^17.0.0"
  },
  "scripts": {
    "start": "node index.js",
    "install-pkg": "node index.js"
  }
}
```

## Usage

Install packages using:

```bash
node index.js <package-name>
```

Example:
```bash
node index.js lodash
```

You can install multiple packages at once:
```bash
node index.js express moment chalk
```

## Output Information

The tool provides the following information for each installation:

1. Package Changes
   - Newly installed packages
   - Removed packages (if any)

2. Installation History
   - Last 5 installations with dates
   - Package versions

3. Dependency Tree
   - Complete dependency structure
   - Nested dependencies up to 2 levels

## File Structure

```
.
├── index.js              # Main script
├── package.json          # Project configuration
├── package-history.json  # Installation history
└── node_modules/         # Installed packages
```

## History Tracking

The tool maintains a `package-history.json` file with:
- Installation records
- Package versions
- Installation dates
- Deletion records

## Error Handling

The tool includes error handling for:
- Failed installations
- Missing packages
- Invalid package names
- Dependency tree errors

## Development

To modify the tool:

1. Main functions are in `index.js`:
   - `getPackageHistory()`: Manages installation history
   - `getDependencyTree()`: Gets package dependencies
   - `installPackage()`: Handles package installation
   - `findPackageChanges()`: Tracks package modifications

2. History is stored in `package-history.json`

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT

## Author

Light13008

---

**Note:** This tool uses `pacote` for package management and requires proper npm configuration in your environment.
