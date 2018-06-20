sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";

	return Controller.extend("com.espedia.demo.EquipmentCalendar.controller.Calendar", {
		onInit: function() {
			this._cModel = new sap.ui.model.json.JSONModel();

			this._cModel.setData({
				startDate: new Date("2017", "0", "15", "8", "0"),
				equipments: [{
					pic: "data/images/9767676.jpg",
					name: "Mechanical Arm Model 192.3A",
					"id": "9767676",
					visible: false,
					appointments: [{
						start: new Date("2017", "0", "8", "08", "30"),
						end: new Date("2017", "0", "8", "09", "30"),
						title: "Meet Max Mustermann",
						type: "Type02",
						tentative: false
					}]
				}, {
					pic: "data/images/9878787.jpg",
					name: "Industrial Packer 78",
					"id": "9878787",
					visible: true,
					appointments: [{
						start: new Date("2017", "0", "10", "18", "00"),
						end: new Date("2017", "0", "10", "19", "10"),
						title: "Discussion of the plan",
						info: "Online meeting",
						type: "Type04",
						tentative: false
					}, {
						start: new Date("2017", "0", "15", "08", "00"),
						end: new Date("2017", "0", "15", "09", "30"),
						title: "Discussion of the plan",
						info: "Online meeting",
						type: "Type04",
						tentative: false
					}],
					headers: [{
						start: new Date("2017", "0", "15", "9", "0"),
						end: new Date("2017", "0", "15", "10", "0"),
						title: "Payment reminder",
						type: "Type06"
					}, {
						start: new Date("2017", "0", "15", "16", "30"),
						end: new Date("2017", "0", "15", "18", "00"),
						title: "Private appointment",
						type: "Type06"
					}]
				}]
			});
			this.getView().byId("calendar").setModel(this._cModel);
		},

		pressDebug: function() {
			debugger;
			var c = this.getView().byId("calendar");
			this.getDatesShown();
		},

		getDatesShown: function() {
			var cal = this.getView().byId("calendar");
			var startDate = cal.getStartDate();
			var endDate = new Date(startDate.valueOf());
			/*function addDays(date, days) {
				var result = new Date(date);
				result.setDate(result.getDate() + days);
				return result;
			}*/
			var view = cal.getViewKey();
			switch (view) {
				case "Hour":
				//	endDate = new Date(startDate.valueOf());
					break;
				case "Day":
				//	endDate = new Date(startDate.valueOf());
					endDate.setDate(endDate.getDate() + 20);
					break;
				case "Week":
					endDate.setDate(endDate.getDate() + 7);
					break;
				case "Month":
					endDate.setDate(endDate.getDate() + 365);
					break;
				case "One Month":
						endDate.setDate(endDate.getDate() + 31);
					break;
			}
			this.getView().byId("startDate").setText(startDate.toDateString());
			this.getView().byId("endDate").setText(endDate.toDateString());
			startDate = null;
			endDate = null;
			debugger;
		}
	});
});