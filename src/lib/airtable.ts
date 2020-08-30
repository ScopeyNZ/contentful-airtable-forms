export const resolveFields = async (workspace: string, table: string): Promise<Array<string>> => {
  return fetch(
    `https://api.airtable.com/v0/${workspace}/${encodeURIComponent(table)}?maxRecords=20`,
    { headers: {
      'Authorization': `Bearer ${process.env.REACT_APP_AIRTABLE_KEY}`,
    }},
  )
    .then(response => {
      if (response.status !== 200) {
        return response.json().then(response => {
          throw response
        });
      }

      return response.json()
    })
    .then(json => json.records.reduce((acc: Array<string>, record: { fields: Object }): Array<string> => (
      Object.keys(record.fields).reduce((currentFields: Array<string>, candidateField: string): Array<string> => {
        if (currentFields.includes(candidateField)) {
          return currentFields;
        }
        return [
          ...currentFields,
          candidateField,
        ];
      }, acc)
    ), []));
}

export const validateField = async (
  workspace: string,
  table: string,
  candidateField: string
): Promise<true> => {
  return fetch(
    `https://api.airtable.com/v0/${workspace}/${encodeURIComponent(table)}`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.REACT_APP_AIRTABLE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        records: [
          {
            fields: {
              [candidateField]: 'something',
            }
          }
        ]
      })
    },
  ).then(response => {
    if (response.status === 200) {
      // Dispatch a request to delete the record we just added, but don't wait for it.
      response.json().then((records) => fetch(
        `https://api.airtable.com/v0/${workspace}/${encodeURIComponent(table)}?records=${records[0].id}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${process.env.REACT_APP_AIRTABLE_KEY}`,
          },
        },
      ));

      return true;
    }

    return response.json().then(({ error }) => {
      throw error.type;
    });
  })
}
