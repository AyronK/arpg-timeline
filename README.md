[![aRPG Timeline Discord](https://img.shields.io/badge/discord-grey.svg?&logo=discord)](https://discord.gg/39mTbjkePg)

# aRPG Timeline

[aRPG Timeline Website](https://www.arpg-timeline.com/)

Stay ahead in your favorite ARPGs with the season tracker.
Never miss a season start or end again!

## 🧑‍💻 Become a Code Contributor
Want to help shape the future of arpg‑timeline?  
Whether you're a skilled developer or just starting out, your code contributions are welcome — and appreciated.

This project exists to serve the aRPG community, and it gets better every time someone like you helps improve it.

### Why Contribute?
- 🎮 Support the aRPG community by keeping widgets accurate and up-to-date
- 🧠 Learn and grow by contributing to a real-world project using Next.js, React, TypeScript, Tailwind, and modern tooling
- 🚀 Make an impact — even small fixes or improvements help thousands of users
- 🤝 Collaborate with others who share your interest in action RPGs

### How to Get Involved

1. Fork the repository and create a feature branch.
2. Set up the project locally — check the README for setup instructions or join Discord for help.
3. Make your changes following existing patterns and clean code practices.
4. Open a pull request with a clear summary of what you've added or improved.

### What Can You Work On?

- Fix bugs or improve performance
- Refactor UI components or enhance mobile support
- Improve date handling or add timezone features
- Suggest and implement new features
- Pick up something from the growing backlog! Most of the issues are drafts in refinement, so do not hesistate to ask on Discord!

## Features

- Support for multiple games in a single dashboard
- Display timestamps for current and upcoming season start and end dates
- Live countdowns for upcoming seasons
- Countdown timers for upcoming developer announcement streams
- Twitch button that activates when a game or stream goes live
- Customizable filters to adjust the dashboard to your preferences
- Visual progress indicators showing how far along the current season is
- Ability to add events directly to your preferred calendar apps
- Content management powered by Sanity CMS for easy updates of games and seasons
- Automated crawler for game notifications

## Stack

<table>
  <tr>
    <td align="center">
      <a href="https://nextjs.org/">
        <img src="https://camo.githubusercontent.com/c3635f27439ecdbf20e3cbf969c156f4040f10a0c8c836cf307d916dd8f806d4/68747470733a2f2f6173736574732e76657263656c2e636f6d2f696d6167652f75706c6f61642f76313636323133303535392f6e6578746a732f49636f6e5f6461726b5f6261636b67726f756e642e706e67" width="72" heigth="72" alt="Next.js" /><br />Next.js
      </a>
    </td>
    <td align="center">
      <a href="https://www.typescriptlang.org/">
        <img src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/typescript-colored.svg" width="72" heigth="72" alt="TypeScript" /><br />TypeScript
      </a>
    </td>
    <td align="center">
      <a href="https://react.dev/">
        <img src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/react-colored.svg" width="72" heigth="72" alt="React" /><br />React
      </a>
    </td>
    <td align="center">
      <a href="https://tailwindcss.com/">
        <img src="https://avatars.githubusercontent.com/u/67109815?s=200&v=4" width="72" heigth="72" alt="Tailwind CSS" /><br />Tailwind CSS
      </a>
    </td>
    <td align="center">
      <a href="https://vercel.com/">
        <img src="https://avatars.githubusercontent.com/u/14985020?s=200&v=4" width="72" heigth="72" alt="Vercel" /><br />Vercel
      </a>
    </td>
    <td align="center">
      <a href="https://www.sanity.io/">
        <img src="https://avatars.githubusercontent.com/u/17177659?s=200&v=4" width="72" heigth="72" alt="Sanity" /><br />Sanity
      </a>
    </td>
  </tr>
</table>

## Development

### Prerequisites

- Node >= 22
- npm
- contact maintainers for Sanity credentials or mock the response

### Setup your environment

1. Navigate to the `arpg-timeline` project directory.
2. Create a `.env` file in the root of the project with the following variables:

```
DISCORD_URL=...
GITHUB_URL=...
GITHUB_REPO=...
BUY_ME_A_COFFEE_URL=...
SITE_URL=...
GOOGLE_SITE_VERIFICATION=...
CONTACT_EMAIL=...
NEXT_PUBLIC_SANITY_PROJECT_ID=...
NEXT_PUBLIC_SANITY_DATASET=...
SANITY_STUDIO_READ_TOKEN=...
SANITY_HOOK_SECRET=...
```

3. Run `npm i`
4. Run `npm run dev`
5. Go to http://localhost:3000

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

| Name                             | License type | Author                                                  | Link                                                                           | Installed version |
| :------------------------------- | :----------- | :------------------------------------------------------ | :----------------------------------------------------------------------------- | :---------------- |
| @radix-ui/react-checkbox         | MIT          | n/a                                                     | git+https://github.com/radix-ui/primitives.git                                 | 1.3.2             |
| @radix-ui/react-collapsible      | MIT          | n/a                                                     | git+https://github.com/radix-ui/primitives.git                                 | 1.1.11            |
| @radix-ui/react-dialog           | MIT          | n/a                                                     | git+https://github.com/radix-ui/primitives.git                                 | 1.1.14            |
| @radix-ui/react-dropdown-menu    | MIT          | n/a                                                     | git+https://github.com/radix-ui/primitives.git                                 | 2.1.15            |
| @radix-ui/react-slot             | MIT          | n/a                                                     | git+https://github.com/radix-ui/primitives.git                                 | 1.2.3             |
| @radix-ui/react-switch           | MIT          | n/a                                                     | git+https://github.com/radix-ui/primitives.git                                 | 1.2.5             |
| @radix-ui/react-toast            | MIT          | n/a                                                     | git+https://github.com/radix-ui/primitives.git                                 | 1.2.14            |
| @react-hooks-library/core        | MIT          | Arpit<https://github.com/heyitsarpit>                   | https://registry.npmjs.org/                                                    | 0.6.2             |
| @sanity/image-url                | MIT          | Sanity.io <hello@sanity.io>                             | git+https://github.com/sanity-io/image-url.git                                 | 1.1.0             |
| @vercel/speed-insights           | Apache-2.0   | n/a                                                     | git+https://github.com/vercel/speed-insights.git                               | 1.2.0             |
| class-variance-authority         | Apache-2.0   | Joe Bell (https://joebell.co.uk)                        | git+https://github.com/joe-bell/cva.git                                        | 0.7.1             |
| embla-carousel-autoplay          | MIT          | David Jerleke                                           | git+https://github.com/davidjerleke/embla-carousel                             | 8.6.0             |
| embla-carousel-react             | MIT          | David Jerleke                                           | git+https://github.com/davidjerleke/embla-carousel                             | 8.6.0             |
| ics                              | ISC          | Adam Gibbons <adam@agibbons.com> (http://agibbons.com/) | git+https://github.com/adamgibbons/ics.git                                     | 3.8.1             |
| lucide-react                     | ISC          | Eric Fennis                                             | git+https://github.com/lucide-icons/lucide.git                                 | 0.513.0           |
| next                             | MIT          | n/a                                                     | git+https://github.com/vercel/next.js.git                                      | 15.4.0-canary.71  |
| next-sanity                      | MIT          | Sanity.io <hello@sanity.io>                             | git+ssh://git@github.com/sanity-io/next-sanity.git                             | 9.12.0            |
| react                            | MIT          | n/a                                                     | git+https://github.com/facebook/react.git                                      | 19.1.0            |
| react-dom                        | MIT          | n/a                                                     | git+https://github.com/facebook/react.git                                      | 19.1.0            |
| react-google-charts              | MIT          | Rakan Nimer                                             | git+https://github.com/RakanNimer/react-google-charts.git                      | 5.2.1             |
| react-is                         | MIT          | n/a                                                     | git+https://github.com/facebook/react.git                                      | 19.1.0            |
| react-responsive                 | MIT          | Contra <yo@contra.io> (https://contra.io)               | git://github.com/yocontra/react-responsive.git                                 | 10.0.1            |
| styled-components                | MIT          | Glen Maddern                                            | git+https://github.com/styled-components/styled-components.git                 | 6.1.18            |
| tailwind-merge                   | MIT          | Dany Castillo                                           | git+https://github.com/dcastil/tailwind-merge.git                              | 3.3.0             |
| tailwind-scrollbar               | MIT          | Graham Still <graham@gstill.dev>                        | git+https://github.com/adoxography/tailwind-scrollbar.git                      | 4.0.2             |
| tailwindcss-animate              | MIT          | Jamie Kyle <me@thejameskyle.com>                        | https://registry.npmjs.org/tailwindcss-animate/-/tailwindcss-animate-1.0.7.tgz | 1.0.7             |
| vaul                             | MIT          | Emil Kowalski <e@emilkowal.ski>                         | git+https://github.com/emilkowalski/vaul.git                                   | 1.1.2             |
| @eslint/eslintrc                 | MIT          | Nicholas C. Zakas                                       | git+https://github.com/eslint/eslintrc.git                                     | 3.3.1             |
| @eslint/js                       | MIT          | n/a                                                     | git+https://github.com/eslint/eslint.git                                       | 9.28.0            |
| @tailwindcss/postcss             | MIT          | n/a                                                     | git+https://github.com/tailwindlabs/tailwindcss.git                            | 4.1.8             |
| @types/node                      | MIT          | n/a                                                     | https://github.com/DefinitelyTyped/DefinitelyTyped.git                         | 22.15.29          |
| @types/react                     | MIT          | n/a                                                     | https://github.com/DefinitelyTyped/DefinitelyTyped.git                         | 19.1.6            |
| @types/react-dom                 | MIT          | n/a                                                     | https://github.com/DefinitelyTyped/DefinitelyTyped.git                         | 19.1.6            |
| eslint                           | MIT          | Nicholas C. Zakas <nicholas+npm@nczconsulting.com>      | git+https://github.com/eslint/eslint.git                                       | 9.28.0            |
| eslint-config-next               | MIT          | n/a                                                     | git+https://github.com/vercel/next.js.git                                      | 15.4.0-canary.71  |
| eslint-plugin-jsx-a11y           | MIT          | Ethan Cohen                                             | git+https://github.com/jsx-eslint/eslint-plugin-jsx-a11y.git                   | 6.10.2            |
| eslint-plugin-react              | MIT          | Yannick Croissant <yannick.croissant+npm@gmail.com>     | git+https://github.com/jsx-eslint/eslint-plugin-react.git                      | 7.37.5            |
| eslint-plugin-simple-import-sort | MIT          | Simon Lydell                                            | git+https://github.com/lydell/eslint-plugin-simple-import-sort.git             | 12.1.1            |
| prettier                         | MIT          | James Long                                              | git+https://github.com/prettier/prettier.git                                   | 3.5.3             |
| prettier-plugin-tailwindcss      | MIT          | n/a                                                     | git+https://github.com/tailwindlabs/prettier-plugin-tailwindcss.git            | 0.6.12            |
| tailwindcss                      | MIT          | n/a                                                     | git+https://github.com/tailwindlabs/tailwindcss.git                            | 4.1.8             |
| typescript                       | Apache-2.0   | Microsoft Corp.                                         | git+https://github.com/microsoft/TypeScript.git                                | 5.8.3             |
| typescript-eslint                | MIT          | n/a                                                     | git+https://github.com/typescript-eslint/typescript-eslint.git                 | 8.33.1            |

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

#### studio-arpg-timeline

| Name                         | License type | Author                                             | Link                                                           | Installed version |
| :--------------------------- | :----------- | :------------------------------------------------- | :------------------------------------------------------------- | :---------------- |
| @sanity/vision               | MIT          | Sanity.io <hello@sanity.io>                        | git+https://github.com/sanity-io/sanity.git                    | 3.91.0            |
| luxon                        | MIT          | Isaac Cambron                                      | git+https://github.com/moment/luxon.git                        | 3.6.1             |
| react                        | MIT          | n/a                                                | git+https://github.com/facebook/react.git                      | 19.1.0            |
| react-dom                    | MIT          | n/a                                                | git+https://github.com/facebook/react.git                      | 19.1.0            |
| react-icons                  | MIT          | Goran Gajic                                        | git+ssh://git@github.com/react-icons/react-icons.git           | 5.5.0             |
| sanity                       | MIT          | Sanity.io <hello@sanity.io>                        | git+https://github.com/sanity-io/sanity.git                    | 3.91.0            |
| styled-components            | MIT          | Glen Maddern                                       | git+https://github.com/styled-components/styled-components.git | 6.1.18            |
| @sanity/eslint-config-studio | MIT          | Sanity.io <hello@sanity.io>                        | git+https://github.com/sanity-io/eslint-config-studio.git      | 5.0.2             |
| @types/react                 | MIT          | n/a                                                | https://github.com/DefinitelyTyped/DefinitelyTyped.git         | 19.1.6            |
| eslint                       | MIT          | Nicholas C. Zakas <nicholas+npm@nczconsulting.com> | git+https://github.com/eslint/eslint.git                       | 9.28.0            |
| prettier                     | MIT          | James Long                                         | git+https://github.com/prettier/prettier.git                   | 3.5.3             |
| typescript                   | Apache-2.0   | Microsoft Corp.                                    | git+https://github.com/microsoft/TypeScript.git                | 5.8.3             |

### Explicit license mentions

#### shadcn

MIT License

Copyright (c) 2023 shadcn

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
