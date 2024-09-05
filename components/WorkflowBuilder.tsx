
"use client";
import React, { useState, useCallback } from "react";
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  Connection,
  addEdge,
  ReactFlowInstance,
  applyNodeChanges,
  applyEdgeChanges,
  XYPosition,
  Handle,
  Position,
} from "reactflow";
import "reactflow/dist/style.css";
import { v4 as uuidv4 } from "uuid";

const nodeTypes = {
  filterData: FilterDataNode,
  wait: WaitNode,
  convertFormat: ConvertFormatNode,
  sendPostRequest: SendPostRequestNode,
};

const initialNodes: Node[] = [
  {
    id: "start",
    type: "input",
    data: { label: "Start" },
    position: { x: 250, y: 0 },
  },
  {
    id: "end",
    type: "output",
    data: { label: "End" },
    position: { x: 250, y: 300 },
  },
];

export default function WorkflowBuilder() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null);

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      const reactFlowBounds = event.currentTarget.getBoundingClientRect();
      const type = event.dataTransfer.getData("application/reactflow");

      if (typeof type === "undefined" || !type) {
        return;
      }

      // Ensure position is valid by checking if reactFlowInstance is defined
      const position: XYPosition = reactFlowInstance?.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      }) || { x: 0, y: 0 }; // Fallback position if undefined

      const newNode: Node = {
        id: uuidv4(),
        type,
        position,
        data: { label: type },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance]
  );

  const saveWorkflow = () => {
    const workflow = { nodes, edges };
    const workflowId = uuidv4();
    localStorage.setItem(workflowId, JSON.stringify(workflow));
    alert(`Workflow saved with ID: ${workflowId}`);
  };

  return (
    <div className="h-[600px]">
      <div className="mb-4">
        <div className="flex space-x-2">
          <div
            className="border p-2 cursor-move"
            onDragStart={(event) =>
              event.dataTransfer.setData("application/reactflow", "filterData")
            }
            draggable
          >
            Filter Data
          </div>
          <div
            className="border p-2 cursor-move"
            onDragStart={(event) =>
              event.dataTransfer.setData("application/reactflow", "wait")
            }
            draggable
          >
            Wait
          </div>
          <div
            className="border p-2 cursor-move"
            onDragStart={(event) =>
              event.dataTransfer.setData(
                "application/reactflow",
                "convertFormat"
              )
            }
            draggable
          >
            Convert Format
          </div>
          <div
            className="border p-2 cursor-move"
            onDragStart={(event) =>
              event.dataTransfer.setData(
                "application/reactflow",
                "sendPostRequest"
              )
            }
            draggable
          >
            Send POST Request
          </div>
        </div>
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={(changes) =>
          setNodes((nds) => applyNodeChanges(changes, nds))
        }
        onEdgesChange={(changes) =>
          setEdges((eds) => applyEdgeChanges(changes, eds))
        }
        onConnect={onConnect}
        onInit={setReactFlowInstance}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        fitView
      >
        <Controls />
        <Background />
      </ReactFlow>
      <button
        onClick={saveWorkflow}
        className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Save Workflow
      </button>
    </div>
  );
}

// Custom node components (simplified for this example)
function FilterDataNode({ data }: { data: { label: string } }) {
  return (
    <div className="border p-2 rounded bg-yellow-100">
      <Handle type="target" position={Position.Top} />
      <strong>{data.label}</strong>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

function WaitNode({ data }: { data: { label: string } }) {
  return (
    <div className="border p-2 rounded bg-green-100">
      <Handle type="target" position={Position.Top} />
      <strong>{data.label}</strong>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

function ConvertFormatNode({ data }: { data: { label: string } }) {
  return (
    <div className="border p-2 rounded bg-blue-100">
      <Handle type="target" position={Position.Top} />
      <strong>{data.label}</strong>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

function SendPostRequestNode({ data }: { data: { label: string } }) {
  return (
    <div className="border p-2 rounded bg-red-100">
      <Handle type="target" position={Position.Top} />
      <strong>{data.label}</strong>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

