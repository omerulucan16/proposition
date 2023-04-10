sap.ui.define([
    "sap/ui/base/Object",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (UI5Object, MessageBox, Filter, FilterOperator) {
    "use strict";

    return UI5Object.extend("com.marturfompak.propositionmanagement.propositionmanagement.controller.ErrorHandler", {

        /**
         * Handles application errors by automatically attaching to the model events and displaying errors when needed.
         * @class
         * @param {sap.ui.core.UIComponent} oComponent reference to the app's component
         * @public
         * @alias com.marturfompak.propositionmanagement.propositionmanagement.controller.ErrorHandler
         */
        constructor : function (oComponent) {
            this._oResourceBundle = oComponent.getModel("i18n").getResourceBundle();
			this._oComponent = oComponent;
			this._oModel = oComponent.getModel();
			this._bMessageOpen = false;
			this._sErrorText = this._oResourceBundle.getText("errorText");

			this._oModel.attachMetadataFailed(function (oEvent) {
				var oParams = oEvent.getParameters();
				this._showServiceError(oParams.response);
			}, this);

			this._oModel.attachRequestFailed(function (oEvent) {
				var oParams = oEvent.getParameters();
				// An entity that was not found in the service is also throwing a 404 error in oData.
				// We already cover this case with a notFound target so we skip it here.
				// A request that cannot be sent to the server is a technical error that we have to handle though
				if (oParams.response.statusCode !== "404" || (oParams.response.statusCode === 404 && oParams.response.responseText.indexOf("Cannot POST") === 0)) {
					this._showServiceError(oParams.response);
				}
			}, this);
        },

        /**
         * Shows a {@link sap.m.MessageBox} when a service call has failed.
         * Only the first error message will be displayed.
         * @param {string} sErrorTitle A title for the error message
         * @param {string} sDetails A technical error to be displayed on request
         * @private
         */
        _showServiceError: function(sDetails) {

			var jsonError, errorDetails, errorMessage = "",
				msg = "";

			try {
                debugger;
				jsonError = JSON.parse(sDetails.responseText);
				errorDetails = jsonError.error.innererror.errordetails;

				if (errorDetails && errorDetails.length > 0) {
					for (var i in errorDetails) {
						if (msg !== errorDetails[i].message && errorDetails[i].code !="/IWBEP/CX_SD_GEN_DPC_BUSINS" ) {
							msg = errorDetails[i].message;
							errorMessage += "\u2022 " + msg + "\n";
						}
					}
				} else {
					errorMessage += "\u2022 " + jsonError.error.message.value + "\n";
				}
			} catch (exception) {
				errorMessage = this._sErrorText;
			}

			if (this._bMessageOpen) {
				return;
			}
			this._bMessageOpen = true;
			MessageBox.error(
				errorMessage, {
					id: "serviceErrorMessageBox",
					details: errorDetails,
					styleClass: this._oComponent.getContentDensityClass(),
					actions: [MessageBox.Action.CLOSE],
					onClose: function() {
						this._bMessageOpen = false;
					}.bind(this)
				}
			);
			sap.ui.core.BusyIndicator.hide(0);
		}
    });
});