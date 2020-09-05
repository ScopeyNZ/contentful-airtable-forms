import React, {useEffect, useState} from 'react';
import debounce from 'lodash.debounce';
import ChooseTableStep from "./steps/ChooseTableStep";
import SetFieldsStep from "./steps/SetFieldsStep";
import {FieldExtensionSDK} from 'contentful-ui-extensions-sdk';
import FieldDefinition from './types/FieldDefinition';
import './App.scss';

interface ContentfulFieldValue {
  workspace: string | undefined,
  table: string | undefined,
  knownFields: Array<string> | undefined,
  fieldDefinitions: Array<FieldDefinition> | undefined,
}

let counter = 0;
const getId = (): string => `id-${counter++}`;

function App({ contentfulSdk }: { contentfulSdk: FieldExtensionSDK }) {
  const initial: ContentfulFieldValue = contentfulSdk.field.getValue();

  const makeNewField = (): FieldDefinition => ({
    id: getId(),
    label: '',
    airtableField: undefined,
    type: 'text',
  });

  const initialDefinitions = initial?.fieldDefinitions && initial.fieldDefinitions.length
    ? initial.fieldDefinitions.map(definition => {
      definition.id = getId();
      return definition;
    })
    : [makeNewField()];

  const [workspaceId, setWorkspaceId] = useState<string>(initial?.workspace || '');
  const [tableName, setTableName] = useState<string>(initial?.table || '');
  const [potentialFields, setPotentialFields] = useState<Array<string>>(initial?.knownFields || []);
  const [fieldDefinitions, setFieldDefinitions] = useState(initialDefinitions);

  const handleCreateNewField = () => {
    setFieldDefinitions([
      ...fieldDefinitions,
      makeNewField(),
    ])
  }

  useEffect(() => {
    console.log('current contentful value', contentfulSdk.field.getValue());
  })

  const change = (stateFunction: Function, key: string) => (value: any) => {
    stateFunction(value);

    debounce(() => {
      contentfulSdk.field.setValue({
        workspace: workspaceId,
        table: tableName,
        knownFields: potentialFields,
        fieldDefintions: fieldDefinitions,
      });
    }, 3000);
  }

  return (
    <div className="max-w-2xl">
      {(workspaceId && tableName) || (<ChooseTableStep
        onResolveFields={change(setPotentialFields, 'knownFields')}
        onSetWorkspaceId={change(setWorkspaceId, 'workspace')}
        onSetTableName={change(setTableName, 'table')}
        workspaceId={workspaceId}
      />)}
      {workspaceId && tableName && (<>
        <SetFieldsStep
          value={fieldDefinitions}
          onChange={change(setFieldDefinitions, 'fieldDefinitions')}
          onCreateNewField={handleCreateNewField}
          knownFields={potentialFields}
          workspaceId={workspaceId}
          tableName={tableName}
        />
      </>)}

    </div>
  );
};

export default App;
