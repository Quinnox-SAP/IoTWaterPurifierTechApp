sap.ui.define([
	"com/quinnox/IoTTechnicians/controller/BaseController",
	"/sap/m/MessageBox"
], function (BaseController, MessageBox) {
	"use strict";

	return BaseController.extend("com.quinnox.IoTTechnicians.controller.GoogleMap", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.quinnox.IoTTechnicians.view.GoogleMap
		 */
		onInit: function () {
			this.getView().addEventDelegate({
				onBeforeShow: jQuery.proxy(function (evt) {
					this.onBeforeShow(evt);
				}, this)
			});
		},

		// onAfterRendering function of controller
		// onAfterRendering: function () {
		// },
		onBeforeShow: function () {
			var me = this;
			this.loadGoogleMaps("https://maps.googleapis.com/maps/api/js?key=AIzaSyAh2r1atxybn3PriPw7NxnJSwLnNlAML9k", me.setMapData.bind(me));
		},
		// function for loading google maps
		loadGoogleMaps: function (scriptUrl, callbackFn) {

			var script = document.createElement('script');
			script.onload = function () {
				callbackFn();
			}
			script.src = scriptUrl;
			document.body.appendChild(script);
		},

		// function to set map data
		setMapData: function () {
			var address = "Mumbai";
			this.getCustLocation(address);

		},
		getCustLocation: function (address) {
			var _self = this;
			var _address = address;
			var geocoder = new google.maps.Geocoder();
			geocoder.geocode({
				'address': _address
			}, function (results, status) {
				if (status == google.maps.GeocoderStatus.OK) {
					sap.ui.getCore().latitude = results[0].geometry.location.lat();
					sap.ui.getCore().longitude = results[0].geometry.location.lng();
					var myCenter = new google.maps.LatLng(sap.ui.getCore().latitude, sap.ui.getCore().longitude);
					// return (latitude, longitude);
					// console.log(sap.ui.getCore().latitude, sap.ui.getCore().longitude);
					var mapProp = {
						center: myCenter,
						zoom: 15,
						scrollwheel: true,
						draggable: true,
						mapTypeId: google.maps.MapTypeId.ROADMAP
					};
					var map = new google.maps.Map(_self.getView().byId("googleMap").getDomRef(), mapProp);
					var marker = new google.maps.Marker({
						position: myCenter
					});
					marker.setMap(map);
				}
			});
		},

		onNavigatePress: function () {
			//window.location.replace("https://www.google.co.in/maps/dir/Mumbai/Bengaluru/");
			window.location.replace("http://maps.google.com");
		},
		onPress:function(){
			this.getOwnerComponent().getRouter().navTo("Login");
		}

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf com.quinnox.IoTTechnicians.view.GoogleMap
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf com.quinnox.IoTTechnicians.view.GoogleMap
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf com.quinnox.IoTTechnicians.view.GoogleMap
		 */
		//	onExit: function() {
		//
		//	}

	});

});