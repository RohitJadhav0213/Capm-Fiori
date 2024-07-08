sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/Dialog",
    "sap/m/MessageBox",
    'sap/ui/model/Filter',
	'sap/ui/model/FilterOperator'
],
function (Controller,Dialog,Button,MessageBox) {
    "use strict";

    return Controller.extend("createmultiple.controller.create", {
        onInit: function () {

            const myUniversallyUniqueID = globalThis.crypto.randomUUID();
            var depID = this.byId("Department").getValue();
            // var depID = parseInt(a);
            console.log(depID);
            //console.log(depID,typeof(depID));
            var that = this;
            var data = { 
            "Carriers": [{
            "ID": myUniversallyUniqueID,
            "Name": "",
            //"Department":"",
            "Department_ID":depID,
            "Email": "",
            "Manager": "",
            "visible": false
            }]
            };
            console.log(data);
            //var oTable = this.byId("batchTable");
            var oModel1 = new sap.ui.model.json.JSONModel();
            //oModel1 = this.getView().getModel();
            // var oBindingInfo = {
            //     path: "/Employee",
            //     urlparameters: {
            //         $expand: "Department"
            //     },
            //     template: oTable.getBindingInfo("items").template
            // };
            oModel1.setData(data);
            this.getView().setModel(oModel1, "jTabModel");
            
        },
        
            

        onCancel: function(){
            window.history.go(-1);

        },
        onAddRow: function() {
            const myUniversallyUniqueID2 = globalThis.crypto.randomUUID();
            var depID = this.byId("Department").getValue();
            
            console.log(depID)
            var oTable = this.getView().byId("batchTable");
            this.oTableModel = this.getView().getModel("jTabModel").getProperty("/Carriers");
            var oNewRow = {
            "ID": myUniversallyUniqueID2,
            "Name": "",
            //"Department":"",
            "Department_ID":depID,
            "Email": "",
            "Manager": "",
            "CreatedDate" : "",
            };
            this.oTableModel.push(oNewRow);
            this.getView().getModel("jTabModel").setProperty("/Carriers", this.oTableModel);
        },

         //this is the GET operation
         tableRead: function() {
            var that = this;
            var oModel = new sap.ui.model.json.JSONModel({
            tabbleItems: ""
            });
            that.getView().setModel(oModel, "tableModel");
            // var oDataModel = that.getOwnerComponent().getModel();
            var url = that.getOwnerComponent().getModel().sServiceUrl;
            var oDataModel = new sap.ui.model.odata.ODataModel(url);
            oDataModel.read("/Employee", {
                urlParameters:{
                    "$expand": "Department"
                },
                success: function(data, res) {
                    if (res.statusCode === "200" || res.statusCode === 200) {
                    oModel.setData({
                    EmpdataSet: data.results
                    });
                }
                },
                error: function(error) {
                    var errorMsg = JSON.parse(error.responseText).error.message;
                }
            });

        },

        onBatchSave: function() {
            var that = this;
            var addedProdCodeModel = that.getView().getModel("jTabModel").getData();
            console.log(addedProdCodeModel);
            var batchChanges = [];
            var url = that.getOwnerComponent().getModel().sServiceUrl;
            var oDataModel = new sap.ui.model.odata.ODataModel(url);
            oDataModel.setUseBatch(true);
            var uPath = "/Employee";
            for (var i = 0; i < addedProdCodeModel.Carriers.length; i++) {
            var addRow = addedProdCodeModel.Carriers[i];
            delete addRow.visible;
            addRow.CreatedDate = new Date().toISOString();
            batchChanges.push(oDataModel.createBatchOperation(uPath, "POST", addRow));
            }
            oDataModel.addBatchChangeOperations(batchChanges);
            oDataModel.submitBatch(function(oData, oResponse) {
            // Success callback function
            if (oResponse.statusCode === "202" || oResponse.statusCode === 202) {    
                sap.m.MessageBox.success("Recorde Created Successfully");
                
                that.tableRead();
                window.history.go(-1);
                   
            }
            // Handle the response data
            }, function(oError) {
            // Error callback function
            //sap.m.MessageBox.success("failed");
            // Handle the error
            });
        
        },

        onBatchSave2: function() {
            var that = this;
            var addedProdCodeModel = that.getView().getModel("jTabModel").getData();
            console.log(addedProdCodeModel);
            var batchChanges = [];
            var url = that.getOwnerComponent().getModel().sServiceUrl;
            var oDataModel = new sap.ui.model.odata.ODataModel(url);
            oDataModel.setUseBatch(true);
            //var uPath = "/Employee";
            for (var i = 0; i < addedProdCodeModel.Carriers.length; i++) {
                var addRow = addedProdCodeModel.Carriers[i];
                delete addRow.visible;
                addRow.CreatedDate = new Date().toISOString();
                jQuery.ajax({
                    type: "POST",
                    contentType: "application/json",
                    url: "/v2/odata/v4/employee/Employee",
                    data: JSON.stringify(addRow)
                    // success: function (data) {
                    //     MessageBox.success("Data saved to database successfully!");
                    // },
                    // error: function (err) {
                    //     MessageBox.error("Error saving data to local database: " + err.responseText);
                    // }
                });
            }
            
        
        }
    });
});
