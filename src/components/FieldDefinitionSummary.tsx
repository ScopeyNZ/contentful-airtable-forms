import React, {useState} from 'react';
import FieldDefinition from '../types/FieldDefinition';
import FieldDefinitionBuilder from './FieldDefinitionBuilder';
import {Draggable} from 'react-beautiful-dnd';

export default function FieldDefinitionSummary({
  index,
  fieldDefinition,
  onAddPossibleField,
  onChange,
  onRemove,
  possibleFields,
  tableName,
  workspaceId,
  startInEdit,
}: {
  index: number,
  fieldDefinition: FieldDefinition,
  onAddPossibleField: (field: string) => void,
  onChange: (definition: FieldDefinition) => void,
  onRemove: () => void,
  possibleFields: Array<string>,
  tableName: string,
  workspaceId: string,
  startInEdit: boolean,
}) {
  const [isEditing, setIsEditing] = useState(startInEdit);

  const handleCloseBuilder = () => {
    if (!fieldDefinition.airtableField || fieldDefinition.label.length === 0) {
      onRemove();
      return;
    }

    setIsEditing(false);
  }

  const renderSummary = () => (
    <div className="flex">
      <div className="flex-grow">
        <p className="cf-text-dimmed mb-2">
          { fieldDefinition.airtableField } ({ fieldDefinition.type })
        </p>
        <p className="text-lg font-bold">{ fieldDefinition.label }</p>
      </div>
      <button
        type="button"
        className="cf-btn-secondary"
        onClick={() => setIsEditing(true)}
      >
        Edit
      </button>
    </div>
  );

  const renderBuilder = function () {
    return <FieldDefinitionBuilder
      fieldDefinition={fieldDefinition}
      possibleFields={possibleFields}
      onAddPossibleField={onAddPossibleField}
      onChange={onChange}
      tableName={tableName}
      workspaceId={workspaceId}
      onClose={handleCloseBuilder}
    />;
  };

  return (
    <Draggable draggableId={fieldDefinition.id} index={index}>
      { provided => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="shadow border border-cf-element transition hover:border-blue-light p-2 mt-2"
        >
          { isEditing ? renderBuilder() : renderSummary() }
        </div>
      )}
    </Draggable>

  )
}
