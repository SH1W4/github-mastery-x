#!/usr/bin/env node

/**
 * GitHub Presence Activator
 * Automatiza tarefas para tornar você um desenvolvedor ativo no GitHub
 */

import { execSync } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import readline from 'readline';
import os from 'os';

// Configurações
const CONFIG = {
  githubUsername: 'NEO_SH1W4',
  targetProjects: ['GITHUB_MASTERY', 'MCP_ECOSYSTEM', 'GIDEN', 'GUARDRIVE'],
  apiToken: process.env.GITHUB_TOKEN || '',
};

// Interface de linha de comando
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Utilidades
const prompt = (question) => new Promise((resolve) => rl.question(question, resolve));

const log = {
  info: (msg) => console.log(`✅ ${msg}`),
  error: (msg) => console.error(`❌ ${msg}`),
  task: (msg) => console.log(`🔄 ${msg}`),
  success: (msg) => console.log(`🎉 ${msg}`),
};

// Funções principais
class GitHubActivator {
  constructor() {
    this.stats = {
      profileUpdated: false,
      projectsEnhanced: 0,
      issuesCreated: 0,
      prsSubmitted: 0,
    };
  }

  async run() {
    log.info('🚀 Iniciando GitHub Presence Activator...\n');

    const actions = [
      { name: '1. Otimizar Perfil', fn: () => this.optimizeProfile() },
      { name: '2. Melhorar Projetos', fn: () => this.enhanceProjects() },
      { name: '3. Criar Conteúdo', fn: () => this.createContent() },
      { name: '4. Buscar Contribuições', fn: () => this.findContributions() },
      { name: '5. Gerar README Pessoal', fn: () => this.generateProfileReadme() },
      { name: '6. Análise de Métricas', fn: () => this.analyzeMetrics() },
      { name: '7. Executar Tudo', fn: () => this.runAll() },
      { name: '0. Sair', fn: () => process.exit(0) },
    ];

    console.log('📋 Escolha uma ação:\n');
    actions.forEach((action) => console.log(`   ${action.name}`));

    const choice = await prompt('\nSua escolha: ');
    const selectedAction = actions[parseInt(choice)];

    if (selectedAction && selectedAction.fn) {
      await selectedAction.fn();
      console.log('\n---\n');
      await this.run(); // Volta ao menu
    } else {
      log.error('Opção inválida!');
      await this.run();
    }
  }

  async optimizeProfile() {
    log.task('Otimizando perfil do GitHub...');

    // Criar estrutura para README pessoal
    const profileDir = path.join(path.dirname(process.cwd()), 'GITHUB_PROFILE_' + CONFIG.githubUsername);
    
    try {
      await fs.mkdir(profileDir, { recursive: true });
      log.info(`Diretório do perfil criado: ${profileDir}`);
      
      log.info('Para otimizar seu perfil:');
      console.log('1. Acesse: https://github.com/settings/profile');
      console.log('2. Adicione uma bio profissional com emojis');
      console.log('3. Preencha: empresa, localização, website');
      console.log('4. Configure status com o que está trabalhando');
      
      this.stats.profileUpdated = true;
    } catch (error) {
      log.error(`Erro ao criar diretório: ${error.message}`);
    }
  }

  async enhanceProjects() {
    log.task('Melhorando documentação dos projetos...');

    for (const project of CONFIG.targetProjects) {
      log.info(`Analisando ${project}...`);

      const improvements = [
        '- [ ] Adicionar badges no README',
        '- [ ] Criar CONTRIBUTING.md',
        '- [ ] Adicionar CODE_OF_CONDUCT.md',
        '- [ ] Configurar issue templates',
        '- [ ] Adicionar PR template',
        '- [ ] Criar CHANGELOG.md',
        '- [ ] Adicionar screenshots/GIFs',
      ];

      const todoPath = path.join(process.cwd(), '..', project, 'IMPROVEMENTS.md');
      const content = `# Melhorias para ${project}\n\n${improvements.join('\n')}\n`;

      try {
        await fs.writeFile(todoPath, content);
        log.info(`Lista de melhorias criada para ${project}`);
        this.stats.projectsEnhanced++;
      } catch (error) {
        log.error(`Erro ao criar arquivo: ${error.message}`);
      }
    }
  }

  async createContent() {
    log.task('Gerando ideias de conteúdo...');

    const contentIdeas = {
      blogPosts: [
        'Como Automatizei Meu Workflow com GitHub Actions',
        'De Zero a Hero: Minha Jornada Open Source',
        'GitHub CLI: O Poder da Linha de Comando',
        '5 Automações que Todo Dev Deveria Conhecer',
      ],
      videos: [
        'Setup Completo do GitHub em 10 minutos',
        'Live Coding: Criando uma GitHub Action',
        'GitHub Copilot: Vale a Pena?',
      ],
      gists: [
        'Script para backup automático de repos',
        'GitHub Actions workflow templates',
        '.gitignore universal',
        'Pre-commit hooks essenciais',
      ],
    };

    const contentPath = path.join(process.cwd(), 'CONTENT_CALENDAR.md');
    let content = '# Calendário de Conteúdo\n\n';

    content += '## 📝 Blog Posts\n';
    contentIdeas.blogPosts.forEach((post) => {
      content += `- [ ] ${post}\n`;
    });

    content += '\n## 🎥 Vídeos\n';
    contentIdeas.videos.forEach((video) => {
      content += `- [ ] ${video}\n`;
    });

    content += '\n## 📋 Gists\n';
    contentIdeas.gists.forEach((gist) => {
      content += `- [ ] ${gist}\n`;
    });

    await fs.writeFile(contentPath, content);
    log.success('Calendário de conteúdo criado!');
  }

  async findContributions() {
    log.task('Buscando oportunidades de contribuição...');

    const languages = ['javascript', 'python', 'rust'];
    const labels = ['good-first-issue', 'help-wanted', 'documentation'];

    console.log('\n🔍 Procure por issues em:');
    
    languages.forEach((lang) => {
      labels.forEach((label) => {
        const url = `https://github.com/search?q=language:${lang}+label:"${label}"+state:open&type=Issues`;
        console.log(`\n${lang} + ${label}:`);
        console.log(`   ${url}`);
      });
    });

    console.log('\n💡 Dicas para primeira contribuição:');
    console.log('1. Comece com documentação ou typos');
    console.log('2. Leia CONTRIBUTING.md do projeto');
    console.log('3. Seja respeitoso e paciente');
    console.log('4. Teste suas mudanças localmente');
  }

  async generateProfileReadme() {
    log.task('Gerando README.md para seu perfil...');

    const template = `<div align="center">

# Olá! Eu sou ${CONFIG.githubUsername} 👋

### 🚀 Full-Stack Developer | 🤖 AI Enthusiast | 🛠️ Building Developer Tools

[![GitHub followers](https://img.shields.io/github/followers/${CONFIG.githubUsername}?style=social)](https://github.com/${CONFIG.githubUsername})
[![Twitter Follow](https://img.shields.io/twitter/follow/${CONFIG.githubUsername}?style=social)](https://twitter.com/${CONFIG.githubUsername})

</div>

## 🔧 Tecnologias & Ferramentas

![JavaScript](https://img.shields.io/badge/-JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![Node.js](https://img.shields.io/badge/-Node.js-339933?style=flat-square&logo=node.js&logoColor=white)
![Python](https://img.shields.io/badge/-Python-3776AB?style=flat-square&logo=python&logoColor=white)
![Rust](https://img.shields.io/badge/-Rust-000000?style=flat-square&logo=rust&logoColor=white)
![Git](https://img.shields.io/badge/-Git-F05032?style=flat-square&logo=git&logoColor=white)
![GitHub](https://img.shields.io/badge/-GitHub-181717?style=flat-square&logo=github&logoColor=white)

## 📊 GitHub Stats

<div align="center">
  <img src="https://github-readme-stats.vercel.app/api?username=${CONFIG.githubUsername}&show_icons=true&theme=dark" alt="GitHub Stats" />
  <img src="https://github-readme-streak-stats.herokuapp.com/?user=${CONFIG.githubUsername}&theme=dark" alt="GitHub Streak" />
</div>

## 🚀 Projetos em Destaque

### [GitHub Mastery](https://github.com/${CONFIG.githubUsername}/github-mastery)
Complete GitHub automation toolkit with CLI tools, API client, and webhook server.

### [MCP Ecosystem](https://github.com/${CONFIG.githubUsername}/mcp-ecosystem)
Model Context Protocol integrations for enhanced AI development.

### [GIDEN](https://github.com/${CONFIG.githubUsername}/giden)
Autonomous GitHub Intelligence system with adaptive learning.

## 📈 Atividade Recente

<!--START_SECTION:activity-->
<!--END_SECTION:activity-->

## 💬 Vamos Conectar!

- 💼 LinkedIn: [/in/${CONFIG.githubUsername}](https://linkedin.com/in/${CONFIG.githubUsername})
- 🐦 Twitter: [@${CONFIG.githubUsername}](https://twitter.com/${CONFIG.githubUsername})
- 📧 Email: ${CONFIG.githubUsername}@example.com
- 🌐 Website: [https://${CONFIG.githubUsername}.dev](https://${CONFIG.githubUsername}.dev)

---

<div align="center">
  <img src="https://komarev.com/ghpvc/?username=${CONFIG.githubUsername}&color=blue" alt="Profile views" />
  
  ⭐️ From [${CONFIG.githubUsername}](https://github.com/${CONFIG.githubUsername})
</div>
`;

    const readmePath = path.join(path.dirname(process.cwd()), 'GITHUB_PROFILE_' + CONFIG.githubUsername, 'README.md');
    
    try {
      await fs.writeFile(readmePath, template);
      log.success(`README.md criado em: ${readmePath}`);
      console.log('\n📌 Próximos passos:');
      console.log('1. Crie um repositório com seu username no GitHub');
      console.log('2. Faça push do README.md');
      console.log('3. Personalize com suas informações');
    } catch (error) {
      log.error(`Erro ao criar README: ${error.message}`);
    }
  }

  async analyzeMetrics() {
    log.task('Analisando métricas atuais...');

    console.log('\n📊 Métricas para acompanhar:\n');

    const metrics = {
      'Perfil': [
        'Followers',
        'Following',
        'Public Repos',
        'Public Gists',
      ],
      'Atividade': [
        'Contributions (último ano)',
        'Longest streak',
        'Current streak',
        'Pull Requests',
      ],
      'Engajamento': [
        'Total stars recebidas',
        'Issues abertas',
        'PRs merged',
        'Repos watched',
      ],
    };

    Object.entries(metrics).forEach(([category, items]) => {
      console.log(`\n${category}:`);
      items.forEach((item) => console.log(`  - ${item}`));
    });

    console.log('\n🔗 Verifique suas métricas em:');
    console.log(`   https://github.com/${CONFIG.githubUsername}`);
    console.log(`   https://github-readme-stats.vercel.app/api?username=${CONFIG.githubUsername}`);
  }

  async runAll() {
    log.task('Executando todas as ações...\n');

    await this.optimizeProfile();
    await this.enhanceProjects();
    await this.createContent();
    await this.generateProfileReadme();
    await this.analyzeMetrics();

    console.log('\n📊 Resumo da Execução:');
    console.log(`✅ Perfil otimizado: ${this.stats.profileUpdated ? 'Sim' : 'Não'}`);
    console.log(`✅ Projetos melhorados: ${this.stats.projectsEnhanced}`);
    console.log(`✅ Conteúdo planejado: Sim`);
    console.log(`✅ README do perfil: Criado`);

    log.success('\nTodas as ações foram executadas!');
  }
}

// Executar
async function main() {
  console.clear();
  console.log('╔═══════════════════════════════════════╗');
  console.log('║   GitHub Presence Activator v1.0.0    ║');
  console.log('║   Torne-se um Dev Ativo no GitHub!   ║');
  console.log('╚═══════════════════════════════════════╝\n');

  if (!CONFIG.apiToken) {
    log.error('⚠️  GITHUB_TOKEN não configurado!');
    console.log('Configure com: export GITHUB_TOKEN=seu_token\n');
  }

  const activator = new GitHubActivator();
  await activator.run();
  
  rl.close();
}

// Tratamento de erros
process.on('unhandledRejection', (error) => {
  log.error(`Erro não tratado: ${error.message}`);
  process.exit(1);
});

// Iniciar aplicação
main().catch((error) => {
  log.error(`Erro fatal: ${error.message}`);
  process.exit(1);
});
