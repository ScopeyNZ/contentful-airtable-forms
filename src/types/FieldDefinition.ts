export type FieldDefinitionType = 'text' | 'select' | 'checkbox' | 'optionList' | 'email';

export default interface FieldDefinition {
  id: string,
  label: string,
  airtableField: string|undefined,
  type: FieldDefinitionType,
  required: boolean,
  options: Array<string>|undefined,
}
