import React, { useState } from 'react';
import { useSchemaData } from '../../contexts/SchemaContext';
import './SchemaItemRow.css';

const SchemaItemRow = ({ item, years }) => {
  const { updateSchemaItem } = useSchemaData();
  const [isEditing, setIsEditing] = useState(false);
  const [editedValues, setEditedValues] = useState({});

  if (!item || !item.yearData) {
    return null;
  }

  // Format currency for display
  const formatCurrency = (value) => {
    if (value === null || value === undefined) return '-';
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      maximumFractionDigits: 0
    }).format(value);
  };

  // Start editing by creating a copy of current values
  const handleStartEditing = () => {
    const newEditedValues = {};
    years.forEach(year => {
      newEditedValues[year] = {
        min: item.yearData[year]?.min || 0,
        max: item.yearData[year]?.max || 0
      };
    });
    setEditedValues(newEditedValues);
    setIsEditing(true);
  };

  // Handle input change
  const handleValueChange = (year, field, value) => {
    setEditedValues(prev => ({
      ...prev,
      [year]: {
        ...prev[year],
        [field]: parseInt(value) || 0
      }
    }));
  };

  // Save changes
  const handleSave = () => {
    const yearData = {};
    years.forEach(year => {
      yearData[year] = editedValues[year];
    });
    
    updateSchemaItem(item.id, { yearData });
    setIsEditing(false);
  };

  // Cancel editing
  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <tr className={isEditing ? "editing-row" : ""}>
      <td className="item-name">
        <div className="item-name-content">
          <span className="item-name-text">{item.name}</span>
          {item.metadata?.description && (
            <span className="item-description" title={item.metadata.description}>ℹ️</span>
          )}
        </div>
      </td>
      
      {isEditing ? (
        <>
          {years.map(year => (
            <React.Fragment key={`${item.id}-${year}`}>
              <td className="min-value">
                <input
                  type="number"
                  value={editedValues[year]?.min}
                  onChange={(e) => handleValueChange(year, 'min', e.target.value)}
                  className="edit-input"
                />
              </td>
              <td className="max-value">
                <input
                  type="number"
                  value={editedValues[year]?.max}
                  onChange={(e) => handleValueChange(year, 'max', e.target.value)}
                  className="edit-input"
                />
              </td>
            </React.Fragment>
          ))}
          <td className="actions">
            <button onClick={handleSave} className="save-btn">Save</button>
            <button onClick={handleCancel} className="cancel-btn">Cancel</button>
          </td>
        </>
      ) : (
        <>
          {years.map(year => (
            <React.Fragment key={`${item.id}-${year}`}>
              <td className="min-value">
                {formatCurrency(item.yearData[year]?.min)}
              </td>
              <td className="max-value">
                {formatCurrency(item.yearData[year]?.max)}
              </td>
            </React.Fragment>
          ))}
          <td className="actions">
            <button onClick={handleStartEditing} className="edit-btn">Edit</button>
          </td>
        </>
      )}
    </tr>
  );
};

export default SchemaItemRow; 