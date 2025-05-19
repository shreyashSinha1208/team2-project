import React, { useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  TooltipProps,
  Rectangle,
  ReferenceLine,
  ReferenceDot,
} from "recharts";
import { useTheme } from "next-themes";
import DropDown from "../DropDown";

// Type definitions
interface DataPoint {
  xValue: string;
  value?: number;
  status?: "On time" | "Ahead" | "Behind";
  [key: string]: string | number | undefined;
}

interface ClassData {
  classId: string;
  class: string;
  data: DataPoint[];
}

interface FilterOption {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

interface SeriesConfig {
  name: string;
  dataKey: string;
  color: string;
  showDots?: boolean;
}

interface StatusConfig {
  name: string;
  color: string;
}

interface HighlightPoint {
  x: string | number;
  y: number;
  color?: string;
}

interface AnalyticsChartProps {
  chartType: "bar" | "line";
  classData: ClassData[];

  // First dropdown (original class dropdown)
  classOptions?: FilterOption[];
  initialClass?: string;
  onClassChange?: (value: string) => void;

  // Second dropdown
  showSecondDropdown?: boolean;
  secondDropdownOptions?: FilterOption[];
  secondDropdownInitial?: string;
  secondDropdownLabel?: string;
  onSecondDropdownChange?: (value: string) => void;

  // Third dropdown
  showThirdDropdown?: boolean;
  thirdDropdownOptions?: FilterOption[];
  thirdDropdownInitial?: string;
  thirdDropdownLabel?: string;
  onThirdDropdownChange?: (value: string) => void;

  // Multiple dropdown layout
  showMultipleDropdowns?: boolean;

  title?: string;
  subtitle?: string;
  seriesConfig?: SeriesConfig[];
  statusConfig?: StatusConfig[];
  yAxisDomain?: [number, number];
  yAxisTicks?: number[];
  highlightPoint?: HighlightPoint;
  className?: string;
}

// Theme colors based on system preference
const themeColors = {
  light: {
    backgroundColor: "white",
    textPrimary: "#1f2937", // gray-900
    textSecondary: "#9ca3af", // gray-400
    border: "#e5e7eb", // gray-200
    chart: {
      gridLines: "#f0f0f0",
      axisText: "#888888",
    },
  },
  dark: {
    backgroundColor: "#1f2937", // gray-800
    textPrimary: "#f9fafb", // gray-50
    textSecondary: "#6b7280", // gray-500
    border: "#374151", // gray-700
    chart: {
      gridLines: "#374151",
      axisText: "#9ca3af", // gray-400
    },
  },
};

// Default status colors
const defaultStatusConfig = [
  { name: "On time", color: "#10B981" }, // green
  { name: "Ahead", color: "#3B82F6" }, // blue
  { name: "Behind", color: "#EF4444" }, // red
];

/**
 * AnalyticsChart - A unified chart component that can render bar or line charts
 *
 * This component is designed to be flexible and reusable for different analytics
 * visualizations. It supports up to three dropdowns for filtering, responsive design,
 * and theme switching.
 */
const AnalyticsChart: React.FC<AnalyticsChartProps> = ({
  chartType = "bar",
  classData = [],

  // First dropdown (original)
  classOptions = [],
  initialClass = null,
  onClassChange = null,

  // Second dropdown
  showSecondDropdown = false,
  secondDropdownOptions = [],
  secondDropdownInitial = null,
  secondDropdownLabel = "Filter 2",
  onSecondDropdownChange = null,

  // Third dropdown
  showThirdDropdown = false,
  thirdDropdownOptions = [],
  thirdDropdownInitial = null,
  thirdDropdownLabel = "Filter 3",
  onThirdDropdownChange = null,

  // Multiple dropdown layout
  showMultipleDropdowns = false,

  title = "ANALYTICS",
  subtitle = "Chart description",
  seriesConfig = [],
  statusConfig = defaultStatusConfig,
  yAxisDomain = [0, 100],
  yAxisTicks = [0, 20, 40, 60, 80, 100],
  highlightPoint = null,
  className = "",
}) => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  // Use the initialClass or the first option as default
  const [selectedClass, setSelectedClass] = useState<string>(
    initialClass || (classOptions.length > 0 ? classOptions[0].value : "")
  );

  // Second dropdown state
  const [selectedSecondFilter, setSelectedSecondFilter] = useState<string>(
    secondDropdownInitial ||
      (secondDropdownOptions.length > 0 ? secondDropdownOptions[0].value : "")
  );

  // Third dropdown state
  const [selectedThirdFilter, setSelectedThirdFilter] = useState<string>(
    thirdDropdownInitial ||
      (thirdDropdownOptions.length > 0 ? thirdDropdownOptions[0].value : "")
  );

  // Get current class data based on selection
  const currentData =
    classData.find(
      (dataItem) =>
        dataItem.classId === selectedClass || dataItem.class === selectedClass
    )?.data || [];

  // Handle class selection change (first dropdown)
  const handleClassChange = (value: string) => {
    setSelectedClass(value);
    if (onClassChange) {
      onClassChange(value);
    }
  };

  // Handle second dropdown change
  const handleSecondDropdownChange = (value: string) => {
    setSelectedSecondFilter(value);
    if (onSecondDropdownChange) {
      onSecondDropdownChange(value);
    }
  };

  // Handle third dropdown change
  const handleThirdDropdownChange = (value: string) => {
    setSelectedThirdFilter(value);
    if (onThirdDropdownChange) {
      onThirdDropdownChange(value);
    }
  };

  // Get status color (for bar chart)
  const getStatusColor = (status: string) => {
    const statusItem = statusConfig.find((item) => item.name === status);
    return statusItem ? statusItem.color : "#888888";
  };

  // Custom bar shape to create rounded bars
  const CustomBar = (props: any) => {
    const { x, y, width, height, fill } = props;
    return (
      <Rectangle
        x={x}
        y={y}
        width={width}
        height={height}
        fill={fill}
        radius={[20, 20, 20, 20]} // rounded corners
      />
    );
  };

  // Bar chart tooltip component
  const BarChartTooltip: React.FC<TooltipProps<number, string>> = ({
    active,
    payload,
    label,
  }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const value = data.value as number;
      const status = data.payload.status;

      return (
        <div
          className={`
          ${isDarkMode ? "bg-gray-900" : "bg-gray-800"} 
          text-white px-4 py-3 rounded-lg shadow-lg
          border ${isDarkMode ? "border-gray-700" : "border-gray-600"}
          min-w-[160px]
        `}
        >
          <p className="text-lg font-medium text-center mb-2">
            <span className="text-blue-400 mr-1">{value}%</span>
            <span>complete</span>
          </p>
          <p className="text-sm text-gray-300 font-medium mb-2">{label}</p>
          <div className="pt-1 border-t border-gray-700">
            <div className="flex items-center text-sm">
              <span
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: getStatusColor(status) }}
              ></span>
              <span>Status: {status}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // Line chart tooltip component
  const LineChartTooltip: React.FC<TooltipProps<number, string>> = ({
    active,
    payload,
    label,
  }) => {
    if (active && payload && payload.length) {
      // Calculate average of all values in this data point
      const allValues = payload
        .map((p) => p.value as number)
        .filter((v) => !isNaN(v));
      const avgScore =
        allValues.length > 0
          ? (
              allValues.reduce((sum, val) => sum + val, 0) / allValues.length
            ).toFixed(1)
          : "N/A";

      return (
        <div
          className={`
          ${isDarkMode ? "bg-gray-900" : "bg-gray-800"} 
          text-white px-4 py-3 rounded-lg shadow-lg
          border ${isDarkMode ? "border-gray-700" : "border-gray-600"}
          min-w-[160px] max-w-[240px]
        `}
        >
          <p className="text-lg font-medium text-center mb-2">
            <span className="text-teal-400 mr-1">{avgScore}%</span>
            <span>avg score</span>
          </p>
          <p className="text-sm text-gray-300 font-medium mb-2">{label}</p>
          <div className="space-y-1 pt-1 border-t border-gray-700">
            {payload.map((entry, index) => (
              <div
                key={index}
                className="flex justify-between items-center text-sm"
              >
                <div className="flex items-center">
                  <span
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: entry.color }}
                  ></span>
                  <span>{entry.name}: </span>
                </div>
                <span className="font-medium">
                  {Number(entry.value).toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  // Render bar chart
  const renderBarChart = () => (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={currentData}
        margin={{ top: 20, right: 20, left: 10, bottom: 10 }}
        barSize={60}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke={
            isDarkMode
              ? themeColors.dark.chart.gridLines
              : themeColors.light.chart.gridLines
          }
        />
        <XAxis
          dataKey="xValue"
          axisLine={false}
          tickLine={false}
          tick={{
            fill: isDarkMode
              ? themeColors.dark.chart.axisText
              : themeColors.light.chart.axisText,
            fontSize: 12,
          }}
        />
        <YAxis
          domain={yAxisDomain}
          ticks={yAxisTicks}
          axisLine={false}
          tickLine={false}
          tick={{
            fill: isDarkMode
              ? themeColors.dark.chart.axisText
              : themeColors.light.chart.axisText,
            fontSize: 12,
          }}
        />
        <Tooltip
          content={<BarChartTooltip />}
          cursor={false}
          wrapperStyle={{ zIndex: 100 }}
        />

        <Bar dataKey="value" name="Progress" shape={<CustomBar />}>
          {currentData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={getStatusColor(entry.status || "")}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );

  // Render line chart
  const renderLineChart = () => (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={currentData}
        margin={{ top: 20, right: 20, left: 10, bottom: 10 }}
      >
        <defs>
          {seriesConfig.map((series, idx) => (
            <linearGradient
              key={idx}
              id={`color${series.dataKey}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="5%" stopColor={series.color} stopOpacity={0.2} />
              <stop offset="95%" stopColor={series.color} stopOpacity={0} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke={
            isDarkMode
              ? themeColors.dark.chart.gridLines
              : themeColors.light.chart.gridLines
          }
        />
        <XAxis
          dataKey="xValue"
          axisLine={false}
          tickLine={false}
          tick={{
            fill: isDarkMode
              ? themeColors.dark.chart.axisText
              : themeColors.light.chart.axisText,
            fontSize: 12,
          }}
        />
        <YAxis
          domain={yAxisDomain}
          ticks={yAxisTicks}
          axisLine={false}
          tickLine={false}
          tick={{
            fill: isDarkMode
              ? themeColors.dark.chart.axisText
              : themeColors.light.chart.axisText,
            fontSize: 12,
          }}
        />
        <Tooltip
          content={<LineChartTooltip />}
          cursor={false}
          position={{ y: 100 }}
          wrapperStyle={{ zIndex: 100 }}
        />

        <ReferenceLine
          y={0}
          stroke={
            isDarkMode ? themeColors.dark.border : themeColors.light.border
          }
        />

        {seriesConfig.map((series, idx) => (
          <Line
            key={idx}
            type="monotone"
            dataKey={series.dataKey}
            name={series.name}
            stroke={series.color}
            strokeWidth={2.5}
            dot={series.showDots || false}
            activeDot={{ r: 6, fill: series.color }}
            isAnimationActive={true}
            fill={`url(#color${series.dataKey})`}
          />
        ))}

        {/* Add highlight point if provided */}
        {highlightPoint && (
          <ReferenceDot
            x={highlightPoint.x}
            y={highlightPoint.y}
            r={6}
            fill={highlightPoint.color || "#ff7300"}
            stroke="none"
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  );

  // Render legend based on chart type
  const renderLegend = () => {
    if (chartType === "bar") {
      return (
        <div className="mb-4 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-4 min-w-max">
            {statusConfig.map((status, idx) => (
              <div key={idx} className="flex items-center whitespace-nowrap">
                <div
                  className="w-4 h-4 rounded mr-2 flex-shrink-0"
                  style={{ backgroundColor: status.color }}
                ></div>
                <span
                  className={isDarkMode ? "text-gray-200" : "text-gray-700"}
                >
                  {status.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    } else {
      return (
        seriesConfig.length > 0 && (
          <div className="mb-4 overflow-x-auto scrollbar-none">
            <div className="flex items-center gap-4 min-w-max">
              {seriesConfig.map((series, idx) => (
                <div key={idx} className="flex items-center whitespace-nowrap">
                  <div
                    className="w-4 h-4 rounded mr-2 flex-shrink-0"
                    style={{ backgroundColor: series.color }}
                  ></div>
                  <span
                    className={isDarkMode ? "text-gray-200" : "text-gray-700"}
                  >
                    {series.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )
      );
    }
  };

  // Render filter dropdowns
  const renderDropdowns = () => {
    // For backward compatibility - single dropdown mode
    if (!showMultipleDropdowns) {
      return (
        classOptions.length > 0 && (
          <div className="relative">
            <DropDown
              items={classOptions}
              value={selectedClass}
              onChange={handleClassChange}
              buttonText="Select Class"
              width="200px"
              className="w-auto"
            />
          </div>
        )
      );
    }

    // Multiple dropdowns mode
    return (
      <div className="flex flex-wrap gap-3 items-center">
        {classOptions.length > 0 && (
          <div className="relative">
            <DropDown
              items={classOptions}
              value={selectedClass}
              onChange={handleClassChange}
              buttonText="Select Class"
              width="180px"
              className="w-auto"
            />
          </div>
        )}

        {showSecondDropdown && secondDropdownOptions.length > 0 && (
          <div className="relative">
            <DropDown
              items={secondDropdownOptions}
              value={selectedSecondFilter}
              onChange={handleSecondDropdownChange}
              buttonText={secondDropdownLabel}
              width="180px"
              className="w-auto"
            />
          </div>
        )}

        {showThirdDropdown && thirdDropdownOptions.length > 0 && (
          <div className="relative">
            <DropDown
              items={thirdDropdownOptions}
              value={selectedThirdFilter}
              onChange={handleThirdDropdownChange}
              buttonText={thirdDropdownLabel}
              width="180px"
              className="w-auto"
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className={`rounded-xl p-6 w-full max-w-3xl mx-auto ${
        isDarkMode ? "bg-gray-800" : "bg-white"
      } ${className}`}
    >
      <div className="flex justify-between items-start gap-5 mb-6 flex-wrap">
        <div>
          <h2
            className={`text-xl font-bold ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {title}
          </h2>
          <p
            className={`mt-1 text-sm text-balance ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            {subtitle}
          </p>
        </div>

        {renderDropdowns()}
      </div>

      {renderLegend()}

      <div className="w-full h-64">
        {chartType === "bar" ? renderBarChart() : renderLineChart()}
      </div>
    </div>
  );
};

export default AnalyticsChart;
