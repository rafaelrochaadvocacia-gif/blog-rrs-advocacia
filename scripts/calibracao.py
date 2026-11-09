#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
calibracao.py — mede quanto o Rafael alterou cada artigo antes de publicar.

É o termômetro da FASE 1 da automação do blog: a rotina cria o rascunho, o
revisor automático aprova, e o Rafael revisa e publica. Este script compara o
rascunho que a rotina entregou com o texto que foi ao ar e registra a
semelhança numa planilha (CSV). Quando os últimos artigos saírem praticamente
sem ajustes, o script avisa que o blog está pronto para a FASE 2 (publicação
agendada com janela de veto).

USO (chamado pelas rotinas, passo 5.2):

    # Compara um artigo e grava uma linha na planilha
    python3 calibracao.py comparar \
        --rascunho revisoes/<slug>.rascunho.md \
        --publicado revisoes/<slug>.publicado.md \
        --slug <slug> --csv revisoes/calibracao.csv \
        [--status-revisor APROVADO]

    # Diz se já dá para ir para a fase 2
    python3 calibracao.py status --csv revisoes/calibracao.csv

Os dois arquivos .md vêm do revisor automático (scripts/revisar_rascunho.js),
nos modos "snapshot_rascunho" (logo depois de criar o rascunho) e
"snapshot_publicado" (depois que o post foi publicado).

Além da linha no CSV, o modo "comparar" grava revisoes/<slug>.diff.md com
o que mudou, parágrafo a parágrafo. As rotinas leem esses diffs para aprender
com as correções do Rafael.

Só usa a biblioteca padrão do Python (funciona no Windows, Mac e Linux).
"""

import argparse
import csv
import datetime
import difflib
import os
import re
import sys

# Critério para liberar a fase 2 (ajustável).
LIMIAR_SEMELHANCA = 0.95   # 95% do texto igual = "sem ajuste relevante"
ARTIGOS_SEGUIDOS = 6       # quantos artigos seguidos precisam passar

CAMPOS = [
    "data",
    "slug",
    "semelhanca_pct",
    "paragrafos_rascunho",
    "paragrafos_alterados",
    "paragrafos_removidos",
    "paragrafos_novos",
    "titulo_mudou",
    "subtitulos_mudaram",
    "status_revisor",
]


def _utf8_stdout():
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass


def limpar(linha):
    """Tira a marcação de markdown e deixa só o texto."""
    t = re.sub(r"\[([^\]]*)\]\([^)]*\)", r"\1", linha)  # [texto](url) -> texto
    t = re.sub(r"(\*\*|__)", "", t)
    t = re.sub(r"(?<!\w)_(.+?)_(?!\w)", r"\1", t)
    t = re.sub(r"^\s*(#{1,6}|[-*]|\d+\.)\s+", "", t)
    t = re.sub(r"\s+", " ", t)
    return t.strip()


def ler_blocos(caminho):
    """Lê o .md e devolve [(tipo, texto)] — tipo: titulo, subtitulo ou paragrafo."""
    with open(caminho, encoding="utf-8") as f:
        bruto = f.read()
    blocos = []
    for parte in re.split(r"\n\s*\n", bruto):
        for linha in parte.split("\n"):
            linha = linha.strip()
            if not linha or re.match(r"^\[\[.*\]\]$", linha):
                continue  # marcadores [[SUMARIO]], [[BOTAO]], [[IMAGEM]]
            if linha.startswith("|") and set(linha) <= set("|-: "):
                continue  # separador de tabela
            if re.match(r"^# ", linha):
                tipo = "titulo"
            elif re.match(r"^#{2,6} ", linha):
                tipo = "subtitulo"
            else:
                tipo = "paragrafo"
            texto = limpar(linha)
            if texto:
                blocos.append((tipo, texto))
    return blocos


def comparar(args):
    a = ler_blocos(args.rascunho)
    b = ler_blocos(args.publicado)

    palavras_a = " ".join(t for _, t in a).split()
    palavras_b = " ".join(t for _, t in b).split()
    semelhanca = difflib.SequenceMatcher(None, palavras_a, palavras_b, autojunk=False).ratio()

    textos_a = [t for _, t in a]
    textos_b = [t for _, t in b]
    sm = difflib.SequenceMatcher(None, textos_a, textos_b, autojunk=False)
    alterados = removidos = novos = 0
    for op, i1, i2, j1, j2 in sm.get_opcodes():
        if op == "replace":
            n = min(i2 - i1, j2 - j1)
            alterados += n
            removidos += (i2 - i1) - n
            novos += (j2 - j1) - n
        elif op == "delete":
            removidos += i2 - i1
        elif op == "insert":
            novos += j2 - j1

    titulo_a = next((t for k, t in a if k == "titulo"), "")
    titulo_b = next((t for k, t in b if k == "titulo"), "")
    subs_a = [t for k, t in a if k == "subtitulo"]
    subs_b = [t for k, t in b if k == "subtitulo"]

    linha = {
        "data": datetime.date.today().isoformat(),
        "slug": args.slug,
        "semelhanca_pct": "%.1f" % (semelhanca * 100),
        "paragrafos_rascunho": len(textos_a),
        "paragrafos_alterados": alterados,
        "paragrafos_removidos": removidos,
        "paragrafos_novos": novos,
        "titulo_mudou": "sim" if titulo_a != titulo_b else "nao",
        "subtitulos_mudaram": "sim" if subs_a != subs_b else "nao",
        "status_revisor": args.status_revisor or "",
    }

    novo_csv = not os.path.exists(args.csv)
    pasta = os.path.dirname(os.path.abspath(args.csv))
    os.makedirs(pasta, exist_ok=True)
    with open(args.csv, "a", encoding="utf-8", newline="") as f:
        w = csv.DictWriter(f, fieldnames=CAMPOS)
        if novo_csv:
            w.writeheader()
        w.writerow(linha)

    # Diff legível, para a rotina e o Rafael verem o que mudou
    diff_path = os.path.join(pasta, "%s.diff.md" % args.slug)
    with open(diff_path, "w", encoding="utf-8") as f:
        f.write("# O que mudou entre o rascunho e o publicado: %s\n\n" % args.slug)
        f.write("Semelhança: %.1f%% | alterados: %d | removidos: %d | novos: %d\n\n"
                % (semelhanca * 100, alterados, removidos, novos))
        for op, i1, i2, j1, j2 in sm.get_opcodes():
            if op == "equal":
                continue
            f.write("---\n\n")
            for t in textos_a[i1:i2]:
                f.write("- ANTES: %s\n" % t)
            for t in textos_b[j1:j2]:
                f.write("+ DEPOIS: %s\n" % t)
            f.write("\n")

    print("Artigo: %s" % args.slug)
    print("Semelhança entre rascunho e publicado: %.1f%%" % (semelhanca * 100))
    print("Parágrafos alterados: %d | removidos: %d | novos: %d" % (alterados, removidos, novos))
    print("Título mudou: %s | Subtítulos mudaram: %s" % (linha["titulo_mudou"], linha["subtitulos_mudaram"]))
    print("Diff gravado em: %s" % diff_path)
    print()
    return status(args)


def status(args):
    if not os.path.exists(args.csv):
        print("FASE 1: nenhum artigo comparado ainda (0 de %d)." % ARTIGOS_SEGUIDOS)
        return 0
    with open(args.csv, encoding="utf-8", newline="") as f:
        linhas = list(csv.DictReader(f))
    seguidos = 0
    for l in reversed(linhas):
        ok_texto = float(l["semelhanca_pct"]) >= LIMIAR_SEMELHANCA * 100
        ok_titulo = l["titulo_mudou"] == "nao"
        ok_revisor = (l.get("status_revisor") or "APROVADO").startswith("APROVADO")
        if ok_texto and ok_titulo and ok_revisor:
            seguidos += 1
        else:
            break
    media = sum(float(l["semelhanca_pct"]) for l in linhas[-ARTIGOS_SEGUIDOS:]) / min(len(linhas), ARTIGOS_SEGUIDOS)
    print("Artigos comparados: %d | semelhança média (últimos %d): %.1f%%"
          % (len(linhas), min(len(linhas), ARTIGOS_SEGUIDOS), media))
    if seguidos >= ARTIGOS_SEGUIDOS:
        print("PRONTO PARA A FASE 2: os últimos %d artigos foram publicados com %.0f%%+ do texto "
              "igual ao rascunho e sem trocar o título." % (seguidos, LIMIAR_SEMELHANCA * 100))
    else:
        print("FASE 1: %d de %d artigos seguidos publicados sem ajuste relevante "
              "(critério: %.0f%%+ do texto igual e título mantido)."
              % (seguidos, ARTIGOS_SEGUIDOS, LIMIAR_SEMELHANCA * 100))
    return 0


def main():
    _utf8_stdout()
    p = argparse.ArgumentParser(description="Calibração da automação do blog RRS (fase 1 -> fase 2)")
    sub = p.add_subparsers(dest="cmd", required=True)

    c = sub.add_parser("comparar", help="compara rascunho x publicado e registra no CSV")
    c.add_argument("--rascunho", required=True)
    c.add_argument("--publicado", required=True)
    c.add_argument("--slug", required=True)
    c.add_argument("--csv", required=True)
    c.add_argument("--status-revisor", default="")
    c.set_defaults(func=comparar)

    s = sub.add_parser("status", help="diz se o blog já está pronto para a fase 2")
    s.add_argument("--csv", required=True)
    s.set_defaults(func=status)

    args = p.parse_args()
    sys.exit(args.func(args) or 0)


if __name__ == "__main__":
    main()
