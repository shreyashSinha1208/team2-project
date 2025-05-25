declare module "fusioncharts" {
  interface FusionChartsStatic {
    options: {
      creditLabel: boolean;
      [key: string]: any;
    };
    addDep(dep: any): void;
    [key: string]: any;
  }
  const FusionCharts: FusionChartsStatic;
  export default FusionCharts;
}

declare module "fusioncharts/fusioncharts.charts" {
  const Charts: any;
  export default Charts;
}

declare module "fusioncharts/fusioncharts.widgets" {
  const Widgets: any;
  export default Widgets;
}

declare module "fusioncharts/themes/fusioncharts.theme.fusion" {
  const FusionTheme: any;
  export default FusionTheme;
}

declare module "react-fusioncharts" {
  import { ComponentType } from "react";

  interface FusionChartsProps {
    type?: string;
    width?: string | number;
    height?: string | number;
    dataFormat?: string;
    dataSource?: any;
    [key: string]: any;
  }

  interface ReactFCStatic extends ComponentType<FusionChartsProps> {
    fcRoot: (...args: any[]) => void;
  }

  const ReactFC: ReactFCStatic;
  export default ReactFC;
}
