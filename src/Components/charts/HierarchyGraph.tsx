"use client";

import React from "react";
import { TreeNode } from "@/components/types";

interface Props {
  data: TreeNode;
}

export default function HierarchyTree({ data }: Props) {
  const RenderNode = ({ node }: { node: TreeNode }) => (
    <div className="flex flex-col items-center">
      <div className="bg-gray-200 border rounded p-2 w-32 text-center">
        <div className="font-semibold">{node.name}</div>
        <div className="text-xs">{node.title}</div>
      </div>
      {node.children?.length ? (
        <>
          <div className="w-1 h-6 bg-gray-400" />
          <div className="flex space-x-4 mt-2">
            {node.children.map((c,i) => <RenderNode key={i} node={c} />)}
          </div>
        </>
      ) : null}
    </div>
  );

  return (
    <div className="p-8 flex justify-center">
      <RenderNode node={data} />
    </div>
  );
}
``