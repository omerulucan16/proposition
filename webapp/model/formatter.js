sap.ui.define([], function () {
    "use strict";

    return {

        /**
         * Rounds the number unit value to 2 digits
         * @public
         * @param {string} sValue the number string to be rounded
         * @returns {string} sValue with 2 digits rounded
         */
        numberUnit : function (sValue) {
            if (!sValue) {
                return "";
            }
            return parseFloat(sValue).toFixed(2);
        },
        deleteZeros:function(sValue)
        {
            return parseInt(sValue);
        },
        setStatus:function(sValue)
        {

            return sValue == "05" ? "Success" : sValue == "06" ? "Error" : sValue == "07" ? "Success" : "Warning";
        },
        DetailColorShemeControl:function(sValue)
        {
            return sValue == "05" ? 7 : sValue == "06" ? 3 : sValue == "07" ? 7 : 1;
        }

    };

});