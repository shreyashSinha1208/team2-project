export interface TreeNode {
  id: string;
  name: string;
  title?: string;
  children?: TreeNode[];
}

export interface ChartJsData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
  }[];
}
