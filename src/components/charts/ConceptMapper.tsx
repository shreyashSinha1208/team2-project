import React, { useState, useCallback, useRef, useEffect } from "react";
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  Panel,
  MarkerType,
  Connection,
  Edge,
  ConnectionLineType,
} from "reactflow";
import "reactflow/dist/style.css";
import dagre from "dagre";
import { motion } from "framer-motion";
import { Download, Plus, Trash2 } from "lucide-react";

interface ConceptMapperProps {
  data: string;
}

const nodeWidth = 180;
const nodeHeight = 50;
const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));
dagreGraph.setGraph({ rankdir: "TB" });

function applyDagreLayout(nodes: any[], edges: Edge[]) {
  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });
  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });
  dagre.layout(dagreGraph);
  return nodes.map((node) => {
    const { x, y } = dagreGraph.node(node.id);
    return {
      ...node,
      position: { x, y },
    };
  });
}

export default function ConceptMapper({ data }: ConceptMapperProps) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [nodeName, setNodeName] = useState("");
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const [nodeIdCounter, setNodeIdCounter] = useState(1);


  const handleNodeClick = useCallback(
    (node: any) => {
      const action = prompt(
        `Selected node: "${node.data.label}"\nChoose an action:\n1. Edit label\n2. Add connected node\n3. Delete node`,
        '1'
      );
  
      if (action === '1') {
        const newLabel = prompt('Enter new label:', node.data.label);
        if (newLabel) {
          setNodes((nds) =>
            nds.map((n) =>
              n.id === node.id ? { ...n, data: { ...n.data, label: newLabel } } : n
            )
          );
        }
      } else if (action === '2') {
        const newNodeLabel = prompt('Enter new node label:');
        if (newNodeLabel && reactFlowInstance) {
          const newId = getNodeId(newNodeLabel + '-' + nodeIdCounter);
          const position = {
            x: node.position.x + 200,
            y: node.position.y + 100,
          };
  
          const newNode = {
            id: newId,
            data: { label: newNodeLabel },
            position,
            style: {
              background: '#ffffff',
              color: '#333333',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '10px',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
              width: nodeWidth,
            },
          };
  
          const newEdge = {
            id: `edge-${node.id}-${newId}`,
            source: node.id,
            target: newId,
            type: 'default',
            animated: false,
            style: { stroke: '#94a3b8' },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: '#94a3b8',
            },
          };
  
          setNodes((nds) => [...nds, newNode]);
          setEdges((eds) => [...eds, newEdge]);
          setNodeIdCounter((c) => c + 1);
        }
      } else if (action === '3') {
        setNodes((nds) => nds.filter((n) => n.id !== node.id));
        setEdges((eds) => eds.filter((e) => e.source !== node.id && e.target !== node.id));
      }
    },
    [setNodes, setEdges, nodeIdCounter, reactFlowInstance]
  );
  

  const getNodeId = (label: string) =>
    `node-${label.toLowerCase().replace(/\s+/g, "-")}`;

  useEffect(() => {
    if (!data?.trim()) return;

    try {
      const lines = data.split("\n").filter(Boolean);
      const nodeMap = new Map<string, string>();
      const newNodes: any[] = [];
      const newEdges: Edge[] = [];

      lines.forEach((line) => {
        const trimmed = line.trim();
        if (trimmed.includes("->")) {
          const [source, target] = trimmed.split("->").map((s) => s.trim());
          if (!nodeMap.has(source)) nodeMap.set(source, getNodeId(source));
          if (!nodeMap.has(target)) nodeMap.set(target, getNodeId(target));
        } else {
          if (!nodeMap.has(trimmed)) nodeMap.set(trimmed, getNodeId(trimmed));
        }
      });

      nodeMap.forEach((id, label) => {
        newNodes.push({
          id,
          data: { label },
          position: { x: 0, y: 0 },
          style: {
            background: "#ffffff",
            color: "#333333",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            padding: "10px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            width: nodeWidth,
          },
        });
      });

      lines.forEach((line) => {
        if (line.includes("->")) {
          const [source, target] = line.split("->").map((s) => s.trim());
          newEdges.push({
            id: `edge-${nodeMap.get(source)}-${nodeMap.get(target)}`,
            source: nodeMap.get(source)!,
            target: nodeMap.get(target)!,
            type: "default",
            animated: false,
            style: { stroke: "#94a3b8" },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: "#94a3b8",
            },
          });
        }
      });

      const laidOutNodes = applyDagreLayout(newNodes, newEdges);
      setNodes(laidOutNodes);
      setEdges(newEdges);
    } catch (error) {
      console.error("Failed to parse concept map data:", error);
    }
  }, [data, setNodes, setEdges]);

  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            type: "default",
            animated: false,
            style: { stroke: "#94a3b8" },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: "#94a3b8",
            },
          },
          eds
        )
      ),
    [setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const addNode = useCallback(() => {
    if (!nodeName.trim() || !reactFlowInstance) return;

    const position = reactFlowInstance.project({
      x: 100 + Math.random() * 400,
      y: 100 + Math.random() * 400,
    });

    const newNode = {
      id: `custom-node-${nodeIdCounter}`,
      data: { label: nodeName },
      position,
      style: {
        background: "#ffffff",
        color: "#333333",
        border: "1px solid #e2e8f0",
        borderRadius: "8px",
        padding: "10px",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
        width: nodeWidth,
      },
    };

    setNodes((nds) => nds.concat(newNode));
    setNodeIdCounter((c) => c + 1);
    setNodeName("");
  }, [nodeName, reactFlowInstance, setNodes, nodeIdCounter]);

  const exportToImage = () => {
    if (reactFlowWrapper.current) {
      alert("Export functionality would save the diagram as an image");
    }
  };

  const deleteSelectedElements = useCallback(() => {
    setNodes((nds) => nds.filter((node) => !node.selected));
    setEdges((eds) => eds.filter((edge) => !edge.selected));
  }, [setNodes, setEdges]);

  return (
    <motion.div
      className="w-full h-full bg-white rounded-xl overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <ReactFlowProvider>
        <div className="w-full h-full" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDragOver={onDragOver}
            onInit={setReactFlowInstance}
            connectionLineType={ConnectionLineType.SmoothStep}
            fitView
            attributionPosition="bottom-right"
            onNodeClick={(_, node) => handleNodeClick(node)}
          >
            <Background color="#f8fafc" gap={16} />
            <Controls />
          </ReactFlow>
        </div>
      </ReactFlowProvider>
    </motion.div>
  );
}
