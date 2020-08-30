import React, {useState} from 'react';
import './App.scss';
import ChooseTableStep from "./steps/ChooseTableStep";
import SetFieldsStep from "./steps/SetFieldsStep";
import FieldDefinition from './types/FieldDefinition';

function App() {
  const [potentialFields, setPotentialFields] = useState<Array<string>>([
    "Name",
    "Stories",
    "Target release date",
    "Status",
    "Merchant impact total",
    "Developer impact total",
    "Complexity total",
    "Developer adoption total",
    "Revenue impact total",
    "Growth impact total",
    "Notes"
  ]);
  const [workspaceId, setWorkspaceId] = useState('apppLonXlMz0AfbvQ');
  const [tableName, setTableName] = useState('Cycles');

  const initialDefinitions: Array<FieldDefinition> = [
    {
      id: '',
      label: 'One',
      airtableField: 'Stories',
      type: 'text',
    },
    {
      id: '',
      label: 'Two',
      airtableField: 'Status',
      type: 'text',
    },
    {
      id: '',
      label: 'Three',
      airtableField: 'Target release date',
      type: 'text',
    }
  ];

  return (
    <div className="max-w-2xl">
      {Array.isArray(potentialFields) || (<ChooseTableStep
        onResolveFields={setPotentialFields}
        onSetWorkspaceId={setWorkspaceId}
        onSetTableName={setTableName}
        tableName={tableName}
        workspaceId={workspaceId}
      />)}
      {Array.isArray(potentialFields) && (<>
        <SetFieldsStep
          initialDefinitions={initialDefinitions}
          knownFields={potentialFields}
          workspaceId={workspaceId}
          tableName={tableName}
        />
      </>)}

    </div>
  );
};

export default App;
