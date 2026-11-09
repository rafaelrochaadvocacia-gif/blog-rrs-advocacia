# Revisão Automática dos Artigos — Fase 1 e Fase 2

Procedimento que as rotinas agendadas do blog seguem **depois de criar o rascunho no Wix**.
Objetivo: o Rafael ter o mínimo de trabalho de revisão, até chegar à publicação automática.

| | Fase 1 (ATIVA desde 09/11/2026) | Fase 2 (ainda não ativa) |
|---|---|---|
| O que a rotina faz | Cria o rascunho, roda o revisor automático, corrige o que ele apontar e deixa o rascunho pronto | O mesmo e, se o revisor aprovar, **agenda a publicação** para 48h depois |
| O que o Rafael faz | Abre o rascunho, ajusta o que quiser e publica | Só olha se quiser. Para vetar, cancela o agendamento |
| Como medimos | Calibração: compara o rascunho entregue com o que foi publicado | Continua medindo |
| Quando muda de fase | `calibracao.py status` diz **PRONTO PARA A FASE 2** (6 artigos seguidos publicados com 95% ou mais do texto igual e o título mantido) e o Rafael autoriza | — |

## Arquivos (pasta de trabalho das rotinas: `Logo final/capas-blog/`)

Cópias destes arquivos do repositório `blog-rrs-advocacia` precisam estar na pasta de trabalho:

| Na pasta de trabalho | No repositório | Para quê |
|---|---|---|
| `guia-de-estilo-casa.md` | `diretrizes/guia-de-estilo-casa.md` | Como a casa escreve (ler antes de escrever) |
| `revisao-automatica.md` | `diretrizes/revisao-automatica.md` | Este procedimento |
| `revisar_rascunho.js` | `scripts/revisar_rascunho.js` | Revisor automático (roda no ExecuteWixAPI) |
| `calibracao.py` | `scripts/calibracao.py` | Mede o quanto o Rafael alterou cada artigo |
| `revisoes/` (subpasta) | — | Pareceres, snapshots, diffs e a planilha `calibracao.csv` |

Se `revisar_rascunho.js` não estiver na pasta, a rotina **não pula a revisão**: faz a conferência
manualmente pela lista da seção "O que o revisor confere" e avisa no relatório que o arquivo está
faltando.

## Passo a passo da rotina (Fase 1)

### R1. Antes de escrever: aprender com a casa e com as correções

1. Ler `guia-de-estilo-casa.md`. Em caso de conflito com a skill `artigos-juridicos-seo`, vale o guia.
2. Ler os **3 arquivos `revisoes/*.diff.md` mais recentes**, se houver. Eles mostram o que o Rafael
   mudou nos últimos artigos antes de publicar. **Não repita o que ele corrigiu.**

### R2. Durante a pesquisa: registrar as fontes

Para **cada** lei, súmula, tema, portaria, edital, instrução normativa, resolução ou número de
processo que for citar, guarde a URL **oficial** onde conferiu o texto (planalto.gov.br, stj.jus.br,
stf.jus.br, gov.br, in.gov.br, cnj.jus.br...). Se não conseguir confirmar numa fonte oficial,
**não cite**. Salve a lista em `revisoes/<slug>.fontes.json`:

```json
[
  { "citacao": "Lei 7.713/1988", "url": "https://www.planalto.gov.br/ccivil_03/leis/l7713.htm" },
  { "citacao": "Súmula 598/STJ", "url": "https://scon.stj.jus.br/SCON/sumstj/" }
]
```

### R3. Depois de criar o rascunho: rodar o revisor

1. Leia `revisar_rascunho.js` e passe o arquivo **inteiro** como `code` do **ExecuteWixAPI**
   (siteId `333aa652-3f67-4300-9a63-f40b6407ce15`). Altere só o bloco `CONFIG`:
   - `modo: "revisar"`, `origem: "rascunho"`
   - `postId`: id do rascunho criado
   - `palavraChave`: a PALAVRA-CHAVE da pauta, exata
   - `autor`: `"rafael"` ou `"fernanda"` (ver guia, seção 2)
   - `frente`: o numeral romano da FRENTE da pauta (`"I"` a `"VIII"`)
   - `fontes`: a lista do passo R2
2. O revisor devolve `status` (APROVADO, APROVADO_COM_AVISOS ou REPROVADO), `nota`, `bloqueios`
   e `avisos`.
3. **Se REPROVADO:** corrija cada bloqueio no rascunho (PATCH `/blog/v3/draft-posts/{id}`, sem
   `action`, para continuar rascunho) e rode o revisor de novo. Faça **no máximo 2 rodadas de
   correção**. Se ainda houver bloqueio, deixe o rascunho como está e destaque no relatório
   "⚠️ REPROVADO NA REVISÃO AUTOMÁTICA", com os bloqueios restantes.
4. **Avisos** não impedem nada: corrija os que forem simples e liste os demais no relatório.
5. Grave o resultado final em `revisoes/<slug>.revisao.json`, incluindo o `postId`.

### R4. Guardar o "antes" para a calibração

Rode o mesmo `revisar_rascunho.js` com `modo: "snapshot_rascunho"` e salve o campo `markdown`
da resposta em `revisoes/<slug>.rascunho.md`. Esse é o texto exatamente como a rotina entregou,
e será comparado com o que for publicado.

### R5. Calibração (rodar SEMPRE, junto com o passo de arquivar capas)

Para cada `revisoes/<slug>.revisao.json` que **ainda não tem** `revisoes/<slug>.publicado.md`:

1. Rode `revisar_rascunho.js` com `modo: "snapshot_publicado"` e o `postId` do arquivo.
2. Se a resposta trouxer `publicado: false`, o Rafael ainda não publicou: pule esse artigo.
3. Se vier o `markdown`, salve em `revisoes/<slug>.publicado.md` e rode:
   ```
   python3 calibracao.py comparar --rascunho revisoes/<slug>.rascunho.md --publicado revisoes/<slug>.publicado.md --slug <slug> --csv revisoes/calibracao.csv --status-revisor <status do revisao.json>
   ```
4. No fim, rode `python3 calibracao.py status --csv revisoes/calibracao.csv` e copie a última
   linha para o relatório.

### R6. Relatório (acrescentar ao relatório que a rotina já faz)

- **Revisão automática:** status, nota, número de rodadas de correção, bloqueios restantes (se
  houver) e os avisos.
- **Fontes:** quantas citações jurídicas foram conferidas.
- **Calibração:** artigos comparados nesta rodada (slug e semelhança) e a linha de status
  (por exemplo, "FASE 1: 3 de 6 artigos seguidos publicados sem ajuste relevante").

## O que o revisor confere

**Bloqueiam (REPROVADO):**

- **Assinatura:** do autor certo, com a OAB.
- **Palavra-chave exata:** no título, no 1º parágrafo e em um H2 ou H3.
- **Sumário:** um único sumário nativo antes do 1º H2, sem título manual antes dele.
- **Seções obrigatórias:** Box do Especialista, Perguntas Frequentes (4 ou mais perguntas em H3,
  terminadas em "?") e Conclusão como último H2.
- **Simulação:** rotulada como hipotética ou ilustrativa.
- **Subtítulos:** nenhum repetido ou vazio.
- **CTA:** um único botão "Falar com um(a) Especialista no WhatsApp", com a mensagem do artigo, e
  nenhum outro link de WhatsApp. Tagline final exata.
- **Link de serviço:** link para a página de serviço da frente, e nenhum índice manual com âncoras.
- **Formatação:** H2 em negrito e perguntas do FAQ em negrito, itálico e 20px.
- **Tamanho:** pelo menos 1.200 palavras.
- **OAB:** nenhuma expressão vedada (lista negra).
- **Digitação:** nenhum erro de digitação conhecido.
- **Fontes:** toda citação jurídica com fonte e URL.
- **SEO:** title tag com até 60 caracteres e a palavra-chave; meta com até 156 caracteres e a
  palavra-chave; palavra-chave principal configurada; JSON-LD Article com o autor; sem noindex.

**Avisos:**

- **Palavra-chave e estrutura:** palavra-chave 4 ou mais vezes; 7 a 14 H2; seção "Por Que Contar";
  seção de simulação; Box abrindo com "Por <autor>"; chamada em negrito antes do botão.
- **Links:** 2 a 8 links internos; links externos só oficiais.
- **Formatação:** parágrafos justificados; imagem no topo com alt; capa do post definida.
- **Texto:** 1.500 a 3.300 palavras; menção a "honorários"; espaços duplos.
- **Fontes e SEO:** fontes em domínio oficial; Open Graph; slug; excerpt.

## Fase 2 — publicação agendada com janela de veto (ainda NÃO ativa)

Só ligar quando as duas condições forem verdadeiras:

1. `calibracao.py status` responde "PRONTO PARA A FASE 2".
2. O Rafael autorizou expressamente.

Quando ligada, depois de R3 a rotina:

1. Só segue se o revisor der **APROVADO** ou **APROVADO_COM_AVISOS** e o aviso F5 (capa) estiver
   resolvido. **Pendência a resolver antes de ligar:** hoje a capa não é enviada por API (as rotinas
   registram que o upload corrompe a imagem). Na fase 2, a capa precisa ser definida pela própria
   rotina, ou o artigo vai ao ar sem imagem no feed.
2. Agenda a publicação para **48h depois, às 9h (horário de Brasília)**:
   `PATCH https://www.wixapis.com/blog/v3/draft-posts/{id}` com
   `{ "draftPost": { "id": "<id>", "memberId": "<memberId>" }, "action": "UPDATE_SCHEDULE", "scheduledPublishDate": "<data ISO>" }`
   (ação e campo confirmados no schema do Wix em 09/11/2026).
3. Avisa o Rafael (relatório e notificação) com o título, o link do rascunho e a data agendada.
4. **Veto:** se o Rafael não quiser publicar, ele cancela no painel do Wix (Blog → Agendados), ou
   uma sessão do Claude faz `PATCH` com `"action": "UPDATE_CANCEL_SCHEDULE"`.
5. A calibração continua: se a semelhança média dos últimos 6 cair abaixo de 95%, a rotina volta
   sozinha à Fase 1 e avisa.
