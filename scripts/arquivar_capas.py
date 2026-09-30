#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
arquivar_capas.py — organiza as capas do blog do RRS Advocacia.

REGRA: uma capa e' considerada "ja utilizada" quando o post correspondente
JA FOI PUBLICADO no blog. Capas de posts que ainda sao RASCUNHO (aguardando
revisao do Rafael) permanecem na raiz de capas-blog/, para ficarem faceis de achar.

Capas ja utilizadas sao movidas para a subpasta "Ja usadas" (acentuada: "Já usadas").

USO (chamado pelas tarefas agendadas de criacao de artigo):
    python3 arquivar_capas.py --slugs-file <arquivo.txt>
    python3 arquivar_capas.py --slugs "slug-um,slug-dois,slug-tres"
    python3 arquivar_capas.py --slugs-file slugs.txt --dry-run

O arquivo de slugs deve conter UM SLUG POR LINHA, sendo os slugs dos posts
PUBLICADOS (campo "slug" da resposta de POST /v3/posts/query do Wix).

A comparacao ignora acentos, maiusculas e os separadores, e tolera pequenas
diferencas de palavras de ligacao (de/da/do/para/e/a/o/com/em). Uma capa so e
movida quando o casamento e' CONFIANTE; na duvida, ela fica onde esta.
"""

import argparse
import os
import shutil
import sys
import unicodedata

PASTA_USADAS = "Já usadas"
EXTENSOES = (".webp", ".png", ".jpg", ".jpeg")
# palavras de ligacao que nao contam para o casamento
STOPWORDS = {
    "de", "da", "do", "das", "dos", "para", "por", "e", "a", "o", "as", "os",
    "com", "em", "no", "na", "nos", "nas", "ao", "aos", "um", "uma", "que", "se",
}
# proporcao minima de tokens significativos em comum para considerar confiante
LIMIAR = 0.80


def normalizar(texto):
    """minusculas, sem acentos, separadores viram espaco."""
    texto = unicodedata.normalize("NFKD", texto)
    texto = "".join(c for c in texto if not unicodedata.combining(c))
    texto = texto.lower()
    return "".join(c if c.isalnum() else " " for c in texto)


def tokens(texto):
    return {t for t in normalizar(texto).split() if t and t not in STOPWORDS}


def nome_base_capa(arquivo):
    """capa-isencao-ir-hiv.webp -> isencao ir hiv"""
    base = os.path.splitext(arquivo)[0]
    if base.lower().startswith("capa-"):
        base = base[5:]
    elif base.lower() == "capa":
        return set()
    return tokens(base)


def casa(tokens_capa, tokens_slug):
    """True se quase todo o nome da capa esta contido no slug publicado.

    Compara so' num sentido (capa -> slug) porque os slugs do Wix sao longos
    e carregam cauda de titulo ("...guia-completo-2026") que a capa nao tem.
    O limiar alto (0.80) e' o que impede que a capa de um RASCUNHO case com
    um post publicado do mesmo assunto: p.ex. "capa-isencao-imposto-renda-
    hanseniase" divide apenas 3 de 4 tokens (0.75) com os posts genericos de
    isencao ja publicados, entao NAO e' arquivada por engano.
    """
    if not tokens_capa or not tokens_slug:
        return False
    comuns = tokens_capa & tokens_slug
    return len(comuns) / len(tokens_capa) >= LIMIAR


def main():
    ap = argparse.ArgumentParser(description="Arquiva capas de posts ja publicados.")
    ap.add_argument("--slugs-file", help="arquivo com um slug publicado por linha")
    ap.add_argument("--slugs", help="slugs publicados separados por virgula")
    ap.add_argument("--pasta", default=os.path.dirname(os.path.abspath(__file__)),
                    help="pasta capas-blog (padrao: pasta deste script)")
    ap.add_argument("--dry-run", action="store_true",
                    help="apenas mostra o que seria movido, sem mover")
    args = ap.parse_args()

    brutos = []
    if args.slugs_file:
        with open(args.slugs_file, encoding="utf-8") as fh:
            brutos += [l.strip() for l in fh if l.strip()]
    if args.slugs:
        brutos += [s.strip() for s in args.slugs.split(",") if s.strip()]

    if not brutos:
        print("ERRO: informe --slugs-file ou --slugs com os slugs dos posts PUBLICADOS.",
              file=sys.stderr)
        return 2

    publicados = [(s, tokens(s)) for s in brutos]

    raiz = args.pasta
    destino = os.path.join(raiz, PASTA_USADAS)
    os.makedirs(destino, exist_ok=True)

    movidas, mantidas = [], []

    for arquivo in sorted(os.listdir(raiz)):
        caminho = os.path.join(raiz, arquivo)
        if not os.path.isfile(caminho):
            continue
        if not arquivo.lower().endswith(EXTENSOES):
            continue
        if not arquivo.lower().startswith("capa"):
            continue  # nao mexe em logo, etc.

        tk = nome_base_capa(arquivo)
        if not tk:
            mantidas.append((arquivo, "nome generico — revisar a mao"))
            continue

        candidatos = [slug for slug, tks in publicados if casa(tk, tks)]
        if len(candidatos) > 1:
            # ambiguo: a capa casa com mais de um post publicado. Nao arrisca.
            mantidas.append((arquivo, "casa com %d posts publicados — ambiguo, revisar a mao"
                             % len(candidatos)))
            continue
        achou = candidatos[0] if candidatos else None
        if achou:
            alvo = os.path.join(destino, arquivo)
            if os.path.exists(alvo):
                mantidas.append((arquivo, "ja existe uma copia em '%s'" % PASTA_USADAS))
                continue
            if not args.dry_run:
                shutil.move(caminho, alvo)
            movidas.append((arquivo, achou))
        else:
            mantidas.append((arquivo, "sem post publicado correspondente (provavel rascunho)"))

    prefixo = "[SIMULACAO] " if args.dry_run else ""
    print("%sArquivadas em '%s': %d" % (prefixo, PASTA_USADAS, len(movidas)))
    for arq, slug in movidas:
        print("   -> %s   (post publicado: %s)" % (arq, slug))
    print("")
    print("Mantidas na raiz (aguardando publicacao): %d" % len(mantidas))
    for arq, motivo in mantidas:
        print("   .  %s   [%s]" % (arq, motivo))
    return 0


if __name__ == "__main__":
    sys.exit(main())
