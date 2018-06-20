function initModel() {
	var sUrl = "/sap/opu/odata/sap/Z_PM_GW_SERVICE_SRV/";
	var oModel = new sap.ui.model.odata.ODataModel(sUrl, true);
	sap.ui.getCore().setModel(oModel);
}