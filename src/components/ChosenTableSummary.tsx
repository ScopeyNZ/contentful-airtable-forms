import React from 'react';
import KnownWorkspace from '../types/KnownWorkspace';

export default function ChosenTableSummary({ workspace, tableName, onClickChange }: {
  workspace: KnownWorkspace,
  tableName: string,
  onClickChange: () => void,
}) {
  return (
    <div className="bg-gray-100 p-2 pl-4 font-semibold flex justify-between items-center mb-2">
      <span>
        Submissions will be saved to { workspace.label.length ? workspace.label : (
          <abbr title="This is an unlabelled workspace">[{ workspace.value }]</abbr>
        ) } > { tableName }
      </span>
      {/*<button type="button" className="cf-btn-secondary" onClick={onClickChange}>
        Change
      </button>*/}
    </div>
  )
}
