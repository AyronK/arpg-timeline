import CMS from "decap-cms-app";
import { TimezoneDateWidget } from "@/components/Cms/TimezoneDateWidget/TimezoneDateWidget";

(() => {
  window.CMS_MANUAL_INIT = true;

  window.onload = function () {
    CMS.init();
    CMS.registerWidget(
      TimezoneDateWidget.name,
      TimezoneDateWidget.controlComponent,
      TimezoneDateWidget.previewComponent,
    );
  };
})();
