# Revisão Automática dos Artigos — Fase 1 e Fase 2

Como as rotinas do blog revisam o próprio rascunho antes de entregar, e como o blog chega à
publicação automática. As rotinas rodam no **Claude Code na nuvem**, direto neste repositório
(instruções completas em `rotinas/redator.md`).

| | Fase 1 (ATIVA desde 09/11/2026) | Fase 2 (ainda não ativa) |
|---|---|---|
| O que a rotina faz | Cria o rascunho, roda o revisor automático, corrige o que ele apontar e deixa o rascunho pronto | O mesmo e, se o revisor aprovar, **agenda a publicação** para 48h depois |
| O que o Rafael faz | Abre o rascunho, ajusta o que quiser e publica | Só olha se quiser. Para vetar, cancela o agendamento |
| Como medimos | Calibração: compara o rascunho entregue com o que foi publicado | Continua medindo |
| Quando muda de fase | `python3 scripts/calibracao.py status --csv revisoes/calibracao.csv` diz **PRONTO PARA A FASE 2** (6 artigos seguidos publicados com 95% ou mais do texto igual e o título mantido) e o Rafael autoriza | — |

## Arquivos

| Arquivo | Para quê |
|---|---|
| `diretrizes/guia-de-estilo-casa.md` | Como a casa escreve, inclusive a seção 16 (humanização) |
| `scripts/revisar_rascunho.js` | Revisor automático: roda no ExecuteWixAPI do Wix |
| `scripts/calibracao.py` | Mede o quanto o Rafael alterou cada artigo antes de publicar |
| `revisoes/` | Fontes, fichas de variação, pareceres, snapshots, diffs e `calibracao.csv` |

## Passo a passo da rotina (Fase 1)

### R1. Antes de escrever: aprender com a casa e com as correções

1. Ler `diretrizes/guia-de-estilo-casa.md` inteiro. Em conflito com a skill artigos-juridicos-seo,
   vale o guia.
2. Ler os **3 `revisoes/*.diff.md` mais recentes**: o que o Rafael mudou antes de publicar.
   **Não repetir o que ele corrigiu.**
3. Ler as **3 `revisoes/*.variacao.json` mais recentes** e montar a ficha do artigo novo com abertura,
   simulação e Box diferentes (guia, seção 16.8).

### R2. Durante a pesquisa: registrar as fontes

Para **cada** lei, súmula, tema, portaria, edital, instrução normativa, resolução ou número de
processo citado, guardar a URL **oficial** onde o texto foi conferido. Sem confirmação em fonte
oficial, **não citar**. A lista vai para `revisoes/<slug>.fontes.json`:

```json
[
  { "citacao": "Lei 7.713/1988", "url": "https://www.planalto.gov.br/ccivil_03/leis/l7713.htm" },
  { "citacao": "Súmula 598/STJ", "url": "https://scon.stj.jus.br/SCON/sumstj/" }
]
```

### R3. Depois de criar o rascunho: rodar o revisor

1. Ler `scripts/revisar_rascunho.js` e passar o arquivo **inteiro** como `code` do **ExecuteWixAPI**
   (siteId `333aa652-3f67-4300-9a63-f40b6407ce15`), mudando só o `CONFIG`: `modo "revisar"`,
   `origem "rascunho"`, `postId`, `palavraChave` (exata), `autor` (`"rafael"` ou `"fernanda"`),
   `frente` (`"I"` a `"VIII"`) e `fontes` (lista do R2). `compararRecentes: 8` liga a checagem de
   repetição contra os 8 últimos posts publicados.
2. A resposta traz `status` (APROVADO, APROVADO_COM_AVISOS ou REPROVADO), `nota`, `bloqueios`,
   `avisos` e `estatisticas`.
3. **REPROVADO:** corrigir cada bloqueio (PATCH `/blog/v3/draft-posts/{id}` sem `action`) e rodar de
   novo, até 2 rodadas. Se sobrar bloqueio, deixar o rascunho e destacar no relatório
   "⚠️ REPROVADO NA REVISÃO AUTOMÁTICA".
4. **Avisos H1 a H7 (humanização):** reescrever os trechos apontados e rodar de novo.
5. Gravar o JSON final em `revisoes/<slug>.revisao.json`.

### R4. Guardar o "antes" para a calibração

Rodar o revisor com `modo "snapshot_rascunho"` e gravar o `markdown` em `revisoes/<slug>.rascunho.md`.

### R5. Calibração (SEMPRE, mesmo sem artigo novo)

Para cada `revisoes/<slug>.revisao.json` sem o `revisoes/<slug>.publicado.md` correspondente:

1. Rodar o revisor com `modo "snapshot_publicado"` e o `postId` do arquivo.
2. Se vier `publicado: false`, o Rafael ainda não publicou: pular.
3. Se vier `markdown`, gravar `revisoes/<slug>.publicado.md` e rodar
   `python3 scripts/calibracao.py comparar --rascunho revisoes/<slug>.rascunho.md --publicado revisoes/<slug>.publicado.md --slug <slug> --csv revisoes/calibracao.csv --status-revisor <status>`.
   Isso também grava `revisoes/<slug>.diff.md`, que as próximas execuções leem no R1.
4. No fim, rodar `python3 scripts/calibracao.py status --csv revisoes/calibracao.csv`.

### R6. Relatório

Status, nota, rodadas de correção, bloqueios restantes, avisos, citações conferidas, palavras repetidas
de artigos recentes (H7), artigos calibrados nesta rodada e a linha de status da calibração.

## O que o revisor confere

**Bloqueiam (REPROVADO):**

- **Assinatura:** do autor certo, com a OAB.
- **Palavra-chave exata:** no título, no 1º parágrafo e em um H2 ou H3.
- **Sumário:** um único sumário nativo antes do 1º H2, sem título manual antes dele.
- **Seções obrigatórias:** Box do Especialista, Perguntas Frequentes (4 ou mais perguntas em H3,
  terminadas em "?") e Conclusão como último H2.
- **Simulação:** rotulada como hipotética ou ilustrativa.
- **Subtítulos:** nenhum repetido ou vazio.
- **CTA:** um único botão de WhatsApp com a mensagem do artigo, nenhum outro link de WhatsApp e a
  tagline final exata.
- **Link de serviço:** link para a página de serviço da frente, e nenhum índice manual com âncoras.
- **Formatação:** H2 em negrito e perguntas do FAQ em negrito, itálico e 20px.
- **Tamanho:** pelo menos 1.200 palavras.
- **OAB:** nenhuma expressão vedada (lista negra).
- **Digitação:** nenhum erro de digitação conhecido.
- **Fontes:** toda citação jurídica com fonte e URL.
- **SEO:** title tag com até 60 caracteres e a palavra-chave; meta com até 156 caracteres e a
  palavra-chave; palavra-chave principal configurada; JSON-LD Article com o autor; sem noindex.

**Avisos:**

- **Estrutura e SEO:** palavra-chave 4 ou mais vezes; 7 a 14 H2; seção sobre o papel do advogado;
  simulação; Box abrindo com "Por <autor>"; chamada em negrito antes do botão; 2 a 8 links internos;
  links externos só oficiais; parágrafos justificados; imagem no topo; capa do post; 1.500 a 3.300
  palavras; "honorários"; espaços duplos; fontes oficiais; Open Graph; slug; excerpt.
- **Humanização:**
  - **H1:** no máximo 3 vícios de texto de IA.
  - **H2:** até 10 travessões.
  - **H3:** ritmo variado (variação do tamanho das frases de 0,45 ou mais e 3 ou mais frases curtas).
  - **H4:** no máximo 3 fórmulas da casa.
  - **H5:** subtítulos diferentes dos 8 últimos artigos.
  - **H6:** abertura diferente das recentes.
  - **H7:** no máximo 60 palavras em trechos iguais aos de artigos recentes.

Na calibração com os 30 últimos artigos publicados, o H7 encontrou artigos com até **895 palavras**
copiadas de artigos anteriores (Espondiloartrose) e 504 (Hepatopatia).

## Fase 2 — publicação agendada com janela de veto (ainda NÃO ativa)

Só ligar quando as duas condições forem verdadeiras:

1. `calibracao.py status` responde "PRONTO PARA A FASE 2".
2. O Rafael autorizou expressamente.

Quando ligada, depois do R3 a rotina:

1. Só segue com **APROVADO** ou **APROVADO_COM_AVISOS**, sem avisos de humanização pendentes, e com
   a capa definida (aviso F5 resolvido). Desde 09/11/2026 a rotina envia a capa ao Wix e a define como
   imagem de capa do post (`rotinas/redator.md`, passo P7). O endereço `upload.wixmp.com` foi
   liberado na rede do ambiente Default para isso.
2. Agenda a publicação para **48h depois, às 9h (horário de Brasília)**:
   `PATCH https://www.wixapis.com/blog/v3/draft-posts/{id}` com
   `{ "draftPost": { "id": "<id>", "memberId": "<memberId>" }, "action": "UPDATE_SCHEDULE", "scheduledPublishDate": "<data ISO>" }`
   (ação e campo confirmados no schema do Wix em 09/11/2026).
3. Avisa o Rafael com o título, o link do rascunho e a data agendada.
4. **Veto:** no painel do Wix (Blog → Agendados), ou numa sessão do Claude com
   `"action": "UPDATE_CANCEL_SCHEDULE"`.
5. A calibração continua: se a média dos últimos 6 cair abaixo de 95%, a rotina volta à Fase 1 e avisa.
