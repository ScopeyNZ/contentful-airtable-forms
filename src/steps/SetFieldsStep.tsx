import React, {useState} from 'react';
import FieldDefinition from '../types/FieldDefinition';
import FieldDefinitionSummary from '../components/FieldDefinitionSummary';
import {DragDropContext, DragUpdate, Droppable} from 'react-beautiful-dnd';
import {EntityList} from "@contentful/forma-36-react-components";


export default function SetFieldsStep({ knownFields, tableName, workspaceId, value, onChange, onCreateNewField }: {
  knownFields: Array<string>,
  tableName: string,
  workspaceId: string,
  value: Array<FieldDefinition>,
  onChange: (newDefinitions: Array<FieldDefinition>) => void,
  onCreateNewField: () => void,
}) {

  const [possibleFields, setPossibleFields] = useState(knownFields)

  const handleAddPossibleField = (field: string) => setPossibleFields([
    ...possibleFields,
    field
  ]);

  const handleChangeFieldDefinition = (index: number) => (definition: FieldDefinition) => {
    const temp = [...value];
    temp.splice(index, 1, definition);
    onChange(temp);
  }

  const handleRemoveFieldDefinition = (index: number) => () => {
    const temp = [...value];
    temp.splice(index, 1);
    onChange(temp);
  }

  const endDrag = (result: DragUpdate) => {
    if (!result.destination) {
      return;
    }

    const temp = [...value];
    const [removed] = temp.splice(result.source.index, 1);
    temp.splice(result.destination.index, 0, removed);

    onChange(temp);
  };

  return (
    <>
      <DragDropContext onDragEnd={endDrag}>
        <Droppable droppableId="fields">
          { (provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="cursor-grab"
            >
              <EntityList>
                { value.map((definition, index) => (
                  <FieldDefinitionSummary
                    key={definition.id}
                    index={index}
                    fieldDefinition={definition}
                    onAddPossibleField={handleAddPossibleField}
                    onChange={handleChangeFieldDefinition(index)}
                    onRemove={handleRemoveFieldDefinition(index)}
                    possibleFields={possibleFields}
                    tableName={tableName}
                    workspaceId={workspaceId}
                    startInEdit={
                      index === value.length - 1 && (!definition.airtableField || !definition.label.length)
                    }
                  />
                )) }
                { provided.placeholder }
              </EntityList>
            </div>
          ) }
        </Droppable>
      </DragDropContext>

      <button
        type="button"
        className="cf-btn-secondary mt-4"
        onClick={onCreateNewField}
      >+ Add new field</button>
    </>
  )
};
