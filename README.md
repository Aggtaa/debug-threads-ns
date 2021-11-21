 ![NPM](https://img.shields.io/npm/l/debug-threads-ns) [![Build Status](https://scrutinizer-ci.com/g/Aggtaa/debug-threads-ns/badges/build.png?b=master)](https://scrutinizer-ci.com/g/Aggtaa/debug-threads-ns/build-status/master) [![npm version](https://badge.fury.io/js/debug-threads-ns.svg)](https://badge.fury.io/js/debug-threads-ns) ![npm](https://img.shields.io/npm/dm/debug-threads-ns)
 # `debug-threads-ns`
This module is located at https://github.com/Aggtaa/debug-threads-ns. Any other location is either a fork or a copy.

## Overview
This module is a simple helper for debug namespaces, especially useful for `typescript` projects. 

You can provide static namespace structure or embed [`thread-context`](https://www.npmjs.com/package/thread-context) dynamic namespace identifying current "thread".

## Usage
Its this simple:
```typescript
import { debug, setup, ExtendedDebugger, threadContext } from "debug-thread-ns";
import express from 'express';

setup('myAppName');

export interface Debugger extends ExtendedDebugger {
    db: ExtendedDebugger;
    web: ExtendedDebugger & {
        thread: ExtendedDebugger;
    };
}

debug.warn('Process started');
// renders line "myappaname Process started"

const app = new express.Express();
debug.web.info('Express app created');
// renders line "myappaname:web Express app created"
app.use((req, res, next) => {
    threadContext.init();
    debug.web.thread.debug(req.method + ' ' + req.originalPath);
    // renders line "myappaname:web:$h4JJd20L GET /"
});

```