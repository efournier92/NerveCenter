'use strict';
/**
 * @author Rafael Violato (http://rviolato.com)
 */

(function(){

	angular.module('pg-ng-dropdown', [])
		.directive('pgNgDropdown', dropdownDirective);

	dropdownDirective.$inject = ['$timeout', '$document', '$parse'];

	function dropdownDirective($timeout, $document, $parse){

		var template = [

			'<div class="pg-dropdown" data-ng-class="{\'disabled\': ctrl.disabled()}">',
				'<div data-ng-click="ctrl.toggle()" class="current-selected-option">',
						'<i data-ng-if="ctrl.image == \'true\'" data-ng-style="{\'background-image\': \'url(\'+(ctrl.data[ctrl.selectedOption][ctrl.imageProperty])+\')\'}">',
						'</i>',
						'<span data-ng-bind="ctrl.data[ctrl.selectedOption][ctrl.textProperty] || ctrl.emptyText">',
						'</span>',
						'<div class="arrow-wrapper">',
							'<div class="arrow"></div>',
						'</div>',
						'<div style="clear:both;"></div>',
				'</div>',
				'<ul class="dropdown-content">',
					'<li data-ng-click="ctrl.selectOption($index)" data-ng-repeat="option in ctrl.data" title="{{option[ctrl.textProperty]}}" >',
						'<i data-ng-if="ctrl.image == \'true\'" data-ng-style="{\'background-image\': \'url(\'+(option[ctrl.imageProperty])+\')\'}">',
						'</i>',
						'<span data-ng-bind="option[ctrl.textProperty]">',
						'</span>',
						'<div style="clear:both;"></div>',
					'</li>',
				'</ul>',
		    '</div>',

		].join('');

		var directive = {

			scope: {
				
				data: '=options',
				model: '=',
				image: '@imageOptions',
				emptyText: '@',
				name: '@',
				imageProperty: '@',
				textProperty: '@',
				valueProperty: '@',
				openedClass: '@',
				selectedClass: '@',
				dynamicHeight: '@',
				disabled: '&',
				onchange: '&',

			},

			restrict: 'AEC',
			compile: compile,
			controller: controller,
			controllerAs: 'ctrl',
			bindToController: true,
			replace: true,
			template: template,

		};

		return directive;

		function compile($element, attrs){

			attrs.textProperty = attrs.textProperty || 'text';
			attrs.imageProperty = attrs.imageProperty || 'image';
			attrs.valueProperty = attrs.valueProperty || 'value';

			return {
				post: postLink,
			};
			
		}

		function controller($scope){

			var vm = this;

			vm.opened = false;
			vm.currentOption = -1;
			vm.selectedOption;

			vm.selectOption = selectOption;
			vm.open = open;
			vm.close = close;
			vm.toggle = toggle;

			if(vm.disabled() === 'undefined'){

				$scope.disabled = function(){

					return false;
					
				};

			}

			$scope.$watch('data', function(){

				$scope.$broadcast('options-changed');

			});

			if(vm.model){

				vm.data.forEach(function(opt, i){

					if(opt[vm.valueProperty] == vm.model){

						vm.selectedOption = i;

					}
					
				});

			}
			
			function selectOption(_index){

				if(_index !== parseInt(vm.selectedOption)){

					var _pastSelected = vm.selectedOption;

					_index = parseInt(_index);

					vm.selectedOption = _index;

					vm.model = vm.data[vm.selectedOption][vm.valueProperty];

					vm.onchange();

					$scope.$broadcast('pg-option-selected', {index: _index, pastIndex: _pastSelected});

				}
				
			}

			function toggle(){

				if(vm.opened){

					vm.opened = false;
					$scope.$broadcast('pg-close-dropdown');

				}else if(!vm.disabled()){

					vm.opened = true;
					$scope.$broadcast('pg-open-dropdown');

				}

			}

			function open(){
				
				if(!vm.disabled()){

					vm.opened = true;
					$scope.$broadcast('pg-open-dropdown');

				}

			}

			function close(){

				vm.opened = false;
				$scope.$broadcast('pg-close-dropdown');

			}
			
		}

		function postLink($scope, $element, attrs, ctrl){

			var optionsWrapper;
			var options;
			var optionHeight;
			var closedHeight;
			var openedHeight;
			var openedClass = 'opened';
			var selectedClass = 'selected';

			if(ctrl.openedClass){
				var openedClass = ctrl.openedClass;
			}

			if(ctrl.selectedClass){
				var selectedClass = ctrl.selectedClass;
			}
			
			var $open = $scope.$on('pg-open-dropdown', open);
			var $close = $scope.$on('pg-close-dropdown', close);
			var $openThis = $scope.$on('pg-dropdown-open', openEvt);
			var $closeThis = $scope.$on('pg-dropdown-close', closeEvt);
			var $selectThis = $scope.$on('pg-select-option', selectEvt);
			var $optionsChanged = $scope.$on('pg-options-changed', measureHeight);
			var $select = $scope.$on('pg-option-selected', function($evt, data){

				select($evt, data);
				ctrl.close();

			});

			$element.on('click', elementClick);
			$document.on('click', ctrl.close);
			$element.on('keydown', keydown);
			$scope.$on('$destroy', destroy);

			//init
			$timeout(function(){

				optionsWrapper = $element.find('ul');
				options = optionsWrapper.find('li');
				options.eq(ctrl.selectedOption).addClass(selectedClass);

				optionHeight = options.eq(0).prop('offsetHeight');

				if(ctrl.dynamicHeight){

					measureHeight();

				}

			});

			function select($evt, data){

				options.eq(data.index).addClass(selectedClass);
				options.eq(data.pastIndex).removeClass(selectedClass);
				
			}

			function open(){

				$element.addClass(openedClass);

				if(ctrl.dynamicHeight){
					$element.css('height', (openedHeight) + 'px');
				}

			}

			function close(){

				$element.removeClass(openedClass);

				if(ctrl.currentOption > 0){

					options.eq(ctrl.currentOption).removeClass('focused');
					ctrl.currentOption = -1;

				}

				if(ctrl.dynamicHeight){

					$element.css('height', (closedHeight) + 'px');

				}

			}

			function elementClick(evt){

				evt.stopPropagation();

			}

			function selectEvt($evt, data){

				if(ctrl.name === data.name){

					$scope.$apply(function(){

						ctrl.selectOption(data.index);

					});

				}
				
			}

			function openEvt($evt, data){

				if(ctrl.name === data.name){

					ctrl.open();

				}
				
			}

			function closeEvt($evt, data){

				if(ctrl.name === data.name){

					ctrl.close();

				}
				
			}

			function keydown(evt){

				var _code = evt.keyCode || evt.which;

				if(_code === 13) { //enter

					evt.preventDefault();

					if(!ctrl.opened){

						ctrl.open();

					}else if(ctrl.opened && ctrl.currentOption != -1 && ctrl.currentOption != ctrl.selectedOption){

						$scope.$apply(function(){

							ctrl.selectOption(ctrl.currentOption);

						});

					}

				}else if(_code === 27){ //esc

					evt.preventDefault();

					if(ctrl.opened){

						ctrl.close();

					}

				}else if(_code === 38){ //up

					evt.preventDefault();

					if(ctrl.currentOption-1 >= 0){

						options.eq(ctrl.currentOption).removeClass('focused');
						ctrl.currentOption--;
						options.eq(ctrl.currentOption).addClass('focused');

						if(ctrl.currentOption < options.length){

							optionsWrapper[0].scrollTop -= optionHeight;

						}

					}

				}else if(_code === 40){ //down

					evt.preventDefault();

					if(ctrl.currentOption+1 < options.length){

						options.eq(ctrl.currentOption).removeClass('focused');
						ctrl.currentOption++;
						options.eq(ctrl.currentOption).addClass('focused');
						
						if(ctrl.currentOption > 1){

							optionsWrapper[0].scrollTop += optionHeight;

						}

					}

				}
				
			}

			function measureHeight(){

				var _style = window.getComputedStyle(optionsWrapper[0]);
				var _padding = parseInt(_style.paddingTop) + parseInt(_style.paddingBottom);
				var _margin = parseInt(_style.marginTop) + parseInt(_style.marginBottom);

				closedHeight = $element.prop('offsetHeight');
				openedHeight = (optionHeight * options.length) + closedHeight + _padding + _margin;
				
			}

			function destroy(){
				
				$document.off('click');
				$open();
				$close();
				$select();
				$optionsChanged();
				$closeThis();
				$openThis();
				$selectThis();

			}

		}

	}
	
})();