import express from 'express';
import path from 'path';
import fs from 'fs/promises';
import { XMLParser, XMLBuilder } from 'fast-xml-parser';
import xml2js from 'xml2js';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.text({ type: 'application/xml' }));

const parser = new XMLParser({ ignoreAttributes: false });
const builder = new XMLBuilder({ ignoreAttributes: false });

// 1. Data Access Endpoint (REST XML)
app.get('/api/xml/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(process.cwd(), 'xml', `${filename}.xml`);
    const data = await fs.readFile(filePath, 'utf-8');
    
    if (req.headers.accept === 'application/json') {
      const json = parser.parse(data);
      return res.json(json);
    }
    
    res.header('Content-Type', 'application/xml');
    res.send(data);
  } catch (error) {
    res.status(404).send('File not found');
  }
});

// 2. Conversion JSON -> XML
app.post('/api/convert/json-to-xml', (req, res) => {
  try {
    const xml = builder.build(req.body);
    res.header('Content-Type', 'application/xml');
    res.send(xml);
  } catch (error) {
    res.status(400).send('Invalid JSON');
  }
});

// 3. Conversion XML -> JSON
app.post('/api/convert/xml-to-json', (req, res) => {
  try {
    const json = parser.parse(req.body);
    res.json(json);
  } catch (error) {
    res.status(400).send('Invalid XML');
  }
});

// 4. SOAP Simulation
app.post('/api/soap/service', (req, res) => {
  const xmlInput = req.body;
  console.log('SOAP Request received:', xmlInput);
  
  // Simple mock logic: extract username from soap:Body and return info
  const parsed = parser.parse(xmlInput);
  const body = parsed['soap:Envelope']?.['soap:Body'] || parsed['Envelope']?.['Body'] || parsed;
  
  const responseXml = `
<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope">
<soap:Header/>
<soap:Body>
  <GetUserResponse xmlns="http://xmlhub.dev/soap">
    <Status>Success</Status>
    <ProcessedAt>${new Date().toISOString()}</ProcessedAt>
    <Details>Service XML DataHub processed your request correctly.</Details>
  </GetUserResponse>
</soap:Body>
</soap:Envelope>`.trim();

  res.header('Content-Type', 'application/xml');
  res.send(responseXml);
});

// 5. Serve XSLT files
app.get('/api/xslt/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const filePath = path.join(process.cwd(), 'xslt', `${name}.xslt`);
    const data = await fs.readFile(filePath, 'utf-8');
    res.header('Content-Type', 'application/xml');
    res.send(data);
  } catch (error) {
    res.status(404).send('XSLT not found');
  }
});

// 6. Validation Simulation
app.post('/api/validate', async (req, res) => {
  try {
    const { xml, schemaName } = req.body;
    const xsdPath = path.join(process.cwd(), 'xsd', `${schemaName}.xsd`);
    const xsdString = await fs.readFile(xsdPath, 'utf-8');
    
    // Since real XSD validation in JS without libxmljs is complex,
    // we do a structure check: check if the root element matches the XSD's defined root element
    const xmlObj = parser.parse(xml);
    const xsdObj = parser.parse(xsdString);
    
    const rootElement = Object.keys(xmlObj)[0];
    const expectedRoot = xsdObj['xs:schema']?.['xs:element']?.['@_name'];
    
    if (rootElement === expectedRoot) {
      res.json({ valid: true, message: 'Valid according to structural rules.' });
    } else {
      res.json({ valid: false, message: `Validation failed: Root element should be <${expectedRoot}>, found <${rootElement}>.` });
    }
  } catch (error) {
    res.status(500).json({ valid: false, message: 'Server error during validation' });
  }
});

// 7. Config Endpoint
app.get('/api/config', async (req, res) => {
  const configPath = path.join(process.cwd(), 'config', 'config.xml');
  const data = await fs.readFile(configPath, 'utf-8');
  const json = parser.parse(data);
  res.json(json.config);
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  if (!process.env.VERCEL) {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }
}

startServer();

export default app;
