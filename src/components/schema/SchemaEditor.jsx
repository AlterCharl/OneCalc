import React, { useState, useEffect, useCallback } from 'react';
import { defaultSchemaData } from '../../contexts/defaultSchemaData';

/**
 * Schema Editor Component
 * 
 * Provides a UI for editing business model schema data
 */
const SchemaEditor = ({ onChange, disabled, schemaType }) => {
  // Initialize with a safe default schema structure that matches what we expect
  const createInitialSchema = () => {
    try {
      // If defaultSchemaData exists, convert its structure to the format we need
      if (defaultSchemaData && defaultSchemaData.items) {
        // Convert items to nodes format
        const nodes = Object.values(defaultSchemaData.items)
          .filter(item => item.category === schemaType)
          .map(item => ({
            id: item.id,
            type: item.category,
            name: item.name,
            data: {
              financials: Object.entries(item.yearData).reduce((acc, [year, values]) => {
                acc[year] = { min: values.min, max: values.max };
                return acc;
              }, {})
            }
          }));
        
        return { nodes, connections: [] };
      } 
      // Fallback to empty structure
      return { nodes: [], connections: [] };
    } catch (error) {
      console.error("Error initializing schema:", error);
      return { nodes: [], connections: [] };
    }
  };
  
  const [schema, setSchema] = useState(createInitialSchema);
  const [newNodeType, setNewNodeType] = useState(schemaType || 'revenue');
  const [newNodeName, setNewNodeName] = useState('');
  const [newNodeValues, setNewNodeValues] = useState({
    2026: { min: 0, max: 0 },
    2027: { min: 0, max: 0 },
    2028: { min: 0, max: 0 },
    2029: { min: 0, max: 0 }
  });

  // Update schema if schemaType changes
  useEffect(() => {
    setNewNodeType(schemaType || 'revenue');
    setSchema(createInitialSchema());
  }, [schemaType]);

  // Notify parent of schema changes
  useEffect(() => {
    if (onChange && schema.nodes && schema.nodes.length > 0) {
      onChange(schema);
    }
  }, [schema, onChange]);

  // Add a new node to the schema
  const addNode = useCallback(() => {
    if (!newNodeName.trim()) {
      alert('Please enter a node name');
      return;
    }

    const newNode = {
      id: `node-${Date.now()}`,
      type: newNodeType,
      name: newNodeName,
      data: {
        financials: {
          2026: { min: parseInt(newNodeValues[2026].min), max: parseInt(newNodeValues[2026].max) },
          2027: { min: parseInt(newNodeValues[2027].min), max: parseInt(newNodeValues[2027].max) },
          2028: { min: parseInt(newNodeValues[2028].min), max: parseInt(newNodeValues[2028].max) },
          2029: { min: parseInt(newNodeValues[2029].min), max: parseInt(newNodeValues[2029].max) }
        }
      }
    };

    setSchema(prev => ({
      ...prev,
      nodes: [...(prev.nodes || []), newNode]
    }));

    // Reset form
    setNewNodeName('');
    setNewNodeValues({
      2026: { min: 0, max: 0 },
      2027: { min: 0, max: 0 },
      2028: { min: 0, max: 0 },
      2029: { min: 0, max: 0 }
    });
  }, [newNodeType, newNodeName, newNodeValues]);

  // Remove a node from the schema
  const removeNode = useCallback((nodeId) => {
    setSchema(prev => ({
      ...prev,
      nodes: (prev.nodes || []).filter(node => node.id !== nodeId),
      connections: (prev.connections || []).filter(
        conn => conn.source !== nodeId && conn.target !== nodeId
      )
    }));
  }, []);

  // Handle value change for new node
  const handleValueChange = useCallback((year, field, value) => {
    setNewNodeValues(prev => ({
      ...prev,
      [year]: {
        ...prev[year],
        [field]: value
      }
    }));
  }, []);

  return (
    <div className="schema-editor">
      {/* Node List */}
      {schema.nodes && schema.nodes.length > 0 ? (
        <div className="mb-4">
          <h3 className="text-md font-semibold mb-2">Schema Nodes</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  <th className="py-2 px-3 border-b text-left">Name</th>
                  <th className="py-2 px-3 border-b text-left">Type</th>
                  <th className="py-2 px-3 border-b text-center">2026</th>
                  <th className="py-2 px-3 border-b text-center">2027</th>
                  <th className="py-2 px-3 border-b text-center">2028</th>
                  <th className="py-2 px-3 border-b text-center">2029</th>
                  <th className="py-2 px-3 border-b"></th>
                </tr>
              </thead>
              <tbody>
                {schema.nodes.map(node => (
                  <tr key={node.id} className={node.type === 'cost' ? 'bg-red-50' : 'bg-green-50'}>
                    <td className="py-2 px-3 border-b">{node.name}</td>
                    <td className="py-2 px-3 border-b capitalize">{node.type}</td>
                    {[2026, 2027, 2028, 2029].map(year => (
                      <td key={year} className="py-2 px-3 border-b text-center">
                        {node.data?.financials?.[year] ? (
                          <span>
                            {node.data.financials[year].min !== undefined ? 
                              `${node.data.financials[year].min} - ${node.data.financials[year].max}` : 
                              node.data.financials[year].value}
                          </span>
                        ) : '-'}
                      </td>
                    ))}
                    <td className="py-2 px-3 border-b text-center">
                      <button
                        onClick={() => removeNode(node.id)}
                        disabled={disabled}
                        className="text-red-600 hover:text-red-800 disabled:opacity-50"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="mb-4 p-4 bg-gray-50 text-center rounded">
          <p>No schema nodes defined yet. Add your first node below.</p>
        </div>
      )}

      {/* Add Node Form */}
      <div className="bg-gray-50 p-4 rounded">
        <h3 className="text-md font-semibold mb-2">Add New Node</h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Node Type</label>
            <select
              value={newNodeType}
              onChange={(e) => setNewNodeType(e.target.value)}
              disabled={disabled}
              className="w-full p-2 border rounded disabled:opacity-50"
            >
              <option value="revenue">Revenue</option>
              <option value="cost">Cost</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Node Name</label>
            <input
              type="text"
              value={newNodeName}
              onChange={(e) => setNewNodeName(e.target.value)}
              disabled={disabled}
              className="w-full p-2 border rounded disabled:opacity-50"
              placeholder="e.g., Subscription Revenue"
            />
          </div>
        </div>

        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Financial Projections (Min-Max)</h4>
          <div className="grid grid-cols-4 gap-2">
            {[2026, 2027, 2028, 2029].map(year => (
              <div key={year} className="p-2 border rounded">
                <div className="text-sm font-medium mb-1">{year}</div>
                <div className="grid grid-cols-2 gap-1">
                  <div>
                    <label className="block text-xs text-gray-500">Min</label>
                    <input
                      type="number"
                      value={newNodeValues[year].min}
                      onChange={(e) => handleValueChange(year, 'min', e.target.value)}
                      disabled={disabled}
                      className="w-full p-1 border rounded text-sm disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500">Max</label>
                    <input
                      type="number"
                      value={newNodeValues[year].max}
                      onChange={(e) => handleValueChange(year, 'max', e.target.value)}
                      disabled={disabled}
                      className="w-full p-1 border rounded text-sm disabled:opacity-50"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={addNode}
          disabled={disabled || !newNodeName.trim()}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          Add Node
        </button>
      </div>
    </div>
  );
};

export default SchemaEditor; 