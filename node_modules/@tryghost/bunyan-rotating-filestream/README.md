# Bunyan Rotating Filestream

## Install

`npm install @tryghost/bunyan-rotating-filestream --save`

or

`yarn add @tryghost/bunyan-rotating-filestream`


## Usage

Create a bunyan logger using the stream:

```js
    var log = bunyan.createLogger({
        name: 'foo',
        streams: [{
            stream: new RotatingFileStream({
                path: '/var/log/foo.log',
                period: '1d',          // daily rotation
                totalFiles: 10,        // keep up to 10 backup copies
                rotateExisting: true,  // Give ourselves a clean file when we start up, based on period
                threshold: '10m',      // Rotate log files larger than 10 megabytes
                totalSize: '20m',      // Don't keep more than 20mb of archived log files
                gzip: true             // Compress the archive log files to save space
            })
        }]
    });
```

Other options include `startNewFile` to always open a new file on start-up.

## Develop

1. `git clone` this repo & `cd` into it as usual
2. Run `yarn` to install top-level dependencies.

## Test

- `yarn lint` run just eslint
- `yarn test` run lint and tests


## Publish

- `yarn ship`

## Credit

Many thanks to @Rcomian for their work on the original bunyan-rotating-file-stream project, this project borrows lots of the code and all of the ideas in the original.

# Copyright & License 

Copyright (c) 2013-2021 Ghost Foundation - Released under the [MIT license](LICENSE).
