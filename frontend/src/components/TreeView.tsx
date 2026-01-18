import React, { useState } from 'react';
import { ChevronRightIcon, ChevronDownIcon, FolderIcon, DocumentIcon } from '@heroicons/react/24/outline';

export interface TreeNode {
  id: string;
  label: string;
  children?: TreeNode[];
  type?: 'folder' | 'file';
  expanded?: boolean;
}

export interface TreeViewProps {
  nodes: TreeNode[];
  onNodeSelect?: (node: TreeNode) => void;
  onNodeToggle?: (node: TreeNode) => void;
  selectedNodeId?: string;
  className?: string;
}

export default function TreeView({
  nodes,
  onNodeSelect,
  onNodeToggle,
  selectedNodeId,
  className = '',
}: TreeViewProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  const handleToggle = (node: TreeNode) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(node.id)) {
      newExpanded.delete(node.id);
    } else {
      newExpanded.add(node.id);
    }
    setExpandedNodes(newExpanded);
    onNodeToggle?.(node);
  };

  const handleSelect = (node: TreeNode) => {
    onNodeSelect?.(node);
  };

  const renderNode = (node: TreeNode, level: number = 0) => {
    const isExpanded = expandedNodes.has(node.id);
    const isSelected = selectedNodeId === node.id;
    const hasChildren = node.children && node.children.length > 0;
    const isFolder = node.type === 'folder' || hasChildren;

    return (
      <div key={node.id}>
        <div
          className={`flex items-center py-1 px-2 hover:bg-gray-100 cursor-pointer ${
            isSelected ? 'bg-blue-100 text-blue-900' : 'text-gray-900'
          }`}
          style={{ paddingLeft: `${level * 20 + 8}px` }}
          onClick={() => handleSelect(node)}
        >
          {hasChildren && (
            <button
              className="mr-1 p-0.5 rounded hover:bg-gray-200"
              onClick={(e) => {
                e.stopPropagation();
                handleToggle(node);
              }}
            >
              {isExpanded ? (
                <ChevronDownIcon className="w-4 h-4" />
              ) : (
                <ChevronRightIcon className="w-4 h-4" />
              )}
            </button>
          )}
          {!hasChildren && <div className="w-5" />}
          <div className="mr-2">
            {isFolder ? (
              <FolderIcon className="w-4 h-4 text-yellow-500" />
            ) : (
              <DocumentIcon className="w-4 h-4 text-gray-500" />
            )}
          </div>
          <span className="text-sm">{node.label}</span>
        </div>
        {hasChildren && isExpanded && (
          <div>
            {node.children!.map(child => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`bg-white border border-gray-200 rounded-md ${className}`}>
      {nodes.map(node => renderNode(node))}
    </div>
  );
}