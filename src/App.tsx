import React, { useState, useEffect } from 'react';
import { 
  Database, 
  RefreshCcw, 
  FileCheck, 
  FileCode, 
  LayoutDashboard, 
  Settings, 
  UserCircle, 
  Terminal,
  Activity,
  Package,
  Layers,
  Download,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Helpers ---

const transformXml = async (xmlString: string, xsltName: string): Promise<string> => {
  const response = await fetch(`/api/xslt/${xsltName}`);
  const xsltString = await response.text();

  const parser = new DOMParser();
  const xml = parser.parseFromString(xmlString, 'application/xml');
  const xslt = parser.parseFromString(xsltString, 'application/xml');

  if (typeof window !== 'undefined' && 'XSLTProcessor' in window) {
    const processor = new XSLTProcessor();
    processor.importStylesheet(xslt);
    const resultDoc = processor.transformToDocument(xml);
    return new XMLSerializer().serializeToString(resultDoc);
  }
  return 'XSLT transformation not supported in this environment.';
};

const downloadXml = (content: string, filename: string) => {
  const blob = new Blob([content], { type: 'application/xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const Tooltip = ({ text, children }: { text: string, children: React.ReactNode }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="relative inline-block" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            className="absolute z-[100] px-3 py-2 text-[10px] font-medium text-white bg-[#1a1a1f] border border-gray-800 rounded shadow-2xl w-48 bottom-full left-1/2 -translate-x-1/2 mb-2 pointer-events-none"
          >
            {text}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-[#1a1a1f]"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Modules ---

const Dashboard = () => (
  <div className="flex flex-col gap-6">
    <div className="grid grid-cols-4 gap-6">
      <div className="bg-[#0a0a0f] border border-gray-800 rounded-lg p-5">
        <div className="flex items-center gap-3 mb-2">
          <Database className="neon-text-cyan" size={24} />
          <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Entités XML</span>
        </div>
        <p className="text-2xl font-bold text-white code-font">12</p>
      </div>
      <div className="bg-[#0a0a0f] border border-gray-800 rounded-lg p-5">
        <div className="flex items-center gap-3 mb-2">
          <Activity className="neon-text-purple" size={24} />
          <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Validations</span>
        </div>
        <p className="text-2xl font-bold text-white code-font">100%</p>
      </div>
      <div className="bg-[#0a0a0f] border border-gray-800 rounded-lg p-5">
        <div className="flex items-center gap-3 mb-2">
          <RefreshCcw className="neon-text-cyan" size={24} />
          <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Sync JSON</span>
        </div>
        <p className="text-2xl font-bold text-white code-font">ACTIVE</p>
      </div>
      <div className="bg-[#0a0a0f] border border-gray-800 rounded-lg p-5">
        <div className="flex items-center gap-3 mb-2">
          <Terminal className="text-white" size={24} />
          <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">SOAP Status</span>
        </div>
        <p className="text-2xl font-bold text-white code-font">ONLINE</p>
      </div>
    </div>

    <div className="grid grid-cols-12 gap-6 flex-1 h-full">
      <div className="col-span-8 flex flex-col gap-6">
        <div className="bg-[#0a0a0f] neon-border-cyan rounded-lg overflow-hidden flex flex-col flex-1">
          <div className="card-header-styled">Système XML Distribué</div>
          <div className="p-6">
            <p className="text-gray-400 text-sm leading-relaxed">Le XML DataHub synchronise les données structurées à travers plusieurs services via SOAP et REST. Il utilise XSD pour garantir l'intégrité et XSLT pour la présentation.</p>
            <div className="mt-8 space-y-6">
              <div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-gray-500 uppercase tracking-wider">Intégrité des Schémas</span>
                  <span className="text-cyan-400 code-font">98%</span>
                </div>
                <div className="h-1 bg-gray-900 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-500" style={{ width: '98%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-gray-500 uppercase tracking-wider">Performances XSLT</span>
                  <span className="text-purple-400 code-font">24ms</span>
                </div>
                <div className="h-1 bg-gray-900 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500" style={{ width: '85%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-span-4 flex flex-col gap-6">
        <div className="bg-[#0a0a0f] border border-gray-800 rounded-lg overflow-hidden flex flex-col flex-1">
          <div className="card-header-styled">Journal d'échanges</div>
          <div className="p-4 space-y-4">
            <div className="flex gap-3 text-[10px]">
              <span className="neon-text-cyan code-font">[INFO]</span>
              <span className="text-gray-400">Export XML Produits généré.</span>
            </div>
            <div className="flex gap-3 text-[10px]">
              <span className="neon-text-purple code-font">[SOAP]</span>
              <span className="text-gray-400">Requête GetUser traitée.</span>
            </div>
            <div className="flex gap-3 text-[10px]">
              <span className="neon-text-cyan code-font">[XSD]</span>
              <span className="text-gray-400">Validation Catalog.xml réussie.</span>
            </div>
            <div className="flex gap-3 text-[10px]">
              <span className="neon-text-cyan code-font">[REST]</span>
              <span className="text-gray-400">Update Config via XML.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const Catalog = () => {
  const [xmlContent, setXmlContent] = useState('');
  const [htmlContent, setHtmlContent] = useState('');
  const [viewMode, setViewMode] = useState<'xml' | 'html'>('html');

  useEffect(() => {
    fetch('/api/xml/products')
      .then(res => res.text())
      .then(async xml => {
        setXmlContent(xml);
        const html = await transformXml(xml, 'products');
        setHtmlContent(html);
      });
  }, []);

  return (
    <div className="flex flex-col gap-6 h-full overflow-hidden">
      <div className="flex justify-between items-center">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Source: products.xml</h3>
        <div className="flex gap-2">
          <button className="neon-btn-outline flex items-center gap-2" onClick={() => downloadXml(xmlContent, 'products.xml')}>
            <Download size={14} /> Exporter XML
          </button>
          <button className={`neon-btn-outline ${viewMode === 'html' ? 'border-cyan-500 text-cyan-400' : ''}`} onClick={() => setViewMode('html')}>Rendu Visuel</button>
          <button className={`neon-btn-outline ${viewMode === 'xml' ? 'border-cyan-500 text-cyan-400' : ''}`} onClick={() => setViewMode('xml')}>Code XML</button>
        </div>
      </div>
      <div className="bg-[#0a0a0f] neon-border-cyan rounded-lg overflow-hidden flex flex-col flex-1">
        <div className="card-header-styled flex justify-between">
          <span>{viewMode === 'xml' ? 'Contenu XML Brut' : 'Transformation XSLT'}</span>
          {viewMode === 'html' && (
            <Tooltip text="XSD (XML Schema Definition): Garantit que le fichier XML respecte la structure et les types de données prédéfinis.">
              <span className="text-cyan-400 cursor-help flex items-center gap-1">
                <FileCheck size={12} /> XSD VALIDATED
              </span>
            </Tooltip>
          )}
        </div>
        <div className="p-6 overflow-auto flex-1">
          {viewMode === 'xml' ? (
            <pre className="text-cyan-100">{xmlContent}</pre>
          ) : (
            <div className="rendered-content" dangerouslySetInnerHTML={{ __html: htmlContent }} />
          )}
        </div>
      </div>
    </div>
  );
};

const CVGenerator = () => {
    const [html, setHtml] = useState('');
    const [xml, setXml] = useState('');

    const generate = () => {
        fetch('/api/xml/cv')
            .then(res => res.text())
            .then(async xmlString => {
                setXml(xmlString);
                const htmlString = await transformXml(xmlString, 'cv');
                setHtml(htmlString);
            });
    };

    return (
        <div className="grid grid-cols-12 gap-6 h-full overflow-hidden">
            <div className="col-span-8 flex flex-col gap-6">
                <div className="bg-[#0a0a0f] neon-border-purple rounded-lg overflow-hidden flex-1 flex flex-col">
                    <div className="card-header-styled flex justify-between">
                        <div className="flex items-center gap-2">
                           <span>Rendu CV Dynamique</span>
                           <Tooltip text="XSLT (eXtensible Stylesheet Language Transformations): Transforme les données XML brutes en documents HTML structurés pour l'affichage.">
                              <Info size={12} className="text-gray-600 cursor-help" />
                           </Tooltip>
                        </div>
                        <button onClick={generate} className="text-[10px] text-purple-400 hover:text-white transition-colors">DÉCLENCHER XSLT</button>
                    </div>
                    <div className="p-8 flex-1 overflow-auto">
                        <AnimatePresence mode="wait">
                        {html ? (
                            <motion.div 
                                key="cv-rendered"
                                initial={{ opacity: 0 }} 
                                animate={{ opacity: 1 }} 
                                dangerouslySetInnerHTML={{ __html: html }} 
                            />
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-600 border border-dashed border-gray-800 rounded-lg">
                                <UserCircle size={48} className="mb-4 opacity-20" />
                                <p className="text-sm">En attente de transformation du document XML...</p>
                            </div>
                        )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
            <div className="col-span-4 flex flex-col gap-6">
                <div className="bg-[#0a0a0f] border border-gray-800 rounded-lg p-6">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Moteur de Rendu</h3>
                    <div className="space-y-4">
                        <div className="p-3 bg-black rounded border border-gray-900">
                            <span className="text-[10px] text-gray-500 uppercase block mb-1">Source</span>
                            <span className="text-xs code-font text-purple-400">cv.xml</span>
                        </div>
                        <div className="p-3 bg-black rounded border border-gray-900">
                            <span className="text-[10px] text-gray-500 uppercase block mb-1">Feuille de Style</span>
                            <span className="text-xs code-font text-cyan-400">cv.xslt</span>
                        </div>
                        <button onClick={generate} className="neon-btn-primary w-full mt-4">GÉNÉRER CV HUB</button>
                        {xml && (
                            <button 
                                onClick={() => downloadXml(xml, 'cv.xml')} 
                                className="neon-btn-outline w-full mt-2 flex items-center justify-center gap-2"
                            >
                                <Download size={14} /> EXPORTER EN XML
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const Converter = () => {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');

    const toXml = () => {
        fetch('/api/convert/json-to-xml', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: input
        }).then(res => res.text()).then(setOutput);
    };

    const toJson = () => {
        fetch('/api/convert/xml-to-json', {
            method: 'POST',
            headers: { 'Content-Type': 'application/xml' },
            body: input
        }).then(res => res.json()).then(j => setOutput(JSON.stringify(j, null, 2)));
    };

    return (
        <div className="grid grid-cols-12 gap-6 h-full overflow-hidden">
            <div className="col-span-6 flex flex-col gap-4">
                <div className="bg-[#0a0a0f] border border-gray-800 rounded-lg overflow-hidden flex flex-col flex-1">
                    <div className="card-header-styled flex justify-between items-center">
                        <span>Data Input Zone</span>
                        <Tooltip text="XML Mapping: Conversion entre les formats hiérarchiques XML et JSON pour l'interopérabilité entre différents systèmes distribués.">
                          <Info size={12} className="text-gray-600 cursor-help" />
                        </Tooltip>
                    </div>
                    <textarea 
                        className="bg-transparent text-cyan-100 p-6 flex-1 outline-none resize-none code-font leading-relaxed" 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder='// Collez votre flux XML ou JSON ici...'
                    />
                </div>
                <div className="flex gap-4">
                    <button className="neon-btn-outline flex-1 border-purple-500 text-purple-400" onClick={toJson}>XML &rarr; JSON</button>
                    <button className="neon-btn-outline flex-1 border-cyan-500 text-cyan-400" onClick={toXml}>JSON &rarr; XML</button>
                </div>
            </div>
            <div className="col-span-6 flex flex-col">
                <div className="bg-[#0a0a0f] border border-gray-800 rounded-lg overflow-hidden flex flex-col flex-1">
                    <div className="card-header-styled">Output Buffer</div>
                    <div className="p-6 overflow-auto">
                        <pre className="m-0 p-0 bg-transparent text-gray-400">{output || '// En attente de traitement...'}</pre>
                    </div>
                </div>
            </div>
        </div>
    );
};

const SoapTester = () => {
    const [response, setResponse] = useState('');
    const mockSoapRequest = `
<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope">
  <soap:Body>
    <GetUserRequest xmlns="http://xmlhub.dev/soap">
      <UserId>U001</UserId>
    </GetUserRequest>
  </soap:Body>
</soap:Envelope>`.trim();

    const send = () => {
        fetch('/api/soap/service', {
            method: 'POST',
            headers: { 'Content-Type': 'application/xml' },
            body: mockSoapRequest
        }).then(res => res.text()).then(setResponse);
    };

    return (
        <div className="grid grid-cols-12 gap-6 h-full overflow-hidden">
            <div className="col-span-5 flex flex-col gap-6">
                <div className="bg-[#0a0a0f] border border-gray-800 rounded-lg overflow-hidden flex flex-col flex-1">
                    <div className="card-header-styled flex justify-between items-center">
                        <span>SOAP Envelope Builder</span>
                        <Tooltip text="SOAP (Simple Object Access Protocol): Protocole de messagerie XML standard pour l'échange d'informations dans des environnements décentralisés et distribués.">
                          <Info size={12} className="text-gray-600 cursor-help" />
                        </Tooltip>
                    </div>
                    <div className="p-6 overflow-auto flex-1">
                        <pre className="text-purple-400 m-0 p-0 bg-transparent">{mockSoapRequest}</pre>
                    </div>
                </div>
                <button className="neon-btn-primary w-full" onClick={send}>CALL SOAP GATEWAY</button>
            </div>
            <div className="col-span-7 flex flex-col gap-6">
                <div className="bg-[#0a0a0f] neon-border-cyan rounded-lg overflow-hidden flex flex-col flex-1">
                    <div className="card-header-styled">Service Response Stack</div>
                    <div className="p-6 overflow-auto flex-1">
                        <pre className="text-cyan-400 m-0 p-0 bg-transparent">{response || '// En attente de requête...'}</pre>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ConfigView = () => {
    const [config, setConfig] = useState<any>(null);

    useEffect(() => {
        fetch('/api/config').then(res => res.json()).then(setConfig);
    }, []);

    if (!config) return <div className="text-center p-20 animate-pulse text-gray-600 uppercase tracking-widest text-xs">Synchronizing Nodes...</div>;

    return (
        <div className="flex flex-col gap-6">
            <div className="bg-[#0a0a0f] neon-border-cyan rounded-lg overflow-hidden">
                <div className="card-header-styled">System Configuration Metrics</div>
                <div className="p-8 grid grid-cols-3 gap-8">
                    <div className="space-y-2">
                        <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Application Name</span>
                        <p className="text-xl text-white font-light">{config['app-name']}</p>
                    </div>
                    <div className="space-y-2">
                        <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Theme Definition</span>
                        <div className="flex items-center gap-3">
                            <span className="text-xs uppercase text-purple-400 font-bold">{config.theme.mode}</span>
                            <div className="flex gap-1">
                                <div className="w-3 h-3 rounded-full" style={{ background: config.theme['primary-color'] }}></div>
                                <div className="w-3 h-3 rounded-full" style={{ background: config.theme['secondary-color'] }}></div>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Locale Context</span>
                        <p className="text-xs text-gray-300">{config.localization.language} / {config.localization.timezone}</p>
                    </div>
                </div>
            </div>

            <div className="bg-[#0a0a0f] border border-gray-800 rounded-lg overflow-hidden">
                <div className="card-header-styled">API Core Manifest</div>
                <div className="p-6">
                    <div className="grid grid-cols-2 gap-8 text-[11px]">
                        <div className="flex justify-between border-b border-gray-900 pb-2">
                            <span className="text-gray-500">Service Endpoint</span>
                            <span className="code-font text-cyan-400">{config['api-settings'].endpoint}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-900 pb-2">
                            <span className="text-gray-500">Hub Protocol Version</span>
                            <span className="code-font text-purple-400">v{config['api-settings'].version}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-900 pb-2">
                            <span className="text-gray-500">Diagnostic Intercept</span>
                            <span className="text-green-500 font-bold">ENABLED</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-900 pb-2">
                            <span className="text-gray-500">Distributed Node State</span>
                            <span className="text-cyan-400 font-bold">STABLE</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Main App ---

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', num: '01' },
    { id: 'catalog', label: 'Catalogue XML', num: '02' },
    { id: 'cv', label: 'Générateur CV (XSLT)', num: '03' },
    { id: 'converter', label: 'Mapping & Convert', num: '04' },
    { id: 'soap', label: 'SOAP Web Services', num: '05' },
    { id: 'config', label: 'Config & Properties', num: '06' },
  ];

  return (
    <div className="flex h-screen w-full bg-[#050505] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0a0a0f] border-r border-gray-800 flex flex-col">
        <div className="p-6 mb-4">
          <h1 className="text-xl font-bold neon-text-purple tracking-tighter">XML <span className="text-white">DataHub</span></h1>
          <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest">Distributed Systems Engine</p>
        </div>
        
        <nav className="flex-1 space-y-1">
          {menuItems.map(item => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`sidebar-item ${activeTab === item.id ? 'active' : ''}`}
            >
              <span className="code-font mr-3 opacity-50">{item.num}</span>
              <span className="tracking-wide">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 bg-black border-t border-gray-800 space-y-3">
          <div className="flex items-center text-[10px] text-gray-500 uppercase tracking-widest font-bold">
            <div className="status-dot bg-green-500 pulse mr-2"></div> 
            NODE-XML-CORE: ACTIVE
          </div>
          <div className="flex items-center text-[10px] text-gray-500 uppercase tracking-widest font-bold">
            <div className="status-dot bg-green-500 pulse mr-2"></div> 
            SOAP-GATEWAY: READY
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden flex flex-col p-8">
        <header className="flex justify-between items-center mb-8">
           <div className="flex flex-col">
              <h2 className="text-2xl font-light text-white leading-none">
                XML <span className="neon-text-cyan">Synchronization</span> Hub
              </h2>
              <p className="text-sm text-gray-500 mt-2">
                {menuItems.find(m => m.id === activeTab)?.label} — Flux distribués et mapping en temps réel
              </p>
           </div>
           <div className="flex gap-4">
               <button className="neon-btn-outline" onClick={() => window.location.reload()}>REFRESH NODE</button>
               <button className="neon-btn-primary">DEPLOY CONFIG</button>
           </div>
        </header>

        <div className="flex-1 overflow-hidden relative">
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    className="h-full"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                >
                    {activeTab === 'dashboard' && <Dashboard />}
                    {activeTab === 'catalog' && <Catalog />}
                    {activeTab === 'cv' && <CVGenerator />}
                    {activeTab === 'converter' && <Converter />}
                    {activeTab === 'soap' && <SoapTester />}
                    {activeTab === 'config' && <ConfigView />}
                </motion.div>
            </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

// Custom button style logic
if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.textContent = `
    .btn-neon-cyan { background: var(--neon-cyan); color: black; font-weight: 700; box-shadow: 0 0 12px rgba(0, 255, 255, 0.4); border: none; }
    .btn-neon-cyan:hover { background: #00e5e5; box-shadow: 0 0 20px var(--neon-cyan); transform: scale(1.05); }
    .bg-neon-blue { background-color: var(--neon-blue); }
    .bg-neon-purple { background-color: var(--neon-purple); }
    .nav-link.active { background: rgba(0, 243, 255, 0.08) !important; color: white !important; border-right: 3px solid var(--neon-blue) !important; box-shadow: inset -10px 0 20px rgba(0, 243, 255, 0.05); }
    .progress-bar { transition: width 1s cubic-bezier(0.4, 0, 0.2, 1); }
    .neon-card { transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
    `;
    document.head.appendChild(style);
}
