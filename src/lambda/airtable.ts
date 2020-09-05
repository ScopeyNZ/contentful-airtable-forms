import { resolveFields, validateField } from '../lib/airtable';
require('dotenv').config();

export const handler = async (event: any) => {
  const action = event.path.substring(event.path.lastIndexOf('/') + 1);

  switch (action) {
    case 'fields':
      return handleFields(event);
    case 'validate-field':
      return handleValidateField(event);
    default:
      return respond('Not found', 404);
  }
}

const handleFields = async (event: any) => {
  if (!checkQueryParams(['workspaceId', 'table'], event)) {
    return respond('Must provide "workspaceId" and "table" parameters', 422);
  }
  const { workspaceId, table } = event.queryStringParameters;
  return handleAirtableCall(async () => await resolveFields(workspaceId, table));
}

const handleValidateField = async (event: any) => {
  if (!checkQueryParams(['workspaceId', 'table', 'candidateField'], event)) {
    return respond('Must provide "workspaceId", "table", and "candidateField" parameters', 422);
  }
  const { workspaceId, table, candidateField } = event.queryStringParameters;
  return handleAirtableCall(async () => await validateField(workspaceId, table, candidateField));
}

const handleAirtableCall = async (caller: Function) => {
  try {
    return respond(await caller());
  } catch (error) {
    if (error.error === 'NOT_FOUND') {
      return respond('Invalid workspace ID', 400);
    }
    return respond(error, 500);
  }
}

const respond = (body: any, statusCode: number = 200) => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(body),
});

const checkQueryParams = (paramNames: Array<string>, event: any): boolean => {
  if (!Object.hasOwnProperty.call(event, 'queryStringParameters')) {
    return false;
  }

  for (const name of paramNames) {
    if (!Object.hasOwnProperty.call(event.queryStringParameters, name)) {
      return false;
    }
  }
  return true;
}
