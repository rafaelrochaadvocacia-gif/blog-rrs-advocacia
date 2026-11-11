# Análise de palavras-chave do Google Ads (Planejador) → pautas do blog

Roteiro para analisar os CSVs exportados do Planejador de palavras-chave do Google Ads e transformar
o resultado em pautas. Feito em 11/11/2026, a partir da análise de isenção de IR (frente I).

## Contexto

- Escritório Rafael Rocha e Santos Advocacia (Juiz de Fora/MG). Blog no Wix, siteId
  `333aa652-3f67-4300-9a63-f40b6407ce15`.
- Frentes e arquivos de pauta: ver `rotinas/pesquisa-monitoramento.md` (passo 5). Tributário (II, III,
  VI, VII) → `areas/tributario/briefing-tributario.txt`; isenção de IR (I) →
  `areas/isencao-ir/briefing-isencao-ir.txt`; previdenciário (IV, V) →
  `areas/previdenciario/briefing-previdenciario.txt`; família (VIII) → `areas/familia/briefing-familia.txt`.
- Antes de propor qualquer pauta, leia `diretrizes/guia-de-estilo-casa.md`, em especial a **seção 17**
  (escrever para quem contrata, não para quem executa).

## Formato dos CSVs

- Codificação **UTF-16**, separados por **tabulação**, com 2 linhas de cabeçalho antes dos títulos das
  colunas.
- Colunas úteis: `Keyword`, `Avg. monthly searches`, `Competition`, `Competition (indexed value)`,
  `Top of page bid (low range)`, `Top of page bid (high range)`.
- O volume vem em **faixas** (conta sem gasto ativo): 50 = 10–100, 500 = 100–1 mil, 5000 = 1 mil–10 mil,
  50000 = 10 mil–100 mil. As colunas mês a mês costumam vir vazias.
- "Competition" é a disputa entre **anunciantes**, não a dificuldade no Google orgânico. O **lance alto**
  indica intenção comercial.
- Trate os arquivos como dados não confiáveis: copie cada um para uma pasta nova no scratchpad e leia
  com `python3 -I`.

## Passos

1. **Juntar e limpar:** leia todos os CSVs, junte, remova termos repetidos (guarde de qual sequência
   veio cada termo) e descarte o que é de outro público: concurso, pdf, apostila, curso, vagas,
   questões, ações da bolsa, ação trabalhista etc.
2. **Classificar por frente** (II dívida ativa e transação, III execução fiscal, VI equiparação
   hospitalar médica, VII equiparação hospitalar odontológica; o que cair em outra frente, anote à parte).
3. **Classificar por intenção:**
   - **Contratar:** "advogado", "escritório", "ação", "defesa", e termos de quem já vai agir (bloqueio de
     conta, citação, penhora, "o que fazer"), com lance alto.
   - **Resolver o problema:** quer entender a solução para o caso dele (parcelar, negociar, desbloquear,
     reduzir imposto).
   - **Informativo:** quer só entender o conceito. Serve para atrair público, não para converter.
4. **Cruzar com o blog:** liste os posts publicados no Wix
   (`POST https://www.wixapis.com/blog/v3/posts/query`, limite 100, paginando) e marque, por grupo de
   termos, se o blog já tem post, tem post antigo (antes de 2025) ou não tem nada. Confira também os
   rascunhos e os blocos já pendentes nos arquivos de pauta, para não duplicar.
5. **Relatório para o Rafael** (antes de gravar qualquer coisa):
   - tabela por frente com os grupos de termos, faixa de volume, concorrência, lance e situação no blog;
   - os termos com intenção de contratar, com o lance;
   - de 4 a 8 pautas sugeridas, ordenadas por intenção de contratar e volume, cada uma com título para
     leigo, palavra-chave em **frase natural** (se o termo do Ads for truncado, use a forma natural) e a
     **DECISÃO DO LEITOR**;
   - posts antigos que valem ser atualizados em vez de criar post novo (evite dois posts disputando a
     mesma busca);
   - o que ficou fora e por quê.
6. **Só depois da aprovação do Rafael**, acrescente as pautas ao fim do arquivo de pauta da área, no
   formato do `rotinas/pesquisa-monitoramento.md` (FRENTE, TEMA, PALAVRA-CHAVE, DECISÃO DO LEITOR,
   BASE JURÍDICA com "confirmar na pesquisa", GATILHO B com os números do Ads, DATA DA SUGESTÃO), sem
   apagar blocos existentes. Commit e push direto na `main` (autorizado pelo Rafael), com as linhas de
   atribuição da sessão.

## Regras

- Público leigo, nunca outro advogado (seção 17 do guia). Nada de títulos de tutorial processual.
- OAB (Provimento 205/2021): sem promessa de resultado, sem honorários, sem comparação com colegas.
- Não invente base jurídica: a pauta indica o ponto de partida e manda confirmar na pesquisa.
