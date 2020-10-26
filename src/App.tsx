import React, {useEffect, useState} from 'react';
import ChooseTableStep from "./steps/ChooseTableStep";
import SetFieldsStep from "./steps/SetFieldsStep";
import {FieldExtensionSDK} from 'contentful-ui-extensions-sdk';
import FieldDefinition from './types/FieldDefinition';
import './App.scss';
import { get, set } from "local-storage";
import KnownWorkspace from './types/KnownWorkspace';
import ChosenTableSummary from './components/ChosenTableSummary';
import { v4 } from 'uuid';

interface ContentfulFieldValue {
  workspace: string,
  workspaceName: string|undefined,
  table: string,
  knownFields: Array<string>,
  fieldDefinitions: Array<FieldDefinition>,
}

function App({ contentfulSdk, initial }: { contentfulSdk: FieldExtensionSDK, initial: ContentfulFieldValue }) {
  const makeNewField = (): FieldDefinition => ({
    id: v4(),
    label: '',
    airtableField: undefined,
    type: 'text',
  });

  // Check local storage for previous workspaces
  const knownSpaces = Array.isArray(get('spaces')) ? get<Array<KnownWorkspace>>('spaces') : new Array<KnownWorkspace>();

  const initialDefinitions = initial?.fieldDefinitions && initial.fieldDefinitions.length
    ? initial.fieldDefinitions
    : [makeNewField()];

  const [fieldValue, setFieldValue] = useState<ContentfulFieldValue>(initial
    ? {
      ...initial,
      fieldDefinitions: initialDefinitions,
    }
    : {
      workspace: '',
      workspaceName: '',
      table: '',
      knownFields: [],
      fieldDefinitions: [makeNewField()],
    });

  const [knownWorkspaces, setKnownWorkspaces] = useState<Array<KnownWorkspace>>(knownSpaces);
  const [editingTable, setEditingTable] = useState(false);

  // Add the current field's workspace if it's not known
  useEffect(() => {
    if (initial && !knownSpaces.find(space => space.value === initial.workspace)) {
      setKnownWorkspaces([...knownSpaces, {
        label: initial.workspaceName || initial.workspace,
        value: initial.workspace,
      }]);
    }
  }, []);

  const { workspace, table, knownFields, fieldDefinitions } = fieldValue;

  const handleAddKnownWorkspace = (workspace: KnownWorkspace) => {
    const allSpaces = [
      ...knownWorkspaces,
      workspace,
    ];

    set('spaces', allSpaces);
    setKnownWorkspaces(allSpaces);
  }

  const handleCreateNewField = () => {
    handleSetFieldDefinitions([
      ...fieldDefinitions,
      makeNewField(),
    ])
  }

  const handleSetFieldDefinitions = (definitions: Array<FieldDefinition>) => {
    contentfulSdk.field.setValue({
      ...fieldValue,
      fieldDefinitions: definitions,
    });
  }

  const handleSetWorkspaceId = (workspaceId: string) => {
    const workspace = knownSpaces.find((candidate) => candidate.value === workspaceId);

    contentfulSdk.field.setValue({
      ...fieldValue,
      workspace: workspaceId,
      workspaceName: workspace ? workspace.label : workspaceId,
    });
  }

  const handleChooseTable = (tableName: string, fields: Array<string>) => {
    contentfulSdk.field.setValue({
      ...fieldValue,
      table: tableName,
      knownFields: fields,
    });
  }

  useEffect(() => {
    const unsubscribe = contentfulSdk.field.onValueChanged((value) => {
      if (value) {
        setFieldValue(value);
      }
    });

    // clean up the event listener when the component is removed from the DOM
    return () => {
      unsubscribe();
    };
  }, [])

  const hasChosenTable = workspace && table;

  const renderChooseTableStep = () => {
    if (hasChosenTable && !editingTable) {
      const selectedWorkspace = knownWorkspaces.find(candidate => candidate.value === workspace) || {
        label: '',
        value: workspace,
      };

      return <ChosenTableSummary
        tableName={table}
        workspace={selectedWorkspace}
        onClickChange={() => { setEditingTable(true) }}
      />;
    }

    return <ChooseTableStep
      onSetWorkspaceId={handleSetWorkspaceId}
      onChooseTable={handleChooseTable}
      onAddKnownWorkspace={handleAddKnownWorkspace}
      knownWorkspaces={knownWorkspaces}
      workspaceId={workspace}
    />
  }

  const renderSetFieldsStep = () => {
    if (!hasChosenTable) {
      return null;
    }

    return <SetFieldsStep
      value={fieldDefinitions}
      onChange={handleSetFieldDefinitions}
      onCreateNewField={handleCreateNewField}
      knownFields={knownFields}
      workspaceId={workspace}
      tableName={table}
    />;
  }

  return (
    <div className="max-w-3xl">
      {renderChooseTableStep()}
      {renderSetFieldsStep()}

    </div>
  );
};

export default App;
