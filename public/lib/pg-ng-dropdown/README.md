# [pagarme-ng-dropdown](http://pagarme.github.io/pagarme-ng-dropdown)
*[Pagar.me](http://pagar.me) directive to provide a simple and quick dropdown from a provided array of options*

*For angular versions < 1.3 that does not supports* [`bindToController`](https://docs.angularjs.org/api/ng/service/$compile) *, you should see this [branch](https://github.com/pagarme/pagarme-ng-dropdown/tree/legacy).*

### Check the demo [here](http://pagarme.github.io/pagarme-ng-dropdown/)

#### Installation

Install via npm package manager:
```
$ npm install pg-ng-dropdown
```

Import the directive file into your project:
```html
<script src="node_modules/pg-ng-dropdown/dest/pg-ng-dropdown.min.js"></script>
```

If you wish the same style of the example, import the css.
```html
<link rel="stylesheet" type="text/css" href="dest/css/pg-ng-dropdown.min.css">
```

Load the pg-ng-dropdown module:
```javscript
angular.module('myApp', ['pg-ng-dropdown']);
```


Call the directive in an element via attribute, class or tag name:
```html
<div data-pg-ng-dropdown></div>
<div class="pg-ng-dropdown"></div>
<pg-ng-dropdown></pg-ng-dropdown>
```


Pass the data via attribute:
```html
<div data-pg-ng-dropdown data-options="myOptionsArray"></div>
```

Give a model to the dropdown:
```html
<div data-pg-ng-dropdown data-model="myModel" data-options="myOptionsArray"></div>
```

#### Array expected format

The options array must contains one JSON for each option.

Example:
```javascript
var myOptionArray = [
		{
			text: 'Carl Sagan',
			image: 'img/carl.png' //if image-options is set to true
			value: 0,
		},
		{
			text: 'Stephen Hawking',
			image: 'img/stephen.png' //if image-options is set to true
			value: 1,
		},
		{
			text: 'Michio Kaku',
			image: 'img/michio.png' //if image-options is set to true
			value: 2,
		}
];
```


#### Directive Optionals

You can choose what property from the json you wish to be used as value for the model, instead of the default `value`.
On the given example below, the text of the option will be set to the model, instead of its value.

```html
<div data-pg-ng-dropdown data-value-property="text" data-model="myModel" data-options="myOptionsArray"></div>
```

Also choose the object property to display the text of the option, instead of the default `text`:

```html
<div data-pg-ng-dropdown data-text-property="diffTextProp" data-options="myOptionsArray"></div>

```

You can do the same to set the image url of the option, instead of the default `image`:

```html
<div data-pg-ng-dropdown data-text-property="diffImageProp" data-options="myOptionsArray"></div>
```


Set the empty text that will be displayed when model is empty or does not matches any of the options:
```html
<div data-pg-ng-dropdown data-empty-text="Choose an option" data-options="myOptionsArray"></div>
```


Enable image options (default is `false`):
```html
<div data-pg-ng-dropdown data-image-options="true" data-options="myOptionsArray"></div>
```


Opened dropdown class (default is `opened`):
```html
<div data-pg-ng-dropdown data-opened-class="my-opened-class" data-options="myOptionsArray"></div>
```


Selected option class (default is `selected`):
```html
<div data-pg-ng-dropdown data-selected-class="my-selected-class" data-options="myOptionsArray"></div>
```


Option selected/changed custom function:
```html
<div data-pg-ng-dropdown data-onchange="myFunction" data-options="myOptionsArray"></div>
```

Dynamic Height support:
```html
<div data-pg-ng-dropdown data-dynamic-height="true" data-options="myOptionsArray"></div>
```

To simulate ng-disabled functionality, you must pass a function that return the disabled condition result:

```javascript
$scope.disabled = function(){

	return $scope.valA !== $scope.valB;
	
};
```

```html
<div data-pg-ng-dropdown disabled="disabled()" data-options="myOptionsArray"></div>
```


#### Registered Scope Events

You can communicate with each of the dropdowns in your page by naming them with the attribute `name`:
```html
<div data-pg-ng-dropdown name="myDropdown" data-options="myOptionsArray"></div>
```


And you can open and close a dropdown trough scope events by passing as data the name of the directive:
```javascript
//opening
$scope.$broadcast('pg-dropdown-open', {
	name: 'myDropdown'
});

//closing
$scope.$broadcast('pg-dropdown-close', {
	name: 'myDropdown'
});
```


You can also select a given option:
```javascript
//select the third option
$scope.$broadcast('pg-select-option', {
	name: 'myDropdown',
	index: 2,
});
```

#### Accessibility

Supports tab index, with `enter`, `esc`, `up` and `down` arrows controls. Enter key opens the focused dropdown and esc closes it. Use up and down arrow to choose an option and press enter again to select it.

#### Testing
This directive has e2e testing specs done by [protractor](https://angular.github.io/protractor/#/).
Follow protractor's instructions, run `gulp server` task and run testing command `protractor protractor.conf.js` to run the test cases.

And that's it :D

[Rafael Violato](http://rviolato.com) @ [pagar.me](http://pagar.me)
