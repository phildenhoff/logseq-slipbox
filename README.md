# Logseq Plugin template for Svelte

A template for Logseq plugins using Svelte, Vitest, Playwright, and pnpm.

## Getting set up

Install pnpm, then you can either hit "Use this template" above or use degit:

```
npx degit phildenhoff/logseq-plugin-template my-ls-plugin
cd my-ls-plugin
git init
```

Then,

```
pnpm install
```

## Templates for other frameworks

**React**: [pengx17/logseq-plugin-template-react](https://github.com/pengx17/logseq-plugin-template-react)

## Technical choices

### Why Svelte?

It's a good framework! Feel free to adapt this for any other framework, in case you'd like to set up an Angular or Vue.js template.

### Why use Vitest?

Vitest is faster than Jest, and a better fit for unit tests than Playwright.

### Why include Playwright?

It allows for component/integration-level tests in your plugin. 

If you don't want to use it, you can remove this line:

https://github.com/phildenhoff/logseq-plugin-template-svelte/blob/af03895844a181025acac788686b0a72e92cbe12/package.json#L16

as well as the [Playright config file](playwright.config.ts), the [e2e folder](e2e), the [playwright workflow file in `.github/actions`](.github/workflows/playwright.yml), and finally the `@playwright/test` dev dependency in the Package.json:

https://github.com/phildenhoff/logseq-plugin-template-svelte/blob/af03895844a181025acac788686b0a72e92cbe12/package.json#L23

### Why pnpm instead of X?

When I created this, `pnpm` was faster than `npm` and `yarn`.
`bun`, my first choice, wasn't stable.
That doesn't mean you have to use it!
You are more than welcome to use another package manager instead, but you _may_ end up with different packages than what PNPM would install for you.

So be warned, things may not work if you don't use PNPM!
