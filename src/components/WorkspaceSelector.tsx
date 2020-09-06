import React from 'react';
import {useState} from "react";
import classNames from "classnames";
import ContentfulFieldHint from "./ContentfulFieldHint";
import KnownWorkspace from '../types/KnownWorkspace';

export default function WorkspaceSelector(
  { invalid, value: chosenSpace, onChange, knownWorkspaces, onAddKnownWorkspace }: {
    invalid: boolean,
    value: string|undefined,
    knownWorkspaces: Array<KnownWorkspace>,
    onAddKnownWorkspace: (newSpace: KnownWorkspace) => void
    onChange: (newSpace: string) => void
  }
) {
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [isValidatingSpace, setIsValidatingSpace] = useState<boolean>(false);
  const [invalidSpace, setInvalidSpace] = useState<boolean>(false);
  const [newSpace, setNewSpace] = useState<string>('');
  const [newSpaceName, setNewSpaceName] = useState<string>('');

  const handleAddSpace = async () => {
    setIsValidatingSpace(true);

    const response = await fetch(`/.netlify/functions/airtable/fields?workspaceId=${newSpace}&table=not_real_table`)
      .then(response => response.json())

    setIsValidatingSpace(false);

    if (response === 'Invalid workspace ID') {
      setInvalidSpace(true);
      return;
    }

    // Emit event
    onChange(newSpace)

    // Reset state
    onAddKnownWorkspace({
      value: newSpace,
      label: newSpaceName
    });
    setNewSpace('');
    setNewSpaceName('')
    setShowAddForm(false);
    setInvalidSpace(false);
  }

  const handleToggleAdd = () => setShowAddForm(!showAddForm);

  let hint = 'Choose the workspace where you have set up a table for form submissions.';

  if (showAddForm) {
    hint = 'Enter the ID that is shown in the API docs for the workspace of your table, and enter a label for it.'
  }
  if (invalidSpace) {
    hint = `"${newSpace}" does not appear to be a valid workspace ID.`;
  }
  if (invalid) {
    hint = 'You must choose (or add) the workspace that your submissions table belongs to.';
  }

  const showError = invalid || invalidSpace;
  return (
    <div className="cf-form-field">
      <label htmlFor="cfaf-choose-space">Workspace ID</label>
      <div className="flex items-center space-x-2 w-full">
        { showAddForm || knownWorkspaces.length === 0 || (
          <select
            className="cf-form-input flex-grow"
            id="cfaf-choose-space"
            aria-invalid={invalid}
            onChange={event => onChange(event.target.value)}
            value={chosenSpace}
          >
            <option />
            { knownWorkspaces.map(({ label, value }) => (
              <option
                key={value}
                value={value}
              >
                { label }
              </option>
            )) }
          </select>
        )}
        {
          showAddForm && (
            <>
              <input
                type="text"
                placeholder="Workspace ID"
                value={newSpace}
                onChange={event => setNewSpace(event.target.value)}
                className="cf-form-input"
                aria-invalid={invalidSpace}
              />
              <input
                type="text"
                placeholder="Name"
                onChange={event => setNewSpaceName(event.target.value)}
                className="cf-form-input flex-grow"
              />
              <button
                type="button"
                className={classNames('cf-btn-primary', { 'cf-is-loading': isValidatingSpace })}
                onClick={handleAddSpace}
                disabled={isValidatingSpace}
              >Verify & add workspace</button>
            </>
          )
        }
        <button type="button" className="cf-btn-secondary" onClick={handleToggleAdd}>
          { showAddForm ? 'Cancel' : '+ Add new workspace' }
        </button>
      </div>
      <ContentfulFieldHint text={hint} errored={showError} />
    </div>
  )
}
