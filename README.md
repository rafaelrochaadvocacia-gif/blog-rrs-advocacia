# blog-rrs-advocacia

Repositório centralizado de tarefas agendadas para criação de artigos jurídicos no blog da Rafael Rocha e Santos Advocacia.

## 📁 Estrutura

```
blog-rrs-advocacia/
├── scripts/
│   ├── cover_gen.py           # Gera capas de blog (1080x1350, estilo RRS)
│   └── arquivar_capas.py      # Organiza capas: rascunho vs publicado
├── areas/
│   ├── isencao-ir/
│   │   ├── briefing-isencao-ir.txt
│   │   └── capas/
│   ├── previdenciario/
│   │   ├── briefing-previdenciario.txt
│   │   └── capas/
│   ├── tributario/
│   │   ├── briefing-tributario.txt
│   │   └── capas/
│   └── familia/
│       ├── briefing-familia.txt
│       └── capas/
├── diretrizes/
│   ├── diretrizes-bpc.txt
│   ├── diretrizes-aposentadoria-especial.txt
│   └── diretrizes-indice-clicavel.txt
└── README.md
```

## 🎯 Áreas do Direito

Cada pasta em `areas/` corresponde a uma **frente de atuação** do escritório com sua própria:
- **Briefing**: arquivo `briefing-<area>.txt` com pautas de artigos a criar
- **Capas**: subpasta com imagens de capa geradas para cada artigo
- **Rotina agendada**: tarefa no Claude Code que roda toda semana

### Áreas Ativas

1. **Isenção de IR por Doença Grave** (`isencao-ir/`)
   - Rotina: Toda sexta-feira 9:03 AM (9:03 UTC)
   - Modelo: Claude Sonnet 5.5

2. **Previdenciário / BPC / LOAS** (`previdenciario/`)
   - Rotina: Toda segunda-feira [PENDENTE]

3. **Tributário / Dívidas Fiscais** (`tributario/`)
   - Rotina: Toda quarta-feira [PENDENTE]

4. **Família / Direito Civil** (`familia/`)
   - Rotina: Toda terça-feira [PENDENTE]

## 📝 Formato de Briefing

Cada arquivo `briefing-<area>.txt` contém **pautas** separadas por linhas `---`:

```
FRENTE: I - Isenção de Imposto de Renda por doença grave
TEMA: Hepatopatia Grave e Isenção de Imposto de Renda: Quem Tem Direito e Como Pedir
PALAVRA-CHAVE: isenção de imposto de renda para hepatopatia grave
BASE JURÍDICA: Lei 7.713/1988, art. 6º, XIV; Tema 250/STJ
GATILHO: A - novidade jurídica
DATA DA SUGESTÃO: 2026-09-04
---
```

**Campos:**
- `FRENTE`: classificação do tipo de direito (grupo de tarefas)
- `TEMA`: título do artigo a ser criado
- `PALAVRA-CHAVE`: frase-chave para SEO (exata, sem variações)
- `BASE JURÍDICA`: legislação/jurisprudência de partida para pesquisa
- `GATILHO`: `A` (novidade jurídica) ou `B` (lacuna competitiva)
- `DATA DA SUGESTÃO`: quando a pauta foi criada

## 🚀 Fluxo de Criação de Artigos

1. **Pesquisa de monitoramento** (segunda-feira) → Gera pauta no `briefing-<area>.txt`
2. **Rotina agendada** (sexta-feira para isenção de IR) → Lê primeira pauta e cria artigo em **RASCUNHO** no Wix
3. **Revisão manual** (Rafael) → Revisa, ajusta, publica no blog
4. **Organização** (automática) → Capa é movida para "Já usadas" quando post é publicado

## 🐍 Scripts Python

### `cover_gen.py`
Gera capas de blog em PNG/WEBP (1080x1350px, estilo RRS).

**Uso:**
```bash
python3 scripts/cover_gen.py "Seu Título Aqui" "areas/isencao-ir/capas/capa-seu-titulo.webp"
```

**Nota:** A cor da primeira parte do título (antes de `:`) sai em OURO; o resto em CREME.

### `arquivar_capas.py`
Move capas de posts publicados para a pasta "Já usadas", mantendo a raiz limpa com apenas capas de **RASCUNHOS**.

**Uso (chamado automaticamente pelas rotinas):**
```bash
# Ler slugs de um arquivo (um por linha)
python3 scripts/arquivar_capas.py --slugs-file slugs.txt --pasta "areas/isencao-ir/capas"

# Teste seco
python3 scripts/arquivar_capas.py --slugs-file slugs.txt --dry-run
```

## 🔗 APIs Externas

- **Wix API**: `https://www.wixapis.com/v3/posts` — criar/atualizar rascunhos de blog
- **SEO**: Assistente do Wix valida keywords, meta description, JSON-LD

## 📋 Checklist para Novas Áreas

Quando adicionar uma nova área de direito:

- [ ] Criar pasta em `areas/<nome>/`
- [ ] Criar arquivo `areas/<nome>/briefing-<nome>.txt`
- [ ] Criar subpasta `areas/<nome>/capas/`
- [ ] Atualizar lista de **Áreas Ativas** acima
- [ ] Criar rotina no Claude Code (schedule)
- [ ] Testar primeira pauta

## 📧 Contato & Manutenção

**Responsável**: Rafael Rocha  
**Escritório**: Rafael Rocha e Santos Advocacia  
**Especialização**: Direito Tributário, Previdenciário, Família e Civil

---

*Última atualização: 2026-09-30*
