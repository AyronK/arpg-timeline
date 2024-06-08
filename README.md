# arpg-timeline

[ARPG Timeline Website](https://arpg-timeline.ayronk.com/)

Stay ahead in your favorite ARPGs with the season tracker.
Never miss a season start or end again!

## Features
- Supported games
  - Path of Exile
  - Path of Exile 2
  - Diablo IV
  - Last Epoch
- Timestamps for current and future season start and end dates
- Progress for the current season (how far is it until the end?)
- Adding season start date to your Google Calendar
- RSS channel with season updates
- FAQ
- CMS for managing games and seasons

## Stack
<a href="https://liquidjs.com"><img src="https://liquidjs.com/icon/mstile-310x310.png" width="72" height="72" alt="liquid logo"></a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
<a href="https://developer.mozilla.org/en-US/docs/Web/javascript" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/javascript-colored.svg" width="72" height="72" alt="JavaScript" /></a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
<a href="https://tailwindcss.com/" target="_blank" rel="noreferrer"><img src="https://avatars.githubusercontent.com/u/67109815?s=200&v=4" width="72" height="72" alt="Tailwind" /></a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

## Development

### Dev server

To run the website server:
```npm
npm run start
```

To run the CMS server:
```npm
npm run start
```

### Styles

```npm
npx tailwindcss -m -i ./styles.css -o ./styles.min.css --watch
```

### Build

```npm
npm run generate-html
```

