import React, {useState} from 'react';
import FieldDefinition from '../types/FieldDefinition';
import FieldDefinitionSummary from '../components/FieldDefinitionSummary';
import {DragDropContext, DragUpdate, Droppable} from 'react-beautiful-dnd';

let counter = 0;
const getId = (): string => `id-${counter++}`;

export default function SetFieldsStep({ knownFields, tableName, workspaceId, initialDefinitions }: {
  knownFields: Array<string>,
  tableName: string,
  workspaceId: string,
  initialDefinitions: Array<FieldDefinition>,
}) {
  const makeNewField = (): FieldDefinition => ({
    id: getId(),
    label: '',
    airtableField: undefined,
    type: 'text',
  });

  const [fieldDefinitions, setFieldDefinitions] = useState<Array<FieldDefinition>>(initialDefinitions.length
    ? initialDefinitions.map(definition => {
      definition.id = getId();
      return definition;
    })
    : [makeNewField()])
  const [possibleFields, setPossibleFields] = useState(knownFields)

  const handleAddPossibleField = (field: string) => setPossibleFields([
    ...possibleFields,
    field
  ]);

  const handleChangeFieldDefinition = (index: number) => (definition: FieldDefinition) => {
    const temp = [...fieldDefinitions];
    temp.splice(index, 1, definition);
    setFieldDefinitions(temp);
  }

  const handleRemoveFieldDefinition = (index: number) => () => {
    const temp = [...fieldDefinitions];
    temp.splice(index, 1);
    setFieldDefinitions(temp);
  }

  const handleAddDefinition = () => {
    setFieldDefinitions([
      ...fieldDefinitions,
      makeNewField(),
    ])
  }

  const endDrag = (result: DragUpdate) => {
    if (!result.destination) {
      return;
    }

    const temp = [...fieldDefinitions];
    const [removed] = temp.splice(result.source.index, 1);
    temp.splice(result.destination.index, 0, removed);

    setFieldDefinitions(temp);
  };

  return (
    <>
      <DragDropContext onDragEnd={endDrag}>
        <Droppable droppableId="fields">
          { (provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-2 cursor-grab"
            >
              { fieldDefinitions.map((definition, index) => (
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
                    index === fieldDefinitions.length - 1 && (!definition.airtableField || !definition.label.length)
                  }
                />
              )) }
            </div>
          ) }
        </Droppable>
      </DragDropContext>

      <button
        role="button"
        className="cf-btn-secondary mt-4"
        onClick={handleAddDefinition}
      >+ Add new field</button>
    </>
  )
};
