var map, toc, _currentMediaMode, _mapVisibleXS;
require([
"esri/map", "esri/dijit/HomeButton", "esri/dijit/Scalebar", "application/bootstrapmap", "esri/layers/ArcGISDynamicMapServiceLayer", "esri/layers/FeatureLayer", "esri/dijit/Popup", "esri/dijit/PopupTemplate", "esri/renderers/SimpleRenderer", "esri/renderers/UniqueValueRenderer", "esri/symbols/SimpleFillSymbol", "esri/symbols/SimpleLineSymbol", "esri/Color", "esri/tasks/query", "esri/tasks/QueryTask", "esri/graphic", "dijit/TooltipDialog", "dijit/popup", "esri/lang", "dojo/dom-style", "esri/symbols/PictureMarkerSymbol", "dojo/dom-construct", "dojo/domReady!"],
  function( Map,  HomeButton,  Scalebar,  BootstrapMap,  ArcGISDynamicMapServiceLayer,  FeatureLayer,  Popup,  PopupTemplate, SimpleRenderer,  UniqueValueRenderer,  SimpleFillSymbol,  SimpleLineSymbol,  Color,  Query,  QueryTask,  Graphic,  TooltipDialog,  dijitPopup,  esriLang,  domStyle,  PictureMarkerSymbol,  domConstruct) {
	
	// Get a reference to the ArcGIS Map class
	var map = BootstrapMap.create("map", {
	  basemap: "gray",
	  center: [-79.970, 32.821],
	  zoom: 11,
	  scrollWheelZoom: true,
	});
		
	var home = new HomeButton({
        map: map
      }, "HomeButton");
      home.startup();
	
	 $('#HomeButton').on('click', function() {
		if (featureLayerWarnings.visible == true){
			featureLayerWarnings.hide();
		}
		$('#warnBtn').removeClass("active");
		
		if (featureLayerPrecipitation.visible == true){
			featureLayerPrecipitation.hide();
		}
		$('#precipBtn').removeClass("active");
		
		if (featureLayerWind.visible == true){
			featureLayerWind.hide();
		}
		$('#windBtn').removeClass("active");
		
		if (featureLayerStorm.visible == true){
			featureLayerStorm.hide();
		}
		$('#stormBtn').removeClass("active");
	}); 
	
	var mapServiceURL = "http://tela.roktech.net/arcgis/rest/services/Demos/fishackathonGhostGearBusters/MapServer";
	var gearURL = "http://tela.roktech.net/arcgis/rest/services/Demos/fishackathonGhostGearBusters/MapServer/0";
	var warningsURL = "http://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/watch_warn_adv/MapServer/1";
	var precipURL = "http://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Climate_Outlooks/cpc_weather_hazards/MapServer/4";
	var windURL = "https://tmservices1.esri.com/arcgis/rest/services/LiveFeeds/NOAA_storm_reports/MapServer/2";
	var stormURL = "https://tmservices1.esri.com/arcgis/rest/services/LiveFeeds/NOAA_storm_reports/MapServer/3";
	
	var dynamicMapService = new ArcGISDynamicMapServiceLayer(mapServiceURL);
	
	//create feature layers
	var featureLayerGear = new FeatureLayer(gearURL,{
		mode: FeatureLayer.MODE_AUTO,
		outFields:["*"]
	});
	var featureLayerWarnings = new FeatureLayer(warningsURL,{
		mode: FeatureLayer.MODE_AUTO,
		outFields:["*"]
	});
	var featureLayerPrecipitation = new FeatureLayer(precipURL,{
		mode: FeatureLayer.MODE_AUTO,
		outFields:["*"]
	});
	var featureLayerWind = new FeatureLayer(windURL,{
		mode: FeatureLayer.MODE_AUTO,
		outFields:["*"]
	});
	var featureLayerStorm = new FeatureLayer(stormURL,{
		mode: FeatureLayer.MODE_AUTO,
		outFields:["*"]
	});
	dynamicMapService.hide();
	featureLayerWarnings.hide();
	featureLayerPrecipitation.hide();
	featureLayerWind.hide();
	featureLayerStorm.hide();
	
	//add scalebar
	var scalebar = new Scalebar({
	  map: map,
	  scalebarUnit: "dual"
	});

   $(document).ready(function () {
	  $("#basemapList li").click(function (e) {
		switch (e.target.text) {
		  case "Streets":
			map.setBasemap("streets");
			break;
		  case "Imagery":
			map.setBasemap("hybrid");
			break;
		  case "National Geographic":
			map.setBasemap("national-geographic");
			break;
		  case "Topographic":
			map.setBasemap("topo");
			break;
		  case "Gray":
			map.setBasemap("gray");
			break;
		  case "Open Street Map":
			map.setBasemap("osm");
			break;
		}
	  }); 
	});	
			
	//create picture image renderers for point data
	var betaURL = "img/icons/";
	var gImg = "ghost.png";
	var wImg = "wind.png";
	
	var wSym = new PictureMarkerSymbol(betaURL+wImg,16,16);
	var wRen = new SimpleRenderer(wSym);
	featureLayerWind.setRenderer(wRen); 
	
	var gSym = new PictureMarkerSymbol(betaURL+gImg,16,16);
	var gRen = new SimpleRenderer(gSym);
	featureLayerGear.setRenderer(gRen);
	
	
	//Add mapLayers
	map.addLayers( [dynamicMapService, featureLayerGear, featureLayerWarnings, featureLayerPrecipitation, featureLayerWind, featureLayerStorm] );
	
	//Control feature layers via "TOC" menu
	$('#warnBtn').on('click', function() {
		if (featureLayerWarnings.visible == true){
			featureLayerWarnings.hide();
		}
		else if (featureLayerWarnings.visible == false){
			featureLayerWarnings.show();
		}
	});
	$('#precipBtn').on('click', function() {
		if (featureLayerPrecipitation.visible == true){
			featureLayerPrecipitation.hide();
		}
		else if (featureLayerPrecipitation.visible == false){
			featureLayerPrecipitation.show();
		}
	});
	$('#windBtn').on('click', function() {
		if (featureLayerWind.visible == true){
			featureLayerWind.hide();
		}
		else if (featureLayerWind.visible == false){
			featureLayerWind.show();
		}
	});
	$('#stormBtn').on('click', function() {
		if (featureLayerStorm.visible == true){
			featureLayerStorm.hide();
		}
		else if (featureLayerStorm.visible == false){
			featureLayerStorm.show();
		}
	});
	//Make union basemap transparent based on zoom-scale
	map.on("zoom-end", transparencyUpdate);
	function transparencyUpdate(evt) {
		var mapScale = map.getScale();
		if (mapScale < 144447.638572){
		dynamicMapService.setOpacity(0.45);
		}
		else if (mapScale > 144447.638572){
		dynamicMapService.setOpacity(1.0);
		}
	}	
	
	//map tips
	dialog = new TooltipDialog({
	  id: "tooltipDialog",
	  style: "position: absolute; width: 240px; font: normal normal normal 10pt Helvetica;z-index:100"
	});
    dialog.startup();
	
	var highlightSymbol = new SimpleFillSymbol(
          SimpleFillSymbol.STYLE_SOLID, 
          new SimpleLineSymbol(
            SimpleLineSymbol.STYLE_SOLID, 
            new Color([255,0,0]), 3
          ), 
          new Color([255,0,0,0])
        );

        //close the dialog when the mouse leaves the highlight graphic
        map.on("load", function(){
          map.graphics.enableMouseEvents();
        });
		map.on("extent-change", function(){
			closeDialog();
		});
               
	//listen for when the onMouseOver event fires on the graphics layer
	//when fired, create a new graphic with the geometry from the event.graphic and add it to the maps graphics layer
	featureLayerWarnings.on("click", function(evt){
	  map.graphics.clear();
	  var ttText = "<b>${prod_type}</b><br /><a href=\"${url}\" target=\"blank\">More info...</a>";
	  var content = esriLang.substitute(evt.graphic.attributes,ttText);
	  var highlightGraphic = new Graphic(evt.graphic.geometry,highlightSymbol);
	  map.graphics.add(highlightGraphic);
	  map.setMapCursor("pointer");
	  
	  dialog.setContent(content);

	  domStyle.set(dialog.domNode, "opacity", 0.85);
	  dijitPopup.open({
		popup: dialog, 
		x: evt.pageX,
		y: evt.pageY
	  });
	});
	featureLayerPrecipitation.on("click", function(evt){
	  map.graphics.clear();
	  var ttText = "<b>3-7 Day Forecast</b><br />${label}";
	  var content = esriLang.substitute(evt.graphic.attributes,ttText);
	  var highlightGraphic = new Graphic(evt.graphic.geometry,highlightSymbol);
	  map.graphics.add(highlightGraphic);
	  map.setMapCursor("pointer");
	  
	  dialog.setContent(content);

	  domStyle.set(dialog.domNode, "opacity", 0.85);
	  dijitPopup.open({
		popup: dialog, 
		x: evt.pageX,
		y: evt.pageY
	  });
	});
	featureLayerWind.on("click", function(evt){
	  map.graphics.clear();
	  var ttText = "<b>Wind Past 24 Hrs</b><br />${COMMENTS}";
	  var content = esriLang.substitute(evt.graphic.attributes,ttText);
	  var highlightGraphic = new Graphic(evt.graphic.geometry,highlightSymbol);
	  map.graphics.add(highlightGraphic);
	  map.setMapCursor("pointer");
	  
	  dialog.setContent(content);

	  domStyle.set(dialog.domNode, "opacity", 0.85);
	  dijitPopup.open({
		popup: dialog, 
		x: evt.pageX,
		y: evt.pageY
	  });
	});
	function closeDialog() {
		dijitPopup.close(dialog);
		map.setMapCursor("default");
	}
		
});