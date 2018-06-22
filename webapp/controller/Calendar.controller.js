sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox"
], function(Controller, MessageBox) {
	"use strict";

	return Controller.extend("com.espedia.demo.EquipmentCalendar.controller.Calendar", {
		_dateFilter: null,
		onInit: function() {
			this._cModel = new sap.ui.model.json.JSONModel({
				"Data": []
			});
			
			this.getView().byId("calendar").setBuiltInViews(["Day", "Week", "Month", "One Month"]);

			this.getOwnerComponent().getModel().attachMetadataLoaded(null, this.updateCalendar, this);
			this.getOwnerComponent().getModel().attachMetadataLoaded(null, this.setDefaultFirstView, this);
			this.getView().byId("calendar").setModel(this._cModel);
			this.getView().byId("maintPlanForm").setModel(this._cModel);
		},

		setDefaultFirstView: function() {
			this.getView().byId("calendar").setViewKey("Week");
			this.getView().getModel().detachMetadataLoaded(this.setDefaultFirstView);
		},

		updateCalendar: function() {
			this.getDatesShown();
			this.readCalendarData();
		},

		pressDebug: function() {
			var c = this.getView().byId("calendar");
			this.getDatesShown();
		},

		onDateChange: function() {
			this.updateCalendar();
		},

		onViewKeyChange: function(oEvent) {
			this.updateCalendar();
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
			this._startDate = new Date(startDate.valueOf());
			this._endDate = new Date(endDate.valueOf());
			startDate = null;
			endDate = null;

		},

		readCalendarData: function() {
			this.getView().getModel().read("/EquipmentCalendarSet", {
				"filters": [this._dateFilter],
				"success": function(oData) {
					var data = [];
					var entity = {};
					var index, entry;
					for (var i in oData.results) {
						entry = oData.results[i];
						if (entry.Equipment.length < 1 || (entry.ScheduledStartDate < this._startDate || entry.ScheduledStartDate > this._endDate)) {
							continue;
						}
						entity = {};
						index = data.findIndex(function(el) {
							return el.Equipment === entry.Equipment;
						});
						if (index > -1) {
							entity.ScheduledStartDate = entry.ScheduledStartDate;
							entity.DummyEndDate = new Date(entry.ScheduledStartDate.valueOf());
							entity.ScheduledStartDate.setHours(0);
							entity.DummyEndDate.setHours(23, 59);
							entity.MaintPlanCall = entry.MaintPlanCall;
							entity.MaintenancePlan = entry.MaintenancePlan;
							entity.MaintItemDescruption = entry.MaintItemDescruption;
							entity.type = (entry.WorkOrder && entry.WorkOrder.length > 0) ? "Type06" : "Type04";
							entity.WorkOrder = entry.WorkOrder;

							entity.CallHorizon = entry.CallHorizon;
							entity.SchedulingPeriod = entry.SchedulingPeriod;
							entity.SchedulingPeriodUnit = entry.SchedulingPeriodUnit;
							entity.TaskListType = entry.TaskListType;
							entity.TaskListGroup = entry.TaskListGroup;
							entity.GroupCounter = entry.GroupCounter;
							entity.TaskListDescription = entry.TaskListDescription;

							data[index]["Appointments"].push(entity);
						} else {
							entity.Equipment = entry.Equipment;

							var appointment = {};
							appointment.ScheduledStartDate = entry.ScheduledStartDate;
							appointment.DummyEndDate = new Date(entry.ScheduledStartDate.valueOf());
							appointment.ScheduledStartDate.setHours(0);
							appointment.DummyEndDate.setHours(23, 59);

							appointment.MaintPlanCall = entry.MaintPlanCall;
							appointment.MaintenancePlan = entry.MaintenancePlan;
							appointment.MaintItemDescruption = entry.MaintItemDescruption;
							appointment.type = (entry.WorkOrder && entry.WorkOrder.length > 0) ? "Type06" : "Type04";
							appointment.WorkOrder = entry.WorkOrder;
							
							appointment.CallHorizon = entry.CallHorizon;
							appointment.SchedulingPeriod = entry.SchedulingPeriod;
							appointment.SchedulingPeriodUnit = entry.SchedulingPeriodUnit;
							appointment.TaskListType = entry.TaskListType;
							appointment.TaskListGroup = entry.TaskListGroup;
							appointment.GroupCounter = entry.GroupCounter;
							appointment.TaskListDescription = entry.TaskListDescription;

							
							entity.Appointments = [appointment];
							data.push(entity);
						}
					}
					this._cModel.setData({
						"Data": data
					});
				}.bind(this),
				"error": function(err) {
					MessageBox.error(err.message);
				}
			});
		},

		handleAppointmentSelect: function(oEvent) {
			var oAppointment = oEvent.getParameter("appointment");
			var sPath = oEvent.getParameter("appointment").getBindingContext().getPath();
			//var selectedRow = oEvent.getParameter("appointment").getParent().getBindingContext().getPath();
			this.getView().byId("maintPlanForm").bindElement(sPath);
			var appointmentData = this._cModel.getProperty(sPath);
			if (appointmentData.WorkOrder && appointmentData.WorkOrder.length > 0){
				this.getView().byId("maintOrderForm").setVisible(true);
			this.getView().byId("maintOrderForm").bindElement("/OrderSet('" + appointmentData.WorkOrder +"')");     
			} else {
				this.getView().byId("maintOrderForm").setVisible(false);
			}
			if (oAppointment) {
				this.getView().byId("DynamicSideContent").setShowSideContent(true);
				sap.m.MessageToast.show("Appointment selected: " + oAppointment.getTitle() + "\n" + oAppointment.getText());
			} else {
				this.getView().byId("DynamicSideContent").setShowSideContent(false);
				var aAppointments = oEvent.getParameter("appointments");
				var sValue = aAppointments.length + " Appointments selected";
				sap.m.MessageBox.show(sValue);
			}
		},
		
		hideSideContent: function() {
			this.getView().byId("DynamicSideContent").setShowSideContent(false);
		}
	});
});