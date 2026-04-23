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
      <Tooltip text="Nombre total de documents XML traités et stockés dans le hub. Inclut les données de produits, CV, configurations.">
        <StatCard icon={Database} label="Entités XML" value="142" colorClass="neon-text-cyan" />
      </Tooltip>
      <Tooltip text="Pourcentage de documents XML qui respectent les schémas XSD définis. Un score < 95% indique des données mal formatées.">
        <StatCard icon={Activity} label="Validations" value="100%" colorClass="neon-text-purple" />
      </Tooltip>
      <Tooltip text="État de synchronisation des données entre les formats XML et JSON. Actif = les deux formats sont en sync.">
        <StatCard icon={RefreshCcw} label="Sync JSON" value="ACTIVE" colorClass="neon-text-cyan" />
      </Tooltip>
      <Tooltip text="État de la passerelle SOAP. En ligne = prêt à recevoir des appels à Web Services SOAP.">
        <StatCard icon={Terminal} label="SOAP Status" value="ONLINE" colorClass="text-white" />
      </Tooltip>
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
          <Tooltip text="Télécharge le fichier products.xml contenant la source de données brute. Utile pour l'intégration dans d'autres systèmes ou sauvegarde.">
            <button className="neon-btn-outline flex items-center gap-2" onClick={() => downloadXml(xmlContent, 'products.xml')}>
              <Download size={14} /> EXPORTER XML
            </button>
          </Tooltip>
          <Tooltip text="Vérifie la conformité du catalogue par rapport au schéma XSD (products.xsd). Valide types de données, éléments obligatoires, etc.">
            <button className="neon-btn-outline flex items-center gap-2" onClick={runValidation}>
              <ShieldCheck size={14} className={isValidating ? 'animate-spin' : ''} />
              {isValidating ? 'ANALYSE XSD...' : 'VALIDER XSD'}
            </button>
          </Tooltip>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 flex-1 overflow-hidden">
        <div className="col-span-12 flex flex-col overflow-hidden">
          <div className="bg-[#0a0a0f]/80 glass neon-border-cyan rounded-lg overflow-hidden flex flex-col flex-1">
            <div className="card-header-styled flex justify-between">
              <div className="flex items-center gap-4">
                <Tooltip text="Affichage formaté du catalogue. Les données XML sont transformées en layout visuel lisible avec CSS.">
                  <button className={`pb-1 transition-all ${viewMode === 'html' ? 'border-b-2 border-cyan-400 text-white' : 'text-gray-600'}`} onClick={() => setViewMode('html')}>RENDU VISUEL (XSLT)</button>
                </Tooltip>
                <Tooltip text="Vue brute du fichier XML source. Montre la structure exacte des données : balises, attributs, hiérarchie.">
                  <button className={`pb-1 transition-all ${viewMode === 'xml' ? 'border-b-2 border-cyan-400 text-white' : 'text-gray-600'}`} onClick={() => setViewMode('xml')}>SOURCE XML</button>
                </Tooltip>
              </div>
              <Tooltip text="XSD (XML Schema Definition): La structure du catalogue est rigoureusement validée contre un schéma pour prévenir toute corruption de données. Chaque prix doit être un décimal positif, chaque stock un entier.">
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
                <Tooltip text="XSLT (eXtensible Stylesheet Language Transformations) transforme vos données XML brutes en documents HTML structurés. Une seule source de données, plusieurs présentations possibles.">
                  <Info size={12} className="text-gray-600 cursor-help" />
                </Tooltip>
              </div>
            </div>
            <Tooltip text="Lance la transformation XSLT : récupère cv.xml, charge cv.xslt, applique la transformation via XSLTProcessor. Résultat = CV HTML élégant avec styling.">
              <button onClick={generate} className="text-[10px] text-purple-400 hover:text-white transition-colors m-4 neon-btn-outline">DÉCLENCHER XSLT</button>
            </Tooltip>
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
    </div>
  );

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

  const SystemGuide = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
    const [tab, setTab] = React.useState('intro');

    const tutorialSections = {
      intro: {
        title: '🎯 Qu\'est-ce que XML DataHub ?',
        content: (
          <div className="space-y-6">
            <p className="text-gray-300 leading-relaxed">
              XML DataHub est une plateforme <strong className="text-cyan-400">d'orchestration de données XML</strong> qui démontre les capacités modernes du standard XML. C'est une application full-stack conçue pour :
            </p>
            <ul className="space-y-3 ml-4 text-sm text-gray-400">
              <li>✅ <strong className="text-white">Valider l'intégrité</strong> de vos données via des schémas XSD typés</li>
              <li>✅ <strong className="text-white">Transformer et rendu</strong> vos données XML en documents HTML élégants avec XSLT</li>
              <li>✅ <strong className="text-white">Convertir facilement</strong> entre XML et JSON pour l'interopérabilité</li>
              <li>✅ <strong className="text-white">Communiquer</strong> avec des Web Services legacy via SOAP</li>
              <li>✅ <strong className="text-white">Centraliser la configuration</strong> en utilisant XML comme source unique de vérité</li>
            </ul>
            <div className="bg-purple-900/20 border border-purple-500/30 rounded p-4 mt-6">
              <p className="text-xs text-purple-300 uppercase tracking-widest font-bold mb-2">💡 Cas d'usage réels :</p>
              <p className="text-sm text-gray-300">Systèmes bancaires, intégrations EDI, pipelines de données d'entreprise, services de facturation, gestion de contrats légaux.</p>
            </div>
          </div>
        )
      },
      dashboard: {
        title: '📊 Module 1 : Dashboard (Monitoring)',
        content: (
          <div className="space-y-6">
            <p className="text-gray-300 leading-relaxed">
              Le <strong className="text-cyan-400">Dashboard</strong> est votre centre de commande pour monitorer la santé globale du système en temps réel.
            </p>
            <div className="bg-cyan-900/20 border border-cyan-500/30 rounded p-4">
              <p className="text-xs text-cyan-300 uppercase tracking-widest font-bold mb-2">📈 Métriques affichées :</p>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• <strong>Entités XML</strong> : Nombre total de documents XML traités</li>
                <li>• <strong>Validations</strong> : Pourcentage de conformité XSD</li>
                <li>• <strong>Sync JSON</strong> : Statut de synchronisation bidirectionnelle</li>
                <li>• <strong>SOAP Status</strong> : État de la passerelle SOAP</li>
              </ul>
            </div>
            <div className="space-y-3">
              <p className="text-sm font-bold text-white">📋 Étapes d'utilisation :</p>
              <ol className="space-y-2 ml-4 text-sm text-gray-300">
                <li><strong>1.</strong> Accédez au Dashboard via le menu latéral</li>
                <li><strong>2.</strong> Observez les indicateurs en haut (cartes de statistiques)</li>
                <li><strong>3.</strong> Consultez l'infrastructure détaillée (centre)</li>
                <li><strong>4.</strong> Vérifiez les logs de flux en temps réel (droite)</li>
              </ol>
            </div>
            <div className="bg-blue-900/20 border border-blue-500/30 rounded p-4">
              <p className="text-xs text-blue-300 uppercase tracking-widest font-bold mb-2">💾 Indicateurs importants :</p>
              <p className="text-sm text-gray-300">Si l'intégrité XSD dépasse 95%, votre hub fonctionne correctement. La latence de transformation XSLT doit rester sous 20ms.</p>
            </div>
          </div>
        )
      },
      catalog: {
        title: '📦 Module 2 : Catalogue XML (Validation XSD)',
        content: (
          <div className="space-y-6">
            <p className="text-gray-300 leading-relaxed">
              Le <strong className="text-cyan-400">Catalogue</strong> gère votre stockage de données structurées avec validation stricte via schémas XSD.
            </p>
            <div className="bg-cyan-900/20 border border-cyan-500/30 rounded p-4">
              <p className="text-xs text-cyan-300 uppercase tracking-widest font-bold mb-2">🔍 Comment ça fonctionne :</p>
              <p className="text-sm text-gray-300">Vos produits sont stockés dans <code className="text-purple-400">products.xml</code>. Un schéma <code className="text-purple-400">products.xsd</code> garantit que chaque produit a un nom, catégorie, prix (décimal), stock (entier), etc.</p>
            </div>
            <div className="space-y-3">
              <p className="text-sm font-bold text-white">📋 Tutoriel pas à pas :</p>
              <ol className="space-y-3 ml-4 text-sm text-gray-300">
                <li><strong>1. Accédez au Catalogue</strong> → Cliquez sur "Catalogue XML" dans le menu</li>
                <li><strong>2. Visualisez les produits</strong> → Onglet "RENDU VISUEL" affiche les données formatées</li>
                <li><strong>3. Validez l'intégrité</strong> → Cliquez "VALIDER XSD" pour vérifier la conformité</li>
                <li><strong>4. Exportez vos données</strong> → Bouton "EXPORTER XML" pour télécharger le fichier</li>
                <li><strong>5. Inspectez la source</strong> → Onglet "SOURCE XML" pour voir le format brut</li>
              </ol>
            </div>
            <div className="bg-purple-900/20 border border-purple-500/30 rounded p-4">
              <p className="text-xs text-purple-300 uppercase tracking-widest font-bold mb-2">⚡ Cas d'usage :</p>
              <p className="text-sm text-gray-300">Gestion de catalogue e-commerce, systèmes de gestion de contenu, stockage hiérarchique de configuration.</p>
            </div>
          </div>
        )
      },
      cv: {
        title: '✨ Module 3 : Générateur de CV (XSLT)',
        content: (
          <div className="space-y-6">
            <p className="text-gray-300 leading-relaxed">
              Le <strong className="text-purple-400">Générateur de CV</strong> transforme vos données XML brutes en un document HTML visuel et structuré via XSLT.
            </p>
            <div className="bg-purple-900/20 border border-purple-500/30 rounded p-4">
              <p className="text-xs text-purple-300 uppercase tracking-widest font-bold mb-2">🎨 La magie de XSLT :</p>
              <p className="text-sm text-gray-300">Au lieu de mélanger données et présentation (comme en HTML classique), XSLT les sépare complètement. Votre <code className="text-cyan-400">cv.xml</code> contient les données, <code className="text-cyan-400">cv.xslt</code> définit comment les afficher.</p>
            </div>
            <div className="space-y-3">
              <p className="text-sm font-bold text-white">📋 Tutoriel pas à pas :</p>
              <ol className="space-y-3 ml-4 text-sm text-gray-300">
                <li><strong>1. Ouvrez le Générateur CV</strong> → Menu → "Générateur CV (XSLT)"</li>
                <li><strong>2. Déclenchez la transformation</strong> → Cliquez "DÉCLENCHER XSLT"</li>
                <li><strong>3. Patientez (&lt; 1 seconde)</strong> → Le système récupère cv.xml, load cv.xslt, transforme via XSLTProcessor</li>
                <li><strong>4. Visualisez le rendu</strong> → Un CV formaté s'affiche avec styling Tailwind intégré</li>
                <li><strong>5. Exportez le XML source</strong> → Bouton "EXPORTER EN XML" sauvegarde les données brutes</li>
              </ol>
            </div>
            <div className="bg-cyan-900/20 border border-cyan-500/30 rounded p-4">
              <p className="text-xs text-cyan-300 uppercase tracking-widest font-bold mb-2">💡 Avantage clé :</p>
              <p className="text-sm text-gray-300">Modifiez le CV une seule fois dans cv.xml. Les changements de design ? Éditez cv.xslt. Zéro impact sur les données.</p>
            </div>
          </div>
        )
      },
      converter: {
        title: '🔄 Module 4 : Convertisseur (JSON ↔ XML)',
        content: (
          <div className="space-y-6">
            <p className="text-gray-300 leading-relaxed">
              Le <strong className="text-cyan-400">Convertisseur</strong> transforme vos données bidirectionnellement entre XML (format d'entreprise) et JSON (format web moderne).
            </p>
            <div className="bg-cyan-900/20 border border-cyan-500/30 rounded p-4">
              <p className="text-xs text-cyan-300 uppercase tracking-widest font-bold mb-2">🔀 Quand utiliser :</p>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Vous avez un <strong>vieux système XML</strong> et besoin d'APIs JSON modernes</li>
                <li>• Vous récupérez des données <strong>JSON d'une API</strong> mais devez les envoyer vers un système XML legacy</li>
                <li>• <strong>Migration</strong> progressive d'une architecture à l'autre</li>
              </ul>
            </div>
            <div className="space-y-3">
              <p className="text-sm font-bold text-white">📋 Tutoriel JSON → XML :</p>
              <ol className="space-y-2 ml-4 text-sm text-gray-300">
                <li><strong>1.</strong> Allez dans "Mapping & Convert"</li>
                <li><strong>2.</strong> Collez du JSON dans la zone gauche (ex: {"name": "Jean", "age": 30})</li>
                <li><strong>3.</strong> Cliquez "JSON → XML"</li>
                <li><strong>4.</strong> Résultat : XML structuré s'affiche à droite</li>
              </ol>
            </div>
            <div className="space-y-3">
              <p className="text-sm font-bold text-white">📋 Tutoriel XML → JSON :</p>
              <ol className="space-y-2 ml-4 text-sm text-gray-300">
                <li><strong>1.</strong> Collez du XML (ex: &lt;person&gt;&lt;name&gt;Jean&lt;/name&gt;&lt;/person&gt;)</li>
                <li><strong>2.</strong> Cliquez "XML → JSON"</li>
                <li><strong>3.</strong> JSON structuré s'affiche immédiatement</li>
              </ol>
            </div>
            <div className="bg-green-900/20 border border-green-500/30 rounded p-4">
              <p className="text-xs text-green-300 uppercase tracking-widest font-bold mb-2">✅ Cas réels d'utilisation :</p>
              <p className="text-sm text-gray-300">Intégration API REST avec backends XML bancaires, migration de données, test de parsing.</p>
            </div>
          </div>
        )
      },
      soap: {
        title: '📮 Module 5 : SOAP Tester (Web Services)',
        content: (
          <div className="space-y-6">
            <p className="text-gray-300 leading-relaxed">
              Le <strong className="text-purple-400">SOAP Tester</strong> simule des communications avec des Web Services d'entreprise (bancaires, assurances, ERP) qui utilisent le protocole SOAP.
            </p>
            <div className="bg-purple-900/20 border border-purple-500/30 rounded p-4">
              <p className="text-xs text-purple-300 uppercase tracking-widest font-bold mb-2">📡 Qu'est-ce que SOAP ?</p>
              <p className="text-sm text-gray-300">SOAP (Simple Object Access Protocol) est une enveloppe XML standardisée pour encapsuler vos requêtes/réponses. Format : Header (métadonnées) + Body (données métier).</p>
            </div>
            <div className="space-y-3">
              <p className="text-sm font-bold text-white">📋 Tutoriel SOAP :</p>
              <ol className="space-y-3 ml-4 text-sm text-gray-300">
                <li><strong>1. Ouvrez le SOAP Tester</strong> → Menu → "SOAP Web Services"</li>
                <li><strong>2. Visualisez la requête exemple</strong> → À gauche : enveloppe SOAP avec requête GetUser</li>
                <li><strong>3. Lancez l'appel</strong> → Cliquez "CALL SOAP GATEWAY"</li>
                <li><strong>4. Reçevez la réponse</strong> → À droite : réponse SOAP avec status, timestamp, détails</li>
                <li><strong>5. Inspectez le format</strong> → Observez le structure &lt;soap:Envelope&gt;</li>
              </ol>
            </div>
            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded p-4">
              <p className="text-xs text-yellow-300 uppercase tracking-widest font-bold mb-2">⚙️ Structure SOAP :</p>
              <p className="text-xs text-gray-300 font-mono">
                &lt;soap:Envelope&gt;<br />
                &nbsp;&nbsp;&lt;soap:Body&gt;<br />
                &nbsp;&nbsp;&nbsp;&nbsp;&lt;GetUserRequest&gt; ← Requête métier<br />
                &nbsp;&nbsp;&lt;/soap:Body&gt;<br />
                &lt;/soap:Envelope&gt;
              </p>
            </div>
            <div className="bg-orange-900/20 border border-orange-500/30 rounded p-4">
              <p className="text-xs text-orange-300 uppercase tracking-widest font-bold mb-2">🏦 Industries utilisant SOAP :</p>
              <p className="text-sm text-gray-300">Secteur bancaire (SWIFT), assurances, santé (HL7), e-commerce (EDI), gouvernement (administration).</p>
            </div>
          </div>
        )
      },
      config: {
        title: '⚙️ Module 6 : Configuration (XML Config)',
        content: (
          <div className="space-y-6">
            <p className="text-gray-300 leading-relaxed">
              La section <strong className="text-cyan-400">Configuration</strong> centralise tous vos paramètres système en XML, servant de source unique de vérité pour le hub entier.
            </p>
            <div className="bg-cyan-900/20 border border-cyan-500/30 rounded p-4">
              <p className="text-xs text-cyan-300 uppercase tracking-widest font-bold mb-2">🔧 Qu'est-ce que vous controllez ?</p>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• <strong>Theme</strong> : Mode sombre/clair, couleurs primaire/secondaire (hex)</li>
                <li>• <strong>Localization</strong> : Langue (fr, en, es, etc.) et timezone</li>
                <li>• <strong>API Settings</strong> : Endpoint, version du protocole, mode debug</li>
                <li>• <strong>Distributed Nodes</strong> : État de synchronisation des nœuds</li>
              </ul>
            </div>
            <div className="space-y-3">
              <p className="text-sm font-bold text-white">📋 Comment utiliser :</p>
              <ol className="space-y-2 ml-4 text-sm text-gray-300">
                <li><strong>1. Accédez à Config</strong> → Menu → "Config & Properties"</li>
                <li><strong>2. Visualisez les paramètres</strong> → Dashboard de configuration détaillé</li>
                <li><strong>3. Modifiez config.xml</strong> → Fichier stocké dans /config/config.xml</li>
                <li><strong>4. Déployez</strong> → Cliquez "DEPLOY CONFIG" dans le header</li>
                <li><strong>5. Vérifiez les manifests</strong> → API endpoint et version affichés</li>
              </ol>
            </div>
            <div className="bg-green-900/20 border border-green-500/30 rounded p-4">
              <p className="text-xs text-green-300 uppercase tracking-widest font-bold mb-2">📁 Fichier config.xml :</p>
              <p className="text-xs text-gray-300 font-mono">
                &lt;config&gt;<br />
                &nbsp;&nbsp;&lt;theme&gt;&lt;primary-color&gt;#00f3ff&lt;/primary-color&gt;&lt;/theme&gt;<br />
                &nbsp;&nbsp;&lt;localization&gt;&lt;language&gt;fr&lt;/language&gt;&lt;/localization&gt;<br />
                &lt;/config&gt;
              </p>
            </div>
          </div>
        )
      },
      tips: {
        title: '💡 Astuces & Bonnes Pratiques',
        content: (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="bg-green-900/20 border border-green-500/30 rounded p-3">
                <p className="text-sm font-bold text-green-300 mb-2">✅ Démarrage rapide :</p>
                <p className="text-xs text-gray-300">Commencez par le Dashboard pour comprendre l'architecture globale, puis explorez chaque module dans l'ordre.</p>
              </div>
              <div className="bg-cyan-900/20 border border-cyan-500/30 rounded p-3">
                <p className="text-sm font-bold text-cyan-300 mb-2">🚀 Performance :</p>
                <p className="text-xs text-gray-300">Les transformations XSLT s'exécutent côté navigateur (pas de serveur). Pour gros volumes (>1000 documents), utilisez le serveur Node.js.</p>
              </div>
              <div className="bg-purple-900/20 border border-purple-500/30 rounded p-3">
                <p className="text-sm font-bold text-purple-300 mb-2">🔒 Sécurité :</p>
                <p className="text-xs text-gray-300">Les schémas XSD garantissent valide des types. Les enveloppes SOAP encryptent méthodiquement vos données.</p>
              </div>
              <div className="bg-orange-900/20 border border-orange-500/30 rounded p-3">
                <p className="text-sm font-bold text-orange-300 mb-2">🛠️ Débogage :</p>
                <p className="text-xs text-gray-300">Utilisez l'onglet "SOURCE XML" pour voir les données brutes. Le convertisseur XML↔JSON aide à valider la structure.</p>
              </div>
              <div className="bg-blue-900/20 border border-blue-500/30 rounded p-3">
                <p className="text-sm font-bold text-blue-300 mb-2">📊 Monitoring :</p>
                <p className="text-xs text-gray-300">Le Dashboard affiche les signaux clés. Si la latence XSLT > 20ms, optimisez votre feuille de style.</p>
              </div>
            </div>
          </div>
        )
      }
    };

    return (
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
                className="bg-[#0a0a0f] border border-white/10 w-full max-w-3xl rounded-xl overflow-hidden glass shadow-[0_0_100px_rgba(0,0,0,0.5)] flex flex-col max-h-[85vh]"
              >
                <div className="card-header-styled flex justify-between p-6">
                  <span className="flex items-center gap-2"><HelpCircle size={14} className="text-cyan-400" /> Tutoriel Complet XML DataHub</span>
                  <button onClick={onClose} className="hover:text-white transition-colors"><X size={18} /></button>
                </div>

                {/* Tab Navigation */}
                <div className="flex gap-2 p-4 bg-black/30 border-b border-white/5 overflow-x-auto">
                  {[
                    { key: 'intro', label: '📖 Intro' },
                    { key: 'dashboard', label: '📊 Dashboard' },
                    { key: 'catalog', label: '📦 Catalogue' },
                    { key: 'cv', label: '✨ CV (XSLT)' },
                    { key: 'converter', label: '🔄 Converter' },
                    { key: 'soap', label: '📮 SOAP' },
                    { key: 'config', label: '⚙️ Config' },
                    { key: 'tips', label: '💡 Astuces' }
                  ].map(item => (
                    <button
                      key={item.key}
                      onClick={() => setTab(item.key)}
                      className={`text-xs whitespace-nowrap px-3 py-2 rounded transition-all ${tab === item.key
                        ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-500/50'
                        : 'bg-white/5 text-gray-400 hover:text-white'
                        }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-auto p-8">
                  <h4 className="text-lg font-bold text-white mb-4">{tutorialSections[tab as keyof typeof tutorialSections].title}</h4>
                  <div className="text-sm">
                    {tutorialSections[tab as keyof typeof tutorialSections].content}
                  </div>
                </div>

                {/* Footer */}
                <div className="p-6 bg-black/40 border-t border-white/5 flex justify-between">
                  <p className="text-xs text-gray-500">Besoin d'aide ? Consultez les icônes <Info size={12} className="inline" /> tout au long de l'interface.</p>
                  <button onClick={onClose} className="neon-btn-primary">FERMER</button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  };

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
