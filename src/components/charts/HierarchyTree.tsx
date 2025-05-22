"use client";

import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import * as d3 from "d3";

interface TreeNode {
  name: string;
  children?: TreeNode[];
}

interface Props {
  data: TreeNode;
}

export default function HierarchyTree({ data }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!svgRef.current || !data || !containerRef.current) return;
    
    // Clear previous rendering
    d3.select(svgRef.current).selectAll("*").remove();
    
    // Get container dimensions
    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight;
    
    // Create the tree layout
    const treeLayout = d3.tree<TreeNode>()
      .size([containerHeight - 100, containerWidth - 160]);
    
    // Create hierarchy from data
    const root = d3.hierarchy(data);
    
    // Assign positions to nodes
    const treeData = treeLayout(root);
    
    // Create SVG element
    const svg = d3.select(svgRef.current)
      .attr("width", containerWidth)
      .attr("height", containerHeight)
      .append("g")
      .attr("transform", `translate(80, 50)`);
    
    // Add links between nodes
    svg.selectAll(".link")
      .data(treeData.links())
      .enter()
      .append("path")
      .attr("class", "link")
      .attr("d", d3.linkHorizontal<d3.HierarchyPointLink<TreeNode>, d3.HierarchyPointNode<TreeNode>>()
        .x(d => d.y)
        .y(d => d.x)
      )
      .style("fill", "none")
      .style("stroke", "#e2e8f0")
      .style("stroke-width", 2);
    
    // Add nodes
    const nodes = svg.selectAll(".node")
      .data(treeData.descendants())
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", d => `translate(${d.y},${d.x})`);
    
    // Add node circles with gradient fill
    nodes.append("circle")
      .attr("r", 8)
      .style("fill", "#f8fafc")
      .style("stroke", "#94a3b8")
      .style("stroke-width", 2)
      .style("filter", "drop-shadow(0px 2px 3px rgba(0, 0, 0, 0.1))");
    
    // Add node labels
    nodes.append("text")
      .attr("dy", ".35em")
      .attr("x", d => d.children ? -12 : 12)
      .style("text-anchor", d => d.children ? "end" : "start")
      .style("font-family", "Inter, system-ui, sans-serif")
      .style("font-size", "14px")
      .style("font-weight", d => d.depth === 0 ? "600" : "400")
      .style("fill", "#334155")
      .text(d => d.data.name);
    
  }, [data]);
  
  return (
    <motion.div 
      ref={containerRef}
      className="w-full h-full flex items-center justify-center bg-gradient-to-br from-white to-slate-50 rounded-xl p-4 overflow-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <svg ref={svgRef} className="w-full h-full"></svg>
    </motion.div>
  );
}