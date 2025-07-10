#!/usr/bin/env node

import { Octokit } from '@octokit/rest';
import { config } from 'dotenv';

// Carregar variáveis de ambiente
config();

async function testToken() {
  const token = process.env.GITHUB_TOKEN;
  
  if (!token) {
    console.error('❌ GITHUB_TOKEN não encontrado no arquivo .env');
    process.exit(1);
  }
  
  console.log('🔍 Testando token do GitHub...\n');
  console.log(`📝 Token encontrado: ${token.substring(0, 4)}...${token.substring(token.length - 4)}`);
  
  try {
    const octokit = new Octokit({
      auth: token
    });
    
    // Testar autenticação
    console.log('\n1️⃣ Verificando autenticação...');
    const { data: user } = await octokit.rest.users.getAuthenticated();
    
    console.log(`\n✅ TOKEN VÁLIDO E FUNCIONANDO!\n`);
    console.log(`👤 Usuário: ${user.login}`);
    console.log(`📧 Nome: ${user.name || 'Não definido'}`);
    console.log(`📊 Repositórios públicos: ${user.public_repos}`);
    console.log(`⭐ Seguidores: ${user.followers}`);
    console.log(`🔗 URL: ${user.html_url}`);
    
    // Verificar rate limit
    console.log('\n2️⃣ Verificando rate limit...');
    const { data: rateLimit } = await octokit.rest.rateLimit.get();
    
    console.log(`📊 Rate Limit: ${rateLimit.rate.remaining}/${rateLimit.rate.limit}`);
    console.log(`⏰ Reset: ${new Date(rateLimit.rate.reset * 1000).toLocaleString('pt-BR')}`);
    
    // Verificar escopos
    console.log('\n3️⃣ Escopos do token:');
    const { headers } = await octokit.rest.users.getAuthenticated();
    const scopes = headers['x-oauth-scopes'] || 'Não disponível';
    console.log(`🔐 Escopos: ${scopes}`);
    
    console.log('\n✅ Tudo funcionando perfeitamente!');
    
  } catch (error) {
    console.error('\n❌ ERRO AO VALIDAR TOKEN:', error.message);
    
    if (error.status === 401) {
      console.error('   Token inválido ou expirado');
    } else if (error.status === 403) {
      console.error('   Token sem permissões necessárias');
    }
    
    console.log('\n💡 Verifique:');
    console.log('   1. Se o token está correto');
    console.log('   2. Se o token tem os escopos: repo, user');
    console.log('   3. Se o token não expirou');
    
    process.exit(1);
  }
}

// Executar teste
testToken();
