# 📖 Instruções: Como Fazer Upload para o GitHub

A estrutura do repositório está pronta. Agora você precisa fazer **upload** dessa estrutura para o GitHub.

## ✅ Pré-requisitos

Você precisa ter **Git** instalado no seu computador. Se ainda não tem:

1. Baixe em: https://git-scm.com/download/win
2. Instale com as configurações padrão
3. Reinicie o PowerShell depois (para carregar o git)

## 📋 Opção 1: Automático (Recomendado)

Se tem Git instalado:

1. Abra **PowerShell** nesta pasta
2. Execute:
```powershell
.\push-github.ps1
```

Pronto! O script faz tudo automaticamente:
- ✅ Inicializa o git
- ✅ Configura suas credenciais
- ✅ Adiciona os arquivos
- ✅ Faz commit
- ✅ Faz push para GitHub

## 📋 Opção 2: Manual (Passo a Passo)

Se preferir fazer manualmente no PowerShell:

```powershell
# 1. Ir para a pasta (substitua pelo caminho correto)
cd C:\Users\faelj\AppData\Local\Temp\blog-rrs-repo

# 2. Inicializar git
git init

# 3. Configurar suas informações
git config user.name "Rafael Rocha"
git config user.email "rafaelrochaadvocacia@gmail.com"

# 4. Adicionar todos os arquivos
git add .

# 5. Criar o primeiro commit
git commit -m "Estrutura inicial: scripts, briefings e diretrizes para tarefas agendadas de blog"

# 6. Renomear branch para "main" (padrão do GitHub)
git branch -M main

# 7. Conectar ao repositório remoto
git remote add origin https://github.com/rafaelrochaadvocacia-gif/blog-rrs-advocacia.git

# 8. Fazer push para GitHub
git push -u origin main
```

## ⚠️ Possíveis Erros

### "Git não é reconhecido"
→ Instale Git (veja acima) e reinicie o PowerShell.

### "Repositório já existe"
→ Se der erro que o repositório já tem conteúdo no GitHub, execute:
```powershell
git push -u origin main --force
```
⚠️ Isso vai **sobrescrever** tudo no GitHub. Use com cuidado.

### "Autenticação falhou"
→ O Git vai pedir sua senha do GitHub. Use seu **Personal Access Token**:
1. Vá para: https://github.com/settings/tokens
2. Clique em "Generate new token (classic)"
3. Dê permissão para "repo" (completo)
4. Copie o token
5. Cole no PowerShell quando pedir (não aparece enquanto digita)

## ✅ Confirmação

Depois de fazer push, você pode verificar em:
```
https://github.com/rafaelrochaadvocacia-gif/blog-rrs-advocacia
```

Você deve ver:
- Pasta `/scripts` com `cover_gen.py` e `arquivar_capas.py`
- Pasta `/areas` com as 4 subpastas (isencao-ir, previdenciario, tributario, familia)
- Pasta `/diretrizes` com os arquivos de diretrizes
- `README.md`

## 🎉 Próximo Passo

Assim que o push for feito, você já pode criar a **rotina agendada no Claude Code** apontando para este repositório!

---

**Dúvidas?** Verifique os logs do push para mensagens de erro.
