angular.module('pg-ng-dropdown-demo', ['pg-ng-dropdown'])
.controller('test', function($scope){

	var a = 0;
	var b = 1;
	$scope.dropdownModel2 = 'Carl Sagan';
	$scope.dropdownModel3 = 4;
	$scope.list = [
		{
			text: 'Carl Sagan',
			image: 'src/img/user.png',
			value: 0,
		},
		{
			text: 'Stephen Hawking',
			image: 'src/img/user.png',
			value: 1,
		},
		{
			text: 'Michio Kaku',
			image: 'src/img/user.png',
			value: 2,
		},
		{
			text: 'Niel deGrasse Tysson',
			image: 'src/img/user.png',
			value: 3,
		},
		{
			text: 'Sir Isaac Newton',
			image: 'src/img/user.png',
			value: 4,
		},
		{
			text: 'Blaise Pascal',
			image: 'src/img/user.png',
			value: 5,
		},
		{
			text: 'Galileo Galilei',
			image: 'src/img/user.png',
			value: 6,
		},
		{
			text: 'Christian Doppler',
			image: 'src/img/user.png',
			value: 7,
		},
		{
			text: 'Nikola Tesla',
			image: 'src/img/user.png',
			value: 8,
		},
	];

	$scope.testDisabled = function(){

		return a !== b;
		
	};
	
});