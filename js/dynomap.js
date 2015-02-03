(function( $ ){

  var methods = {
     init : function( options ) {
		
		return this.each(function() {  
			var settings = {
				clicked : function () {}
			};
			
			var defaults = {
				originalWidth : 0,
				originalHeight : 0,
				loadComplete : false,
				hotspotTimeout : null,
				visitNum : undefined,
				isTouchDevice : 'ontouchstart' in document.documentElement
			}
		
      		if ( options ) {
      			$.extend( settings, options );
      		}
			
			var $this = $(this),
				image = document.createElement('img');
			$this.addClass('dynomap-identifier');
			
			$(image).load(function(){
				defaults.originalWidth = parseFloat(this.width);
				defaults.originalHeight = parseFloat(this.height);
				$this.setupDynomap();
            });
			image.src = settings.background.image;
			
			$(window).bind('resize.hotspot', function (e) {
				if ($this.is(':visible') && defaults.loadComplete) {
					clearTimeout(defaults.hotspotTimeout);
					$this.adjustAreas(false);
				}
			});
			
			$this.clickerEvent = function (index) {
				settings.clicked($this, index);
			};
			
			$this.setupDynomap = function() {
				var drillLayer = $('<div class="main-area"></div>'),
					mapLayer,
					areas,
					counter,
					map,
					label,
					altTitle = ((settings.background.title) ? settings.background.title : ""),
					uniqueMapId = "map" + $this.randomString(10) + $this.randomString(10);
			
				drillLayer.append('<img role="presentation" class="main-bk-img" src="' + settings.background.image + '"/><img class="map-layer" usemap="#' + uniqueMapId + '"/>');
				drillLayer.find(".main-bk-img").attr({
					alt: altTitle,
					title: altTitle
				});
				drillLayer.find(".map-layer").attr({
					alt: altTitle,
					title: altTitle
				});
			
			
				//create and append map tag
				map = document.createElement("map");
		    	$(map).attr({"name": uniqueMapId, "id": uniqueMapId});
		    	drillLayer.append(map);
			
				//go through all hotspots
				$(settings.hotSpots).each(function (number) {
					areas = null;
					areas = this.area.split(",");
					counter = 0;
					
					//add areas to map
					var a;
					if (this.href && this.href.length > 0) {
						a = $('<area id="' + number + '" coords="' + this.area + '" orig-coords="' + this.area + '"/>');	
						a.attr({
							href: this.href,
							target: this.target
						});
					} else {
						a = $('<area class="area" id="' + number + '" coords="' + this.area + '" orig-coords="' + this.area + '"/>');
					}
					a.attr({
						tabindex: "0",
						role: "button", 
						"data-animation": this.clickAnimation,
						title: ((this.title) ? this.title : "" ),
						alt: ((this.title) ? this.title : "" )
					});
					if (areas.length == 3) {
						a.attr("shape", "circle");
					} else if (areas.length == 4) {
						a.attr("shape", "rect");
					} else {
						a.attr("shape", "poly");
					}
					
					drillLayer.find('map').append(a);
					
					//check which image states are authored and add them if applicable
					//over img
					if (this.overImg !== undefined && this.overImg !== "") {
						drillLayer.append('<img class="area-states over-layer" data-num="' + 
								number + '" id="over' + number + '" src="' + this.overImg + '"/>');
					}
					
					//press img
					if (this.downImg !== undefined && this.downImg !== "") {
						drillLayer.append('<img class="area-states down-layer" data-num="' + 
								number + '" id="down' + number + '" src="' + this.downImg + '"/>');
					}
					
					//clicked img
					if (this.clickedImg !== undefined && this.clickedImg !== "") {
						drillLayer.append('<img class="area-states clicked-layer" data-num="' + 
								number + '" id="click' + number + '" src="' + this.clickedImg + '" />');
					}
					
					//visited img
					if (this.visitedImg !== undefined && this.visitedImg !== "") {
						drillLayer.append('<img class="area-states visited-layer" data-num="' + 
								number + '" id="visit' + number + '" src="' + this.visitedImg + '" />');
					}
				});
			
				$this.append(drillLayer);
				//.map-layer has a transparent background image, get full url path and apply it as src for image tag 
				mapLayer = drillLayer.find(".map-layer");
				mapLayer.attr("src", "css/img/transparent.png");
			
				//click event for the maplayer will remove popups and return to states 
				mapLayer.click(function (e) {
					$this.removePreviousStates();
				});
				
				$this.setupDynomapEvents(drillLayer);
		
				defaults.loadComplete = true;
				clearTimeout(defaults.hotspotTimeout);
				$this.adjustAreas(true);
			};
			
			$this.setupDynomapEvents = function (node) {
				var indexId = null,
					clickedObj = null;
				
				if (!defaults.isTouchDevice) {
					node.find('area').mouseover(function (a) {
						node.find("#over" + $(this).attr("id")).show();
					}).mouseout(function (a) {
						node.find('.over-layer').removeAttr('style');
						node.find('.down-layer').removeAttr('style');
					});
					
					node.find('area').mousedown(function (a) {
						node.find("#down" + $(this).attr("id")).show();
					}).mouseup(function (a) {
						node.find('.down-layer').removeAttr('style');
					});
					
					node.find('area').focus(function (a) {
						node.find("#over" + $(this).attr("id")).show();
					}).blur(function (a) {
						node.find('.over-layer').removeAttr('style');
					});
				}	
					
				node.find('.area').bind("click",function (e) {
					e.preventDefault();
					e.stopPropagation();
						node.find('.over-layer').removeAttr('style');
						node.find('.down-layer').removeAttr('style');
						$this.removePreviousStates();
						indexId = $(this).attr('id');
						defaults.visitNum = indexId;
						clickedObj = node.find("#click" + indexId);
						if (clickedObj.is(':hidden') || clickedObj.length == 0) {
							clickedObj.show();
							$this.clickerEvent(indexId); 
						}
				});
			};
				
			$this.removePreviousStates = function () {
					var visitNum = 0;
					
					if (defaults.visitNum === null || defaults.visitNum === undefined) {
						visitNum = $this.find('.clicked-layer:visible').attr('data-num');
					 } else {
						visitNum = defaults.visitNum;
					}
					
					$this.find('.clicked-layer:visible').removeAttr('style');
					$this.find('#visit' + visitNum).show();
					
			};
			
			//responsive image map 
			$this.adjustAreas = function (recursion) {
				clearTimeout(defaults.hotspotTimeout);
				var areaStr = null,
					areas,
					newAreaStr,
					i = 0,
					labelTop = 0,
					labelLeft = 0,
					currentWidth = parseFloat($this.find('.main-area').width()),
					currentHeight = parseFloat(defaults.originalHeight) * (parseFloat($this.width()) / parseFloat(defaults.originalWidth));
				if (currentHeight > 0) {
					$this.find('area').each(function () {
						areaStr = $(this).attr('orig-coords');
						areas = areaStr.split(",");
						newAreaStr = "";
						newAreaStr += (currentWidth * (parseFloat(areas[0]) / defaults.originalWidth));
						for (i = 1; i <= areas.length - 1; i++) {
							if (i % 2) {
								//width
								newAreaStr += "," + (currentWidth * (parseFloat(areas[i]) / defaults.originalWidth));
							} else {
								//height
								newAreaStr += "," + (currentHeight * (parseFloat(areas[i]) / defaults.originalHeight));
							}
						}
						$(this).attr('coords', newAreaStr);
					});
				} else {
					clearTimeout(defaults.hotspotTimeout);
					if (recursion) {
						defaults.hotspotTimeout = setTimeout(defaults.adjustAreas(true), 1000);
					}
				}
			};
			
			//randomString function
			$this.randomString = function (strLength) {
				var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz", string_length = strLength, randomstring = '', rnum, i;
				if (strLength === undefined) {
					string_length = 5;
				}
				for (i = 0; i < string_length; i++) {
					rnum = Math.floor(Math.random() * chars.length);
					randomstring += chars.substring(rnum, rnum + 1);
				}
				return randomstring;
			};
      			
     	});
     }
  };   	 	

   $.fn.dynomap = function( method ) {
    
    if ( methods[method] ) {
      return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
      return methods.init.apply( this, arguments );
    } else {
      $.error( 'Method ' +  method + ' does not exist on jQuery.dynomap' );
    }    
  
  };

})( jQuery );
