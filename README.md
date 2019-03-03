# ![NerveCenter](https://github.com/efournier92/NerveCenter/blob/master/public/img/logo/NerveCenter_Logo.png?raw=true)

## Table of Contents
- [Overview](#overview)
- [Demo](#demo)
- [Features](#features)
- [Development Philosophy](#development-philosophy)
- [Stack](#stack)
- [Configuration](#configuration)
  - [Configure As New Tab Page](#configure-as-new-tab-page)
- [Building](#building)
- [Contributing](#contributing)
- [Licensing](#licensing)
- [Features To Do](#features-to-do)

## Overview
This project is meant to serve as a personalized landing page for any browser. It renders a grid of icons, each of which can be configured with an image and a URL. A user can sign in to define a custom grid of icons. Custom grids can be backed up via JSON export, and imported if necessary.

## Demo
[NerveCenter.xyz](http://www.NerveCenter.xyz)

## Features

### Authentication
![Authentication Screen](https://github.com/efournier92/NerveCenter/blob/master/public/img/screenshots/Authentication.png?raw=true)

### View dashboard with clickable link icons
![View Dashboard Screen](https://github.com/efournier92/NerveCenter/blob/master/public/img/screenshots/View_Dashboard.png?raw=true)

### Delete icons from dashboard
![Delete Icons](https://github.com/efournier92/NerveCenter/blob/master/public/img/screenshots/Delete_Icons.png?raw=true)

### Unlock dashboard to drag icons
![Unlock To Drag Screen](https://github.com/efournier92/NerveCenter/blob/master/public/img/screenshots/Unlock_To_Drag.png?raw=true)

### Calculator Widget
![Calculator Widget Screen](https://github.com/efournier92/NerveCenter/blob/master/public/img/screenshots/Calculator_Widget.png?raw=true)

### Settings

#### Add a new icon
![Add New Icons Screen](https://github.com/efournier92/NerveCenter/blob/master/public/img/screenshots/Settings_Add_New_Icon.png?raw=true)

#### Export configuration data
![Export Screen](https://github.com/efournier92/NerveCenter/blob/master/public/img/screenshots/Settings_Export.png?raw=true)

#### Import configuration data
![Import Screen](https://github.com/efournier92/NerveCenter/blob/master/public/img/screenshots/Settings_Import.png?raw=true)

#### Extra settings
![Extra Settings Screen](https://github.com/efournier92/NerveCenter/blob/master/public/img/screenshots/Settings_Extra.png?raw=true)

## Development Philosophy
I built this with ease-of-use first and foremost in my mind. I've seen similar landing page projects in the past, but they tend to be built as add-ons for a specific browser. My goal was to take a browser-agnostic approach, such that it can be used on any device with virtually any browser. The project is built using Angular 1.5, according to standard framework paradigms. It was build such that the controls options are so intuitive, no require no documentation for regular use-cases.

## Stack
- NodeJS
- ExpressJS
- MongoDB
- AngularJS
- ES6 (JavaScript)
- Gulp
- Babel
- WebPack
- angular-gridster
- angular-ui-bootstrap

## Configuration

### `/.env`
```
JWT_SECRET=YOUR_JWT_SECRET
MONGODB_URI=YOUR_MONGODB_URI
```

### Configure As New Tab Page

#### Chrome
1. Download extension [Fast New Tab Redirect](https://chrome.google.com/webstore/detail/fast-new-tab-redirect/ohnfdmfkceojnmepofncbddpdicdjcoi?hl=en)
2. In extension settings, configure URL for redirect page as `http://nervecenter.herokuapp.com`

#### Firefox
1. Download add-on [New Tab Override](https://addons.mozilla.org/en-US/firefox/addon/new-tab-override/)
2. In extension settings, configure URL for redirect page as `http://nervecenter.herokuapp.com`

#### Safari
1. Open Safari
2. Select `Preferences` from the menu bar
3. General
4. Set homepage as `http://nervecenter.herokuapp.com`

#### Edge
1. Open Edge
2. Enter `about:flags` into URL bar
3. Check the box next to `Enable extension developer features`
4. Download extension [Breeze](https://drive.google.com/file/d/1YupLKhTwgGsbQC362mI3643f3og8nmih/view)
5. Install the downloaded extension
6. Configure new tab page as `http://nervecenter.herokuapp.com`

## Building
1. `npm install --save`
2. `gulp`
3. `nodemon app.js`

## Contributing
If you have feature suggestions, please contact me here or at efournier92@gmail.com. If you'd like to submit a pull request, please feel free and I'll review and merge it at my earliest convenience!

## Licensing
This project is provided under the `MIT` licence and I hereby grant rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the software without limitation, provided the resulting software also carries the same open-source licensing statement.

## Features To Do
* [ ] Change widgets to grids
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

