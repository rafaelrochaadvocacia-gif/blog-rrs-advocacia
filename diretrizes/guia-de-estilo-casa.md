# Guia de Estilo da Casa — Blog RRS Advocacia

Curadoria feita em **09/11/2026** a partir dos **30 últimos artigos publicados** no blog
(de 10/07/2026 a 16/10/2026: 11 de isenção de IR, 9 tributários, 6 previdenciários e 4 de família).
Os 15 mais recentes (setembro e outubro de 2026) foram usados como **padrão atual**, porque já
seguem as regras de sumário nativo, botão de WhatsApp e FAQ formatado.

**Para quem é este arquivo:** para as rotinas agendadas que redigem os artigos e para
quem revisar um artigo. Ele descreve como o escritório *de fato* escreve, com números e trechos
reais, e é a base do revisor automático (`scripts/revisar_rascunho.js`).

**Precedência:** quando este guia e a skill `artigos-juridicos-seo` divergirem, **vale este guia**
(ele reflete os artigos publicados mais recentes). As divergências conhecidas estão na seção 2.

**Manutenção:** refazer a curadoria **uma vez por mês** (ver seção 15).

> **Leia junto a seção 16 (Humanização).** Este guia descreve a *identidade* da casa, não um
> molde para preencher. A estrutura e o tom são fixos; as palavras, as aberturas, os formatos e os
> títulos devem mudar de um artigo para outro. Artigo que parece copiado do anterior soa como robô.

---

## 1. O artigo da casa em números

| Medida (15 artigos mais recentes) | Valor típico | Faixa observada |
|---|---|---|
| Palavras | **~2.500** | 1.860 a 3.070 |
| Tempo de leitura (Wix) | **9 min** | 7 a 12 min |
| Seções H2 | **10 a 12** | 8 a 12 |
| Perguntas no FAQ (H3) | **6** | 4 a 7 |
| Resposta de cada pergunta do FAQ | **~35 palavras** | 1 a 3 frases |
| Parágrafo comum | **~48 palavras** | raramente passa de 80 |
| Frase | **~18 palavras** | raramente passa de 37 |
| Título (H1) | **~100 caracteres** | com dois-pontos em 28 de 30 e "(2026)" em 25 de 30 |
| Title tag (SEO) | **~53 caracteres** | máximo 60 |

Frequência de marcas da casa nos 15 mais recentes:

- "Juiz de Fora" e "todo o Brasil": **15 de 15**.
- "sem compromisso" no fechamento: **15 de 15**.
- Simulação rotulada como **hipotética**: **15 de 15**.
- "análise individual": **14 de 15**.
- "Na prática": **12 de 15**.
- "A boa notícia é que...": **10 de 15**.
- "Este artigo (ou guia) foi escrito para...": **12 de 15**.
- Tabela na simulação ou em um comparativo: **9 de 15**.

## 2. Autoria — quem assina (prática real)

| Área / frente | Assina | Assinatura no topo (1ª linha do corpo, em itálico) |
|---|---|---|
| I - Isenção de IR por doença grave | **Rafael Rocha** | `Por Dr. Rafael Rocha, Advogado especialista em isenção de Imposto de Renda – OAB/MG 193.958.` |
| II, III, VI, VII - Tributário | **Rafael Rocha** | `Por Dr. Rafael Rocha, Advogado Tributarista – OAB/MG 193.958.` |
| IV, V - Previdenciário (BPC, auxílios, aposentadoria) | **Fernanda** | `Por Dra. Fernanda A. Santos Rocha, Advogada Previdenciarista – OAB/MG 199.347.` |
| VIII - Divórcio e família | **Fernanda** | `Por Dra. Fernanda A. Santos Rocha, Advogada de Direito de Família – OAB/MG 199.347.` |

Divergências com a skill `artigos-juridicos-seo` (vale a tabela acima):

- A skill manda a Fernanda assinar isenção de IR. **Na prática, todos os 11 artigos de isenção
  de IR são do Rafael**, e a rotina de sexta já assina como Rafael.
- A skill põe família na conta do Rafael. **Na prática, todos os 4 de família são da Fernanda**,
  e a página de serviço de divórcio é dela.
- Nos artigos publicados, o nome da Fernanda aparece de três jeitos ("Fernanda Santos",
  "Fernanda A. Santos Rocha" e com ou sem "Rocha"). **Padronize em "Dra. Fernanda A. Santos Rocha"**.
- **Regra do Rafael (09/11/2026):** toda menção aos advogados leva o título: "Dr. Rafael Rocha" e
  "Dra. Fernanda A. Santos Rocha", na assinatura do topo, na primeira linha do Box do Especialista e
  em qualquer outro ponto do texto. O nome do escritório ("Rafael Rocha e Santos Advocacia") não leva
  título. O revisor automático bloqueia (A2) menção sem Dr./Dra.

## 3. Esqueleto (a ordem é fixa; os títulos abaixo são só exemplos, redija os seus)

```
[Imagem de capa no topo do corpo — alt text = palavra-chave]
_Por Dr./Dra. <autor>, <qualificação> – OAB/MG <número>._          ← assinatura, em itálico
Parágrafo 1: pergunta-dor + "A boa notícia é que..." com a palavra-chave exata
Parágrafo 2: "Este artigo foi escrito para <persona>..." + o que o texto cobre
[Sumário nativo do Wix — nó TOC — SEM nenhum título antes dele]
## <Tema>: O Que Diz a Lei / O Que É <tema>           ← definição + base legal
## Quem Tem Direito / Requisitos                       ← listas curtas
## <1 a 3 H2 específicos do tema>                     ← o ângulo da pauta, a novidade, o detalhe técnico
## Quanto Você Pode <Recuperar/Economizar>? Uma Simulação Hipotética
## Como Funciona o Processo na Prática                 ← passo a passo
## Box do Especialista: O Que Só Quem Vive o Dia a Dia <do Tribunal / do INSS / da PGFN> Sabe
## Por Que Contar com um(a) Advogado(a) Especialista em <tema>
## Perguntas Frequentes (sobre <tema>)                ← 5 a 7 perguntas em H3
## Conclusão: <frase que recapitula o ganho e a urgência legítima>
**Fale agora com um especialista e entenda os próximos passos do seu caso, sem compromisso.**
[Botão nativo: "Falar com um Especialista no WhatsApp"]
Escritório Rafael Rocha e Santos Advocacia. Seu Direito. Nossa Luta!
```

Regras de forma que o revisor automático **bloqueia** se faltarem:

- Assinatura do autor certo no topo.
- Um único Sumário nativo antes do 1º H2, sem título manual ("O que você vai ver nesse artigo")
  antes dele. **12 dos 15 artigos recentes têm esse título manual, quase sempre com erro de
  digitação ("vocçe", "bai encontrar"). Não use.**
- Box do Especialista, Perguntas Frequentes e Conclusão (como último H2).
- FAQ com 4 ou mais perguntas em H3, terminadas em "?".
- Nenhum subtítulo repetido (um artigo de julho saiu com "Como Funciona o Processo na Prática"
  duas vezes).
- Um único botão de WhatsApp e nenhum link de WhatsApp no texto.
- A tagline como último bloco, em texto simples, sem `######`.

## 4. Abertura — dor, alívio e para quem é

A lógica é sempre a mesma: **a dor do leitor**, depois **o alívio** (existe um caminho) e, por fim,
**para quem é o texto e o que ele cobre**. A palavra-chave exata precisa aparecer no 1º parágrafo.
21 dos 30 artigos abriram com uma pergunta e 22 usaram "A boa notícia é que...". Funciona, mas virou
fórmula: **alterne o tipo de abertura** (cardápio na seção 16).

Trechos-modelo (reais):

> A PGFN avaliou a capacidade de pagamento da sua empresa e o resultado não bate com a realidade
> do seu caixa? Se a nota recebida (a chamada CAPAG) está acima do que o seu negócio realmente
> consegue pagar, você pode estar diante de uma proposta de negociação com menos desconto e
> parcelas mais pesadas do que a lei permitiria.

> O INSS negou o seu auxílio-acidente com justificativa de sequela fora da lista, dizendo que a
> lesão que você carrega depois do acidente "não está prevista no Anexo III"? Se isso aconteceu
> com você, saiba que não está sozinho — e que essa resposta, por si só, não encerra a discussão.

> Quando a empresa é o maior patrimônio da família, o divórcio costuma trazer uma pergunta que
> pesa no peito: o que vai acontecer com o negócio que construímos — e com o sustento de todos?

Segundo parágrafo, sempre com a persona nomeada:

> Este artigo foi escrito para empresas, microempresários e profissionais autônomos com dívida
> ativa da União, e explica o que é a CAPAG, como ela define o desconto, quais documentos a PGFN
> exige e o que fazer agora...

Na área da saúde (isenção de IR e previdenciário), inclua uma frase de acolhimento:

> Sabemos que, logo depois do diagnóstico, a última coisa em que alguém quer pensar é em papelada,
> perícia e prazos.

## 5. Corpo — como cada seção é escrita

- **H2 em forma de pergunta ou de promessa clara**, com a dúvida do leitor:
  "Doença Controlada com Remédio? Você Não Perde o Direito",
  "O Que Você Abre Mão ao Aderir (e Por Que Isso Importa)",
  "Diagnóstico Não É Incapacidade: O Ponto Que Mais Gera Negativas".
  Capitalização de título (iniciais maiúsculas) e **negrito** em todo H2.
- **A palavra-chave exata em pelo menos um H2**, de preferência no 1º ou no 2º.
- **Lei citada pelo número e logo traduzida.** O padrão é citar e explicar na frase seguinte:
  "Em linguagem clara: ...", "Em outras palavras: ...", "Na prática, ...".
- **Listas curtas** (3 a 6 itens) para requisitos, documentos e erros comuns. No passo a passo
  do tributário, o recurso "_Onde o especialista ajuda:_ ..." ao fim de cada etapa funcionou bem
  (artigo da CAPAG). Pode ser usado sempre que houver passo a passo.
- **Honestidade técnica explícita** quando algo depende do caso ou está em disputa:
  "Os percentuais do edital são tetos, não garantias", "a controvérsia aguarda definição pelo STJ",
  "depende do caso concreto e da prova médica".
- **Novidade com data:** quando a pauta nasce de norma ou decisão nova (gatilho A), diga a data e
  o número logo no início ("Desde **6 de agosto de 2026**, uma norma do próprio INSS...").
- **Links no corpo:** o da página de serviço da frente (obrigatório, com âncora descritiva) e mais
  1 a 3 links para posts do blog. Use links externos apenas para fontes oficiais (planalto.gov.br,
  stj.jus.br, stf.jus.br, gov.br).

## 6. Simulação hipotética

Presente em todos os 15 artigos recentes. Sempre:

1. Abre com o rótulo, em negrito: "Veja uma **situação hipotética, apenas para ilustrar**; valores
   reais variam conforme o caso e a análise individual."
2. Um personagem genérico com primeiro nome comum (João, Clara) ou "uma pequena empresa".
3. Números em **tabela** (Item | Valor estimado) ou em lista, com a linha final em negrito.
4. Fecha explicando o que o número mostra e reforçando que depende do caso.

Na isenção de IR, **calcule o imposto faixa a faixa** pela tabela progressiva vigente e diga a
alíquota efetiva. Nunca aplique 27,5% sobre o valor cheio.

## 7. Box do Especialista (o formato varia: ver seção 16)

- H2: "Box do Especialista: O Que Só Quem Vive o Dia a Dia **do Tribunal / do INSS / das Perícias /
  da Negociação com a PGFN** Sabe". Na família: "O Que a Prática no Direito de Família Ensina".
- 1ª linha, em itálico: `Por <autor>, OAB/MG <número> — Juiz de Fora e todo o Brasil.`
  (confira a grafia: um artigo saiu com "Atendiento" e outro sem o número da OAB).
- Em seguida, **3 dicas numeradas**, cada uma com uma frase-título em negrito e duas ou três frases
  de bastidor. Exemplo real:

> **1. O laudo que só traz o CID quase sempre perde força.** A perícia não avalia apenas "qual é a
> doença", mas "o que você deixou de conseguir fazer no trabalho".

## 8. "Por Que Contar com um(a) Advogado(a) Especialista"

Dois parágrafos: (1) os **riscos de fazer sozinho**, concretos e ligados ao tema (perder prazo,
laudo incompleto, aderir à modalidade errada); (2) o escritório: "atua com [link da página de
serviço], com atendimento presencial em Juiz de Fora e online para todo o Brasil", terminando com
"sem prometer resultados, porque cada situação depende da análise individual".

## 9. Perguntas Frequentes

- H2 "Perguntas Frequentes" ou "Perguntas Frequentes sobre <tema>".
- 5 a 7 perguntas em H3, **negrito + itálico + 20px**, escritas como o leitor perguntaria.
- Respostas de 1 a 3 frases (cerca de 35 palavras), que começam respondendo direto ("Sim, quando...",
  "Em regra, não.", "Depende do caso.") e depois qualificam.
- Pelo menos uma pergunta sobre prazo e uma sobre "preciso de advogado / de laudo / de contador?".

## 10. Conclusão, CTA e assinatura final

- H2 "Conclusão: <frase-tese>". Padrões que funcionam: "O Prazo Corre Todos os Dias",
  "Uma Negativa Não Encerra o Seu Direito", "A Janela se Fecha em <data>".
- Dois parágrafos: recapitula o direito e a urgência **legítima** (prazo legal real: prescrição,
  decadência, prazo de edital); depois, o primeiro passo de baixa fricção.
- Frase de chamada **em negrito**, logo antes do botão. Varie entre artigos (opções na seção 16).
  A mais usada é **"Fale agora com um especialista e entenda os próximos passos do seu caso, sem
  compromisso."**; na família, **"Converse com uma especialista em Direito de Família..."**.
- Um único **botão nativo** (nó BUTTON): "Falar com um Especialista no WhatsApp" (ou "com uma
  Especialista" nos artigos da Fernanda), apontando para
  `https://wa.me/5532998169291?text=Olá, estava lendo o artigo "<TÍTULO>" e gostaria de mais informações.`
  (com a codificação de URL).
- Último bloco, em texto simples: `Escritório Rafael Rocha e Santos Advocacia. Seu Direito. Nossa Luta!`

## 11. Tom e linguagem

- **"Você"**, direto, formal-acessível. Frases de ~18 palavras; parágrafos de ~48.
- **Autoridade serena:** afirma com base em lei e jurisprudência, sem adjetivos de autoelogio.
- **Empatia concreta** na saúde e na família; **objetividade financeira** no tributário (fluxo de
  caixa, parcela mensal, passivo).
- Expressões-assinatura (use com naturalidade, sem empilhar): "A boa notícia é que", "Em linguagem
  clara", "Na prática", "Um cuidado importante:", "cada caso depende da análise individual",
  "o prazo corre todos os dias" (só quando houver prazo real).
- **Linguagem de possibilidade**, nunca de garantia: "pode ter direito", "é possível pleitear",
  "em regra", "na maioria dos casos".

**Vedado** (o revisor reprova): "garantimos", "resultado garantido", "100% de chance", "você vai
ganhar", "o melhor escritório", "imbatível", "consulta gratuita", "aproveite agora", "garanta seu
direito", "tenha seu benefício aprovado", menção a honorários ou preço do escritório, comparação
com outros advogados e casos reais identificáveis.

## 12. Particularidades por frente

- **I - Isenção de IR:** o eixo é a **via judicial** (a administrativa aparece só como etapa
  preliminar ou contraponto). Use a Súmula 598/STJ (laudo oficial dispensável na Justiça), a
  Súmula 627/STJ (sem exigir sintomas atuais nem recidiva) e o Tema 1037/STJ (não alcança quem
  está na ativa) quando couber. Explique por que a nova faixa geral de isenção de 2026 não
  substitui o direito. Restituição dos últimos 5 anos com correção pela Selic.
- **II, III, VI e VII - Tributário:** público empresário. Mostre números de caixa (parcela
  mensal, desconto, passivo), prazos de edital e riscos (multa de 75% ou 150%, exclusão,
  certidão positiva). Separe com firmeza planejamento lícito de sonegação.
- **IV e V - Previdenciário:** o foco é a perícia e a prova funcional ("o que você deixou de
  conseguir fazer"). Use valores vigentes (salário mínimo, teto) e a prescrição quinquenal.
  No BPC, siga `diretrizes/diretrizes-bpc.txt`.
- **VIII - Família:** tom sóbrio, sem estimular litígio. O público tem patrimônio a proteger
  (quotas, imóveis, ITCD). Inclua um aviso de segurança quando o tema tocar em violência.
  Nunca ensine a ocultar bens.

## 13. SEO — padrões que estão funcionando

- **Palavra-chave exata** (frase da pauta) no título, no 1º parágrafo, em um H2, na title tag,
  na meta description e no slug. **Nos 30 artigos analisados, 7 títulos não traziam a palavra-chave
  exata, e 8 metas estavam fora do padrão (6 sem a palavra-chave exata e 2 acima de 156
  caracteres). O revisor agora bloqueia isso.**
- **Title tag** (até 60 caracteres): `<Palavra-chave> | 2026` ou `<Palavra-chave>: <ângulo> (2026)`.
  É diferente do H1, que é mais longo e conversacional.
- **Meta description** (130 a 156 caracteres): começa com a palavra-chave e dois-pontos, cita o
  benefício concreto e fecha com "Juiz de Fora e todo o Brasil" ou "Fale com um especialista".
- **Slug** = a palavra-chave exata **com acentos**, em minúsculas e com hífens:
  `isenção-de-imposto-de-renda-para-tuberculose-ativa`. É o formato que o Assistente de SEO do Wix
  exige (sem acentos, ele acusa "Adicione a palavra-chave de foco ao slug do URL"). Os posts publicados
  já usam slug acentuado.
- **Imagem dentro do artigo:** a capa entra também como imagem entre o título e a assinatura, com o
  texto alternativo igual à palavra-chave. Sem ela, o Assistente de SEO acusa "Adicione uma imagem ou
  vídeo" (prioridade alta). A "imagem de capa" do post, sozinha, só aparece no feed.
- **JSON-LD Article** com o autor certo (só 1 dos 30 publicados estava sem). O Wix gera sozinho os
  esquemas HowTo e FAQPage.

## 14. O que os 30 artigos ensinaram (erros a não repetir)

| Problema encontrado | Em quantos | Agora |
|---|---|---|
| Título manual antes do sumário ("O que você vai ver...") | 12 de 15 recentes | bloqueado |
| Erros de digitação ("vocçe", "bai", "Atendiento") | 6 | bloqueado |
| Palavra-chave exata ausente do título | 7 | bloqueado |
| Meta description sem a palavra-chave exata ou com mais de 156 caracteres | 8 | bloqueado |
| Sem JSON-LD Article | 1 | bloqueado |
| Subtítulo repetido | 1 | bloqueado |
| Tagline final ausente ou com formatação diferente | 6 formatos diferentes | padronizado |
| Box do Especialista sem número da OAB | 1 | aviso |

## 15. Como refazer esta curadoria (mensal)

1. Buscar os 30 posts mais recentes (Wix: `POST /blog/v3/posts/query`, ordenado por
   `firstPublishedDate` DESC, com `fieldsets` RICH_CONTENT e SEO, em lotes de 4 para não estourar a
   resposta).
2. Recalcular a tabela da seção 1 e as frequências.
3. Ler os diffs de calibração (`revisoes/*.diff.md`): **cada correção que o Rafael repetir em dois
   ou mais artigos vira uma regra nova** neste guia (e, se for verificável, no revisor).
4. Atualizar a data no topo e registrar abaixo o que mudou.

### Histórico

- **09/11/2026:** primeira curadoria (30 artigos, de 10/07 a 16/10/2026).
- **09/11/2026:** seção 16 (humanização) e verificações H1 a H7 no revisor.

## 16. Humanização — variar sem perder a identidade

O leitor (e o Google) percebe quando todos os artigos saem da mesma forma. A análise dos 30 artigos
mostrou o problema na prática: o artigo de **Espondiloartrose repete 895 palavras** em trechos
idênticos a artigos anteriores, e o de **Hepatopatia, 504**. Há aberturas iguais ("Você recebeu o
diagnóstico de..."), simulações com o mesmo texto e os mesmos subtítulos ("Como Funciona o Processo na
Prática", "Box do Especialista — o Que Só Quem Vive o Dia a Dia do Tribunal Sabe") em quase todos.

### 16.1 O que é fixo (identidade) e o que muda

| FIXO, nunca muda | MUDA a cada artigo |
|---|---|
| Ordem das seções do esqueleto (seção 3) | A redação de todos os subtítulos H2 |
| Assinatura do autor com OAB | O tipo de abertura (16.2) |
| Tom: você, autoridade serena, empatia, honestidade técnica | O formato da simulação (16.3) |
| Regras da OAB e linguagem de possibilidade | O formato do Box do Especialista (16.4) |
| Box, FAQ, Conclusão e o prefixo "Conclusão:" | O complemento dos títulos do Box e da Conclusão |
| Botão de WhatsApp e tagline final | A frase de chamada antes do botão (16.5) |
| Palavra-chave nos lugares de SEO | Quais fórmulas da casa aparecem (máx. 3) |

### 16.2 Cardápio de aberturas (escolha uma diferente dos 3 últimos artigos)

- **A1 Pergunta-dor:** "A PGFN avaliou a capacidade de pagamento da sua empresa e o resultado não bate com a realidade do seu caixa?"
- **A2 Cena concreta:** "A carta do INSS chegou numa terça-feira, com uma palavra só em destaque: indeferido."
- **A3 Novidade com data:** "Desde 6 de agosto de 2026, uma norma do próprio INSS diz, com todas as letras, que..."
- **A4 Frase que ouvimos no escritório:** "'Mas eu já estou curado, ainda tenho direito?' É uma das perguntas que mais ouvimos de quem..."
  (genérica, sem identificar ninguém).
- **A5 Mito × realidade:** "Muita gente acredita que a isenção acaba quando o tratamento termina. Não é bem assim."
- **A6 Número que chama atenção:** "Cinco anos. É o tempo que a lei dá para recuperar o imposto descontado indevidamente, e ele não para de correr."

O **alívio** também varia: "A boa notícia é que...", "Existe saída, e ela está na própria lei.",
"A resposta curta é: depende, mas em muitos casos, sim.", "A lei não deixa você sem resposta."
A **persona** pode vir como "Este artigo foi escrito para...", "Se você é <persona>, este texto é para
você." ou embutida na própria frase.

### 16.3 Formatos de simulação (sempre rotulada como hipotética)

- **S1 Tabela** item / valor, com linha final em negrito.
- **S2 História de um personagem** (João, Clara, "uma clínica de Juiz de Fora"), narrada em 2 ou 3 parágrafos.
- **S3 Dois cenários lado a lado** ("sem a isenção" × "com a isenção"; "CAPAG B" × "CAPAG D").
- **S4 Linha do tempo** (o que acontece no mês 1, no mês 6, no ano 5; ideal para prazos e prescrição).
- **S5 Conta faixa a faixa** (isenção de IR), em lista, com a alíquota efetiva no fim.

Nunca reaproveite o texto de explicação de uma simulação anterior. Mude os números, o personagem e as frases.

### 16.4 Formatos do Box do Especialista

O H2 sempre começa com "Box do Especialista:", e o complemento muda conforme o tema: "O Detalhe Que
Muda o Resultado na Perícia", "O Que a Fiscalização Costuma Olhar Primeiro", "Três Cuidados Antes de
Assinar a Transação". A primeira linha é sempre a assinatura do autor.

- **B1 Três dicas numeradas** (o formato atual).
- **B2 O erro que mais vemos**, em 2 parágrafos: o erro e como evitá-lo.
- **B3 Checklist curto** de 4 a 6 documentos ou providências, com uma frase de bastidor.
- **B4 Bastidor em um parágrafo** (algo que só quem atua vê) e uma dica final.

### 16.5 Chamadas antes do botão (em negrito; alterne)

1. "Fale agora com um especialista e entenda os próximos passos do seu caso, sem compromisso."
2. "Quer saber se isso se aplica ao seu caso? Converse com a nossa equipe, sem compromisso."
3. "Se ficou alguma dúvida sobre a sua situação, mande uma mensagem pelo WhatsApp e conte o seu caso."
4. "O primeiro passo é uma conversa. Fale com a nossa equipe e veja o caminho mais seguro para você."
5. Família: "Converse com uma especialista em Direito de Família, com discrição, sem compromisso."

### 16.6 Técnicas que deixam o texto com cara de gente

- **Ritmo:** misture frases longas com frases curtas. Uma frase de impacto de vez em quando. Assim.
  Pelo menos 3 frases de até 8 palavras por artigo.
- **Uma observação de prática por artigo**, em primeira pessoa do plural e sem identificar clientes:
  "No escritório, a dúvida que mais aparece é...", "Vemos com frequência laudos que...". Nada de
  "ganhamos todos os casos": a observação é sobre o problema, não sobre resultados.
- **Imperfeição controlada:** nem toda lista tem 3 itens, nem toda seção tem 3 parágrafos, nem todo
  H2 é uma pergunta. Quebre a simetria.
- **Exemplos do cotidiano** do leitor (o contracheque, a carta do INSS, o e-mail do contador) em vez de
  abstrações.
- **Fórmulas da casa com moderação:** no máximo 3 por artigo entre "A boa notícia é que", "Em
  linguagem clara", "Este artigo foi escrito para", "Na prática", "O prazo corre todos os dias" e "O
  que só quem vive o dia a dia... sabe". Prefira as que não apareceram nos 2 últimos artigos.

### 16.7 Vícios de texto de IA (evitar)

"É importante destacar", "Vale ressaltar", "Cabe salientar", "Além disso" abrindo parágrafo após
parágrafo, "Em suma", "Em resumo", "Neste contexto", "No cenário atual", "crucial", "fundamental"
repetido, "navegar", "jornada", "desvendar", "mergulhar", "robusto", "abrangente", "Não se trata apenas
de...", "de forma eficaz", "é essencial", "potencializar", "imprescindível". Também evite travessão (—)
em excesso, trios de adjetivos e frase final de seção que só repete o que acabou de ser dito.

### 16.8 Ficha de variação (a rotina preenche)

Antes de escrever, a rotina lê as fichas dos 3 últimos artigos (`revisoes/*.variacao.json`) e escolhe
uma combinação **diferente em abertura, simulação e Box**, com chamada diferente da última. Depois grava
a ficha do artigo novo em `revisoes/<slug>.variacao.json`:

```json
{
  "data": "2026-11-13",
  "frente": "I",
  "abertura": "A4",
  "simulacao": "S3",
  "box": "B2",
  "chamada": 3,
  "formulas_da_casa": ["Na prática", "Em linguagem clara"],
  "titulo_box": "Box do Especialista: O Detalhe Que Muda o Resultado na Perícia",
  "titulo_conclusao": "Conclusão: Curado Não Quer Dizer Sem Direito"
}
```

O revisor automático confere o resultado: vícios de IA (H1), travessões (H2), ritmo (H3), fórmulas
da casa (H4), subtítulos repetidos dos 8 últimos artigos (H5), abertura repetida (H6) e trechos
copiados de artigos recentes (H7, no máximo 60 palavras). São avisos, mas **a rotina deve reescrever os
trechos apontados** antes de entregar.
