#!/usr/bin/env node

/**
 * Sistema de Análise e Correções Incrementais
 * Baseado nas regras VIREON e auditoria MCP
 */

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createLogger } from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '../..');

class SystemAnalyzer {
  constructor() {
    this.logger = createLogger('SystemAnalyzer');
    this.issues = [];
    this.corrections = [];
    this.metrics = {
      filesAnalyzed: 0,
      issuesFound: 0,
      correctionsApplied: 0,
      errors: 0,
    };
  }

  /**
   * Análise principal do sistema
   */
  async analyze() {
    this.logger.info('🔍 Iniciando análise do sistema GitHub Mastery...');

    // 1. Verificar estrutura do projeto
    await this.checkProjectStructure();

    // 2. Verificar configurações MCP
    await this.checkMCPConfiguration();

    // 3. Verificar integrações
    await this.checkIntegrations();

    // 4. Verificar conformidade com regras VIREON
    await this.checkVireonCompliance();

    // 5. Verificar saúde do código
    await this.checkCodeHealth();

    // 6. Gerar relatório
    return this.generateReport();
  }

  /**
   * Verificar estrutura do projeto
   */
  async checkProjectStructure() {
    this.logger.info('📂 Verificando estrutura do projeto...');

    const requiredDirs = [
      'src/mcp',
      'src/agents',
      'src/api',
      'src/utils',
      'config/ci_cd',
      'docs',
      'tests',
    ];

    const requiredFiles = [
      'package.json',
      'README.md',
      '.env.example',
      'src/mcp/consolidated-mcp-server.js',
    ];

    // Verificar diretórios
    for (const dir of requiredDirs) {
      const dirPath = path.join(projectRoot, dir);
      try {
        await fs.access(dirPath);
        this.logger.info(`✅ Diretório ${dir} existe`);
      } catch {
        this.addIssue('structure', `Diretório ausente: ${dir}`, 'high');
        await this.createDirectory(dirPath);
      }
    }

    // Verificar arquivos
    for (const file of requiredFiles) {
      const filePath = path.join(projectRoot, file);
      try {
        await fs.access(filePath);
        this.logger.info(`✅ Arquivo ${file} existe`);
      } catch {
        this.addIssue('structure', `Arquivo ausente: ${file}`, 'medium');
      }
    }
  }

  /**
   * Verificar configuração MCP
   */
  async checkMCPConfiguration() {
    this.logger.info('⚙️ Verificando configuração MCP...');

    const configPath = path.join(projectRoot, 'config/ci_cd/mcp-config-enhanced.json');

    try {
      const config = JSON.parse(await fs.readFile(configPath, 'utf8'));

      // Verificar capabilities
      const requiredCapabilities = [
        'python_brain',
        'health_monitoring',
        'rust_core',
        'advanced_metrics',
      ];

      for (const cap of requiredCapabilities) {
        if (!config.capabilities || !config.capabilities[cap]) {
          this.addIssue('config', `Capability ausente: ${cap}`, 'medium');
        }
      }

    // Verificar servidor MCP
    if (!config.mcpServers || !config.mcpServers['github-mastery-enhanced']) {
      this.addIssue('config', 'Servidor MCP não configurado', 'high');
    }
    
    // Verificar GITHUB_TOKEN no .env
    const envPath = path.join(projectRoot, '.env');
    try {
      const envContent = await fs.readFile(envPath, 'utf8');
      if (!envContent.includes('GITHUB_TOKEN=') || envContent.includes('GITHUB_TOKEN=your_github_token_here')) {
        this.addIssue('config', 'GITHUB_TOKEN não configurado no .env', 'critical');
      } else {
        // Verificar se tem um valor real
        const tokenMatch = envContent.match(/GITHUB_TOKEN=(.+)/m);
        if (tokenMatch && tokenMatch[1] && tokenMatch[1].startsWith('ghp_')) {
          this.logger.info('✅ GITHUB_TOKEN configurado no .env');
        } else {
          this.addIssue('config', 'GITHUB_TOKEN parece inválido no .env', 'critical');
        }
      }
    } catch {
      this.addIssue('config', 'Arquivo .env não encontrado', 'critical');
    }
    } catch (error) {
      this.addIssue(
        'config',
        `Erro ao ler configuração MCP: ${error.message}`,
        'critical'
      );
    }
  }

  /**
   * Verificar integrações
   */
  async checkIntegrations() {
    this.logger.info('🔗 Verificando integrações...');

    // Verificar integração GIDEN
    const gidenPath = path.join(projectRoot, 'src/mcp/giden-integration.js');
    try {
      await fs.access(gidenPath);
      this.logger.info('✅ Integração GIDEN presente');

      // Verificar se está funcional
      const content = await fs.readFile(gidenPath, 'utf8');
      if (!content.includes('class GIDENIntegration')) {
        this.addIssue('integration', 'Classe GIDENIntegration não encontrada', 'high');
      }
    } catch {
      this.addIssue('integration', 'Arquivo de integração GIDEN ausente', 'high');
    }

    // Verificar integração DocSync
    const docsyncPath = path.join(projectRoot, 'src/mcp/docsync-integration.js');
    try {
      await fs.access(docsyncPath);
      this.logger.info('✅ Integração DocSync presente');
    } catch {
      this.addIssue('integration', 'Arquivo de integração DocSync ausente', 'medium');
    }
  }

  /**
   * Verificar conformidade com regras VIREON
   */
  async checkVireonCompliance() {
    this.logger.info('📋 Verificando conformidade com regras VIREON...');

    // Verificar terminologia (Rule: 2NaAMXd68AYJWZlow7GjPa)
    await this.checkTerminology();

    // Verificar documentação de sessão (Rule: TmHEtYPIeeuHMwHAPG1fAf)
    await this.checkSessionDocumentation();

    // Verificar segurança (Rule: GZuVNeJhISm31ffFl8ub16)
    await this.checkSecurity();
  }

  /**
   * Verificar terminologia restrita
   */
  async checkTerminology() {
    const restrictedTerms = ['quantum', 'neural', 'consciousness'];
    const allowedContexts = {
      quantum: ['QPU', 'quantum-resistant', 'post-quantum'],
      neural: ['neural network', 'deep learning', 'AI model'],
      consciousness: ['metacognitive', 'self-assessment', 'awareness'],
    };

    const files = await this.getJavaScriptFiles();

    for (const file of files) {
      const content = await fs.readFile(file, 'utf8');
      const lines = content.split('\n');

      lines.forEach((line, index) => {
        for (const term of restrictedTerms) {
          if (line.toLowerCase().includes(term)) {
            // Verificar se está em contexto permitido
            let isAllowed = false;
            for (const context of allowedContexts[term] || []) {
              if (line.toLowerCase().includes(context.toLowerCase())) {
                isAllowed = true;
                break;
              }
            }

            if (!isAllowed && !line.includes('//') && !line.includes('*')) {
              this.addIssue(
                'terminology',
                `Uso indevido do termo "${term}" em ${path.relative(projectRoot, file)}:${index + 1}`,
                'medium'
              );
            }
          }
        }
      });
    }
  }

  /**
   * Verificar documentação de sessão
   */
  async checkSessionDocumentation() {
    const requiredDocs = ['DESENVOLVIMENTO.md', 'README.md', 'TODO.md', 'SESSION.md'];

    for (const doc of requiredDocs) {
      const docPath = path.join(projectRoot, doc);
      try {
        await fs.access(docPath);
      } catch {
        this.addIssue(
          'documentation',
          `Documento obrigatório ausente: ${doc}`,
          'medium'
        );

        // Criar template básico
        await this.createDocumentTemplate(doc);
      }
    }
  }

  /**
   * Verificar segurança
   */
  async checkSecurity() {
    // Verificar .env.example
    const envExamplePath = path.join(projectRoot, '.env.example');
    try {
      const content = await fs.readFile(envExamplePath, 'utf8');

      // Verificar se não há credenciais hardcoded
      if (content.includes('ghp_') || content.includes('sk-')) {
        this.addIssue(
          'security',
          'Possível credencial exposta em .env.example',
          'critical'
        );
      }
    } catch {
      this.addIssue('security', '.env.example não encontrado', 'high');
      await this.createEnvExample();
    }

    // Verificar arquivos JS por credenciais
    const files = await this.getJavaScriptFiles();
    for (const file of files) {
      const content = await fs.readFile(file, 'utf8');

      // Padrões de credenciais
      const patterns = [
        /ghp_[a-zA-Z0-9]{36}/,
        /sk-[a-zA-Z0-9]{48}/,
        /api[_-]?key\s*[:=]\s*['"][^'"]{10,}/i,
      ];

      for (const pattern of patterns) {
        if (pattern.test(content)) {
          this.addIssue(
            'security',
            `Possível credencial exposta em ${path.relative(projectRoot, file)}`,
            'critical'
          );
        }
      }
    }
  }

  /**
   * Verificar saúde do código
   */
  async checkCodeHealth() {
    this.logger.info('💊 Verificando saúde do código...');

    const files = await this.getJavaScriptFiles();

    for (const file of files) {
      this.metrics.filesAnalyzed++;
      const content = await fs.readFile(file, 'utf8');

      // Verificar imports não utilizados
      const importMatches = content.match(/import\s+{([^}]+)}\s+from/g) || [];
      const usedImports = new Set();

      // Análise simples de uso
      importMatches.forEach(imp => {
        const vars = imp
          .match(/{([^}]+)}/)[1]
          .split(',')
          .map(v => v.trim());
        vars.forEach(v => {
          if (!content.includes(v)) {
            this.addIssue(
              'code-quality',
              `Import não utilizado "${v}" em ${path.relative(projectRoot, file)}`,
              'low'
            );
          }
        });
      });

      // Verificar console.logs em produção
      if (!file.includes('test') && !file.includes('example')) {
        const consoleCount = (content.match(/console\.(log|error|warn)/g) || []).length;
        if (consoleCount > 5) {
          this.addIssue(
            'code-quality',
            `Muitos console.log (${consoleCount}) em ${path.relative(projectRoot, file)}`,
            'low'
          );
        }
      }
    }
  }

  /**
   * Adicionar issue encontrada
   */
  addIssue(category, description, severity) {
    this.issues.push({ category, description, severity, timestamp: new Date() });
    this.metrics.issuesFound++;

    if (severity === 'critical') {
      this.logger.error(`❌ ${description}`);
    } else if (severity === 'high') {
      this.logger.warn(`⚠️ ${description}`);
    }
  }

  /**
   * Aplicar correção
   */
  async applyCorrection(description, action) {
    try {
      await action();
      this.corrections.push({ description, success: true, timestamp: new Date() });
      this.metrics.correctionsApplied++;
      this.logger.info(`✅ Correção aplicada: ${description}`);
    } catch (error) {
      this.corrections.push({ description, success: false, error: error.message });
      this.metrics.errors++;
      this.logger.error(`❌ Falha na correção: ${description} - ${error.message}`);
    }
  }

  /**
   * Criar diretório ausente
   */
  async createDirectory(dirPath) {
    await this.applyCorrection(
      `Criar diretório ${path.relative(projectRoot, dirPath)}`,
      async () => {
        await fs.mkdir(dirPath, { recursive: true });
      }
    );
  }

  /**
   * Criar template de documento
   */
  async createDocumentTemplate(docName) {
    const templates = {
      'DESENVOLVIMENTO.md': `# Documentação Técnica - GitHub Mastery

## Arquitetura

### Componentes Principais
- **MCP Server**: Servidor consolidado para integração com Model Context Protocol
- **GIDEN Integration**: Sistema de inteligência autônoma
- **GitHub API Client**: Cliente para interação com GitHub API

## Decisões Técnicas

### Stack Tecnológica
- Node.js (ES Modules)
- MCP SDK
- Octokit (GitHub API)

## Configuração

### Variáveis de Ambiente
- \`GITHUB_TOKEN\`: Token de acesso do GitHub
- \`MCP_SERVER_PORT\`: Porta do servidor MCP (padrão: 3000)

---
*Última atualização: ${new Date().toISOString()}*
`,
      'TODO.md': `# TODO - GitHub Mastery

## 🚨 Crítico
- [ ] Configurar GITHUB_TOKEN no ambiente
- [ ] Implementar testes automatizados

## 📌 Alta Prioridade
- [ ] Melhorar tratamento de erros
- [ ] Adicionar mais métricas de monitoramento

## 🎯 Média Prioridade
- [ ] Documentar APIs públicas
- [ ] Otimizar performance das queries

## 💡 Baixa Prioridade
- [ ] Adicionar mais exemplos de uso
- [ ] Melhorar logs de debug

---
*Última atualização: ${new Date().toISOString()}*
`,
      'SESSION.md': `# Sessão de Desenvolvimento - ${new Date().toLocaleDateString('pt-BR')}

## Estado Atual
- Sistema em análise e correção incremental
- Verificação de conformidade com regras VIREON

## Último Ponto Trabalhado
- Implementação do sistema de análise automatizada
- Correções de estrutura e configuração

## Pontos de Entrada para Próxima Sessão
1. Completar correções identificadas pela análise
2. Implementar testes automatizados
3. Configurar CI/CD completo

## Arquivos em Progresso
- \`src/tools/system-analysis.js\`
- Configurações MCP

## Notas
- Sistema precisa de GITHUB_TOKEN configurado
- Verificar integrações GIDEN e DocSync

## Comandos Úteis
\`\`\`bash
# Executar análise do sistema
npm run analyze

# Iniciar servidor MCP
npm run mcp:start

# Verificar saúde do sistema
npm run health
\`\`\`

---
*Timestamp: ${new Date().toISOString()}*
`,
    };

    const content =
      templates[docName] || `# ${docName}\n\n*Documento criado automaticamente*\n`;

    await this.applyCorrection(`Criar documento ${docName}`, async () => {
      await fs.writeFile(path.join(projectRoot, docName), content);
    });
  }

  /**
   * Criar .env.example
   */
  async createEnvExample() {
    const content = `# GitHub Mastery Environment Variables

# GitHub Configuration
GITHUB_TOKEN=your_github_token_here
GITHUB_USERNAME=your_username

# MCP Configuration
MCP_SERVER_PORT=3000
MCP_SERVER_NAME=github-mastery

# Feature Flags
ENABLE_AI_SUGGESTIONS=true
ENABLE_HEALTH_MONITORING=true
ENABLE_GIDEN_INTEGRATION=true

# Logging
LOG_LEVEL=info
DEBUG=false

# API Configuration
API_RATE_LIMIT=5000
API_TIMEOUT=30000

# Security
ENABLE_ENCRYPTION=true
SESSION_SECRET=generate_a_random_secret_here

# DO NOT COMMIT REAL CREDENTIALS!
`;

    await this.applyCorrection('Criar .env.example', async () => {
      await fs.writeFile(path.join(projectRoot, '.env.example'), content);
    });
  }

  /**
   * Obter arquivos JavaScript do projeto
   */
  async getJavaScriptFiles() {
    const files = [];

    async function scanDir(dir) {
      const entries = await fs.readdir(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
          if (!['node_modules', '.git', 'dist', 'coverage'].includes(entry.name)) {
            await scanDir(fullPath);
          }
        } else if (entry.name.endsWith('.js')) {
          files.push(fullPath);
        }
      }
    }

    await scanDir(path.join(projectRoot, 'src'));
    return files;
  }

  /**
   * Gerar relatório final
   */
  generateReport() {
    const report = {
      summary: {
        totalIssues: this.issues.length,
        criticalIssues: this.issues.filter(i => i.severity === 'critical').length,
        highIssues: this.issues.filter(i => i.severity === 'high').length,
        mediumIssues: this.issues.filter(i => i.severity === 'medium').length,
        lowIssues: this.issues.filter(i => i.severity === 'low').length,
        correctionsApplied: this.metrics.correctionsApplied,
        errors: this.metrics.errors,
      },
      issues: this.issues,
      corrections: this.corrections,
      metrics: this.metrics,
      recommendations: this.generateRecommendations(),
    };

    return report;
  }

  /**
   * Gerar recomendações baseadas na análise
   */
  generateRecommendations() {
    const recommendations = [];

    if (this.issues.some(i => i.description.includes('GITHUB_TOKEN'))) {
      recommendations.push({
        priority: 'critical',
        action: 'Configurar GITHUB_TOKEN no ambiente',
        command: 'npm run setup:token',
      });
    }

    if (this.issues.some(i => i.category === 'structure')) {
      recommendations.push({
        priority: 'high',
        action: 'Reorganizar estrutura do projeto',
        command: 'npm run organize',
      });
    }

    if (this.issues.some(i => i.category === 'code-quality')) {
      recommendations.push({
        priority: 'medium',
        action: 'Executar linter e formatter',
        command: 'npm run lint:fix && npm run format',
      });
    }

    if (this.metrics.filesAnalyzed > 0) {
      recommendations.push({
        priority: 'low',
        action: 'Adicionar mais testes automatizados',
        command: 'npm test',
      });
    }

    return recommendations;
  }
}

// Executar análise se chamado diretamente
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const analyzer = new SystemAnalyzer();

  analyzer
    .analyze()
    .then(report => {
      console.log('\n📊 RELATÓRIO DE ANÁLISE DO SISTEMA\n');
      console.log('📈 Resumo:');
      console.log(`   Total de Issues: ${report.summary.totalIssues}`);
      console.log(`   - Críticas: ${report.summary.criticalIssues}`);
      console.log(`   - Altas: ${report.summary.highIssues}`);
      console.log(`   - Médias: ${report.summary.mediumIssues}`);
      console.log(`   - Baixas: ${report.summary.lowIssues}`);
      console.log(`   Correções Aplicadas: ${report.summary.correctionsApplied}`);
      console.log(`   Erros: ${report.summary.errors}`);

      if (report.recommendations.length > 0) {
        console.log('\n💡 Recomendações:');
        report.recommendations.forEach(rec => {
          console.log(`   [${rec.priority.toUpperCase()}] ${rec.action}`);
          console.log(`   → ${rec.command}`);
        });
      }

      // Salvar relatório
      const reportPath = path.join(projectRoot, 'ANALYSIS_REPORT.json');
      fs.writeFile(reportPath, JSON.stringify(report, null, 2))
        .then(() => console.log(`\n📄 Relatório completo salvo em: ${reportPath}`))
        .catch(err => console.error('Erro ao salvar relatório:', err));
    })
    .catch(error => {
      console.error('❌ Erro durante análise:', error);
      process.exit(1);
    });
}

export { SystemAnalyzer };
