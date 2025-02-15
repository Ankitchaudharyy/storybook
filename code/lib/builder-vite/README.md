# Storybook builder for Vite <!-- omit in toc -->

Build your stories with [vite](https://vitejs.dev/) for fast startup times and near-instant HMR.

# Table of Contents <!-- omit in toc -->

- [Installation](#installation)
- [Usage](#usage)
  - [Getting started with Vite and Storybook (on a new project)](#getting-started-with-vite-and-storybook-on-a-new-project)
  - [Migration from webpack / CRA](#migration-from-webpack--cra)
  - [Customize Vite config](#customize-vite-config)
  - [Svelte Options](#svelte-options)
  - [TypeScript](#typescript)
  - [React Docgen](#react-docgen)
  - [Note about working directory](#note-about-working-directory)
- [Known issues](#known-issues)
- [Contributing](#contributing)

## Installation

Requirements:

- Vite 3.0 or newer (4.X recommended)

When installing Storybook, use the `--builder=vite` flag if you do not have a `vite.config` file at your project root (if you do, the vite builder is chosen automatically).

## Usage

The builder supports both development mode in Storybook and building a static production version.

Your `vite.config` file will be used by Storybook. If you need to customize the vite config for Storybook, you have two choices:

1. Set values in your `vite.config` conditionally, based on an environment variable, for example.
2. Add a `viteFinal` config to your `.storybook/main.js` file. See [Customize Vite config](#customize-vite-config) for details.

### Getting started with Vite and Storybook (on a new project)

See https://vitejs.dev/guide/#scaffolding-your-first-vite-project,

```
npm create vite@latest # follow the prompts
npx sb@next init --builder vite && npm run storybook
```

### Migration from webpack / CRA

1. Install `vite` and `@storybook/builder-vite`
2. Remove any explicit project dependencies on `webpack`, `react-scripts`, and any other webpack plugins or loaders.
3. If you were previously using `@storybook/manager-webpack5`, you can remove it. Also remove `@storybook/builder-webpack5` or `@storybook/builder-webpack4` if they are installed.
4. Choose a vite-based Storybook "framework" to set in the `framework` option of your `.storybook/main.js` file.
5. Remove storybook webpack cache (`rm -rf node_modules/.cache`)
6. Update your `/public/index.html` file for vite (be sure there are no `%PUBLIC_URL%` inside it, which is a CRA variable)
7. Be sure that any files containing JSX syntax use a `.jsx` or `.tsx` file extension, which [vite requires](https://vitejs.dev/guide/features.html#jsx). This includes `.storybook/preview.jsx` if it contains JSX syntax.
8. If you are using `@storybook/addon-interactions`, for now you'll need to add a [workaround](https://github.com/storybookjs/storybook/issues/18399) for jest-mock relying on the node `global` variable by creating a `.storybook/preview-head.html` file containing the following:

```html
<script>
  window.global = window;
</script>
```

9.  Start up your storybook using the same `yarn storybook` or `npm run storybook` commands you are used to.

For other details about the differences between vite and webpack projects, be sure to read through the [vite documentation](https://vitejs.dev/).

### Customize Vite config

The builder _will_ read your `vite.config.js` file, though it may change some of the options in order to work correctly.
It looks for the Vite config in the CWD. If your config is located elsewhere, specify the path using the `viteConfigPath` builder option:

```javascript
// .storybook/main.mjs

const config = {
  framework: {
    name: '@storybook/react-vite', // Your framework name here.
    options: {
      builder: {
        viteConfigPath: '.storybook/customViteConfig.js',
      },
    },
  },
};

export default config;
```

You can also override the merged Vite config:

```javascript
// use `mergeConfig` to recursively merge Vite options
import { mergeConfig } from 'vite';

const config = {
  async viteFinal(config, { configType }) {
    // Be sure to return the customized config
    return mergeConfig(config, {
      // Customize the Vite config for Storybook
      resolve: {
        alias: { foo: 'bar' },
      },
    });
  },
};

export default config;
```

The `viteFinal` function will give you `config` which is the combination of your project's vite config and the builder's own Vite config.
You can tweak this as you want, for example to set up aliases, add new plugins etc.

The `configType` variable will be either `"DEVELOPMENT"` or `"PRODUCTION"`.

The function should return the updated Vite configuration.

### Svelte Options

When using this builder with Svelte, your `svelte.config.js` file will be used automatically.

### TypeScript

Configure your `.storybook/main.ts` to use TypeScript:

```typescript
import type { StorybookConfig } from '@storybook/react-vite'; // (or whatever framework you are using)

const config: StorybookConfig = {
  // other storybook options...,
  async viteFinal(config, options) {
    // modify and return config
  },
};

export default config;
```

Or alternatively, you can use named exports:

```typescript
import type { ViteFinal } from '@storybook/builder-vite';

export const viteFinal: ViteFinal = async (config, options) => {
  // modify and return config
};
```

See [Customize Vite config](#customize-vite-config) for details about using `viteFinal`.

### React Docgen

Docgen is used in Storybook to populate the props table in docs view, the controls panel, and for several other addons. Docgen is supported in Svelte, Vue, and React, and there are two docgen options when using react, `react-docgen` and `react-docgen-typescript`. You can learn more about the pros/cons of each in [this gist](https://gist.github.com/shilman/036313ffa3af52ca986b375d90ea46b0). By default, if we find a `typescript` dependency in your `package.json` file, we will assume you're using typescript and will choose `react-docgen-typescript`. You can change this by setting the `typescript.reactDocgen` option in your `.storybook/main.js` file:

```javascript
module.exports = {
  typescript: {
    reactDocgen: 'react-docgen`
  }
}
```

If you're using TypeScript, we encourage you to experiment and see which option works better for your project.

### Note about working directory

The builder will by default enable Vite's [server.fs.strict](https://vitejs.dev/config/#server-fs-strict)
option, for increased security. The default project `root` is set to the parent directory of the
storybook configuration directory. This can be overridden in viteFinal.

## Known issues

- HMR: saving a story file does not hot-module-reload, a full reload happens instead. HMR works correctly when saving component files.

## Contributing

The Vite builder cannot build itself.
Are you willing to contribute? We are especially looking for Vue and Svelte experts, as the current maintainers are react users.

Have a look at the GitHub issues with the `vite` label for known bugs. If you find any new bugs,
feel free to create an issue or send a pull request!

Please read the [How to contribute](/CONTRIBUTING.md) guide.
