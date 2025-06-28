# Projeto de Landing Page “MAS-NI” para Divulgação de Imóveis

# 1. Visão Geral
# Criar uma landing page dinâmica e automatizada que capture, do site Tytan Imóveis,
# todos os dados dos imóveis (título, endereço, preço, fotos, características)
# e apresente sempre atualizado, com foco em conversão via WhatsApp.

# 2. Objetivos
# - Capturar leads qualificados (comercial e residencial)
# - Expor novos lançamentos da Tytan em Passo Fundo/RS
# - Facilitar contato via WhatsApp (Mauricio Silveira – CRECI 74302)
# - Monitorar performance (visitas, tempo de permanência, cliques no CTA)

# 3. Público-Alvo
# - Corretores, investidores e empreendedores de Passo Fundo/RS
# - Clínicas, consultórios e escritórios na região da Saúde
# - Profissionais que buscam agilidade e retorno de investimento

# 4. Estrutura e Conteúdo Dinâmico
# 4.1 Hero Section
#    • Título dinâmico (ex: “PRÉDIO COMERCIAL LOCALIZAÇÃO PRIVILEGIADA DA SAÚDE”)
#    • Sub-headline com valor e endereço
#    • Botão “Quero mais detalhes” → WhatsApp
# 4.2 Carrossel de Imagens
#    • Galeria responsiva via JSON/API de scraping
# 4.3 Ficha Técnica Automatizada
#    • Campos: ID, endereço, valor, área, vagas, lavabos, elevador, etc
#    • Colunas de “Características”, “Acabamentos”, “Comodidades”
# 4.4 Descrição do Imóvel
#    • Texto rico enfatizando localização médica e proximidade ao IOT/Unimed
# 4.5 Proposta de Valor + Credenciais
#    • Bloco “Corretor Responsável”: Mauricio Silveira | CRECI 74302
#    • Botão WhatsApp fixo
# 4.6 Prova Social & Redes
#    • Facebook: /MauricioSilveira1962
#    • Instagram/Threads: @mascorretor
# 4.7 Seção “Novidades”
#    • Widget que puxa lançamentos do site Tytan
#    • CTA “Ver todos” com filtros por bairro/tipo
# 4.8 Área de Manutenção (Zoho)
#    • Login restrito para atualizar estoque, banners e textos
# 4.9 Footer & Dashboards
#    • Contatos, política de privacidade, links úteis
#    • Tile com Top 5 imóveis, acessos no período, agenda interna

# 5. Automação & Integrações

# 5.1 Scraping Agendado
#    • Python (BeautifulSoup / Selenium) ou Node.js (Puppeteer)
#    • Cron job (AWS Lambda / Heroku Scheduler)
#    • Extrair: título, endereço, preço, fotos, características, descrição, acabamentos
python scraper/scrape_tytan.py > imoveis.json

# 5.2 Back-end & API
#    • Banco de dados: MySQL / PostgreSQL
#    • Endpoints REST:
#        GET  /api/imoveis
#        GET  /api/imoveis/:id
#        POST /api/leads

# 5.3 Zoho CRM & Analytics
#    • Leads → Zoho CRM via API
#    • Dashboards customizados: mais acessados, taxa de conversão, agenda

# 5.4 Monitoramento & Marketing
#    • Google Analytics + Meta Pixel + Hotjar (heatmaps)
#    • A/B tests: headlines e imagem principal

# 5.5 E-mail & Automação
#    • Gatilhos: visita X vezes ou download de PDF → sequência de e-mails
#        (Zoho Campaigns / Mailchimp)
#    • Remarketing dinâmico no Facebook/Instagram

# 6. Identidade Visual
#    • Paleta de cores: cinza escuro, azul petróleo, off-white
#    • Tipografia: sans-serif moderna
#    • Ícones: consistentes para características e acabamentos

# 7. Cronograma & Entregas
# Fase                         Entrega                                   Prazo
# --------------------------------------------------------------------------------
# 1. Briefing & Wireframe      Protótipo low-fi                           2 dias
# 2. Design Visual             Mockup hi-fi da página principal           4 dias
# 3. Desenvolvimento           Front-end + back-end + scraper             7 dias
# 4. Integrações               Zoho, Analytics, WhatsApp, Meta            3 dias
# 5. Testes & Ajustes          QA, performance, SEO, responsivo           3 dias
# 6. Go Live                   Deploy & analytics setup                   1 dia
# --------------------------------------------------------------------------------
# Total aproximado                                                       20 dias

# 8. Sugestões Extras (Originals!)
# - Tour virtual 360° dos principais imóveis
# - Chatbot inteligente (WhatsApp API / Tidio) por código de imóvel
# - Integração com Google Maps: mapa interativo
# - Push Notifications Web: avisos de novos imóveis ou promoções
# - SEO Local: rich snippets e schema.org (endereço e preço)
# - PageSpeed & Acessibilidade: auditoria Lighthouse, conformidade WCAG
