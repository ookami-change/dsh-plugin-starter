# dsh-plugin-starter

A minimal installable plugin starter for [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness).

This repository contains the smallest useful bundle shape from the official plugin-development guide:

- `package.json` declares `dsh.bundle`.
- `cordis.patch.yml` mounts the plugin.
- `index.js` exports an empty `apply()` entry point.

## Develop

Add capabilities inside `apply()` in `index.js`.

## Install from GitHub

```bash
dsh plugin --profile demo add github:ookami-change/dsh-plugin-starter
dsh --profile demo --dump-config
dsh --profile demo
```
