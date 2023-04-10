sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"../model/formatter",
	"sap/m/Button",
	"sap/m/Dialog",
	"sap/m/Text",
	"sap/m/TextArea",
], function (BaseController, JSONModel, formatter, Button, Dialog, Text, TextArea) {
	"use strict";

	return BaseController.extend("com.marturfompak.propositionmanagement.propositionmanagement.controller.Object", {

		formatter: formatter,
		onInit: function () {
			this.oModel = this.getOwnerComponent().getModel();
			this.getSideNavigationList();
			this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);
		},
		_onObjectMatched: function (oEvent) {
			this.setModel(new JSONModel({
				"propositionDetail": {},
				"enabled": false
			}), "detailFormModel");

			this.detailFormModel = this.getModel("detailFormModel");

			var sBimkd = oEvent.getParameter("arguments").Bimkd,
				sPernr = oEvent.getParameter("arguments").Pernr,
				sSeqnr = oEvent.getParameter("arguments").Seqnr;
			this.getPropositionDetail(sBimkd, sPernr, sSeqnr);
		},
		getPropositionDetail: function (sBimkd, sPernr, sSeqnr) {

			var _this = this,
				sObjectPath = this.oModel.createKey("/PropositonTabSet", {
					Bimkd: sBimkd,
					Pernr: sPernr,
					Seqnr: sSeqnr
				});
			sap.ui.core.BusyIndicator.show(0);
			_this.oModel.read(sObjectPath, {
				success: function (oData, oResponse) {
					sap.ui.core.BusyIndicator.hide(0);
					_this.detailFormModel.setProperty("/propositionDetail", oData);
					debugger;
				},
				error: function (oError) {
					sap.ui.core.BusyIndicator.hide(0);
					debugger;
				},

			});
		},
		onPressCancel: function (oEvent) {
			this.showDialog("cancelTitle", "cancelHint", "Error", "cancelBeginButon", "cancelEndButton", "C");
			debugger;
		},
		onPressObjection: function (oEvent) {
			this.showDialog("objectionTitle", "objectionHint", "Error", "objectionBeginButon", "objectionEndButton", "O");
			debugger;
		},
		showDialog: function (sTitle, hint, state, beginButton, endButton, type) {
			debugger;
			var i18n = this.getResourceBundle();
			var _this = this;
			var dialog = new Dialog({
				title: i18n.getText(sTitle),
				type: "Message",
				state: state,
				content: type == 'O' ? [
					new TextArea("objectionDialogTextArea", {
						width: "100%",
						placeholder: i18n.getText(hint),
					}),
				] : new Text({
					text: i18n.getText(hint)
				}),
				beginButton: new Button({
					text: i18n.getText(beginButton),
					press: function () {
						_this.updateObjection(type, type == 'O' ? sap.ui
							.getCore()
							.byId("objectionDialogTextArea")
							.getValue() : "");
						/*switch (type) {
							case "C":
								_this._callCreate("kontroleGonder1");
								break;
							case "O":
								_this._callCreate("onayaGonder1");
								break;
						}*/
						dialog.close();
					}
				}),
				endButton: new Button({
					text: i18n.getText(endButton),
					press: function () {
						dialog.close();
					}
				}),
				afterClose: function () {
					dialog.destroy();
				}
			});
			dialog.open();
		},
		updateObjection: function (type, message) {
			var _this = this,
				propData = _this.detailFormModel.getData().propositionDetail;
			debugger;
			var sObjectPath = this.oModel.createKey("/PropositonTabSet", {
				Bimkd: propData.Bimkd,
				Pernr: propData.Pernr,
				Seqnr: propData.Seqnr
			});
			sap.ui.core.BusyIndicator.show(0);
			var oParams = {},
				oEntry = {
					Indni: message,
					type: type
				};
			oParams.success = function (oData, oResponse) {
				sap.ui.core.BusyIndicator.hide(0);
				debugger;
			}.bind(_this);

			oParams.error = function (oError) {
				sap.ui.core.BusyIndicator.hide(0);
				debugger;
			};

			oParams.async = true;
			_this.oModel.update(sObjectPath, oEntry, oParams);
		}

	});


});