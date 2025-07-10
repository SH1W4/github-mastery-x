#!/usr/bin/env node

/**
 * Sistema Integrado GITHUB_MASTERY
 *
 * Script principal que executa:
 * - DocSync para organização de documentação
 * - GIDEN para inteligência autônoma
 * - MCP para protocolo de contexto
 * - NEXUS como hub central
 */

import { createDocSyncIntegration } from './src/mcp/docsync-integration.js';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class IntegratedSystem {
  constructor() {
    this.components = {
      docSync: null,
      mcpServer: null,
      nexusServer: null,
    };

    this.isRunning = false;
  }

  /**
   * Iniciar sistema integrado
   */
  async start() {
    console.log(`
╔══════════════════════════════════════════════════════╗
║         GITHUB MASTERY - SISTEMA INTEGRADO           ║
║                                                      ║
║  🤖 GIDEN - Inteligência Autônoma                   ║
║  📚 DocSync - Organização de Documentação           ║
║  🔌 MCP - Protocolo de Contexto do Modelo           ║
║  🌐 NEXUS - Hub Central de Integração               ║
╚══════════════════════════════════════════════════════╝
    `);

    try {
      // Iniciar DocSync
      await this.startDocSync();

      // Iniciar servidor MCP
      await this.startMCPServer();

      // Iniciar NEXUS (se disponível)
      await this.startNEXUS();

      this.isRunning = true;
      console.log('\n✅ Sistema integrado iniciado com sucesso!\n');

      // Mostrar status
      this.showStatus();

      // Configurar handlers de saída
      await this.setupExitHandlers();
    } catch (error) {
      console.error('❌ Erro ao iniciar sistema:', error);
      await this.shutdown();
      process.exit(1);
    }
  }

  /**
   * Iniciar DocSync
   */
  async startDocSync() {
    console.log('🚀 Iniciando DocSync...');

    this.components.docSync = createDocSyncIntegration({
      rootPath: __dirname,
      syncInterval: 5 * 60 * 1000, // 5 minutos
    });

    // Conectar eventos
    this.components.docSync.on('sync_complete', stats => {
      console.log(
        `📊 Sincronização concluída: ${stats.filesProcessed} arquivos, ${stats.documentsIndexed} documentos`
      );
    });

    this.components.docSync.on('error', error => {
      console.error('❌ Erro no DocSync:', error);
    });

    // Inicializar
    await this.components.docSync.initialize();
  }

  /**
   * Iniciar servidor MCP
   */
  async startMCPServer() {
    console.log('🚀 Iniciando servidor MCP...');

    const mcpServerPath = path.join(
      __dirname,
      'src',
      'mcp',
      'consolidated-mcp-server.js'
    );

    // Verificar se o arquivo existe antes de tentar executar
    const fs = await import('fs/promises');
    try {
      await fs.access(mcpServerPath);
    } catch {
      console.log('⚠️ Servidor MCP não encontrado em:', mcpServerPath);
      console.log('   Continuando sem MCP...');
      return;
    }

    this.components.mcpServer = spawn('node', [mcpServerPath], {
      cwd: __dirname,
      stdio: ['pipe', 'pipe', 'pipe'],
      env: { ...process.env, NODE_ENV: 'production' },
    });

    // Capturar saída
    this.components.mcpServer.stdout.on('data', data => {
      console.log(`[MCP] ${data.toString().trim()}`);
    });

    this.components.mcpServer.stderr.on('data', data => {
      console.error(`[MCP Error] ${data.toString().trim()}`);
    });

    // Aguardar inicialização
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  /**
   * Iniciar NEXUS
   */
  async startNEXUS() {
    console.log('🚀 Verificando NEXUS...');

    const nexusPath = path.join(__dirname, 'NEXUS');

    try {
      // Verificar se NEXUS existe
      const nexusExists = await this.checkFileExists(nexusPath);

      if (nexusExists) {
        console.log('✅ NEXUS disponível');
        // Implementar inicialização do NEXUS quando disponível
      } else {
        console.log('⚠️ NEXUS não encontrado - continuando sem ele');
      }
    } catch (error) {
      console.log('⚠️ NEXUS não disponível:', error.message);
    }
  }

  /**
   * Verificar se arquivo/diretório existe
   */
  async checkFileExists(filePath) {
    try {
      const fs = await import('fs/promises');
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Mostrar status do sistema
   */
  showStatus() {
    console.log('\n📊 STATUS DO SISTEMA:');
    console.log('─'.repeat(50));

    console.log(`DocSync: ${this.components.docSync ? '✅ Ativo' : '❌ Inativo'}`);
    console.log(
      `MCP Server: ${this.components.mcpServer && !this.components.mcpServer.killed ? '✅ Ativo' : '❌ Inativo'}`
    );
    console.log(
      `NEXUS: ${this.components.nexusServer ? '✅ Ativo' : '⚠️ Não disponível'}`
    );

    console.log('─'.repeat(50));
    console.log('\n📌 Comandos disponíveis:');
    console.log('  - Ctrl+C: Desligar sistema');
    console.log('  - Digite "status": Ver status atualizado');
    console.log('  - Digite "sync": Forçar sincronização');
    console.log('  - Digite "report": Gerar relatório');
    console.log('\n');
  }

  /**
   * Configurar handlers de saída
   */
  async setupExitHandlers() {
    // Capturar Ctrl+C
    process.on('SIGINT', async () => {
      console.log('\n\n🛑 Desligando sistema...');
      await this.shutdown();
      process.exit(0);
    });

    // Capturar erros não tratados
    process.on('uncaughtException', async error => {
      console.error('❌ Erro não tratado:', error);
      await this.shutdown();
      process.exit(1);
    });

    // Configurar entrada do usuário
    await this.setupUserInput();
  }

  /**
   * Configurar entrada do usuário
   */
  async setupUserInput() {
    const readline = await import('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.on('line', async input => {
      const command = input.trim().toLowerCase();

      switch (command) {
        case 'status':
          this.showStatus();
          break;

        case 'sync':
          console.log('🔄 Forçando sincronização...');
          if (this.components.docSync) {
            await this.components.docSync.performSync();
          }
          break;

        case 'report':
          console.log('📊 Gerando relatório...');
          if (this.components.docSync) {
            const report = await this.components.docSync.generateOrganizationReport();
            console.log('✅ Relatório gerado: ORGANIZATION_REPORT.json');
            console.log(`   Pontuação de saúde: ${report.health.score}/100`);
          }
          break;

        case 'help':
          console.log('\n📌 Comandos disponíveis:');
          console.log('  status - Ver status do sistema');
          console.log('  sync - Forçar sincronização');
          console.log('  report - Gerar relatório de organização');
          console.log('  help - Mostrar esta ajuda');
          console.log('  exit - Sair do sistema\n');
          break;

        case 'exit':
          console.log('👋 Saindo...');
          await this.shutdown();
          process.exit(0);
          break;

        default:
          if (command) {
            console.log(
              `❓ Comando desconhecido: ${command}. Digite 'help' para ajuda.`
            );
          }
      }
    });
  }

  /**
   * Desligar sistema
   */
  async shutdown() {
    if (!this.isRunning) return;

    console.log('🔌 Desligando componentes...');

    // Desligar DocSync
    if (this.components.docSync) {
      await this.components.docSync.shutdown();
    }

    // Desligar MCP Server
    if (this.components.mcpServer && !this.components.mcpServer.killed) {
      this.components.mcpServer.kill();
    }

    // Desligar NEXUS se estiver rodando
    if (this.components.nexusServer) {
      // Implementar shutdown do NEXUS
    }

    this.isRunning = false;
    console.log('✅ Sistema desligado');
  }
}

// Executar sistema
async function main() {
  const system = new IntegratedSystem();
  await system.start();
}

// Iniciar
main().catch(console.error);
