var Dropdown = function(){

	this.openedClass = 'opened';
	this.optionsRepeater = 'option in ctrl.data';
	this.dropdowns = element.all(by.css('.pg-dropdown'));
	
};

describe('Dropdown Spec', function(){

	var elements = new Dropdown();

	beforeEach(function(){

		browser.get('/');
		
	});

	it('should have dropdowns on index.html', hasDropdowns);
	it('should have options inside a dropdown', hasOptions);
	it('should focus dropdown on tab key press', tabFocus);
	it('should open dropdown on click', clickOpen);
	it('should open dropdown on enter key press', enterKeyOpen);
	it('should close dropdown on esc key press', escKeyClose);
	it('should close dropdown when an option is selected', optionSelectClose);
	it('should select an option when clicked', clickSelectOption);
	it('should select an option when enter key is pressed', enterSelectOption);
	it('should have <i> elements when image-options is true', imageOptions);

	function hasDropdowns(){

		elements.dropdowns
		.then(function(dropdowns){

			expect(dropdowns.length).toBeGreaterThan(0);
			
		});
		
	}

	function hasOptions(){

		elements.dropdowns
		.then(function(dropdowns){

			dropdowns[0].all(by.repeater(elements.optionsRepeater))
			.then(function(options){

				expect(options.length).toBeGreaterThan(0);
				
			});
			
		});
		
	}

	function clickOpen(){

		_openClickDropdown(0, function(dropdown){

			expect(dropdown.getAttribute('class')).toMatch(elements.openedClass);
			
		});
		
	}


	function enterKeyOpen(){

		_openEnterDropdown(function(dropdown){

			expect(dropdown.getAttribute('class')).toMatch(elements.openedClass);
			
		});
		
	}

	function escKeyClose(){

		_openEnterDropdown(function(dropdown){

			browser.actions().sendKeys(protractor.Key.ESCAPE).perform()
			.then(function(){

				expect(dropdown.getAttribute('class')).not.toMatch(elements.openedClass);
				
			});
			
		});		
		
	}

	function optionSelectClose(){

		_openClickDropdown(0, function(dropdown){

			dropdown.all(by.repeater(elements.optionsRepeater))
			.then(function(options){

				var _option = options[0];

				_checkVisible(_option)
				.then(function(){

					_option.click()
					.then(function(){

						expect(dropdown.getAttribute('class')).not.toMatch(elements.openedClass);
						
					});
					
				});				
				
			});
			
		});		
		
	}

	function clickSelectOption(){

		_openClickDropdown(0, function(dropdown){

			dropdown.all(by.repeater(elements.optionsRepeater))
			.then(function(options){

				var _option = options[0];

				_checkVisible(_option)
				.then(function(){

					_option.element(by.css('span')).getText()
					.then(function(optionText){

						_option.click()
						.then(function(){

							var _current = dropdown.element(by.css('.current-selected-option span'));

							_current.getText()
							.then(function(currentText){

								expect(currentText).toMatch(optionText);
								
							});
							
						});
						
					});
					
				});				
				
			});
			
		});
		
	}

	function enterSelectOption(){

		_openClickDropdown(0, function(dropdown){

			dropdown.all(by.repeater(elements.optionsRepeater))
			.then(function(options){

				var _option = options[0];

				_checkVisible(_option)
				.then(function(){

					_option.element(by.css('span')).getText()
					.then(function(optionText){

						browser.actions().sendKeys(protractor.Key.ARROW_DOWN).perform()
						.then(function(){

							browser.actions().sendKeys(protractor.Key.ENTER).perform()
							.then(function(){

								var _current = dropdown.element(by.css('.current-selected-option span'));

								_current.getText()
								.then(function(currentText){

									expect(currentText).toMatch(optionText);
									
								});								
								
							});
							
						});

					});
					
				});
				
			});
			
		});
		
	}

	function imageOptions(){

		var _imageDropdown = element(by.xpath('//div[@image-options="true"]'));
		
		_imageDropdown.all(by.css('i'))
		.then(function(icons){

			expect(icons.length).toBeGreaterThan(0);
			
		});
		
	}

	function _openEnterDropdown(callback){

		browser.actions().sendKeys(protractor.Key.TAB).perform()
		.then(function(){

			var _focused = browser.driver.switchTo().activeElement();

			browser.actions().sendKeys(protractor.Key.ENTER).perform()
			.then(function(){

				callback(_focused);
				
			});
			
		});	
		
	}	

	function _openClickDropdown(index, callback){

		elements.dropdowns
		.then(function(dropdowns){

			var _dropdown = dropdowns[index];

			_dropdown.click()
			.then(function(){

				callback(_dropdown);
				
			});
			
		});
		
	}

	function _checkVisible(elem){

		return browser.wait(function () {
		    
		    return elem.isDisplayed();

		},15000);

	}


});