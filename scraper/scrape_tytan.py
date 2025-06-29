#!/usr/bin/env python3
"""
scrape_tytan.py

Scrapes imóveis da Tytan Imóveis (passo a passo abaixo):
 1. Faz login no sistema Tytan (sigacrm).
 2. Busca a lista de imóveis.
 3. Extrai dados (ID, título, perfil, endereço, preço, fotos, complemento, proximidade).
 4. Gera um JSON com estrutura compatível com a landing page (imoveis.json).
"""

import os
import sys
import json
import logging
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, quote_plus

# ——— CONFIGURAÇÃO ——————————————————————————————————————————————
logging.basicConfig(
    level=logging.INFO,
    format='[%(levelname)s] %(message)s'
)

# Endpoints
BASE_URL   = 'https://sistema.sigacrm.com.br'
LOGIN_URL  = urljoin(BASE_URL, '/tytan')
LISTA_URL  = urljoin(BASE_URL, '/imob/indexadmin.php')

# Credenciais (opcionais: defina TYTAN_USER e TYTAN_PASS no seu ambiente)
USERNAME = os.getenv('TYTAN_USER', 'seu_usuario')
PASSWORD = os.getenv('TYTAN_PASS', 'sua_senha')

# Parâmetros da listagem
PARAMS = {
    'vw_imob':       'lista_imovel',
    'idcat':         1,
    'getimobiliaria':2,
    'getcorretor':   42,
    'sit':           '0,2',
    'ord':           9
}

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (compatible; ScrapeTytan/1.0)'
}


def login(session: requests.Session) -> None:
    """
    Faz login no painel Tytan e mantém cookies na sessão.
    """
    payload = {'user': USERNAME, 'pass': PASSWORD}
    resp = session.post(LOGIN_URL, data=payload, headers=HEADERS)
    resp.raise_for_status()
    if "Sair" not in resp.text and resp.status_code != 302:
        logging.warning("Login concluído, mas sem confirmação de redirecionamento.")
    logging.info("✔ Login realizado.")


def parse_address(raw: str) -> dict:
    """
    Divide o endereço bruto em componentes:
    'Rua X, 123 – Bairro, Cidade/UF – 00000-000'
    → { rua, unidade, bairro, cidade, cep }
    """
    parts = [p.strip() for p in raw.split('–')]
    rua_unid = parts[0].split(',', 1)
    bairro = parts[1] if len(parts) > 1 else ''
    cidade_uf = parts[2].split('/') if len(parts) > 2 else ['', '']
    cep = parts[3] if len(parts) > 3 else ''

    return {
        'rua':        rua_unid[0].strip(),
        'unidade':   rua_unid[1].strip() if len(rua_unid) > 1 else '',
        'bairro':    bairro.strip(),
        'cidade':    cidade_uf[0].strip(),
        'uf':        cidade_uf[1].strip() if len(cidade_uf) > 1 else '',
        'cep':       cep.strip()
    }


def parse_imovel(tr) -> dict:
    """
    Extrai campos de uma linha <tr> da tabela de imóveis
    Retorna dicionário compatível com o JSON da landing.
    """
    cols = tr.find_all('td')
    if len(cols) < 6:
        return {}

    # Foto principal (pode ser URL relativa)
    img_tag = cols[0].find('img')
    foto_url = img_tag['src'] if img_tag and img_tag.get('src') else ''
    foto_url = urljoin(BASE_URL, foto_url)

    # Texto do valor: "R$ 1.500.000,00"
    raw_val = cols[5].get_text(strip=True)
    valor = float(
        raw_val.replace('R$', '')
               .replace('.', '')
               .replace(',', '.')
               .strip() or 0
    )

    # Construir o endereço estruturado
    raw_end = cols[3].get_text(separator=' ', strip=True)
    endereco = parse_address(raw_end)

    return {
        'id':        cols[1].get_text(strip=True),
        'titulo':    cols[2].get_text(strip=True),
        'perfil':    cols[4].get_text(strip=True),
        'endereco':  endereco,
        'valor':     valor,
        'fotos':     [foto_url],             # lista (pode ser expandida)
        'complemento': None,
        'proximo':    None,
        'whatsapp':   os.getenv('TYTAN_WHATSAPP', '54999832413')
    }


def scrape() -> list:
    """
    Executa o fluxo de login e scraping da lista de imóveis.
    """
    session = requests.Session()
    session.headers.update(HEADERS)

    try:
        login(session)
        resp = session.get(LISTA_URL, params=PARAMS)
        resp.raise_for_status()
    except requests.RequestException as e:
        logging.error(f"Falha na requisição: {e}")
        sys.exit(1)

    soup = BeautifulSoup(resp.text, 'html.parser')
    tabela = soup.find('table')
    if not tabela:
        logging.error("Tabela de imóveis não encontrada na página.")
        sys.exit(1)

    linhas = tabela.find_all('tr')[1:]  # pula cabeçalho
    imoveis = [parse_imovel(tr) for tr in linhas if tr.find_all('td')]
    logging.info(f"✔ Encontrados {len(imoveis)} imóveis.")
    return imoveis


def main(output_path: str = 'imoveis.json'):
    imoveis = scrape()
    data = {'imobs': imoveis}

    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    logging.info(f"JSON gerado em '{output_path}'.")


if __name__ == '__main__':
    # Permite passar nome do arquivo de saída como argumento
    dest = sys.argv[1] if len(sys.argv) > 1 else 'imoveis.json'
    main(dest)
