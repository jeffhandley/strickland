# Strickland.NuGet

This project creates a NuGet package that contains the built JavaScript files from the Strickland npm package.

## What's Included

The NuGet package includes:
- All transpiled JavaScript files from the `strickland/lib/` directory
- The npm package.json file
- README.md and CHANGELOG.md documentation

## Building

To build the NuGet package:

1. First ensure the npm package is built:
   ```bash
   cd ../strickland
   npm install
   npx babel src -d lib
   ```

2. Then build the NuGet package:
   ```bash
   dotnet pack --configuration Release
   ```

The resulting NuGet package will be created in `bin/Release/Strickland.{version}.nupkg`.

## Usage

This NuGet package is intended for .NET projects that need to include the Strickland JavaScript validation framework as content files.