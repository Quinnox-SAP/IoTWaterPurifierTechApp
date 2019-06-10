sap.ui.define([
	"com/quinnox/IoTTechnicians/controller/BaseController",
	"sap/m/Button",
	"sap/m/Dialog",
	"sap/m/Label",
	"sap/m/MessageToast",
	"sap/m/Text",
	"sap/m/TextArea",
	"sap/m/MessageBox",
	"sap/ui/model/Filter",
	"sap/ui/core/routing/History",
], function (BaseController, Button, Dialog, Label, MessageToast, Text, TextArea, MessageBox, Filter, History) {
	"use strict";

	return BaseController.extend("com.quinnox.IoTTechnicians.controller.OpenServRequests", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.quinnox.IoTTechnicians.view.OpenServRequests
		 */
		onInit: function () {
			this.result = {};
			this.result.items = [];
			this.odataService = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZQNX_IOT_SRV/", true);

			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("RouteOpenServRequests").attachPatternMatched(this._onObjectMatched, this);
			this.getView().addEventDelegate({
				onBeforeShow: jQuery.proxy(function (evt) {
					this.onBeforeShow(evt);
				}, this)
			});
		},
		onBeforeShow: function () {
			// this.getView().byId("searchId").setValue("");
		},
		_onObjectMatched: function (oEvent) {
			var that = this;
			that.getView().byId("searchId").setValue("");
			var aFilters = [];
			var sQuery = "";
			if (sQuery && sQuery.length > 0) {
				var filter = new Filter("NotiNumber", sap.ui.model.FilterOperator.Contains, sQuery);
				aFilters.push(filter);
			}

			// update list binding
			var list = this.byId("idList");
			var binding = list.getBinding("items");
			binding.filter(aFilters);
			var mobNum = oEvent.getParameter("arguments").mobileNum;
			that.mobNum = mobNum;
			this.odataService.read("TechnicianMasterSet?$filter=TechnicianNo eq '" + mobNum + "' and ReqType eq 'X'", null,
				null, false,
				function (
					response) {
					that.getOwnerComponent().getModel("oOpenServices").setData(response);
					that.getOwnerComponent().getModel("oOpenServices").refresh(true);
					//that.getOwnerComponent().getRouter().navTo("RouteOpenServRequests");
				});
			this.getView().byId("idList").removeSelections(true);
			// this.getView().byId("searchId").setValue("");
			// that.getOwnerComponent().getModel("oOpenServices").refresh(true);
		},

		onSearch: function (oEvt) {
			// add filter for search
			var aFilters = [];
			var sQuery = oEvt.getSource().getValue();
			if (sQuery && sQuery.length > 0) {
				var filter = new Filter("NotiNumber", sap.ui.model.FilterOperator.Contains, sQuery);
				aFilters.push(filter);
			}

			// update list binding
			var list = this.byId("idList");
			var binding = list.getBinding("items");
			binding.filter(aFilters);
		},

		onListItemPress: function (evt) {
			// var that = this;
			// sap.ui.getCore().address = that.getView().byId("idAddress").getValue();
			//this.getOwnerComponent().getRouter().navTo("RouteGoogleMap");
			//console.log(sap.ui.getCore().address);
			// var oList = this.getView().byId("idList");
			// var sItems = oList.getSelectedItems();
			sap.ui.getCore().serviceReqNo = evt.getSource().getTitle();
		},

		onAddress: function (Evt) {
			sap.ui.getCore().address = Evt.getSource().getText();
			this.getOwnerComponent().getRouter().navTo("RouteGoogleMap");
		},

		onSubmitDialog: function () {
			//if (!this.submitDialog) {
			var oList = this.getView().byId("idList");
			var sItems = oList.getSelectedItems();
			for (var i = sItems.length - 1; i >= 0; i--) {
				var path = sItems[i].getBindingContext("oOpenServices").getPath();
				var idx = parseInt(path.substring(path.lastIndexOf('/') + 1));
			}
			// console.log(idx);
			var data = this.getView().getModel("oOpenServices").getData();
			sap.ui.getCore().serviceRequestNumber = data.results[idx].NotiNumber;
			// console.log(serviceRequestNumber);
			this.submitDialog = sap.ui.xmlfragment("com.quinnox.IoTTechnicians.view.Remarks", this);
			this.submitDialog.open();
			//}
		},

		onSavePress: function () {
			var oRef = this;
			var cause = sap.ui.getCore().byId("idCause").getValue();
			var remarks = sap.ui.getCore().byId("idRemarks").getValue();
			if (cause !== "" && remarks !== "") {
				var data = {};
				if (cause === "Short Circuit") {
					cause = "EL00";
				} else if (cause === "Loose Connector") {
					cause = "EL01";
				} else if (cause === "Operating Sequence Error") {
					cause = "EL02";
				} else if (cause === "Incorrect SetPoint") {
					cause = "EL03";
				} else if (cause === "Operating Error") {
					cause = "EL04";
				}
				data.ServiiceRequestNo = sap.ui.getCore().serviceRequestNumber;
				data.CauseCode = cause;
				data.Remarks = remarks;
				this.odataService.read("TechnicianNotifCompleteSet(ServiiceRequestNo='" + sap.ui.getCore().serviceRequestNumber + "',CauseCode='" +
					cause + "',Remarks='" + remarks + "')",
					null,
					null,
					function (odata, response) {
						// this.getView().getModel("oOpenServices").refresh(true);
						// Message = Failure;
					},
					function (response) {
						//console.log(response);
						MessageBox.information("Service Request Closed Sucessfully", {
							title: "Service Request Confirmation",
							actions: [MessageBox.Action.OK],
							onClose: function (oAction) {
								if (oAction == sap.m.MessageBox.Action.OK) {
									this.getView().getModel("oOpenServices").refresh(true);

									var sHistory = History.getInstance();
									var sPreviousHash = sHistory.getPreviousHash();
									if (sPreviousHash !== undefined) {
										window.history.go(-1);
									} else {
										this.getOwnerComponent().getRouter().navTo("RouteHome", {
											mobileNum: this.mobNum,
										});
									}

									// console.log(this.getView().getModel("oOpenServices").getData());
								}
							}.bind(oRef)

						});
						// var that = this;
						// that.getView().getModel("oOpenServices").refresh(true);
					}
				);

				this.submitDialog.close();
				this.submitDialog.destroy();
			} else {
				MessageBox.error("Enter all the fields");
			}
		},
		onCancelPress: function () {
			this.submitDialog.close();
			this.submitDialog.destroy();
		},
		onNavBack: function () {
			var that = this;
			that.getView().byId("searchId").setValue("");
			var aFilters = [];
			var sQuery = "";
			if (sQuery && sQuery.length > 0) {
				var filter = new Filter("NotiNumber", sap.ui.model.FilterOperator.Contains, sQuery);
				aFilters.push(filter);
			}

			// update list binding
			var list = this.byId("idList");
			var binding = list.getBinding("items");
			binding.filter(aFilters);
			// this.odataService.read("TechnicianMasterSet?$filter=TechnicianNo eq '" + this.mobNum + "' and ReqType eq 'X'", null,
			// 	null, false,
			// 	function (
			// 		response) {

			// 		that.getOwnerComponent().getModel("oOpenServices").setData(response);
			// 		that.getOwnerComponent().getModel("oOpenServices").refresh(true);
			// 		//that.getOwnerComponent().getRouter().navTo("RouteOpenServRequests");
			// 	});
			// that.getOwnerComponent().getModel("oOpenServices").refresh(true);
			var sPreviousHash = History.getInstance().getPreviousHash();
			if (sPreviousHash !== undefined) {
				history.go(-1);
			} else {
				this.getOwnerComponent().getRouter().navTo("RouteLogin");
			}
		},
			onPress:function(){
			this.getOwnerComponent().getRouter().navTo("Login");
		}

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf com.quinnox.IoTTechnicians.view.OpenServRequests
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf com.quinnox.IoTTechnicians.view.OpenServRequests
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf com.quinnox.IoTTechnicians.view.OpenServRequests
		 */
		//	onExit: function() {
		//
		//	}

	});

});