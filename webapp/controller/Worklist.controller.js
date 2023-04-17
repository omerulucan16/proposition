sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "../model/formatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (BaseController, JSONModel, formatter, Filter, FilterOperator) {
    "use strict";

    return BaseController.extend("com.marturfompak.propositionmanagement.propositionmanagement.controller.Worklist", {

        formatter: formatter,

        /* =========================================================== */
        /* lifecycle methods                                           */
        /* =========================================================== */

        /**
         * Called when the worklist controller is instantiated.
         * @public
         */
        onInit: function () {
            this.oModel = this.getOwnerComponent().getModel();
            var oPropositionListModel = new JSONModel({
                activeTab: "1",
                isAnother: false,
                pernr: "",
                proposition: {},
                userList: [],
                totalCount1:0,
                totalCount2:0,
                totalCount3:0,
                totalCount4:0,
                totalCount5:0
            });
            //test
            this.setModel(oPropositionListModel, "listViewModel");
            this.listViewModel = this.getModel("listViewModel");
            this.listViewModel.setSizeLimit(999999999);
            this.getSideNavigationList();
            this.getRouter()
                .getRoute("worklistAnother")
                .attachPatternMatched(this._onObjectMatchedAnother, this);
            this.getRouter()
                .getRoute("worklist")
                .attachPatternMatched(this._onObjectMatched, this);
        },

        _onObjectMatched: function (oEvent) {
            this.listViewModel.setProperty("/isAnother", false);
            this.listViewModel.setProperty("/pernr", "");
            this.listViewModel.setProperty("/selectedKey","worklist");
            this.getPropositionList(this.listViewModel.getData().activeTab, false, "");
        },
        _onObjectMatchedAnother: function (oEvent) {
            this.listViewModel.setProperty("/isAnother", true);
            this.listViewModel.setProperty("/selectedKey","worklistAnother");
            this.getManagersUserList();
            this.getPropositionList(this.listViewModel.getData().activeTab, true, this.listViewModel.getData().pernr);
            debugger;
        },
        onSearch: function (oEvent) {
            this.listViewModel.setProperty("/isAnother", true);
            this.getManagersUserList();
            this.getPropositionList(this.listViewModel.getData().activeTab, true, this.listViewModel.getData().pernr);
            debugger;

        },
        onPressDetail:function(oEvent)
        {
           var selectedStructure  = this.listViewModel.getProperty(oEvent.oSource.oBindingContexts.listViewModel.sPath);
            this.getRouter().navTo("object", {
                Bimkd:selectedStructure.Bimkd,
                Pernr:selectedStructure.Pernr,
                Seqnr:selectedStructure.Seqnr
              });
        },
        changeTotalCounts:function(key,total)
        {
            this.listViewModel.setProperty("/totalCount1", 0);
            this.listViewModel.setProperty("/totalCount2", 0);
            this.listViewModel.setProperty("/totalCount3", 0);
            this.listViewModel.setProperty("/totalCount4", 0);
            this.listViewModel.setProperty("/totalCount5", 0);
            this.listViewModel.setProperty("/totalCount"+key, total);
        },
        onStatusFilter: function (oEvent) {
            this.listViewModel.setProperty("/activeTab", oEvent.getSource().getSelectedKey());

            this.getPropositionList(this.listViewModel.getData().activeTab, this.listViewModel.getData().isAnother, this.listViewModel.getData().pernr);
        },
        getPropositionList: function (tabId, isAnotherUser, pernr) {
            debugger;
            var _this = this,
                oEntry = {
                    IvTabNo: tabId,
                    Pernr: isAnotherUser == true ? pernr : "",
                    IsWorkerPropPermission: isAnotherUser == true ? "true" : "false",
                    navStatisticsPropositionTab: []
                };
            sap.ui.core.BusyIndicator.show(0);
            _this.oModel.create("/StatisticsSet", oEntry, {
                success: function (oDatas) {
                    debugger;

                    delete oDatas.__metadata;
                    var results = [];
                    oDatas.navStatisticsPropositionTab.results.forEach(function (item) {
                        results.push(item);
                    });
                    oDatas.navStatisticsPropositionTab = results;
                    _this.listViewModel.setProperty("/proposition", oDatas);
                    _this.changeTotalCounts(tabId,oDatas.navStatisticsPropositionTab.length);
                    sap.ui.core.BusyIndicator.hide(0);
                },
                error: function (oError) {
                    sap.ui.core.BusyIndicator.hide(0);
                },
            });
            debugger;
        },
        getManagersUserList: function () {
            var _this = this;
           
            _this.oModel.read("/UserEmployeesSet", {
                success: function (oData, oResponse) {
                  
                    oData.results.unshift({
                        Pernr: "",
                        Ename: _this.getResourceBundle().getText("all"),
                    });
                    _this.listViewModel.setProperty("/userList", oData.results);
                    _this.listViewModel.setProperty("/isAnother", true);
                    debugger;
                },
                error: function (oError) {
                    
                    _this.listViewModel.setProperty("/isAnother", false);
                    debugger;
                },
            });
        },
        onNavBack: function () {

            history.go(-1);
        },onRefresh: function () {
            var oTable = this.byId("table");
            oTable.getBinding("items").refresh();
        },
        _showObject: function (oItem) {
            this.getRouter().navTo("object", {
                objectId: oItem.getBindingContext().getPath().substring("/agreementHeaderSet".length)
            });
        },


    });
});