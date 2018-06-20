sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox"
], function(Controller, MessageBox) {
	"use strict";

	return Controller.extend("com.espedia.demo.EquipmentCalendar.controller.Calendar", {
		_dateFilter: null,
		onInit: function() {
			//this.getView().byId("calendar").setViewKey("Week");
			this._cModel = new sap.ui.model.json.JSONModel({
				"Data": []
			});
			this.getDatesShown();
			debugger;
			/*this.getOwnerComponent().getModel().read("/EquipmentCalendarSet", {
				"filters": [this._dateFilter],
				"success": function(oData) {
					debugger;
				}.bind(this),
				"error": function(err) {
					MessageBox.error(err.message);
					debugger;
				}
			});*/
			this.getOwnerComponent().getModel().attachMetadataLoaded(null, this.updateCalendar, this);
			this.getView().byId("calendar").setModel(this._cModel);
			/*	this._cModel.setData({
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
				this.getView().byId("calendar").setModel(this._cModel);*/
		},

		updateCalendar: function() {
			this.getDatesShown();
			this.readCalendarData();
		},

		pressDebug: function() {
			debugger;
			var c = this.getView().byId("calendar");
			this.getDatesShown();
		},

		onDateChange: function() {
			/*var date = this.getView().byId("calendar").getStartDate().toDateString();
			sap.m.MessageToast.show(date);*/
			this.updateCalendar();
			//this.readCalendarData();
		},

		onViewKeyChange: function(oEvent) {
			this.updateCalendar();
			//this.readCalendarData();
		},

		getDatesShown: function() {
			var cal = this.getView().byId("calendar");
			var startDate = cal.getStartDate();
			var endDate = new Date(startDate.valueOf());
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
			};
			this._dateFilter = new sap.ui.model.Filter("ScheduledStartDate", sap.ui.model.FilterOperator.BT, startDate, endDate);
			this.getView().byId("startDate").setText(startDate.toDateString());
			this.getView().byId("endDate").setText(endDate.toDateString());
			startDate = null;
			endDate = null;

		},

		readCalendarData: function() {
			this.getView().getModel().read("/EquipmentCalendarSet", {
				"filters": [this._dateFilter],
				"success": function(oData) {
					var data = [];
					var entity = {};
					var index;
					for (var entry of oData.results) {
						if (entry.Equipment.length < 1) {
							continue;
						}
						entity = {};
						index = data.findIndex(function(el) {
							return el.Equipment === entry.Equipment;
						});
						if (index > -1) {
							entity.ScheduledStartDate = entry.ScheduledStartDate;
							entity.DummyEndDate = new Date(entry.ScheduledStartDate.valueOf() + 3600 * 1000 * 10);
							entity.MaintPlanCall = entry.MaintPlanCall;
							entity.MaintenancePlan = entry.MaintenancePlan;
							entity.MaintItemDescruption = entry.MaintItemDescruption;
							//if (entry.WorkOrder && entry.WorkOrder.length > 0) {
							entity.type = (entry.WorkOrder && entry.WorkOrder.length > 0) ? "Type06" : "Type04";
							//}
							entity.WorkOrder = entry.WorkOrder;
							data[index]["Appointments"].push(entity);
						} else {
							entity.Equipment = entry.Equipment;

							var appointment = {};
							appointment.ScheduledStartDate = entry.ScheduledStartDate;
							appointment.DummyEndDate = new Date(entry.ScheduledStartDate.valueOf() + 3600 * 1000 * 10);
							appointment.MaintPlanCall = entry.MaintPlanCall;
							appointment.MaintenancePlan = entry.MaintenancePlan;
							appointment.MaintItemDescruption = entry.MaintItemDescruption;
							//if (entry.WorkOrder && entry.WorkOrder.length > 0) {
							appointment.type = (entry.WorkOrder && entry.WorkOrder.length > 0) ? "Type06" : "Type04";
							//}
							appointment.WorkOrder = entry.WorkOrder;
							entity.Appointments = [appointment];
							data.push(entity);
						}
					}
					this._cModel.setData({
						"Data": data
					});
					debugger;
				}.bind(this),
				"error": function(err) {
					MessageBox.error(err.message);
					debugger;
				}
			});
		},
		
		handleAppointmentSelect: function(oEvent) {
			var oAppointment = oEvent.getParameter("appointment");
			if (oAppointment) {
				sap.m.MessageBox.show("Appointment selected: " + oAppointment.getTitle() + "\n" + oAppointment.getText());
			} else {
				var aAppointments = oEvent.getParameter("appointments");
				var sValue = aAppointments.length + " Appointments selected";
				sap.m.MessageBox.show(sValue);
			}
		}
	});
});