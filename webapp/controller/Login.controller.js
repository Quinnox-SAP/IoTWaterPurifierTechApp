sap.ui.define([
	"com/quinnox/IoTTechnicians/controller/BaseController",
	"sap/m/MessageBox"
], function (BaseController, MessageBox) {
	"use strict";

	return BaseController.extend("com.quinnox.IoTTechnicians.controller.Login", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.quinnox.IoTTechnicians.view.Login
		 */
		onInit: function () {
			this.result = {};
			this.result.items = [];
			this.odataService = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZQNX_IOT_SRV/", true);
		},

		onLoginPress: function () {
			var that = this;
			var mobNum = that.getView().byId("idnum").getValue();
			// this.odataService.read("TechnicianNo?MobileNo='" + mobNum + "'", null, null, false, function (response) {
			// 	if (response.Message === "Invalid No") {
			// 		MessageBox.error("Enter Valid Number");
			// 		that.getView().byId("idnum").setValue("");
			// 	}
			// });
			that.getOwnerComponent().getRouter().navTo("RouteHome", {
				mobileNum: mobNum
			});
			// sap.ui.getCore().mobNum = that.getView().byId("idnum").getValue();
			//this.odataService.read("TechnicianNo?MobileNo='" + mobNum + "'", null, null, false, function (response) {
			// 	if (response.Message === "Valid No") {
			// 		that.getOwnerComponent().getModel("oTechnician").setData(response);
			// 		that.getOwnerComponent().getModel("oTechnician").refresh(true);
			// 		that.getOwnerComponent().getRouter().navTo("RouteHome");

			// 	} else {
			// 		MessageBox.error("Enter Valid Number");
			// 		that.getView().byId("idnum").setValue("");
			// 	}
			// });

		}

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf com.quinnox.IoTTechnicians.view.Login
		 */
		// onBeforeRendering: function () {

		// }

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf com.quinnox.IoTTechnicians.view.Login
		 */
		// onAfterRendering: function () {

		// }

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf com.quinnox.IoTTechnicians.view.Login
		 */
		//	onExit: function() {
		//
		//	}

	});

});