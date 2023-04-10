sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/m/MessageBox",
    "sap/m/library"
], function (Controller, UIComponent,MessageBox, mobileLibrary) {
    "use strict";

    // shortcut for sap.m.URLHelper
    var URLHelper = mobileLibrary.URLHelper;

    return Controller.extend("com.marturfompak.propositionmanagement.propositionmanagement.controller.BaseController", {
        /**
         * Convenience method for accessing the router.
         * @public
         * @returns {sap.ui.core.routing.Router} the router for this component
         */
        getRouter: function () {
            return UIComponent.getRouterFor(this);
        },
        createSucces: function (i18nName,i18nParam,isNav,navValue) {
            var _this = this;
            MessageBox.success(
              _this.getModel("i18n").getResourceBundle().getText(i18nName, [i18nParam]),
              {
                actions: [MessageBox.Action.OK],
                onClose: function (sAction) {
                  if (sAction == "OK") 
                  {
                    sap.ui.core.BusyIndicator.hide();
                    if(isNav === true)
                    _this.getRouter().navTo(navValue);
                  }
                 
                  
                },
              }
            );
          },
          
        getSideNavigationList: function () {
            this.i18n = this.getOwnerComponent().getModel("i18n");
            this.mainModel = this.getOwnerComponent().getModel("mainModel");
            var NavigationList = [{
                title: this.i18n.getProperty("mainMenuHeader"),
                icon: "sap-icon://customer-and-supplier",
                enabled: true,
                expanded: true,
                selectedKey:"worklist",
                items: [{
                        title: this.i18n.getProperty("navCreateForm"),
                        key: "CreateForm",
                        enabled: true,
                    }, {
                        title: this.i18n.getProperty("navCreateFormAnother"),
                        key: "CreateFormAnother",
                        enabled: true,
                    },
                    {
                        title: this.i18n.getProperty("navListForms"),
                        key: "worklist",
                        enabled: true,
                    },
                    {
                        title: this.i18n.getProperty("navListFormsAnother"),
                        key: "worklistAnother",
                        enabled: true,
                    }
                ],

                key: "3",
            }, ];
            this.mainModel.setProperty("/navigation", NavigationList);
        },
        onSideNavButtonPress: function () {
			var viewId = this.getView().getId();
			var toolPage = sap.ui.getCore().byId(viewId + "--toolPage");
			var sideExpanded = toolPage.getSideExpanded();
			debugger;
			this._setToggleButtonTooltip(sideExpanded);

			toolPage.setSideExpanded(!toolPage.getSideExpanded());
		},
        _setToggleButtonTooltip: function (bLarge) {
			var toggleButton = this.byId('sideNavigationToggleButton');
			if (bLarge) {
				toggleButton.setTooltip('Large Size Navigation');
			} else {
				toggleButton.setTooltip('Small Size Navigation');
			}
		},
        onItemSelect: function (oEvent) {
            if (!oEvent.getParameter("item").getAggregation("items")) {
                var item = oEvent.getParameter("item");
                if (item.getKey() == "worklist") {
                    this.getRouter().navTo("worklist");
                } else {
                    this.getRouter().navTo(item.getKey());
                }
            } else {
                if (oEvent.getParameter("item").getProperty("expanded"))
                    oEvent.getParameter("item").setProperty("expanded", false);
                else oEvent.getParameter("item").setProperty("expanded", true);
            }

            //var viewId = this.getView().getId();
            //sap.ui.getCore().byId(viewId + "--pageContainer").to(viewId + "--" + item.getKey());
        },
        getModel: function (sName) {
            return this.getView().getModel(sName);
        },

        /**
         * Convenience method for setting the view model.
         * @public
         * @param {sap.ui.model.Model} oModel the model instance
         * @param {string} sName the model name
         * @returns {sap.ui.mvc.View} the view instance
         */
        setModel: function (oModel, sName) {
            return this.getView().setModel(oModel, sName);
        },

        /**
         * Getter for the resource bundle.
         * @public
         * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
         */
        getResourceBundle: function () {
            return this.getOwnerComponent().getModel("i18n").getResourceBundle();
        },

        /**
         * Event handler when the share by E-Mail button has been clicked
         * @public
         */
        onShareEmailPress: function () {
            var oViewModel = (this.getModel("objectView") || this.getModel("worklistView"));
            URLHelper.triggerEmail(
                null,
                oViewModel.getProperty("/shareSendEmailSubject"),
                oViewModel.getProperty("/shareSendEmailMessage")
            );
        }
    });

});