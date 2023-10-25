import React, { useState } from 'react';

function App() {
  const [processedJSON, setProcessedJSON] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const content = JSON.parse(e.target.result);
        const processedContent = processJSON(content);
        setProcessedJSON(JSON.stringify(processedContent));
      };

      reader.readAsText(file);
    }
  };

  const processJSON = (content) => {
    const keyList = ['IndividualEntrepreneur', 'LegalEntity', 'PhysicalPerson'];

    keyList.forEach((key) => {
      const schema = content.components.schemas[key];
      const fixedschema = schema.allOf.find(
        (sc) => sc["$ref"] === undefined
      );
      content.components.schemas[key] = {
        ...fixedschema,
        properties: {
          ...fixedschema.properties,
          legalType: { maxLength: 255, type: "string" }
        },
        description: schema.description,
      };
    });

    delete content.components.schemas['PrincipalUpdate'].required;

    return content;
  };

  const downloadProcessedJSON = () => {
    if (processedJSON) {
      const blob = new Blob([processedJSON], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'processed.json';
      a.click();
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} accept=".json" />
      {processedJSON && (
        <div>
          <button onClick={downloadProcessedJSON}>Скачать обработанный файл</button>
          <pre>{processedJSON}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
