sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History"
], function (Controller, History) {
	"use strict";

	return Controller.extend("com.quinnox.IoTTechnicians.controller.BaseController", {
		onInit: function () {

		},

		getRouter: function () {
			return this.getOwnerComponent().getRouter();
		},

		onNavBack: function () {
			var sPreviousHash = History.getInstance().getPreviousHash();
			if (sPreviousHash !== undefined) {
				history.go(-1);
			} else {
				this.getOwnerComponent().getRouter().navTo("RouteLogin");
			}
		}
	});
});