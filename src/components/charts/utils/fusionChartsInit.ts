import FusionCharts from "fusioncharts";
import Charts from "fusioncharts/fusioncharts.charts";
import * as ReactFC from "react-fusioncharts";
import FusionTheme from "fusioncharts/themes/fusioncharts.theme.fusion";
import Widgets from "fusioncharts/fusioncharts.widgets";

// Disable export feature to prevent chunk loading errors
FusionCharts.options = {
  creditLabel: false,
  exportEnabled: false, // Disable export functionality
};

// Initialize FusionCharts only on client side
if (typeof window !== "undefined") {
  // Initialize core FusionCharts with basic charts
  if (!window.__fusioncharts_initialized) {
    ReactFC.default.fcRoot(FusionCharts, Charts, FusionTheme);
    window.__fusioncharts_initialized = true;
  }

  // Initialize widgets module for gauge charts
  if (!window.__fusioncharts_widgets_initialized) {
    FusionCharts.addDep(Widgets);
    window.__fusioncharts_widgets_initialized = true;
  }
}

// Add type declaration for window
declare global {
  interface Window {
    __fusioncharts_initialized?: boolean;
    __fusioncharts_widgets_initialized?: boolean;
  }
}

// Export the React component
const ReactFusioncharts = ReactFC.default;
export default ReactFusioncharts;
