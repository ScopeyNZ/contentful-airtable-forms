import React, { useState, KeyboardEvent } from 'react';
import FieldDefinition from '../types/FieldDefinition';
import FieldSelector from './FieldSelector';
import ContentfulFieldHint from './ContentfulFieldHint';
import { CheckboxField, Pill } from "@contentful/forma-36-react-components";

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
  const [optionValue, setOptionValue] = useState<string>('');
  const makeId = (field: string) => `cfaf-field-${field}`;
  const updateDefinition = (prop: string) => (value: string|Array<string>|boolean) => onChange({
    ...fieldDefinition,
    [prop]: value,
  });
  const fieldTypes = [
    { label: 'Text field', value: 'text' },
    { label: 'Text area', value: 'textarea' },
    { label: 'Dropdown', value: 'select' },
    { label: 'Checkbox', value: 'checkbox' },
    { label: 'Email', value: 'email' },
    { label: 'Option list (multichoice)', value: 'optionList' },
  ];
  const hasOptions = ['optionList', 'select'].includes(fieldDefinition.type);

  const handleRemoveOption = (option: string) => () => {
    if (!fieldDefinition.options) {
      return;
    }
    const options = [...fieldDefinition.options];
    options.splice(options.findIndex(candidate => candidate === option));
    updateDefinition('options')(options);
  }

  const handleAddOption = (event: KeyboardEvent) => {
    if (event.key !== 'Enter') {
      return;
    }

    updateDefinition('options')([
      ...(fieldDefinition.options || []),
      optionValue,
    ]);
    setOptionValue('');
  }

  return (
    <div className="relative p-2 border-b border-cf-element space-y-4">
      <div className="flex space-x-2">
        <div className="cf-form-field flex-grow mb-0">
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
        <div className="cf-form-field mb-0">
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
      { hasOptions && (
        <div className="space-x-2">
          { fieldDefinition.options?.map((option: string) => (<Pill
            label={option}
            key={option}
            onClose={handleRemoveOption(option)}
          />)) }
        </div>
      )}
      { hasOptions && (
        <div className="cf-form-field">
          <label htmlFor={makeId('type')}>Available options</label>
          <input
            className="cf-form-input w-full"
            id={makeId('options')}
            value={optionValue}
            onChange={event => setOptionValue(event.target.value)}
            onKeyPress={handleAddOption}
          />
          <ContentfulFieldHint text="Enter an option and press enter" />
        </div>
      )}
      <div className="flex justify-between items-center">
        <CheckboxField
          id={makeId('required')}
          labelText="Required"
          checked={fieldDefinition.required}
          onChange={() => updateDefinition('required')(!fieldDefinition.required)}
        />
        <button
          type="button"
          className="cf-btn-secondary" onClick={onClose}
        >
          Done
        </button>
      </div>
    </div>
  )
}
