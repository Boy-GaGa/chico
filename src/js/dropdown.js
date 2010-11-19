/**
 *	Dropdown
 *	@author 
 *	@Contructor
 *	@return An interface object
 */	
ui.Dropdown = function(conf){
	var that = ui.Navigators(); // Inheritance

	// Global configuration
	$(conf.element).addClass('uiDropdown');
	conf.$trigger = $(conf.element).children(':first');
	conf.$htmlContent = conf.$trigger.next().bind('click', function(event){ event.stopPropagation() });
	
	// Events
	conf.$trigger
		.bind('click', function(event){
			if(that.status){ that.hide(event, conf); return; };
			that.show(event, conf);
		
			// Document events
			$(document).bind('click', function(event){
				that.hide(event, conf);
				$(document).unbind('click');
			});
		})
		.css('cursor','pointer')
		.addClass('uiTrigger')
		.append('<span class="ico down">&raquo;</span>');
	
	// Content
	conf.$htmlContent
		.addClass('uiContent')
		.find('a')
			.bind('click', function(){ that.hide($.Event(), conf) });

	return { show: function(event){ that.show(event, conf) }, hide: function(event){ that.hide(event, conf) }};
};