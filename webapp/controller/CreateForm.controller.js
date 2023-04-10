sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "../model/formatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (BaseController, JSONModel, formatter, Filter, FilterOperator) {
    "use strict";

    return BaseController.extend("com.marturfompak.propositionmanagement.propositionmanagement.controller.CreateForm", {

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
            this.getSideNavigationList();

            this.getRouter()
                .getRoute("CreateForm")
                .attachPatternMatched(this._onObjectMatched, this);
            this.getRouter()
                .getRoute("CreateFormAnother")
                .attachPatternMatched(this._onObjectMatchedAnother, this);


        },
        setDefaultModel: function () {
            var oCreatePropositionModel = new JSONModel({
                ename: "",
                pernr: "",
                explanation: "",
                suggestionSolution: "",
                selectedCategory: "",
                userList: [],
                isForAnotherUser: false,
                isCreatable: true
            });
            this.setModel(oCreatePropositionModel, "createFormModel");
            this.createFormModel = this.getModel("createFormModel");
        },
        _onObjectMatched: function (oEvent) {
            this.setDefaultModel();
            this.createFormModel.setProperty("/selectedKey","CreateForm");
            this.getInitialDatas();

        },
        _onObjectMatchedAnother: function (oEvent) {
            this.setDefaultModel();
            this.createFormModel.setProperty("/selectedKey","CreateFormAnother");
            this.getInitialDatas('X');

        },
        onPressClose: function (oEvent) {
                       
                this.getRouter().navTo(this.createFormModel.getProperty("/isForAnotherUser") == true ? "worklistAnother" : "worklist", {}, true);
        },
        getInitialDatas: function (isAnotherPerson) {
            sap.ui.core.BusyIndicator.show(0);
            var _this = this;

            _this.oModel.read("/UserSet('" + isAnotherPerson + "')", {
                success: function (oData, oResponse) {

                    _this.createFormModel.setProperty("/ename", oData.Ename);
                    _this.createFormModel.setProperty("/pernr", oData.Pernr);
                    debugger;
                    if (oData.IsWorkerPropPermission === 'X')
                        _this.getManagersUserList();
                    else
                        sap.ui.core.BusyIndicator.hide(0);
                },
                error: function (oError) {
                    sap.ui.core.BusyIndicator.hide(0);
                },
            });
        },
        getManagersUserList: function () {
            var _this = this;

            _this.oModel.read("/UserEmployeesSet", {
                success: function (oData, oResponse) {
                    sap.ui.core.BusyIndicator.hide(0);
                    _this.createFormModel.setProperty("/userList", oData.results);
                    _this.createFormModel.setProperty("/isForAnotherUser", true);
                    debugger;
                },
                error: function (oError) {
                    sap.ui.core.BusyIndicator.hide(0);
                    _this.createFormModel.setProperty("/isForAnotherUser", false);
                    _this.createFormModel.setProperty("/isCreatable", false);
                    debugger;
                },
            });
        },

        onPressSave: function (oEvent) {
            debugger;
            var _this = this,
                createData = _this.createFormModel.getData();
            sap.ui.core.BusyIndicator.show(0);
            var parsedModel = {
                "Katgr": createData.selectedCategory,
                "PrbTan": createData.explanation,
                "OnerCoz": createData.suggestionSolution,
                "Pernr": createData.isForAnotherUser === true ? createData.selectedUser : ""
            }
            this.oModel.create("/PropositionSet", parsedModel, {
                success: function (oDatas) {
                    debugger;
                    _this.createSucces("successCreateProposition", oDatas.Bimkd, true, "worklist");
                    // param1 i18n name , eğer varsa değişicek alan , true ise gidip sayfa geçişi yapar , gidilecek sayfa
                    sap.ui.core.BusyIndicator.hide(0);
                },
                error: function (oError) {
                    debugger;
                    sap.ui.core.BusyIndicator.hide(0);
                },
            });
            debugger;
        },



        onNavBack: function () {

            history.go(-1);
        },






    });
});