import CMS from "decap-cms-app";

(() => {
  window.CMS_MANUAL_INIT = true;

  window.onload = function () {
    CMS.init();
  };
})();
