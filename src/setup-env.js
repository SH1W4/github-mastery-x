#!/usr/bin/env node

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

async function setupEnv() {
  console.log('🔧 Configurando arquivo .env...\n');

  const envPath = path.join(projectRoot, '.env');

  // Verificar se já existe
  try {
    await fs.access(envPath);
    console.log('⚠️  Arquivo .env já existe!');
    console.log('    Para recriar, delete o arquivo existente primeiro.\n');
    return;
  } catch {
    // Arquivo não existe, continuar
  }

  // Copiar de .env.example
  const envExamplePath = path.join(projectRoot, '.env.example');
  try {
    const content = await fs.readFile(envExamplePath, 'utf8');
    await fs.writeFile(envPath, content);
    console.log('✅ Arquivo .env criado a partir de .env.example');
    console.log('\n⚠️  IMPORTANTE: Configure seu GITHUB_TOKEN no arquivo .env');
    console.log('    1. Abra o arquivo .env');
    console.log('    2. Substitua "your_github_token_here" pelo seu token real');
    console.log('    3. Para obter um token: https://github.com/settings/tokens/new');
    console.log('\n📋 Escopos necessários do token:');
    console.log('    - repo (acesso aos repositórios)');
    console.log('    - user (informações do usuário)');
    console.log('    - workflow (GitHub Actions)\n');
  } catch (error) {
    console.error('❌ Erro ao criar .env:', error.message);
    process.exit(1);
  }
}

setupEnv();
