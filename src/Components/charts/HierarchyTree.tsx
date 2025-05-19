import React from 'react';
import Tree from 'react-d3-tree';

interface TreeNode {
  name: string;
  children?: TreeNode[];
}

interface Props {
  data: TreeNode;
}

// Custom node renderer (rectangle with text inside)
const renderRectNode = ({ nodeDatum }: any) => {
  return (
    <g>
      <rect width={120} height={40} x={-60} y={-20} fill="#fef3c7" stroke="#f59e0b" rx={10} />
      <text fill="#000" x={0} y={5} textAnchor="middle" style={{ fontSize: '14px' }}>
        {nodeDatum.name}
      </text>
    </g>
  );
};

export default function OrgChart({ data }: Props) {
  const containerStyles = {
    width: '100%',
    height: '600px',
  };

  return (
    <div style={containerStyles}>
      <Tree
        data={data}
        orientation="vertical"
        translate={{ x: 300, y: 50 }}
        pathFunc="elbow"
        collapsible={true}
        zoomable={true}
        renderCustomNodeElement={renderRectNode}
      />
    </div>
  );
}
