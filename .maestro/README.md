# Maestro E2E Testing

## Installation

Install Maestro CLI:

```bash
# macOS/Linux
curl -Ls "https://get.maestro.mobile.dev" | bash

# Windows (PowerShell)
iwr -useb "https://get.maestro.mobile.dev/install.ps1" | iex
```

Add to PATH:
```bash
export PATH="$PATH:$HOME/.maestro/bin"
```

## Running Tests

```bash
# Run all tests
maestro test .maestro

# Run specific test
maestro test .maestro/app-launch.yaml

# Run with Maestro Studio (GUI)
maestro studio
```

## Writing Tests

Tests are written in YAML format. See `.maestro/` directory for examples.

## CI Integration

Maestro tests run automatically on GitHub Actions. See `.github/workflows/ci.yml`
