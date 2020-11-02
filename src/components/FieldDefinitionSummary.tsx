import React, {useState} from 'react';
import FieldDefinition from '../types/FieldDefinition';
import FieldDefinitionBuilder from './FieldDefinitionBuilder';
import {Draggable} from 'react-beautiful-dnd';
import {DropdownList, DropdownListItem, EntityListItem} from "@contentful/forma-36-react-components";

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
    <EntityListItem
      title={fieldDefinition.label}
      contentType={fieldDefinition.type}
      description={`${fieldDefinition.required ? 'Required - ' : ''}Saves into: ${fieldDefinition.airtableField}`}
      withDragHandle={true}
      withThumbnail={false}
      onClick={() => setIsEditing(true)}
      dropdownListElements={
        <DropdownList>
          <DropdownListItem isTitle>Actions</DropdownListItem>
          <DropdownListItem onClick={onRemove}>
            Remove
          </DropdownListItem>
        </DropdownList>
      }
    />
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
        >
          { isEditing ? renderBuilder() : renderSummary() }
        </div>
      )}
    </Draggable>

  )
}
