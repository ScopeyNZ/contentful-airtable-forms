import React, {useState} from 'react';
import ContentfulFieldHint from './ContentfulFieldHint';
import classNames from 'classnames';

export default function FieldSelector({
  id,
  onAddPossibleField,
  onChange,
  possibleFields,
  tableName,
  value,
  workspaceId,
}: {
  id: string,
  onAddPossibleField: (field: string) => void,
  onChange: (value: string) => void,
  possibleFields: Array<string>,
  tableName: string,
  value: string|undefined,
  workspaceId: string,
}) {
  const [enteringManualField, setEnteringManualField] = useState(false);
  const [validatingManualField, setValidatingManualField] = useState(false);
  const [newField, setNewField] = useState('');
  const [invalid, setInvalid] = useState(false);

  const handleAddField = async () => {
    setInvalid(false);
    setValidatingManualField(true);

    const params = `workspaceId=${
      workspaceId
    }&table=${
      encodeURIComponent(tableName)
    }&candidateField=${
      encodeURIComponent(newField)
    }`;

    const response = await fetch(`/.netlify/functions/airtable/validate-field?${params}`)
    setValidatingManualField(false);

    if (response.status === 200) {
      setEnteringManualField(false);
      setNewField('');
      onAddPossibleField(newField);
      onChange(newField);
      return;
    }

    setInvalid(true);
  }

  let hint = 'Choose (or enter) the column name that this field should write into';
  if (enteringManualField) {
    hint = 'Enter the column name exactly as it appears on the table in Airtable. Note that validating the field will' +
      ' attempt to add a temporary record to the table';
  }
  if (invalid) {
    hint = 'The column name provided doesn\'t appear to be a valid column on the configured table';
  }

  return (
    <div className="cf-form-field">
      <label htmlFor={id}>Airtable field</label>
      <div className="flex space-x-2">
        { enteringManualField || (
          <select
            className="cf-form-input flex-grow"
            value={value}
            onChange={event => onChange(event.target.value)}
          >
            <option />
            { possibleFields.map(option => <option key={option} value={option}>{ option }</option>) }
          </select>
        )}
        { enteringManualField && (<>
          <input
            className="cf-form-input flex-grow"
            type="text"
            value={newField}
            onChange={event => setNewField(event.target.value)}
          />
          <button
            className={classNames('cf-btn-primary', { 'cf-is-loading': validatingManualField })}
            disabled={validatingManualField}
            type="button"
            onClick={handleAddField}
          >
            Validate & use
          </button>
        </>) }
        <button className="cf-btn-secondary" type="button" onClick={() => setEnteringManualField(!enteringManualField)}>
          { enteringManualField ? 'Cancel' : 'Enter field manually' }
        </button>
      </div>
      <ContentfulFieldHint text={hint} errored={invalid} />
    </div>
  )
}
