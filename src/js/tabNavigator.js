/**
 *	Tabs Navigator
 *	@author
 *	@Contructor
 *	@return An interface object
 */

ui.tabNavigator = function(conf){

    var that = ui.controllers();
    
    conf.publish = that.publish;

	var $triggers = $(conf.element).children(':first').find('a');
	var $htmlContent = $(conf.element).children(':first').next();

	// Global configuration
	$(conf.element).addClass('ch-tabNavigator');
	$(conf.element).children(':first').addClass('ch-tabNavigator-triggers');
	$triggers.addClass('ch-tabNavigator-trigger');
	$htmlContent.addClass('ch-tabNavigator-content box');

	// Starts (Mother is pregnant, and her children born)
	$.each($triggers, function(i, e){
		that.children.push(ui.tab(i, e, conf));
	});
    
    // TODO: Normalizar las nomenclaturas de métodos, "show" debería ser "select"
	var show = function(event, tab){
		//ui.instances.tabNavigator[conf.instance].tabs[tab].shoot(event);
		        
        that.children[tab].shoot(event);
        
        /* The potato is ready!!
		Use this to execute a specific tab on console (on h1 click)
		$('h1').click(function(event){
			ui.instances.tabNavigator[0].show(event, 2);
		});*/

        // return publish object
        return conf.publish; 
	};
    
    // create the publish object to be returned
	conf.publish.uid = conf.id;
	conf.publish.element = conf.element;
	conf.publish.type = "tabNavigator";
	conf.publish.tabs = that.children;
	conf.publish.select = function(tab){ return show($.Event(), tab) };
      	
		
	//Default: Load hash tab or Open first tab
    var hash = window.location.hash.replace( "#!", "" );
	for( var i = that.children.length; i--; ){
		if( that.children[i].conf.$htmlContent.attr("id") === hash ){
			show($.Event(), i);
			break;
		} else {
			show($.Event(), 0);		
		};		  
	};	

	return conf.publish;
	
};


/**
 *	Tab
 *	@author
 *	@Contructor
 *	@return An interface object
 */

ui.tab = function(index, element, conf){
	var that = ui.navs(); // Inheritance
	var display = element.href.split('#');
	var $tabContent = $(element).parents('.ch-tabNavigator').find('#' + display[1]);

	// Global configuration
	that.conf = {
		name: 'tab',
		$trigger: $(element).addClass('ch-tabNavigator-trigger'),
		callbacks: conf.callbacks
	};

	var results = function(){
		
        // If there are a tabContent...
		if ( $tabContent.attr('id') ) {
			return $tabContent; 		
		// If tabContent doesn't exists        
		} else {
			// Set ajax configuration
			that.conf.ajax = true;
						
			// Create tabContent
			var w = $('<div>').attr('id', 'ch-tab' + index);
				w.hide().appendTo( that.conf.$trigger.parents('.ch-tabNavigator').find('.ch-tabNavigator-content') );
			return w;
		};
	};
	that.conf.$htmlContent = results();

	// Hide all closed tabs
	if(!that.status) that.conf.$htmlContent.hide();

	// Process show event
	that.shoot = function(event){
		that.prevent(event);
        
		var tabs = conf.publish.tabs; //ui.instances.tabNavigator[conf.id].tabs; // All my bros
		if(tabs[index].status) return; // Don't click me if I'm open

		// Hide my open bro
		$.each(tabs, function(i, e){
			if(e.status) e.hide(event, e.conf);
		});

		// Load my content if I'need an ajax request 
		if(that.conf.$htmlContent.html() === '') that.conf.$htmlContent.html( that.loadContent(that.conf) );

		// Show me
		that.show(event, that.conf);
		
	};

	// Events	
	that.conf.$trigger.bind('click', function(event){
		that.shoot(event);
		
		//Change location hash
		window.location.hash = "#!" + that.conf.$htmlContent.attr("id");
	});


	return that;
}