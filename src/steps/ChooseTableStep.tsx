import React, {useState} from "react";
import {resolveFields} from "../lib/airtable";
import WorkspaceSelector from "../components/WorkspaceSelector";
import ContentfulFieldHint from "../components/ContentfulFieldHint";
import classNames from "classnames";

export default function ChooseTableStep({
  onResolveFields,
  onSetWorkspaceId,
  onSetTableName,
  tableName,
  workspaceId,
}: {
  onResolveFields: (fields: Array<string>) => void,
  onSetWorkspaceId: (workspaceId: string) => void,
  onSetTableName: (tableName: string) => void ,
  tableName: string,
  workspaceId: string,
}) {
  const [invalidWorkspace, setInvalidWorkspace] = useState<boolean>(false);
  const [invalidTable, setInvalidTable] = useState<boolean>(false);
  const [validating, setValidating] = useState<boolean>(false);

  const handleValidateTable = async () => {
    setInvalidWorkspace(false);
    setInvalidTable(false);

    if (!workspaceId || workspaceId.length === 0) {
      setInvalidWorkspace(true);
      return;
    }
    if (tableName.length === 0) {
      setInvalidTable(true);
      return;
    }

    setValidating(true);

    try {
      const resolved = await resolveFields(workspaceId, tableName)
      setValidating(false);
      onResolveFields(resolved);
    } catch (error) {
      setInvalidTable(true);
    }
  }

  const hint = invalidTable
    ? (tableName.length > 0 ? 'The given table appears to be invalid' : 'You must enter a table name')
    : 'Enter the name of the table where form submissions should go. This must match the name in Airtable exactly.';

  return (
    <form onSubmit={event => event.preventDefault()}>
      <div>
        <h3 className="text-2xl leading-snug mb-4">Step one: specify an Airtable table for form submissions</h3>
        <p className="mb-4">
          Due to limitations in Airtable's API, you need to provide the specific workspace ID and table name where you
          would like form submissions to go. This form will attempt to validate your entries and ensure the workspace
          and table combination you provide is valid.
        </p>
      </div>
      <WorkspaceSelector invalid={invalidWorkspace} value={workspaceId} onChange={onSetWorkspaceId} />
      <div className="cf-form-field">
        <label htmlFor="cfaf-table-name">Table name</label>
        <input
          type="text"
          id="cfaf-table-name"
          className="cf-form-input"
          value={tableName}
          onChange={event => onSetTableName(event.target.value)}
          aria-invalid={invalidTable}
        />
        <ContentfulFieldHint errored={invalidTable} text={hint} />
      </div>
      <input
        type="submit"
        className={classNames('cf-btn-primary', { 'cf-is-loading': validating })}
        onClick={handleValidateTable}
        value="Validate table"
      />
    </form>
  );
}
