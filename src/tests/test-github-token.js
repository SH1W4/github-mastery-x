#!/usr/bin/env node

import { GitHubClient } from '../src/api/github-client.js';
import { config } from 'dotenv';

// Carregar variáveis de ambiente
config();

async function testGitHubToken() {
  console.log('🔍 Testando conexão com GitHub...\n');
  
  try {
    const client = new GitHubClient(process.env.GITHUB_TOKEN);
    
    // Testar autenticação
    console.log('1️⃣ Verificando autenticação...');
    const user = await client.getAuthenticatedUser();
    console.log(`✅ Autenticado como: ${user.login}`);
    console.log(`   Nome: ${user.name || 'Não definido'}`);
    console.log(`   Email: ${user.email || 'Não público'}`);
    console.log(`   Repositórios públicos: ${user.public_repos}`);
    console.log(`   Seguidores: ${user.followers}`);
    
    // Verificar rate limit
    console.log('\n2️⃣ Verificando rate limit...');
    const rateLimit = await client.getRateLimit();
    console.log(`✅ Rate limit: ${rateLimit.remaining}/${rateLimit.limit}`);
    console.log(`   Reset em: ${new Date(rateLimit.reset * 1000).toLocaleString()}`);
    
    // Listar alguns repositórios
    console.log('\n3️⃣ Listando repositórios recentes...');
    const repos = await client.listRepositories({ 
      sort: 'updated', 
      per_page: 5 
    });
    
    if (repos.length > 0) {
      console.log(`✅ Encontrados ${repos.length} repositórios:`);
      repos.forEach(repo => {
        console.log(`   - ${repo.name} (${repo.visibility}) - ⭐ ${repo.stargazers_count}`);
      });
    } else {
      console.log('   Nenhum repositório encontrado');
    }
    
    console.log('\n✅ Token do GitHub está funcionando corretamente!');
    
  } catch (error) {
    console.error('❌ Erro ao testar token:', error.message);
    
    if (error.response) {
      console.error(`   Status: ${error.response.status}`);
      console.error(`   Mensagem: ${error.response.data.message}`);
    }
    
    console.log('\n💡 Dicas:');
    console.log('   1. Verifique se o GITHUB_TOKEN está definido no arquivo .env');
    console.log('   2. Certifique-se de que o token tem os escopos necessários (repo, user)');
    console.log('   3. Verifique se o token não expirou');
    
    process.exit(1);
  }
}

// Executar teste
testGitHubToken();
