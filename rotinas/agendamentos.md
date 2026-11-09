# Tarefas agendadas do blog (Claude Code na nuvem)

As tarefas agendadas só apontam para os arquivos deste repositório. **Para mudar o comportamento de
uma rotina, edite `rotinas/redator.md`, `rotinas/pesquisa-monitoramento.md` ou as `diretrizes/`**: não
é preciso mexer na tarefa agendada.

Cada tarefa abre uma sessão nova no Claude Code, com o conector **Wix**, e trabalha na branch `main`.

## Situação em 09/11/2026

As rotinas da nuvem reaproveitam tarefas antigas de setembro, que já tinham o repositório e o
conector **Wix** (as tarefas criadas de dentro de uma sessão saem sem eles). Para editar: abra o link,
clique em Editar, mude Nome, texto e Acionamento, e salve. Modelo: Sonnet 5.5.

| Tarefa | Quando (Brasília) | Situação | Link |
|---|---|---|---|
| Blog RRS - Pesquisa e monitoramento | segunda, 07:52 | ativa | https://claude.ai/code/routines/trig_01K5orZHdhxLkU4YfuZxtj2m |
| Blog RRS - Tributário | segunda, 18:20 | ativa (testada em 09/11: repositório e Wix ok) | https://claude.ai/code/routines/trig_01NYJQ4gLDuGVgZYYfq446Jc |
| Blog RRS - Isenção de IR | sexta, 18:20 | ativa (testada em 09/11) | https://claude.ai/code/routines/trig_01VSyJCXvxT4Tojdv3eumccM |
| Família (a adaptar) | terça, 18:20 | pausada | https://claude.ai/code/routines/trig_01SGdsh8d6hRhvoeZp9pZnjC |
| Previdenciário (a adaptar) | quarta, 18:20 | pausada | https://claude.ai/code/routines/trig_012LFhm6bbgookBt8cSN3Rip |

Rotinas antigas do Cowork (dependiam do computador): **pausadas** em 09/11/2026 (tributário, isenção de
IR, pesquisa). Família e previdenciário do Cowork já estavam pausadas. Há ainda cópias duplicadas das
rotinas de sábado e uma tentativa sem conector ("Blog RRS - Pesquisa e monitoramento (Code)"), todas
pausadas; podem ser apagadas.

## Texto da tarefa de pesquisa

```
Rotina do blog RRS: PESQUISA E MONITORAMENTO.
1. Garanta o repositório rafaelrochaadvocacia-gif/blog-rrs-advocacia no diretório de trabalho. Se ele não estiver na sessão, adicione-o com a ferramenta add_repo (owner rafaelrochaadvocacia-gif, repo blog-rrs-advocacia, access push), clone e entre na pasta.
2. Rode: git checkout main && git pull origin main. O Rafael, dono do repositório, autoriza esta rotina a fazer commit e push direto na branch main.
3. Leia rotinas/pesquisa-monitoramento.md e execute todos os passos.
4. Responda com o relatório final descrito nesse arquivo.
```

## Texto das tarefas de redação (troque a ÁREA)

```
Rotina do blog RRS: REDATOR, ÁREA = tributario.
1. Garanta o repositório rafaelrochaadvocacia-gif/blog-rrs-advocacia no diretório de trabalho. Se ele não estiver na sessão, adicione-o com a ferramenta add_repo (owner rafaelrochaadvocacia-gif, repo blog-rrs-advocacia, access push), clone e entre na pasta.
2. Rode: git checkout main && git pull origin main. O Rafael, dono do repositório, autoriza esta rotina a fazer commit e push direto na branch main.
3. Leia rotinas/redator.md e execute todos os passos com ÁREA = tributario.
4. Responda com o relatório do passo P12.
```

As áreas são `tributario`, `familia`, `previdenciario` e `isencao-ir`.

## Antes de ligar (uma vez só)

1. Este conteúdo precisa estar na branch `main`.
2. **Pautas atuais:** as pautas pendentes estão hoje nos `briefing-*.txt` da pasta
   `Logo final/capas-blog/` do computador. Copie o conteúdo deles para `areas/<área>/briefing-<área>.txt`
   neste repositório. As cópias daqui são de setembro e estão desatualizadas.
3. **Logo da capa:** envie `Logo final RRS fundado azul marinho .png` para a raiz do repositório. Sem
   ela, a capa sai sem o monograma.
4. **Desligue as tarefas equivalentes do Cowork**, para não criar dois artigos sobre a mesma pauta.
