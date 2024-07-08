sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/Dialog",
    "sap/m/MessageBox",
    'sap/ui/export/library',
    "sap/ui/export/Spreadsheet",
    'sap/ui/model/Filter',
	'sap/ui/model/FilterOperator',
    'sap/ui/model/odata/v2/ODataModel',
],
function (Controller,Dialog,MessageBox,exportLibrary,Spreadsheet,Filter,FilterOperator,ODataModel) {
    "use strict";

    var EdmType = exportLibrary.EdmType;

    return Controller.extend("createmultiple.controller.View1", {
        onInit: function () {           
            this.tableRead();
            //this.getView().setModel(new sap.ui.model.json.JSONModel({ data: [] }));
        },

// Code below this is for switch button
        onMasterSwitch: function(oEvent){
            this._aColumns = [this.byId("_IDGenColumn6"),this.byId("_IDGenColumn7")];
            this._aColumns.forEach(function(oColumn){
                var bVisible = oColumn.getVisible();
                oColumn.setVisible(!bVisible);

            });
            var bState = oEvent.getParameter("state");
            // var aDependentSwitches = ["switch0","switch1","switch2","switch3","switch4"]
            // var oSwitch, oEvent;

            // aDependentSwitches.forEach(function(sId){
            //     oSwitch = this.byId(sId);
            //     oSwitch.setState(bState);

            //     oEvent = new sap.ui.base.Event("change", oSwitch, { state: bState});
            //     oSwitch.fireEvent("change", oEvent.getParameters());
            // }.bind(this));
            this.byId("switch0").setState(bState);
            this.byId("switch1").setState(bState);
            this.byId("switch2").setState(bState);
            this.byId("switch3").setState(bState);
            this.byId("switch4").setState(bState);

        },
        onSwitchID: function(){
            this._aColumns = [this.byId("_IDGenColumn2"),this.byId("_IDGenColumn3"),
            this.byId("_IDGenColumn4"),this.byId("_IDGenColumn5"),this.byId("_IDGenColumn6"),
            this.byId("_IDGenColumn7")];
            this._aColumns.forEach(function(oColumn){
                var bVisible = oColumn.getVisible();
                oColumn.setVisible(!bVisible);

            });

        },
        onSwitchName: function(){
            this._aColumns = [this.byId("_IDGenColumn1"),this.byId("_IDGenColumn3"),
            this.byId("_IDGenColumn4"),this.byId("_IDGenColumn5"),this.byId("_IDGenColumn6"),
            this.byId("_IDGenColumn7")];
            this._aColumns.forEach(function(oColumn){
                var bVisible = oColumn.getVisible();
                oColumn.setVisible(!bVisible);

            });

        },

        onSwitchDept: function(){
            this._aColumns = [this.byId("_IDGenColumn1"),this.byId("_IDGenColumn2"),
            this.byId("_IDGenColumn4"),this.byId("_IDGenColumn5"),this.byId("_IDGenColumn6"),
            this.byId("_IDGenColumn7")];
            this._aColumns.forEach(function(oColumn){
                var bVisible = oColumn.getVisible();
                oColumn.setVisible(!bVisible);

            });

        },

        onSwitchEmail: function(){
            this._aColumns = [this.byId("_IDGenColumn1"),this.byId("_IDGenColumn2"),
            this.byId("_IDGenColumn3"),this.byId("_IDGenColumn5"),this.byId("_IDGenColumn6"),
            this.byId("_IDGenColumn7")];
            this._aColumns.forEach(function(oColumn){
                var bVisible = oColumn.getVisible();
                oColumn.setVisible(!bVisible);

            });

        },

        onSwitchMana: function(){
            this._aColumns = [this.byId("_IDGenColumn1"),this.byId("_IDGenColumn2"),
            this.byId("_IDGenColumn3"),this.byId("_IDGenColumn4"),this.byId("_IDGenColumn6"),
            this.byId("_IDGenColumn7")];
            this._aColumns.forEach(function(oColumn){
                var bVisible = oColumn.getVisible();
                oColumn.setVisible(!bVisible);

            });

        },

// End of switch button codes//

            onToggleFilterBarPress: function () {
                this._oFilterBar = this.byId("filterBar");
                var bVisible = this._oFilterBar.getVisible();              
                this._oFilterBar.setVisible(!bVisible);
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

        deleteTableRead1: function(){
            var oModel = this.getOwnerComponent().getModel();
            var oJSONModel = new sap.ui.model.json.JSONModel();
            oModel.read("/EmployeeDeleted", {
                urlParameters:{
                    "$expand": "Department"
                },
                success: function(resp){
                    oJSONModel.setData(resp.results);
                    this.getView().setModel(oJSONModel,"EmployeeDeletedDataModel");
                }.bind(this),
                error:function(error){

                }
            })
        },

    
        onRefresh: function(){
            this.tableRead();

        },

        onNavToDetails: function(oEvent) {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            //var sID = oEvent.getSource().getCells()[0].getText();
            oRouter.navTo("create");
        },

        onAddRow: function() {
            const myUniversallyUniqueID2 = globalThis.crypto.randomUUID();
            var oTable = this.getView().byId("batchTable");
            this.oTableModel = this.getView().getModel("jTabModel").getProperty("/Carriers");
            var oNewRow = {
            "ID": myUniversallyUniqueID2,
            "Name": "",
            "Department": "",
            "Email": "",
            "Manager": ""
            };
            this.oTableModel.push(oNewRow);
            this.getView().getModel("jTabModel").setProperty("/Carriers", this.oTableModel);
        },


        openUpdateFrag: function() {
            var that = this;
            that.array = [];
            var oTable = that.getView().byId("table");
            var items = oTable.getSelectedItem();
            if (items === null) {
            sap.m.MessageBox.warning("Please Select Records");
            } else {
            
            if (!this.oDialog) {
            this.oDialog = sap.ui.xmlfragment("createmultiple.fragment.update", this);
            this.getView().addDependent(this.oDialog);
            }
            this.oDialog.open();
            }
            var selectedItem = that.getView().byId("table").getSelectedItems();
            for (var i = 0; i <= selectedItem.length - 1; i++) {
            var item = selectedItem[i];
            that.array.push(item.getBindingContext("tableModel").getObject());
            }
            var updateModel = new sap.ui.model.json.JSONModel(that.array);
            that.getView().setModel(updateModel, "updateModel");
        },

        onSaveMulti: function() {
            var that = this;
            var addedProdCodeModel = that.getView().getModel("updateModel").getData();
            var url = that.getOwnerComponent().getModel().sServiceUrl;
            var oDataModel = new sap.ui.model.odata.ODataModel(url);
            var batchChanges = [];
            for (var i = 0; i < addedProdCodeModel.length; i++) {
            var addRow = addedProdCodeModel[i];
            var SCACGroupVal = addRow.ID;
            var uPath = "/Employee(" + SCACGroupVal + ")";
            addRow.UpdatedDate = new Date().toISOString();
            // oDataModel.update("/EmpdataSet('" + addRow.Employeeid + "')", addRow);
            batchChanges.push(oDataModel.createBatchOperation(uPath, "PUT", addRow));
            }
            oDataModel.addBatchChangeOperations(batchChanges);
            oDataModel.submitBatch(function(oData, oResponse) {
            // Success callback function
            if (oResponse.statusCode === "202" || oResponse.statusCode === 202) {
            sap.m.MessageBox.success("Recorde Updated Successfully");
            that.tableRead();
            }
            // Handle the response data
            }, function(oError) {
            // Error callback function
            sap.m.MessageBox.waning("failed");
            // Handle the error
            });
            this.oDialog.close();
        },
            
        onCancel1: function() {
            this.oDialog.close();
        },

        onCancel2: function() {
            this.oDialog1.close();          
        },

        onSearch: function (oEvent) {
                var that = this;
                var oParams = oEvent.getParameters();
                var aSelectionVariants = oParams.selectionSet;
                var aTableFilters = [];
                aSelectionVariants.forEach(function (oControl) {
                    var sKey = oControl.getName();
                    if (oControl instanceof sap.m.MultiComboBox) {
                        var aSelectedKeys = oControl.getSelectedKeys();
                        aSelectedKeys.forEach(function (sValue) {
                            var oFilter = new sap.ui.model.Filter(sKey, sap.ui.model.FilterOperator.EQ, sValue);
                            aTableFilters.push(oFilter);
                        });
                    }
                    else if (oControl instanceof sap.m.DateRangeSelection) {
 
                        sKey = oControl.getParent().getProperty("name");
                        var oDateRange = that.getView().byId("_IDGenDatePicker1");
                        var oDate1 = oDateRange.getDateValue();
                        var oDate2 = oDateRange.getSecondDateValue();
                        //var range1 =oEvent.getParameter("value");
                        var dateArray = [];
                        var i = 0;
                        while (oDate1 < oDate2) {
 
                            dateArray[i] = new Date(oDate1.setHours(5, 30, 0, 0));
 
                            oDate1.setDate(oDate1.getDate() + 1);
                            i++;
                        }
                        dateArray.forEach(function (arrayElement) {
                            var oFilter = new sap.ui.model.Filter(sKey, sap.ui.model.FilterOperator.EQ, arrayElement);
                            aTableFilters.push(oFilter);
 
                        });
                    }
                        
                });
                var oTable = this.byId("table");
                var oBinding = oTable.getBinding("items");
                oBinding.filter(aTableFilters, "Application");
        },

        MultiDelete: function() {
            var that = this;
                var oTable = that.getView().byId("table");
                var items = oTable.getSelectedItem();
                if (items === null) {
                    sap.m.MessageBox.warning("Please Select Records");
                } else {
                    var url = that.getOwnerComponent().getModel().sServiceUrl;
                    var oDataModel = new sap.ui.model.odata.ODataModel(url);
                    var batchChanges = [];
                    var uPath2 = "/EmployeeDeleted"
                    var jModel = that.getView().byId("table").getSelectedItems();
                    for (var i = 0; i < jModel.length; i++) {
                        var oEntry = jModel[i].getBindingContext("tableModel").getObject();
                        var SCACGroupVal1 = oEntry.ID;
                        //var SCACGroupVal = parseInt(SCACGroupVal1);
                        var uPath = "/Employee(" + SCACGroupVal1 + ")";
                        batchChanges.push(oDataModel.createBatchOperation(uPath2, "POST", oEntry));
                        batchChanges.push(oDataModel.createBatchOperation(uPath, "DELETE", oEntry));
                    }
                    oDataModel.addBatchChangeOperations(batchChanges);
                    oDataModel.submitBatch(function (oData, oResponse) {
                        // Success callback function
                        if (oResponse.statusCode === "202" || oResponse.statusCode === 202) {
                            sap.m.MessageBox.success("Records Deleted Successfully");
                            that.tableRead();
                    
                        }
                        // Handle the response data
                    }, function (oError) {
                        // Error callback function
                        sap.m.MessageBox.success("failed");
                        // Handle the error
                    });
                }
        },

        openDeleteFrag: function() {
            var oModel = this.getOwnerComponent().getModel();
            var oJSONModel = new sap.ui.model.json.JSONModel();
            oModel.read("/EmployeeDeleted", {
                urlParameters:{
                    "$expand": "Department"
                },
                success: function(resp){
                    oJSONModel.setData(resp.results);
                    this.getView().setModel(oJSONModel,"EmployeeDeletedDataModel");
                }.bind(this),
                error:function(error){

                }
            })
            if(!this.oDialog1){
                this.loadFragment({
                    name:"createmultiple.fragment.deleted"
                }).then(function(odialog1){
                    this.oDialog1 = odialog1;
                    this.oDialog1.open();
                    
                }.bind(this))
            }else{
                this.oDialog1.open();
               
            }
        },

        onExporttoExcel: function(){
            var oTable = this.getView().byId("table");
            var oBinding = oTable.getBinding('items');
            var aCols = this.createColumnConfig();

            var oSettings = {
                workbook:{
                    columns:aCols,
                    hierarchyLevel:"Level"
                },
                dataSource:oBinding,
                fileName:"Employee Data.xlsx"
            }

            var oSheet = new Spreadsheet(oSettings);
            oSheet.build().finally(function(){
                oSheet.destroy();
            })
        },

        createColumnConfig: function() {
			var aCols = [];
            //var EdmType = exportLibrary.EdmType;

			aCols.push({
				label: "ID",
				property:"ID",
                type: EdmType.String
				
			});

			aCols.push({
				label: 'Name',
                property: 'Name',
                type: EdmType.String
			});

			aCols.push({
				label: 'Department',
                property: 'Department/DepartmentName',
                type: EdmType.String
			});

			aCols.push({
				label: 'Email',
                property: 'Email',
                type: EdmType.String
			});

            aCols.push({
				label: 'Manager',
                property: 'Manager',
                type: EdmType.String
			});

			aCols.push({
				label: 'Created Date',
                property: 'CreatedDate',
                type: EdmType.Date
			});

            aCols.push({
				label: 'Updated Date',
				type: EdmType.Date,
                property: 'UpdatedDate',
                type: EdmType.Date
			});

			
			return aCols;
		},

        onExportToPDF: function() {
            var oTable = this.getView().byId("table");
            var aItems = oTable.getItems();
            var aTableData = [];
        
            // Get the column headers
            var aColumns = oTable.getColumns();
            var aColumnHeaders = [];
            for (var k = 0; k < aColumns.length; k++) {
                var sHeaderText = aColumns[k].getHeader().getText();
                aColumnHeaders.push(sHeaderText);
            }
            aTableData.push(aColumnHeaders); // Add column headers to table data
        
            // Prepare table data
            for (var i = 0; i < aItems.length; i++) {
                var aRowData = [];
                var aCells = aItems[i].getCells();
                for (var j = 0; j < aCells.length; j++) {
                    var sText = aCells[j].getText();
                    aRowData.push(sText);
                }
                aTableData.push(aRowData);
            }
        
            // Define the PDF document
            var docDefinition = {
                content: [
                    {
                        table: {
                            headerRows: 1,
                            columns: aCells.length,
                            widths: [55,55,55,55,55,65,65], // Adjust number of columns
                            body: aTableData
                        }
                    }
                ]
            };
            // Create and download the PDF
            pdfMake.createPdf(docDefinition).download("EmployeeData.pdf");
        },


        onFileChange: function (oEvent) {
            var oFileUploader = oEvent.getSource(),
                aFiles = oEvent.getParameter("files"),
                oFile = aFiles[0];
 
            if (oFile) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    var data = e.target.result;
                    var workbook = XLSX.read(data, { type: "binary" });
 
                    // Assuming the data is in the first sheet
                    var firstSheetName = workbook.SheetNames[0];
                    var worksheet = workbook.Sheets[firstSheetName];
 
                    // Convert to JSON
                    var jsonData = XLSX.utils.sheet_to_json(worksheet);
 
                    // Now you have the JSON data, you can post it to the backend
                    this.postDataToBackend(jsonData);
                }.bind(this);
 
                reader.onerror = function (ex) {
                    console.error(ex);
                };
 
                reader.readAsBinaryString(oFile);
            }
        },
 
        postDataToBackend: function (jsonData) {
            // Assuming you have an OData model set in your component
            var that = this;
            //var oModel = this.getView().getModel();
            var url = that.getOwnerComponent().getModel().sServiceUrl;
            var oDataModel = new sap.ui.model.odata.ODataModel(url);
            oDataModel.setUseBatch(true);
            var aBatchOperations = [];
 
            jsonData.forEach(function (oRecord) {
                var oEntry = {
                    // Map your JSON fields to your OData entity fields
                    // For example:
                    // Field1: oRecord.Field1,
                    // Field2: oRecord.Field2,
                    ID: oRecord.ID,
                    Name: oRecord.Name,
                    Department_ID: oRecord.Department_ID,
                    Email: oRecord.Email,
                    Manager: oRecord.Manager,
                    CreatedDate: new Date().toISOString(),
                };
 
                aBatchOperations.push(oDataModel.createBatchOperation("/Employee", "POST", oEntry));
            });
 
            // Perform batch operation
            oDataModel.addBatchChangeOperations(aBatchOperations);
            oDataModel.submitBatch(function (oData, oResponse) {
                sap.m.MessageBox.success("Data posted successfully!");
            }, function (oError) {
                sap.m.MessageBox.success("Error posting data!");
            });
        },


       
    });
});
