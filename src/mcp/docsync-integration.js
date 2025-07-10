/**
 * DocSync Integration System
 *
 * Sistema de sincronização e organização de documentação
 * Integrado com MCP, GIDEN e NEXUS para o projeto GITHUB_MASTERY
 */

import { EventEmitter } from 'events';
import path from 'path';
import fs from 'fs/promises';
import { createGIDENIntegration } from './giden-integration.js';

class DocSyncIntegration extends EventEmitter {
  constructor(config = {}) {
    super();

    this.config = {
      rootPath: config.rootPath || process.cwd(),
      syncInterval: config.syncInterval || 5 * 60 * 1000, // 5 minutos
      organizationPatterns: config.organizationPatterns || this.getDefaultPatterns(),
      ...config,
    };

    // Componentes integrados
    this.giden = null;
    this.nexus = null;
    this.mcp = null;

    // Estado da sincronização
    this.syncState = {
      lastSync: null,
      fileTree: new Map(),
      documentIndex: new Map(),
      categories: new Map(),
    };
  }

  /**
   * Padrões de organização padrão
   */
  getDefaultPatterns() {
    return {
      documentation: {
        pattern: /\.(md|markdown|txt|doc|docx)$/i,
        subCategories: {
          setup: /setup|install|config/i,
          api: /api|endpoint|reference/i,
          guides: /guide|tutorial|howto/i,
          planning: /plan|strategy|roadmap/i,
          sessions: /session|meeting|notes/i,
        },
      },
      code: {
        pattern: /\.(js|ts|jsx|tsx|py|rs)$/i,
        subCategories: {
          agents: /agent|bot|ai/i,
          api: /api|client|adapter/i,
          mcp: /mcp|server|integration/i,
          utils: /util|helper|tool/i,
          tests: /test|spec|\.test\.|\.spec\./i,
        },
      },
      configuration: {
        pattern: /\.(json|yml|yaml|env|config)$/i,
        subCategories: {
          environment: /\.env|environment/i,
          packages: /package\.json|requirements/i,
          ci_cd: /workflow|ci|cd|github/i,
          app_config: /config|settings/i,
        },
      },
    };
  }

  /**
   * Inicializar sistema integrado
   */
  async initialize() {
    try {
      console.log('🚀 Inicializando DocSync Integration System...');

      // Inicializar GIDEN
      await this.initializeGIDEN();

      // Inicializar estrutura de organização
      await this.initializeOrganization();

      // Iniciar sincronização
      this.startSync();

      console.log('✅ DocSync Integration System inicializado com sucesso');
      this.emit('initialized');

      return true;
    } catch (error) {
      console.error('❌ Erro ao inicializar DocSync:', error);
      this.emit('error', error);
      return false;
    }
  }

  /**
   * Inicializar integração com GIDEN
   */
  async initializeGIDEN() {
    this.giden = createGIDENIntegration({
      learningDataPath: path.join(this.config.rootPath, '.giden-docsync'),
    });

    await this.giden.initialize();

    // Conectar eventos do GIDEN
    this.giden.on('learning_cycle_complete', metrics => {
      this.handleGIDENLearning(metrics);
    });
  }

  /**
   * Inicializar estrutura de organização
   */
  async initializeOrganization() {
    const organizationStructure = {
      docs: {
        architecture: [],
        api: [],
        guides: [],
        planning: [],
        sessions: [],
      },
      src: {
        agents: [],
        api: [],
        mcp: [],
        utils: [],
        integrations: [],
      },
      config: {
        environment: [],
        'ci-cd': [],
        app: [],
      },
      tests: {
        unit: [],
        integration: [],
        e2e: [],
      },
    };

    // Criar estrutura de diretórios se não existir
    for (const [dir, subdirs] of Object.entries(organizationStructure)) {
      const dirPath = path.join(this.config.rootPath, dir);
      await this.ensureDirectory(dirPath);

      for (const subdir of Object.keys(subdirs)) {
        const subdirPath = path.join(dirPath, subdir);
        await this.ensureDirectory(subdirPath);
      }
    }
  }

  /**
   * Garantir que diretório existe
   */
  async ensureDirectory(dirPath) {
    try {
      await fs.mkdir(dirPath, { recursive: true });
    } catch (error) {
      if (error.code !== 'EEXIST') {
        throw error;
      }
    }
  }

  /**
   * Iniciar sincronização automática
   */
  startSync() {
    // Sincronização inicial
    this.performSync();

    // Sincronização periódica
    this.syncInterval = setInterval(() => {
      this.performSync();
    }, this.config.syncInterval);
  }

  /**
   * Executar sincronização
   */
  async performSync() {
    console.log('🔄 Executando sincronização...');

    try {
      // Escanear arquivos
      await this.scanFiles();

      // Organizar arquivos
      await this.organizeFiles();

      // Gerar índice de documentação
      await this.generateDocumentationIndex();

      // Sincronizar com GIDEN
      await this.syncWithGIDEN();

      this.syncState.lastSync = new Date();
      console.log('✅ Sincronização concluída');

      this.emit('sync_complete', {
        timestamp: this.syncState.lastSync,
        filesProcessed: this.syncState.fileTree.size,
        documentsIndexed: this.syncState.documentIndex.size,
      });
    } catch (error) {
      console.error('❌ Erro durante sincronização:', error);
      this.emit('sync_error', error);
    }
  }

  /**
   * Escanear arquivos do projeto
   */
  async scanFiles() {
    this.syncState.fileTree.clear();
    await this.scanDirectory(this.config.rootPath);
  }

  /**
   * Escanear diretório recursivamente
   */
  async scanDirectory(dirPath, relativePath = '') {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      const relPath = path.join(relativePath, entry.name);

      // Ignorar diretórios especiais
      if (this.shouldIgnore(entry.name)) {
        continue;
      }

      if (entry.isDirectory()) {
        await this.scanDirectory(fullPath, relPath);
      } else if (entry.isFile()) {
        const fileInfo = await this.getFileInfo(fullPath);
        this.syncState.fileTree.set(relPath, fileInfo);
      }
    }
  }

  /**
   * Verificar se deve ignorar arquivo/diretório
   */
  shouldIgnore(name) {
    const ignorePatterns = [
      'node_modules',
      '.git',
      '.vscode',
      'coverage',
      'dist',
      'build',
      '.DS_Store',
      'Thumbs.db',
    ];

    return ignorePatterns.includes(name) || name.startsWith('.');
  }

  /**
   * Obter informações do arquivo
   */
  async getFileInfo(filePath) {
    const stats = await fs.stat(filePath);
    const content = await fs.readFile(filePath, 'utf-8').catch(() => null);

    return {
      path: filePath,
      size: stats.size,
      modified: stats.mtime,
      category: this.categorizeFile(filePath),
      content: content,
    };
  }

  /**
   * Categorizar arquivo
   */
  categorizeFile(filePath) {
    const fileName = path.basename(filePath);

    for (const [category, config] of Object.entries(this.config.organizationPatterns)) {
      if (config.pattern.test(fileName)) {
        // Verificar subcategorias
        for (const [subCategory, pattern] of Object.entries(config.subCategories)) {
          if (pattern.test(filePath)) {
            return { main: category, sub: subCategory };
          }
        }
        return { main: category, sub: 'general' };
      }
    }

    return { main: 'other', sub: 'general' };
  }

  /**
   * Organizar arquivos nas categorias apropriadas
   */
  async organizeFiles() {
    const moveOperations = [];

    for (const [relPath, fileInfo] of this.syncState.fileTree) {
      const { main, sub } = fileInfo.category;

      // Determinar novo caminho baseado na categoria
      const newPath = this.getOrganizedPath(relPath, main, sub);

      if (newPath !== relPath) {
        moveOperations.push({
          from: path.join(this.config.rootPath, relPath),
          to: path.join(this.config.rootPath, newPath),
        });
      }
    }

    // Executar movimentações
    for (const op of moveOperations) {
      await this.moveFile(op.from, op.to);
    }
  }

  /**
   * Obter caminho organizado para arquivo
   */
  getOrganizedPath(currentPath, mainCategory, subCategory) {
    const fileName = path.basename(currentPath);

    const categoryMap = {
      documentation: 'docs',
      code: 'src',
      configuration: 'config',
    };

    const mainDir = categoryMap[mainCategory] || 'misc';

    // Casos especiais
    if (fileName.includes('.test.') || fileName.includes('.spec.')) {
      return path.join('tests', 'unit', fileName);
    }

    if (subCategory !== 'general') {
      return path.join(mainDir, subCategory, fileName);
    }

    return path.join(mainDir, fileName);
  }

  /**
   * Mover arquivo com segurança
   */
  async moveFile(from, to) {
    try {
      // Criar diretório de destino se não existir
      await this.ensureDirectory(path.dirname(to));

      // Verificar se arquivo de destino já existe
      try {
        await fs.access(to);
        console.log(`⚠️ Arquivo já existe: ${to}`);
        return;
      } catch (error) {
        // Arquivo não existe, podemos mover
      }

      // Mover arquivo
      await fs.rename(from, to);
      console.log(`📁 Movido: ${from} → ${to}`);
    } catch (error) {
      console.error(`❌ Erro ao mover arquivo: ${from}`, error);
    }
  }

  /**
   * Gerar índice de documentação
   */
  async generateDocumentationIndex() {
    this.syncState.documentIndex.clear();

    const indexContent = {
      generated: new Date().toISOString(),
      totalFiles: this.syncState.fileTree.size,
      categories: {},
      documents: [],
    };

    // Agrupar por categoria
    for (const [relPath, fileInfo] of this.syncState.fileTree) {
      const { main, sub } = fileInfo.category;

      if (!indexContent.categories[main]) {
        indexContent.categories[main] = {};
      }
      if (!indexContent.categories[main][sub]) {
        indexContent.categories[main][sub] = [];
      }

      indexContent.categories[main][sub].push(relPath);

      // Adicionar documentos markdown ao índice
      if (main === 'documentation' && fileInfo.content) {
        const docInfo = this.parseDocument(relPath, fileInfo.content);
        if (docInfo) {
          indexContent.documents.push(docInfo);
          this.syncState.documentIndex.set(relPath, docInfo);
        }
      }
    }

    // Salvar índice
    const indexPath = path.join(this.config.rootPath, 'DOCUMENTATION_INDEX.json');
    await fs.writeFile(indexPath, JSON.stringify(indexContent, null, 2));

    // Gerar README atualizado
    await this.generateREADME(indexContent);
  }

  /**
   * Analisar documento
   */
  parseDocument(filePath, content) {
    const lines = content.split('\n');
    const title = lines
      .find(line => line.startsWith('# '))
      ?.replace('# ', '')
      .trim();
    const description = lines
      .find(line => line.trim() && !line.startsWith('#'))
      ?.trim();

    if (!title) return null;

    return {
      path: filePath,
      title,
      description,
      sections: this.extractSections(content),
      lastModified: this.syncState.fileTree.get(filePath)?.modified,
    };
  }

  /**
   * Extrair seções do documento
   */
  extractSections(content) {
    const sections = [];
    const lines = content.split('\n');

    let currentSection = null;

    for (const line of lines) {
      if (line.startsWith('## ')) {
        if (currentSection) {
          sections.push(currentSection);
        }
        currentSection = {
          title: line.replace('## ', '').trim(),
          content: [],
        };
      } else if (currentSection && line.trim()) {
        currentSection.content.push(line);
      }
    }

    if (currentSection) {
      sections.push(currentSection);
    }

    return sections;
  }

  /**
   * Gerar README atualizado
   */
  async generateREADME(indexContent) {
    const readmeContent = `# GitHub Mastery Project

> Sistema integrado de automação e inteligência para GitHub

## 📋 Índice de Documentação

### Estatísticas
- **Total de arquivos**: ${indexContent.totalFiles}
- **Última atualização**: ${new Date(indexContent.generated).toLocaleString('pt-BR')}

### 📚 Documentos Principais

${this.generateDocumentList(indexContent.documents)}

### 🗂️ Estrutura do Projeto

\`\`\`
${this.generateTreeStructure(indexContent.categories)}
\`\`\`

### 🚀 Início Rápido

1. **Instalação**
   \`\`\`bash
   npm install
   \`\`\`

2. **Configuração**
   - Copie \`.env.example\` para \`.env\`
   - Configure suas credenciais do GitHub

3. **Executar**
   \`\`\`bash
   npm start
   \`\`\`

### 🤖 Componentes Principais

- **GIDEN**: Sistema de inteligência autônoma
- **MCP**: Protocolo de contexto do modelo
- **DocSync**: Sistema de sincronização de documentação
- **NEXUS**: Hub central de integração

### 📖 Documentação Detalhada

Consulte os documentos específicos em \`/docs\` para informações detalhadas sobre cada componente.

---

*Gerado automaticamente por DocSync Integration System*
`;

    const readmePath = path.join(this.config.rootPath, 'README.md');
    await fs.writeFile(readmePath, readmeContent);
  }

  /**
   * Gerar lista de documentos
   */
  generateDocumentList(documents) {
    if (documents.length === 0) {
      return '*Nenhum documento encontrado*';
    }

    return documents
      .sort((a, b) => a.title.localeCompare(b.title))
      .map(
        doc =>
          `- **[${doc.title}](${doc.path})**: ${doc.description || 'Sem descrição'}`
      )
      .join('\n');
  }

  /**
   * Gerar estrutura em árvore
   */
  generateTreeStructure(categories) {
    const lines = [];

    for (const [main, subs] of Object.entries(categories)) {
      lines.push(`${main}/`);
      for (const [sub, files] of Object.entries(subs)) {
        lines.push(`  ├── ${sub}/`);
        const fileCount = files.length;
        lines.push(`  │   └── (${fileCount} arquivo${fileCount !== 1 ? 's' : ''})`);
      }
    }

    return lines.join('\n');
  }

  /**
   * Sincronizar com GIDEN
   */
  async syncWithGIDEN() {
    if (!this.giden) return;

    // Analisar padrões de organização
    const patterns = await this.giden.processCommand('detect_patterns', {
      fileStructure: Object.fromEntries(this.syncState.fileTree),
      categories: Object.fromEntries(this.syncState.categories),
    });

    // Obter sugestões de melhoria
    const improvements = await this.giden.processCommand('optimize_workflow', {
      currentStructure: this.getCurrentStructure(),
      patterns: patterns,
    });

    console.log('🤖 Sugestões do GIDEN:', improvements);
  }

  /**
   * Obter estrutura atual
   */
  getCurrentStructure() {
    const structure = {};

    for (const [path, info] of this.syncState.fileTree) {
      const parts = path.split(/[/\\]/);
      let current = structure;

      for (let i = 0; i < parts.length - 1; i++) {
        if (!current[parts[i]]) {
          current[parts[i]] = {};
        }
        current = current[parts[i]];
      }

      current[parts[parts.length - 1]] = info.category;
    }

    return structure;
  }

  /**
   * Lidar com aprendizado do GIDEN
   */
  handleGIDENLearning(metrics) {
    console.log('📊 Métricas de aprendizado GIDEN:', metrics);

    // Ajustar padrões de organização baseado no aprendizado
    if (metrics.errorRate < 0.1) {
      console.log('✨ Padrões de organização funcionando bem!');
    } else {
      console.log('⚠️ Considerar ajustes nos padrões de organização');
    }
  }

  /**
   * Criar relatório de organização
   */
  async generateOrganizationReport() {
    const report = {
      timestamp: new Date().toISOString(),
      statistics: {
        totalFiles: this.syncState.fileTree.size,
        documentedFiles: this.syncState.documentIndex.size,
        categories: {},
      },
      recommendations: [],
      health: {
        score: 0,
        issues: [],
      },
    };

    // Calcular estatísticas por categoria
    for (const [path, info] of this.syncState.fileTree) {
      const { main, sub } = info.category;
      if (!report.statistics.categories[main]) {
        report.statistics.categories[main] = {
          total: 0,
          subcategories: {},
        };
      }
      report.statistics.categories[main].total++;
      report.statistics.categories[main].subcategories[sub] =
        (report.statistics.categories[main].subcategories[sub] || 0) + 1;
    }

    // Gerar recomendações
    if (report.statistics.documentedFiles < report.statistics.totalFiles * 0.3) {
      report.recommendations.push('Aumentar cobertura de documentação');
    }

    // Calcular pontuação de saúde
    report.health.score = this.calculateHealthScore(report.statistics);

    const reportPath = path.join(this.config.rootPath, 'ORGANIZATION_REPORT.json');
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));

    return report;
  }

  /**
   * Calcular pontuação de saúde
   */
  calculateHealthScore(statistics) {
    let score = 100;

    // Penalizar por falta de documentação
    const docRatio = statistics.documentedFiles / statistics.totalFiles;
    if (docRatio < 0.5) {
      score -= 20;
    }

    // Penalizar por arquivos não categorizados
    if (statistics.categories.other) {
      const otherRatio = statistics.categories.other.total / statistics.totalFiles;
      score -= otherRatio * 30;
    }

    return Math.max(0, Math.round(score));
  }

  /**
   * Limpar recursos
   */
  async shutdown() {
    console.log('🔌 Desligando DocSync...');

    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }

    if (this.giden) {
      await this.giden.shutdown();
    }

    this.emit('shutdown');
    console.log('✅ DocSync desligado');
  }
}

// Exportar classe e função de criação
export { DocSyncIntegration };

export function createDocSyncIntegration(config) {
  return new DocSyncIntegration(config);
}

export default DocSyncIntegration;
