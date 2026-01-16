<p align="center">
  <a href="https://gscan.ghost.org/">
    <img src="https://raw.githubusercontent.com/TryGhost/gscan/main/app/public/logo-gscan-black.png" width="216px" alt="Ghost" />
  </a>
</p>

GScan is a tool for validating Ghost themes. It produces detailed reports of issues where themes need to be modified in order to be compatible with a specific version.

It is actively capable of dealing with the current and last major versions of Ghost (v1-v6).

GScan works on a system of rules. Each rule has a way to check whether it passes or fails and has help content which describes how to fix it. Each rule is also marked with an error level:

- Errors: issues that will cause your theme to not work properly. These must be fixed.
- Warnings: these are usually related to deprecated features. These should be fixed.
- Recommendations: these are advisories about best practice. Fixing these will improve your theme.
- Features: detected features which may impact on compatibility. Nothing to do!

In addition, an **error** can be marked as **fatal**. A **fatal error** means, left unchecked a Ghost publication would throw 500 errors on certain pages because of the detected out-of-date or erroneous code.

## Usage

There are 4 ways to use gscan to validate your theme:

### 1. Inside Ghost

Gscan is pre-installed in Ghost. If there are theme errors, Ghost will show them on boot in the console logs and in the UI (Ghost Admin).

### 2. Web usage

Visit https://gscan.ghost.org and upload your zip to our online version of Gscan.

### 3. CLI usage

Install using yarn / npm:

`yarn global add gscan` /  `npm install -g gscan`

To run a local directory through the checks:

`gscan /path/to/theme/directory`

To run a local zip file through the checks:

`gscan /path/to/theme.zip -z`

By default, GScan scans themes for the latest Ghost version compatibility. You can also specify a Ghost version by using the following parameters (for Ghost 1.0, 2.0, 3.0, 4.0, 5.0 and 6.0):

`--v1` or `-1`
`--v2` or `-2`
`--v3` or `-3`
`--v4` or `-4`
`--v5` or `-5`
`--v6` or `-6` (default) or `--canary`

Examples:

`gscan /path/to/theme.zip -z -1` - scan a theme in a zip file for Ghost 1.0 compatibility
`gscan /path/to/theme/directory --v2` - can a theme in a directory for Ghost 2.0 compatibility
`gscan /path/to/theme/directory` - scan a theme for Ghost 6.0 compatibility

### 4. Lib usage

Install using yarn/npm and then:

```js
var gscan = require('gscan');

gscan.checkZip({
    path: 'path-to-zip',
    // Pass in a folder to check
    // if you need to check the theme for a different
    // major Ghost version, you can pass it. Currently
    // v1, v2, v3, v4, v5 and v6 are supported. Default is
    // the latest Ghost version 6.0:
    // checkVersion: 'v6',
    name: 'my-theme'
}).then(function (result) {
    console.log(result);
}).catch(function(err) {
    console.log(err);
});
```

## Development

### Run in browser (for zip uploads)

- Either dev mode: `yarn dev`
- Or standard server: `yarn start`
- View: http://localhost:2369

### Run on command line

- zip file: `./bin/cli.js -z /path/to/your/theme.zip`
- directory: `./bin/cli.js /path/to/directory`

### Publish

(Core team only)

- `yarn ship`

### Tools
When developing new rules or testing gscan following tools are great to have in the toolbelt:
- [astexplorer](https://astexplorer.net) - absolutely awesome Handlebars AST fiddler, helpful when testing out new ideas and exploring what's possible through AST parser;

## To Do

- Support for running the checks against a GitHub repository
- Many, many more checks
- Detailed advice for each check/result
- Compatibility report
- Feature listing

# Copyright & License

Copyright (c) 2013-2025 Ghost Foundation - Released under the [MIT license](LICENSE). Ghost and the Ghost Logo are trademarks of Ghost Foundation Ltd. Please see our [trademark policy](https://ghost.org/trademark/) for info on acceptable usage.
