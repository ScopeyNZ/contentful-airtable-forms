import React from "react";

export default function ContentfulFieldHint({ text, errored = false }: { text: string, errored?: boolean }) {
  return (
    <div className={`cf-${errored ? 'field-error' : 'form-hint'}`}>
      { text }
    </div>
  )
}
