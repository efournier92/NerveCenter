# ![NerveCenter](https://github.com/efournier92/nervecenter/blob/master/public/img/logo/NerveCenter_Logo.png?raw=true)

## Table of Contents
- [Overview](#overview)
- [Demo](#demo)
- [Features](#features)
- [Development Philosophy](#development-philosophy)
- [Stack](#stack)
- [Configuration](#configuration)
- [Building](#building)
- [Contributing](#contributing)
- [Licensing](#licensing)
- [Features To Do](#features-to-do)

## Overview
This project is meant to serve as a personalized landing page for any browser. It renders a grid of square buttons, each of which can be configured with an icon and a URL to link out to. 

## Demo
[NerveCenter.xyz](http://www.nervecenter.xyz)

## Features

## Development Philosophy
I built this with ease-of-use first and foremost in my mind. I've seen similar landing page projects in the past, but they tend to be built as add-ons for a specific browser. My goal was to take a browser-agnostic approach, such that it can be used on any device with virtually any browser. The project is built using Angular 1.x, and is built according to the paradigms commons to that framework. It was build such that the controls options are so intuitive, they require no documentation for normal use-cases.

## Stack


## Configuration

### `/.env`
```
JWT_SECRET=YOUR_JWT_SECRET
MONGODB_URI=YOUR_MONGODB_URI
```

## Building
1. `npm install --save`
2. `gulp`
3. `nodemon app.js`

## Contributing
If you have feature suggestions, please contact me here or at efournier92@gmail.com. If you'd like to submit a pull request, please feel free and I'll review and merge it at my earliest convenience!

## Licensing

## Features To Do
* [~] Change widgets to grids
* [ ] Amazon Fresh Icon
* [ ] Better Google News Icon
* [ ] Deletes both when same URL
* [ ] Small icons don't arrange correctly after sync (or add)
* [ ] Calc doesn't resize right after $location redirect
* [ ] Icon missing default grid
* [ ] Separate grids from user model
* [ ] Create FavIcon
* [ ] FavIcon in Heroku
* [ ] Add Widget Formatting
* [ ] editWidget Url/Ico
* [ ] rearrange size after grid sync
* [ ] add bower-components to lib
* [ ] convert CSS to SASS
* [ ] add ES6 support
  - [ ] convert es5 to es6
* [ ] add jspm support
* [ ] login modal can't be exited
* [ ] don't show main modal unless logged in
* [ ] update default grid
* [ ] ncCalc delete icon
* [ ] clock delete icon
* [ ] import modal choice of size dropdown
* [ ] Import error handling
* [ ] New Grid Modal (icon checkboxes)
* [ ] Background Color Picker
* [ ] Multiple custom grids for different devices
* [ ] Tabbed grid layouts
* [ ] Digital Clock Widget
* [ ] Analog/Digital Hybrid Clock Widget
* [ ] Weather Widget
* [ ] Word of the Day Widget
* [ ] Dictionary Widget
* [ ] Thesaurus Widget
* [ ] Baseball Scores Widget
* [ ] Measurement Converter Widget
* [ ] Currency Converter Widget

