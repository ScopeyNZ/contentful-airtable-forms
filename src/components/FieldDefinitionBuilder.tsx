import React from 'react';
import FieldDefinition from '../types/FieldDefinition';
import FieldSelector from './FieldSelector';
import ContentfulFieldHint from './ContentfulFieldHint';

export default function FieldDefinitionBuilder({
  fieldDefinition,
  onAddPossibleField,
  onChange,
  onClose,
  possibleFields,
  tableName,
  workspaceId,
}: {
  fieldDefinition: FieldDefinition,
  onAddPossibleField: (field: string) => void,
  onChange: (definition: FieldDefinition) => void,
  onClose: () => void,
  possibleFields: Array<string>,
  tableName: string,
  workspaceId: string,
}) {
  const makeId = (field: string) => `cfaf-field-${field}`;
  const updateDefinition = (prop: string) => (value: string) => onChange({
    ...fieldDefinition,
    [prop]: value,
  });
  const fieldTypes = [
    { label: 'Text field', value: 'text' },
    { label: 'Dropdown', value: 'select' },
    { label: 'Checkbox', value: 'checkbox' },
    { label: 'Email', value: 'email' },
    { label: 'Option list (multichoice)', value: 'optionList' },
  ];

  return (
    <div className="relative">
      <div className="flex space-x-2">
        <div className="cf-form-field flex-grow">
          <label htmlFor={makeId('label')}>Field label</label>
          <input
            className="cf-form-input"
            id={makeId('label')}
            type="text"
            value={fieldDefinition.label}
            onChange={(event) => updateDefinition('label')(event.target.value)}
          />
          <ContentfulFieldHint text="Note that only text columns in Airtable are currently supported." />
        </div>
        <div className="cf-form-field">
          <label htmlFor={makeId('type')}>Field type</label>
          <select
            className="cf-form-input w-full"
            id={makeId('type')}
            value={fieldDefinition.type}
            onChange={event => updateDefinition('type')(event.target.value)}
          >
            {fieldTypes.map(({label, value}) => <option key={value} value={value}>{label}</option>)}
          </select>
        </div>
      </div>
      <FieldSelector
        id={makeId('airtableField')}
        onAddPossibleField={onAddPossibleField}
        onChange={updateDefinition('airtableField')}
        possibleFields={possibleFields}
        tableName={tableName}
        value={fieldDefinition.airtableField}
        workspaceId={workspaceId}
      />
      <button
        className="absolute top-0 right-0 text-xl text-red-600 leading-3" onClick={onClose}
      >
        &times;
      </button>
    </div>
  )
}
