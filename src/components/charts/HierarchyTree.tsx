import React from 'react';
import Tree from 'react-d3-tree';

// Define the TreeNode interface more explicitly
interface TreeNode {
  name: string;
  children?: TreeNode[];
  attributes?: {
    [key: string]: string | number | boolean;
  };
}

// Props for the OrgChart component
interface OrgChartProps {
  data: TreeNode;
  // Optional: Add props for customization if needed
  chartHeight?: string; // e.g., '500px', '100%'
  chartWidth?: string;  // e.g., '800px', '100%'
  nodeFillColor?: string;
  nodeStrokeColor?: string;
  nodeTextColor?: string;
  nodeFontSize?: string;
}

// Custom node renderer component
// We use React.FC for better type checking and clarity
const CustomRectNode: React.FC<any> = ({ nodeDatum, toggleNode }) => {
  const nodeWidth = 120;
  const nodeHeight = 40;
  const cornerRadius = 10; // For rounded corners

  // You can customize colors/styles based on props if passed down
  const fillColor = '#fef3c7'; // Default light yellow
  const strokeColor = '#f59e0b'; // Default orange
  const textColor = '#000';    // Default black
  const fontSize = '14px';

  return (
    <g>
      {/* Node rectangle */}
      <rect
        width={nodeWidth}
        height={nodeHeight}
        x={-nodeWidth / 2} // Center the rectangle
        y={-nodeHeight / 2} // Center the rectangle
        fill={fillColor}
        stroke={strokeColor}
        rx={cornerRadius}
        ry={cornerRadius}
        onClick={toggleNode} // Make node collapsible on click
        style={{ cursor: 'pointer' }}
      />
      {/* Node text */}
      <text
        fill={textColor}
        x={0}
        y={5} // Adjust Y to visually center text
        textAnchor="middle"
        style={{ fontSize: fontSize }}
      >
        {nodeDatum.name}
      </text>
    </g>
  );
};

// Main OrgChart component
export default function OrgChart({
  data,
  chartHeight = '600px', // Default height
  chartWidth = '100%',   // Default width
  nodeFillColor,
  nodeStrokeColor,
  nodeTextColor,
  nodeFontSize,
}: OrgChartProps) {
  // Styles for the container, allowing dynamic height/width
  const containerStyles: React.CSSProperties = {
    width: chartWidth,
    height: chartHeight,
    // Add border for visual separation
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    overflow: 'hidden', // Ensures content stays within rounded corners
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    backgroundColor: '#ffffff' // Ensure white background for chart area
  };

  // Memoize the custom node element to prevent unnecessary re-renders
  // This is passed to react-d3-tree
  const renderCustomNodeElement = (rd3tProps: any) => (
    <CustomRectNode
      {...rd3tProps}
      fillColor={nodeFillColor}
      strokeColor={nodeStrokeColor}
      textColor={nodeTextColor}
      fontSize={nodeFontSize}
    />
  );

  return (
    <div style={containerStyles}>
      <Tree
        data={data}
        // Set a reasonable initial translation to center the root node
        translate={{ x: parseFloat(chartWidth) / 2 || 300, y: 50 }}
        orientation="vertical" // Hierarchy flows top-down
        pathFunc="elbow"      // Provides a clean, angular path
        collapsible={true}    // Nodes can be expanded/collapsed
        zoomable={true}       // Allows zooming in/out
        draggable={true}      // Allows dragging the chart
        renderCustomNodeElement={renderCustomNodeElement} // Use our custom node
        // You might want to adjust depthFactor for vertical spacing
        // depthFactor={100}
        // nodeSize={{ x: 150, y: 80 }} // Adjust spacing between nodes if needed
        separation={{ siblings: 1.5, nonSiblings: 1.5 }} // Control horizontal spacing
        // Add styling for lines (links)
        // linkComponent adds an extra layer of complexity for custom lines
        // For basic styling, you might use CSS if react-d3-tree exposes classes
      />
    </div>
  );
}