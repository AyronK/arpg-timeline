[![Netlify Status](https://api.netlify.com/api/v1/badges/fa2c3ed5-a946-4cc8-9aee-10104c36e385/deploy-status)](https://app.netlify.com/sites/arpg-timeline/deploys)
[![aRPG Timeline Discord](https://img.shields.io/badge/discord-grey.svg?&logo=discord)](https://discord.gg/39mTbjkePg)

# arpg-timeline

[ARPG Timeline Website](https://arpg-timeline.com/)

Stay ahead in your favorite ARPGs with the season tracker.
Never miss a season start or end again!

## Features

- Supported multiple games
- Timestamps for current and future season start and end dates
- Progress for the current season (how long until the end)
- Adding season start date to your Google Calendar
- ~~RSS channel with season updates~~ feature disabled temporarily
- FAQ
- CMS for managing games and seasons

## Stack

<a href="https://www.gatsbyjs.com/"><img src="https://camo.githubusercontent.com/46315a3fc266b1e0535e8e9b00e9cbded7a291b4571d59fc7c4061fe80514bcf/68747470733a2f2f7777772e6761747362796a732e636f6d2f4761747362792d4d6f6e6f6772616d2e737667" width="72" height="72" alt="gatsby logo"></a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
<a href="https://www.typescriptlang.org/" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/typescript-colored.svg" width="72" height="72" alt="TypeScript" /></a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
<a href="https://react.dev/" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/react-colored.svg" width="72" height="72" alt="React" /></a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
<a href="https://tailwindcss.com/" target="_blank" rel="noreferrer"><img src="https://avatars.githubusercontent.com/u/67109815?s=200&v=4" width="72" height="72" alt="Tailwind" /></a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
<a href="https://www.netlify.com/" target="_blank" rel="noreferrer"><img src="https://avatars.githubusercontent.com/u/7892489?s=200&v=4" width="72" height="72" alt="Netlify" /></a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

## Development

### Prerequisites

- Node >= 20
- package manager, preferably npm

### Commands

1. Install packages

```
npm run i
```

2. To launch Gatsby locally run

```npm
npm run develop
```

3. To launch Storybook run

```npm
npm run storybook
```

4. To launch local CMS run

```npm
npx decap-server
```

and set this config in `/static/admin/config.yml`

```yaml
local_backend: true
```

## Contributing

Thank you for considering contributing to the project! I appreciate your time, effort and will to help me build this website!  
Please check out the [Contributing guide](CONTRIBUTING.md) for guidelines about how to proceed.

If you'd like to help maintaining the list with up-to-date information about new seasons without coding, visit [this spreadsheet](https://docs.google.com/spreadsheets/d/18h4sOenvKqpc39YnWpCcuw2n9B6PWx0-wu6JH_VmTnk/edit?usp=sharing) and request editor's access. Let me know on Discord that you'd like to help.

## Tracking

[Simple Analytics](https://dashboard.simpleanalytics.com/arpg-timeline.com)

## License

### aRPG Timeline License

[MIT License](LICENSE.MD)

### Dependencies

Report generated by [license-report](https://github.com/kessler/license-report).  
`license-report --output=markdown --fields=name --fields="licenseType" --fields="author" --fields="link" --fields="installedVersion"`

#### arpg-timeline

| Name                                     | License type | Author                                                        | Link                                                                            | Installed version |
| :--------------------------------------- | :----------- | :------------------------------------------------------------ | :------------------------------------------------------------------------------ | :---------------- |
| @radix-ui/react-checkbox                 | MIT          | n/a                                                           | git+https://github.com/radix-ui/primitives.git                                  | 1.1.2             |
| @radix-ui/react-collapsible              | MIT          | n/a                                                           | git+https://github.com/radix-ui/primitives.git                                  | 1.1.1             |
| @radix-ui/react-dialog                   | MIT          | n/a                                                           | git+https://github.com/radix-ui/primitives.git                                  | 1.1.2             |
| @radix-ui/react-dropdown-menu            | MIT          | n/a                                                           | git+https://github.com/radix-ui/primitives.git                                  | 2.1.2             |
| @radix-ui/react-slot                     | MIT          | n/a                                                           | git+https://github.com/radix-ui/primitives.git                                  | 1.1.0             |
| @radix-ui/react-switch                   | MIT          | n/a                                                           | git+https://github.com/radix-ui/primitives.git                                  | 1.1.1             |
| class-variance-authority                 | Apache-2.0   | Joe Bell (https://joebell.co.uk)                              | git+https://github.com/joe-bell/cva.git                                         | 0.7.0             |
| clsx                                     | MIT          | Luke Edwards luke.edwards05@gmail.com https://lukeed.com      | git+https://github.com/lukeed/clsx.git                                          | 2.1.1             |
| decap-cms-app                            | MIT          | n/a                                                           | git+https://github.com/decaporg/decap-cms.git#main                              | 3.3.3             |
| gatsby                                   | MIT          | Kyle Mathews <mathews.kyle@gmail.com>                         | git+https://github.com/gatsbyjs/gatsby.git                                      | 5.13.7            |
| gatsby-plugin-decap-cms                  | MIT          | Decap <decap@p-m.si>                                          | git+https://github.com/decaporg/gatsby-plugin-decap-cms.git                     | 4.0.4             |
| ics                                      | ISC          | Adam Gibbons <adam@agibbons.com> (http://agibbons.com/)       | git+https://github.com/adamgibbons/ics.git                                      | 3.8.1             |
| lucide-react                             | ISC          | Eric Fennis                                                   | git+https://github.com/lucide-icons/lucide.git                                  | 0.453.0           |
| react                                    | MIT          | n/a                                                           | git+https://github.com/facebook/react.git                                       | 18.3.1            |
| react-dom                                | MIT          | n/a                                                           | git+https://github.com/facebook/react.git                                       | 18.3.1            |
| react-google-charts                      | MIT          | Rakan Nimer                                                   | git+https://github.com/RakanNimer/react-google-charts.git                       | 5.1.0             |
| react-responsive                         | MIT          | Contra <yo@contra.io> (https://contra.io)                     | git://github.com/yocontra/react-responsive.git                                  | 10.0.0            |
| remark                                   | MIT          | Titus Wormer <tituswormer@gmail.com> (https://wooorm.com)     | git+https://github.com/remarkjs/remark.git#main                                 | 15.0.1            |
| remark-html                              | MIT          | Titus Wormer <tituswormer@gmail.com> (https://wooorm.com)     | git+https://github.com/remarkjs/remark-html.git                                 | 16.0.1            |
| vaul                                     | MIT          | Emil Kowalski <e@emilkowal.ski>                               | git+https://github.com/emilkowalski/vaul.git                                    | 1.1.0             |
| @chromatic-com/storybook                 | MIT          | Chromatic <support@chromatic.com>                             | git+https://github.com/chromaui/addon-visual-tests.git                          | 2.0.2             |
| @graphql-eslint/eslint-plugin            | MIT          | Dotan Simha <dotansimha@gmail.com>                            | git+https://github.com/B2o5T/graphql-eslint.git                                 | 3.20.1            |
| @storybook/addon-essentials              | MIT          | n/a                                                           | https://github.com/storybookjs/storybook.git                                    | 8.3.6             |
| @storybook/addon-interactions            | MIT          | n/a                                                           | https://github.com/storybookjs/storybook.git                                    | 8.3.6             |
| @storybook/addon-links                   | MIT          | n/a                                                           | https://github.com/storybookjs/storybook.git                                    | 8.3.6             |
| @storybook/addon-onboarding              | MIT          | n/a                                                           | https://github.com/storybookjs/storybook.git                                    | 8.3.6             |
| @storybook/addon-styling-webpack         | MIT          | Shaun Evening goodeveningshaun@gmail.com                      | git+https://github.com/storybookjs/addon-styling-webpack.git                    | 1.0.0             |
| @storybook/addon-themes                  | MIT          | Shaun Evening                                                 | https://github.com/storybookjs/storybook.git                                    | 8.3.6             |
| @storybook/addon-webpack5-compiler-babel | MIT          | Storybook Bot <storybookbot@gmail.com>                        | git+https://github.com/storybookjs/addon-webpack5-compiler-babel.git            | 3.0.3             |
| @storybook/addon-webpack5-compiler-swc   | MIT          | Storybook Bot <storybookbot@gmail.com>                        | git+https://github.com/storybookjs/addon-webpack5-compiler-swc.git              | 1.0.5             |
| @storybook/blocks                        | MIT          | n/a                                                           | https://github.com/storybookjs/storybook.git                                    | 8.3.6             |
| @storybook/manager-api                   | MIT          | n/a                                                           | https://github.com/storybookjs/storybook.git                                    | 8.3.6             |
| @storybook/react                         | MIT          | n/a                                                           | https://github.com/storybookjs/storybook.git                                    | 8.3.6             |
| @storybook/react-webpack5                | MIT          | n/a                                                           | https://github.com/storybookjs/storybook.git                                    | 8.3.6             |
| @storybook/test                          | MIT          | n/a                                                           | https://github.com/storybookjs/storybook.git                                    | 8.3.6             |
| @storybook/theming                       | MIT          | n/a                                                           | https://github.com/storybookjs/storybook.git                                    | 8.3.6             |
| @types/node                              | MIT          | n/a                                                           | https://github.com/DefinitelyTyped/DefinitelyTyped.git                          | 22.7.8            |
| @types/react                             | MIT          | n/a                                                           | https://github.com/DefinitelyTyped/DefinitelyTyped.git                          | 18.3.11           |
| @types/react-dom                         | MIT          | n/a                                                           | https://github.com/DefinitelyTyped/DefinitelyTyped.git                          | 18.3.1            |
| @typescript-eslint/eslint-plugin         | MIT          | n/a                                                           | git+https://github.com/typescript-eslint/typescript-eslint.git                  | 7.18.0            |
| @typescript-eslint/parser                | BSD-2-Clause | n/a                                                           | git+https://github.com/typescript-eslint/typescript-eslint.git                  | 7.18.0            |
| autoprefixer                             | MIT          | Andrey Sitnik <andrey@sitnik.ru>                              | git+https://github.com/postcss/autoprefixer.git                                 | 10.4.20           |
| css-loader                               | MIT          | Tobias Koppers @sokra                                         | git+https://github.com/webpack-contrib/css-loader.git                           | 7.1.2             |
| eslint                                   | MIT          | Nicholas C. Zakas <nicholas+npm@nczconsulting.com>            | git+https://github.com/eslint/eslint.git                                        | 8.57.1            |
| eslint-plugin-no-relative-import-paths   | ISC          | Melvin Vermeer <melvin.vermeer@gmail.com>                     | git+https://github.com/MelvinVermeer/eslint-plugin-no-relative-import-paths.git | v1.5.5            |
| eslint-plugin-react                      | MIT          | Yannick Croissant <yannick.croissant+npm@gmail.com>           | git+https://github.com/jsx-eslint/eslint-plugin-react.git                       | 7.37.1            |
| eslint-plugin-storybook                  | MIT          | yannbf@gmail.com                                              | git+https://github.com/storybookjs/eslint-plugin-storybook.git                  | 0.8.0             |
| gatsby-adapter-netlify                   | MIT          | pieh                                                          | git+https://github.com/gatsbyjs/gatsby.git                                      | 1.1.7             |
| gatsby-plugin-alias-imports              | MIT          | Rowan Freeman <r@rowanfreeman.id.au>                          | git+https://github.com/rowanfreeman/gatsby-plugin-alias-imports.git             | 1.0.5             |
| gatsby-plugin-image                      | MIT          | Matt Kane <matt@gatsbyjs.com>                                 | git+https://github.com/gatsbyjs/gatsby.git                                      | 3.13.1            |
| gatsby-plugin-manifest                   | MIT          | Kyle Mathews <mathews.kyle@gmail.com>                         | git+https://github.com/gatsbyjs/gatsby.git                                      | 5.13.1            |
| gatsby-plugin-postcss                    | MIT          | Marat Dreizin <marat.dreizin@gmail.com>                       | git+https://github.com/gatsbyjs/gatsby.git                                      | 6.13.1            |
| gatsby-plugin-robots-txt                 | MIT          | Marat Dreizin <marat.dreizin@gmail.com>                       | git+https://github.com/mdreizin/gatsby-plugin-robots-txt.git                    | 1.8.0             |
| gatsby-plugin-sharp                      | MIT          | Kyle Mathews <mathews.kyle@gmail.com>                         | git+https://github.com/gatsbyjs/gatsby.git                                      | 5.13.1            |
| gatsby-plugin-simple-analytics           | MIT          | Adriaan van Rossum <support@mail.simpleanalytics.io>          | git+https://github.com/simpleanalytics/gatsby-plugin.git                        | 1.0.4             |
| gatsby-plugin-sitemap                    | MIT          | n/a                                                           | git+https://github.com/gatsbyjs/gatsby.git                                      | 6.13.1            |
| gatsby-remark-copy-linked-files          | MIT          | Kyle Mathews <mathews.kyle@gmail.com>                         | git+https://github.com/gatsbyjs/gatsby.git                                      | 6.13.2            |
| gatsby-remark-images                     | MIT          | Kyle Mathews <mathews.kyle@gmail.com>                         | git+https://github.com/gatsbyjs/gatsby.git                                      | 7.13.2            |
| gatsby-remark-relative-images            | 0BSD         | Daniel Mahon <daniel@mahonstudios.com>                        | git+https://github.com/danielmahon/gatsby-remark-relative-images.git            | 2.0.5             |
| gatsby-source-filesystem                 | MIT          | Kyle Mathews <mathews.kyle@gmail.com>                         | git+https://github.com/gatsbyjs/gatsby.git                                      | 5.13.1            |
| gatsby-transformer-remark                | MIT          | Kyle Mathews <mathews.kyle@gmail.com>                         | git+https://github.com/gatsbyjs/gatsby.git                                      | 6.13.1            |
| gatsby-transformer-sharp                 | MIT          | Kyle Mathews <mathews.kyle@gmail.com>                         | git+https://github.com/gatsbyjs/gatsby.git                                      | 5.13.1            |
| globals                                  | MIT          | Sindre Sorhus sindresorhus@gmail.com https://sindresorhus.com | git+https://github.com/sindresorhus/globals.git                                 | 15.11.0           |
| husky                                    | MIT          | typicode                                                      | git+https://github.com/typicode/husky.git                                       | 9.1.6             |
| lint-staged                              | MIT          | Andrey Okonetchnikov <andrey@okonet.ru>                       | git+https://github.com/lint-staged/lint-staged.git                              | 15.2.10           |
| netlify-plugin-discord                   | MIT          | Kelly Mears <hello@kellymears.me>                             | git+https://github.com/kellymears/netlify-plugin-discord.git                    | 0.0.2             |
| postcss                                  | MIT          | Andrey Sitnik <andrey@sitnik.ru>                              | git+https://github.com/postcss/postcss.git                                      | 8.4.47            |
| postcss-loader                           | MIT          | Andrey Sitnik <andrey@sitnik.ru>                              | git+https://github.com/webpack-contrib/postcss-loader.git                       | 8.1.1             |
| prettier                                 | MIT          | James Long                                                    | git+https://github.com/prettier/prettier.git                                    | 3.3.3             |
| prettier-plugin-tailwindcss              | MIT          | n/a                                                           | git+https://github.com/tailwindlabs/prettier-plugin-tailwindcss.git             | 0.6.8             |
| storybook                                | MIT          | Storybook Team                                                | https://github.com/storybookjs/storybook.git                                    | 8.3.6             |
| style-loader                             | MIT          | Tobias Koppers @sokra                                         | git+https://github.com/webpack-contrib/style-loader.git                         | 4.0.0             |
| tailwind-merge                           | MIT          | Dany Castillo                                                 | git+https://github.com/dcastil/tailwind-merge.git                               | 2.5.4             |
| tailwindcss                              | MIT          | n/a                                                           | git+https://github.com/tailwindlabs/tailwindcss.git                             | 3.4.14            |
| tailwindcss-animate                      | MIT          | Jamie Kyle <me@thejameskyle.com>                              | https://registry.npmjs.org/tailwindcss-animate/-/tailwindcss-animate-1.0.7.tgz  | 1.0.7             |
| typescript                               | Apache-2.0   | Microsoft Corp.                                               | git+https://github.com/microsoft/TypeScript.git                                 | 5.6.3             |
| typescript-eslint                        | MIT          | n/a                                                           | git+https://github.com/typescript-eslint/typescript-eslint.git                  | 7.18.0            |
| ws                                       | MIT          | Einar Otto Stangvik <einaros@gmail.com> (http://2x.io)        | git+https://github.com/websockets/ws.git                                        | 8.18.0            |

#### arpg-timeline-crawler

| Name               | License type | Author                                                    | Link                                                           | Installed version |
| :----------------- | :----------- | :-------------------------------------------------------- | :------------------------------------------------------------- | :---------------- |
| he                 | MIT          | Mathias Bynens https://mathiasbynens.be/                  | git+https://github.com/mathiasbynens/he.git                    | 1.2.0             |
| openai             | n/a          | n/a                                                       | https://github.com/openai/openai-node.git                      | n/a               |
| tsc-alias          | n/a          | n/a                                                       | git+https://github.com/justkey007/tsc-alias.git                | n/a               |
| @types/he          | n/a          | n/a                                                       | https://github.com/DefinitelyTyped/DefinitelyTyped.git         | n/a               |
| @types/node        | n/a          | n/a                                                       | https://github.com/DefinitelyTyped/DefinitelyTyped.git         | n/a               |
| fast-xml-parser    | n/a          | n/a                                                       | git+https://github.com/NaturalIntelligence/fast-xml-parser.git | n/a               |
| node-fetch         | n/a          | n/a                                                       | git+https://github.com/node-fetch/node-fetch.git               | n/a               |
| remark-frontmatter | n/a          | n/a                                                       | git+https://github.com/remarkjs/remark-frontmatter.git         | n/a               |
| remark-parse       | n/a          | n/a                                                       | git+https://github.com/remarkjs/remark.git#main                | n/a               |
| remark-stringify   | n/a          | n/a                                                       | git+https://github.com/remarkjs/remark.git#main                | n/a               |
| to-vfile           | n/a          | n/a                                                       | git+https://github.com/vfile/to-vfile.git                      | n/a               |
| typescript         | Apache-2.0   | Microsoft Corp.                                           | git+https://github.com/microsoft/TypeScript.git                | 5.6.3             |
| unified            | MIT          | Titus Wormer <tituswormer@gmail.com> (https://wooorm.com) | git+https://github.com/unifiedjs/unified.git                   | 11.0.5            |
| vfile-matter       | n/a          | n/a                                                       | git+https://github.com/vfile/vfile-matter.git                  | n/a               |

### Explicit license mentions

#### shadcn

MIT License

Copyright (c) 2023 shadcn

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
