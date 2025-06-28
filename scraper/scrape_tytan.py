#!/usr/bin/env python3
# scrape_tytan.py

import os
import sys
import json
import logging
import requests
from bs4 import BeautifulSoup

# Configuração de logging
logging.basicConfig(level=logging.INFO, format='[%(levelname)s] %(message)s')

# 1) URLs e credenciais (podem vir de variáveis de ambiente)
LOGIN_URL  = 'https://sistema.sigacrm.com.br/tytan'
LISTA_URL  = 'https://sistema.sigacrm.com.br/imob/indexadmin.php'
USERNAME   = os.getenv('TYTAN_USER', 'seu_usuario')
PASSWORD   = os.getenv('TYTAN_PASS', 'sua_senha')

# Parâmetros de listagem (ajuste conforme necessidade)
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


def login(session):
    """
    Faz login no painel Tytan e retorna a sessão autenticada.
    Ajuste os campos 'user' e 'pass' se forem diferentes no formulário.
    """
    payload = {
        'user': USERNAME,
        'pass': PASSWORD
    }
    resp = session.post(LOGIN_URL, data=payload, headers=HEADERS)
    resp.raise_for_status()
    logging.info('Login bem-sucedido.')
    return session


def parse_imovel(tr):
    """
    Extrai dados de um <tr> da tabela de imóveis.
    Ajuste índices de cols[] conforme a estrutura da tabela HTML.
    """
    cols = tr.find_all('td')
    # Exemplo de mapeamento:
    # cols[0]: foto, cols[1]: ID, cols[2]: título, cols[3]: endereço, cols[4]: perfil, cols[5]: valor, ...
    img_tag = cols[0].find('img')
    foto    = img_tag['src'] if img_tag and img_tag.has_attr('src') else None

    raw_valor = cols[5].get_text(strip=True)
    valor = float(raw_valor.replace('R$', '')
                          .replace('.', '')
                          .replace(',', '.')
                          .strip())

    # dividir endereço em componentes se for necessário
    endereco_text = cols[3].get_text(strip=True)
    # ex.: "Rua Exemplo, 123 – Centro, Cidade/UF – 00000-000"
    return {
        'id':        cols[1].get_text(strip=True),
        'titulo':    cols[2].get_text(strip=True),
        'perfil':    cols[4].get_text(strip=True),
        'endereco':  endereco_text,
        'valor':     valor,
        'foto':      foto
    }


def scrape():
    """
    Abre sessão, faz login, carrega a lista de imóveis e retorna lista de dicts.
    """
    session = requests.Session()
    session.headers.update(HEADERS)

    try:
        login(session)
        resp = session.get(LISTA_URL, params=PARAMS)
        resp.raise_for_status()
    except Exception as e:
        logging.error(f'Falha na requisição: {e}')
        sys.exit(1)

    soup   = BeautifulSoup(resp.text, 'html.parser')
    tabela = soup.find('table')
    if not tabela:
        logging.error('Tabela de imóveis não encontrada.')
        sys.exit(1)

    linhas = tabela.find_all('tr')[1:]  # pula cabeçalho
    imobs  = [parse_imovel(tr) for tr in linhas if tr.find_all('td')]
    logging.info(f'Encontrados {len(imobs)} imóveis.')
    return imobs


if __name__ == '__main__':
    imoveis = scrape()
    # Saída JSON sem escape de Unicode, com indentação
    print(json.dumps({'imobs': imoveis}, ensure_ascii=False, indent=2))
