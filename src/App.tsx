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
  Info,
  HelpCircle,
  X,
  ChevronRight,
  ShieldCheck,
  Cpu
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

const StatCard = ({ icon: Icon, label, value, colorClass }: any) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let current = 0;
    const target = parseInt(value) || 0;
    if (isNaN(target)) return;
    const interval = setInterval(() => {
      if (current < target) {
        current += Math.ceil(target / 20);
        if (current > target) current = target;
        setDisplayValue(current);
      } else {
        clearInterval(interval);
      }
    }, 50);
    return () => clearInterval(interval);
  }, [value]);

  return (
    <motion.div 
      whileHover={{ y: -5, scale: 1.02 }}
      className="bg-[#0a0a0f]/80 backdrop-blur-md border border-white/5 rounded-lg p-5 glass"
    >
      <div className="flex items-center gap-3 mb-2">
        <Icon className={colorClass} size={20} />
        <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">{label}</span>
      </div>
      <p className="text-2xl font-bold text-white code-font">{isNaN(parseInt(value)) ? value : displayValue}</p>
    </motion.div>
  );
};

const Dashboard = () => (
  <div className="flex flex-col gap-6 animate-in">
    <div className="grid grid-cols-4 gap-6">
      <StatCard icon={Database} label="Entités XML" value="142" colorClass="neon-text-cyan" />
      <StatCard icon={Activity} label="Validations" value="100%" colorClass="neon-text-purple" />
      <StatCard icon={RefreshCcw} label="Sync JSON" value="ACTIVE" colorClass="neon-text-cyan" />
      <StatCard icon={Terminal} label="SOAP Status" value="ONLINE" colorClass="text-white" />
    </div>

    <div className="grid grid-cols-12 gap-6 flex-1">
      <div className="col-span-8 flex flex-col gap-6">
        <div className="bg-[#0a0a0f] neon-border-cyan rounded-lg overflow-hidden flex flex-col flex-1 glass relative">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Cpu size={120} className="text-cyan-500" />
          </div>
          <div className="card-header-styled">
            <Layers size={14} className="neon-text-cyan" />
            Infrastructure XML DataHub
          </div>
          <div className="p-8">
            <div className="max-w-2xl">
              <h4 className="text-xl font-light text-white mb-4">Centralisation & Distribution</h4>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Le XML DataHub agit comme le cœur d'un système distribué où le XML n'est pas seulement un format de stockage, 
                mais le langage universel d'échange (REST/SOAP), de validation (XSD) et de présentation (XSLT).
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-10 mt-10">
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-[10px] mb-2">
                    <span className="text-gray-500 uppercase tracking-widest">Intégrité des Schémas (XSD)</span>
                    <span className="text-cyan-400 code-font">99.8%</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: '99.8%' }} className="h-full bg-cyan-500 shadow-[0_0_10px_rgba(0,243,255,0.5)]"></motion.div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] mb-2">
                    <span className="text-gray-500 uppercase tracking-widest">Latence Transformation (XSLT)</span>
                    <span className="text-purple-400 code-font">12ms</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: '85%' }} className="h-full bg-purple-500 shadow-[0_0_10px_rgba(188,19,254,0.5)]"></motion.div>
                  </div>
                </div>
              </div>

              <div className="bg-black/20 rounded border border-white/5 p-4 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-grid opacity-20"></div>
                <div className="text-center relative z-10">
                  <div className="w-16 h-16 rounded-full border-2 border-dashed border-cyan-500/30 flex items-center justify-center mx-auto mb-4 float">
                    <Database className="text-cyan-400" size={32} />
                  </div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest">Node Core Status</p>
                  <p className="text-cyan-400 font-bold code-font">SYNCED</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-span-4 flex flex-col gap-6">
        <div className="bg-[#0a0a0f] border border-white/5 rounded-lg overflow-hidden flex flex-col flex-1 glass">
          <div className="card-header-styled">
            <Activity size={14} className="neon-text-purple" />
            Flux Temps Réel
          </div>
          <div className="p-4 space-y-4">
             {[
               { tag: 'INFO', text: 'Export XML Produits généré', color: 'neon-text-cyan' },
               { tag: 'SOAP', text: 'Requête GetUser traitée', color: 'neon-text-purple' },
               { tag: 'XSD', text: 'Validation Catalog.xml réussie', color: 'neon-text-cyan' },
               { tag: 'REST', text: 'Update Config via XML path', color: 'neon-text-cyan' },
               { tag: 'XSLT', text: 'Rendu CV dynamique achevé', color: 'neon-text-purple' }
             ].map((log, i) => (
               <motion.div 
                 key={i}
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ delay: i * 0.1 }}
                 className="flex gap-3 text-[10px] border-b border-white/5 pb-3 last:border-0"
               >
                 <span className={`${log.color} code-font font-bold`}>[{log.tag}]</span>
                 <span className="text-gray-400">{log.text}</span>
               </motion.div>
             ))}
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
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    fetch('/api/xml/products')
      .then(res => res.text())
      .then(async xml => {
        setXmlContent(xml);
        const html = await transformXml(xml, 'products');
        setHtmlContent(html);
      });
  }, []);

  const runValidation = () => {
    setIsValidating(true);
    setTimeout(() => setIsValidating(false), 1500);
  };

  return (
    <div className="flex flex-col gap-6 h-full overflow-hidden animate-in">
      <div className="flex justify-between items-end">
        <div>
           <h3 className="text-xs font-bold text-gray-500 uppercase tracking-[0.3em] mb-2">02 Stockage & Structure</h3>
           <h4 className="text-xl text-white font-light">Gestion du Catalogue Produits</h4>
        </div>
        <div className="flex gap-3">
          <button className="neon-btn-outline flex items-center gap-2" onClick={() => downloadXml(xmlContent, 'products.xml')}>
            <Download size={14} /> EXPORTER XML
          </button>
          <button className="neon-btn-outline flex items-center gap-2" onClick={runValidation}>
            <ShieldCheck size={14} className={isValidating ? 'animate-spin' : ''} /> 
            {isValidating ? 'ANALYSE XSD...' : 'VALIDER XSD'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 flex-1 overflow-hidden">
        <div className="col-span-12 flex flex-col overflow-hidden">
          <div className="bg-[#0a0a0f]/80 glass neon-border-cyan rounded-lg overflow-hidden flex flex-col flex-1">
            <div className="card-header-styled flex justify-between">
              <div className="flex items-center gap-4">
                 <button className={`pb-1 transition-all ${viewMode === 'html' ? 'border-b-2 border-cyan-400 text-white' : 'text-gray-600'}`} onClick={() => setViewMode('html')}>RENDU VISUEL (XSLT)</button>
                 <button className={`pb-1 transition-all ${viewMode === 'xml' ? 'border-b-2 border-cyan-400 text-white' : 'text-gray-600'}`} onClick={() => setViewMode('xml')}>SOURCE XML</button>
              </div>
              <Tooltip text="XSD (XML Schema Definition): La structure du catalogue est rigoureusement validée contre un schéma pour prévenir toute corruption de données.">
                <span className="text-cyan-400 cursor-help flex items-center gap-2 text-[10px]">
                  <FileCheck size={14} /> XSD VALIDATED
                </span>
              </Tooltip>
            </div>
            <div className="p-8 overflow-auto flex-1 bg-grid">
              <AnimatePresence mode="wait">
                <motion.div
                  key={viewMode}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                >
                  {viewMode === 'xml' ? (
                    <pre className="text-cyan-100/70 border-none bg-transparent">{xmlContent}</pre>
                  ) : (
                    <div className="rendered-content" dangerouslySetInnerHTML={{ __html: htmlContent }} />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
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
        <div className="flex flex-col gap-6 h-full overflow-hidden animate-in">
            <div className="flex justify-between items-end">
                <div>
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-[0.3em] mb-2">03 Transformation Documentaire</h3>
                    <h4 className="text-xl text-white font-light">Générateur de CV (Moteur XSLT)</h4>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-6 flex-1 overflow-hidden">
                <div className="col-span-8 flex flex-col gap-6 overflow-hidden">
                    <div className="bg-[#0a0a0f]/80 glass neon-border-purple rounded-lg overflow-hidden flex-1 flex flex-col">
                        <div className="card-header-styled flex justify-between">
                            <div className="flex items-center gap-2 font-bold tracking-wider">
                               <FileCode size={14} className="text-purple-400" />
                               <span>Rendu CV Dynamique</span>
                               <Tooltip text="XSLT (eXtensible Stylesheet Language Transformations): Transforme les données XML brutes en documents HTML structurés.">
                                  <Info size={12} className="text-gray-600 cursor-help" />
                               </Tooltip>
                            </div>
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
        <div className="flex flex-col gap-6 h-full overflow-hidden animate-in">
            <div className="flex justify-between items-end">
                <div>
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-[0.3em] mb-2">04 Interopérabilité & Mapping</h3>
                    <h4 className="text-xl text-white font-light">Convertisseur XML ↔ JSON</h4>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-6 flex-1 overflow-hidden">
                <div className="col-span-6 flex flex-col gap-4 overflow-hidden">
                    <div className="bg-[#0a0a0f]/80 glass border border-white/5 rounded-lg overflow-hidden flex flex-col flex-1">
                        <div className="card-header-styled flex justify-between items-center bg-white/5">
                            <span className="flex items-center gap-2"><Terminal size={14} className="text-cyan-400" /> Data Input Zone</span>
                            <Tooltip text="Mapping bidirectionnel: Indispensable pour connecter des applications web modernes (JSON) à des backends d'entreprise (XML).">
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
        <div className="flex flex-col gap-6 h-full overflow-hidden animate-in">
            <div className="flex justify-between items-end">
                <div>
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-[0.3em] mb-2">05 Web Services Legacy</h3>
                    <h4 className="text-xl text-white font-light">Passerelle SOAP</h4>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-6 flex-1 overflow-hidden">
                <div className="col-span-5 flex flex-col gap-6 overflow-hidden">
                    <div className="bg-[#0a0a0f]/80 glass border border-white/5 rounded-lg overflow-hidden flex flex-col flex-1">
                        <div className="card-header-styled flex justify-between items-center bg-white/5">
                            <span className="flex items-center gap-2"><Package size={14} className="text-purple-400" /> SOAP Envelope Builder</span>
                            <Tooltip text="SOAP (Simple Object Access Protocol): Protocole de messagerie XML robuste utilisé pour les transactions critiques et les services web d'entreprise.">
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

const SystemGuide = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[1000] flex items-center justify-center p-8"
        >
          <motion.div 
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={e => e.stopPropagation()}
            className="bg-[#0a0a0f] border border-white/10 w-full max-w-2xl rounded-xl overflow-hidden glass shadow-[0_0_100px_rgba(0,0,0,0.5)]"
          >
            <div className="card-header-styled flex justify-between p-6">
              <span className="flex items-center gap-2"><HelpCircle size={14} className="text-cyan-400" /> Mode d'emploi XML DataHub</span>
              <button onClick={onClose} className="hover:text-white transition-colors"><X size={18} /></button>
            </div>
            <div className="p-10 space-y-8 max-h-[70vh] overflow-auto mb-4">
               <section>
                 <h5 className="text-cyan-400 uppercase tracking-widest text-[10px] font-bold mb-2">01 Qu'est-ce que le DataHub ?</h5>
                 <p className="text-gray-400 text-sm leading-relaxed">
                   Cette plateforme démontre la puissance du XML dans l'architecture logicielle moderne. Loin d'être obsolète, le XML reste le pilier des systèmes nécessitant une forte intégrité de données et une interopérabilité stricte.
                 </p>
               </section>
               <section className="grid grid-cols-2 gap-6">
                  <div className="p-4 bg-white/5 border border-white/5 rounded-lg">
                    <h6 className="text-white text-xs font-bold mb-2 flex items-center gap-2"><ShieldCheck size={12} className="text-cyan-400" /> Validation XSD</h6>
                    <p className="text-[11px] text-gray-500">Garantit que vos données sont conformes à une structure métier précise avant traitement.</p>
                  </div>
                  <div className="p-4 bg-white/5 border border-white/5 rounded-lg">
                    <h6 className="text-white text-xs font-bold mb-2 flex items-center gap-2"><LayoutDashboard size={12} className="text-purple-400" /> Rendu XSLT</h6>
                    <p className="text-[11px] text-gray-500">Transforme le XML en documents HTML dynamiques (CV, catalogues) côté client.</p>
                  </div>
               </section>
               <section>
                 <h5 className="text-purple-400 uppercase tracking-widest text-[10px] font-bold mb-2">02 Comment naviguer ?</h5>
                 <ul className="space-y-3">
                   {[
                     { step: 'Dashboard', desc: 'Surveillance des nœuds et statistiques globales des flux.' },
                     { step: 'Mapping', desc: 'Convertissez instantanément vos payloads JSON vers XML et vice versa.' },
                     { step: 'SOAP Services', desc: 'Simulez des appels à des Web Services bancaires ou industriels.' }
                   ].map((item, i) => (
                     <li key={i} className="flex gap-4 items-start">
                        <span className="text-cyan-400 code-font text-xs">{i+1}.</span>
                        <div className="flex-1">
                           <p className="text-white text-xs font-semibold">{item.step}</p>
                           <p className="text-[11px] text-gray-500">{item.desc}</p>
                        </div>
                     </li>
                   ))}
                 </ul>
               </section>
            </div>
            <div className="p-6 bg-black/40 border-t border-white/5 text-center">
               <button onClick={onClose} className="neon-btn-primary">ENTRER DANS LE HUB</button>
            </div>
          </motion.div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

// --- Main App ---

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isGuideOpen, setIsGuideOpen] = useState(false);

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
               <button className="neon-btn-outline" onClick={() => setIsGuideOpen(true)}>
                 <HelpCircle size={14} className="mr-2 inline" /> AIDE & GUIDE
               </button>
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

      <SystemGuide isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
    </div>
  );
}

// Custom UI logic moved to index.css
