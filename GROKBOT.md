# Guia de Integração — Grokbot → `data/casas.json`

Para que o Grokbot alimente o site automaticamente, ele só precisa gerar ou atualizar o arquivo **`data/casas.json`**.

## Prompt pronto para o Grokbot

Copie o texto abaixo nas instruções do seu buscador no Grokbot:

```text
Você é um buscador de casas em Maringá - PR.
Sempre que encontrar casas relevantes, retorne APENAS um JSON válido seguindo exatamente o formato abaixo para atualizar o arquivo data/casas.json do site:

{
  "atualizado_em": "YYYY-MM-DDTHH:MM:SS-03:00",
  "fonte": "Grokbot",
  "cidade": "Maringá - PR",
  "observacao": "Resumo breve desta busca",
  "casas": [
    {
      "id": "slug-unico-estavel",
      "titulo": "Título curto e claro",
      "finalidade": "aluguel",
      "tipo": "Casa térrea",
      "casa": true,
      "preco": 3200,
      "condominio": null,
      "iptu": 150,
      "bairro": "Zona 02",
      "endereco": "Rua aproximada ou referência",
      "lat": -23.4319,
      "lng": -51.9318,
      "quartos": 3,
      "suites": 1,
      "banheiros": 2,
      "vagas": 2,
      "area_m2": 150,
      "terreno_m2": 300,
      "aceita_pets": true,
      "quintal": true,
      "moveis": true,
      "nova": true,
      "destaque": false,
      "descricao": "Resumo objetivo do imóvel.",
      "nota_grokbot": "Por que esta casa vale a pena e pontos de atenção.",
      "tags": ["Quintal gramado", "Rua arborizada"],
      "fotos": ["https://..."],
      "link": "https://url-do-anuncio",
      "portal": "Nome do portal ou imobiliária",
      "encontrado_em": "YYYY-MM-DD"
    }
  ]
}

Regras:
1. "finalidade" deve ser "aluguel" ou "compra".
2. "preco", "condominio", "iptu", "area_m2", "terreno_m2" devem ser números (sem "R$").
3. "casa" deve ser booleano (true = Casa, false = Apartamento).
4. "moveis" deve ser booleano (true quando o imóvel tiver móveis / for mobiliado ou semimobiliado, false quando não tiver).
5. "nova" deve ser booleano (true quando o imóvel for novidade recém-adicionada nesta atualização, para exibir estrelinha e selo "Nova" no mapa ao lado do valor; false para imóveis já listados anteriormente).
6. Mantenha "id" estável para a mesma casa entre atualizações (assim o usuário não perde favoritos nem anotações).
7. Sempre tente preencher "lat" e "lng" reais em Maringá (em torno de -23.42, -51.93). Se não tiver certeza exata, preencha "bairro" corretamente que o site posiciona automaticamente.
8. Extraia as URLs diretas (`https://...`) das fotos reais do anúncio e coloque em `"fotos": ["https://...", "https://..."]` (até 6–8 fotos principais). O site carrega com `referrerpolicy="no-referrer"` e faz fallback automático caso algum link expire.
9. Opcionalmente, adicione "proximidades": [{ "nome": "...", "categoria": "pet|ciclovia|academia|parque|mercado|cafe|saude|educacao", "distancia_m": 250 }] se descobrir algo especial perto da casa.
```

## Campos mínimos obrigatórios

Mesmo um JSON enxuto já funciona perfeitamente:

```json
{
  "casas": [
    {
      "titulo": "Casa 3 quartos na Zona 07",
      "finalidade": "aluguel",
      "preco": 2800,
      "bairro": "Zona 07",
      "link": "https://exemplo.com/anuncio"
    }
  ]
}
```

---

# Guia de Integração — Grokbot → `data/crimes.json` (Mapa de Ocorrências estilo CrimeReports)

Para exibir ocorrências policiais no mapa de Maringá com ícones por categoria (estilo **CrimeReports** dos EUA), o Grokbot deve gerar ou atualizar o arquivo **`data/crimes.json`**.

O site aceita tanto um objeto com `"ocorrencias": [ ... ]` (recomendado) quanto um array JSON direto `[ { ... }, ... ]`.

## Formato de `data/crimes.json`

```json
{
  "atualizado_em": "2026-11-24T12:00:00-03:00",
  "fonte": "Grokbot",
  "cidade": "Maringá - PR",
  "observacao": "Ocorrências policiais recentes coletadas em portais locais.",
  "ocorrencias": [
    {
      "id": "g1-2026-11-20-furto-zona-07",
      "data": "2026-11-20",
      "tipo": "furto",
      "titulo": "Furto de bicicleta em condomínio na Zona 07",
      "cidade": "Maringá",
      "bairro": "Zona 07",
      "endereco": "Rua X (se houver)",
      "lat": -23.4105,
      "lng": -51.9378,
      "precisao": "rua",
      "fonte": "G1",
      "link": "https://..."
    }
  ]
}
```

## Lista de Crimes para o Grok consultar (um ícone para cada grupo de crimes)

Consulte a tabela abaixo e escolha no campo `"tipo"` a chave que melhor representa a ocorrência. Cada chave renderiza um ícone próprio estilo **CrimeReports** no mapa:

| Valor de `"tipo"` | Rótulo no Mapa | Ícone (estilo CrimeReports) | Lista de crimes / ocorrências que se encaixam |
|---|---|---|---|
| `homicidio` | Homicídio / Letal | Caveira (vermelho escuro) | Homicídio doloso ou culposo, tentativa de homicídio, latrocínio, feminicídio, execução, morte violenta, achado de cadáver com indício de crime |
| `roubo` | Roubo / Assalto | Máscara de assalto (vermelho) | Roubo a pedestre, assalto à mão armada, roubo a residência, roubo a comércio/posto/farmácia, arrastão, sequestro relâmpago |
| `furto` | Furto | Ladrão com bolsa (âmbar) | Furto simples ou qualificado, furto de celular/carteira, furto em comércio, furto de bicicleta, furto de fios/cabos/hidrômetro, furto em interior de veículo |
| `invasao` | Invasão / Arrombamento | Casa arrombada (âmbar escuro) | Arrombamento de residência ou comércio, invasão domiciliar, violação de domicílio, furto mediante arrombamento (burglary) |
| `veiculo` | Veículo (Furto/Roubo) | Carro com alerta (ocre) | Furto de carro, furto de moto, roubo de carro, roubo de moto, furto/roubo de caminhonete ou carga veicular |
| `trafico` | Tráfico / Drogas | Cápsula / pílula (roxo) | Tráfico de drogas, apreensão de entorpecentes, ponto de venda (biqueira), associação para o tráfico, laboratório/plantação ilegal |
| `agressao` | Agressão / Violência | Punho / impacto (laranja) | Lesão corporal, agressão física, espancamento, esfaqueamento, briga com feridos, ameaça grave, vias de fato |
| `violencia_domestica` | Violência Doméstica | Casa com alerta (rosa escuro) | Violência doméstica, Lei Maria da Penha, agressão/ameaça contra cônjuge ou familiar, descumprimento de medida protetiva |
| `violencia_sexual` | Crime Sexual | Escudo de alerta (magenta) | Estupro, estupro de vulnerável, importunação sexual, assédio sexual, abuso sexual, ato obsceno |
| `arma` | Arma / Disparo | Mira / disparo (carmim) | Disparo de arma de fogo, tiroteio, troca de tiros, porte ou posse ilegal de arma de fogo, apreensão de armas/munições |
| `incendio` | Incêndio Criminoso | Chama (laranja fogo) | Incêndio criminoso em imóvel, terreno, veículo ou mata, tentativa de atear fogo, artefato explosivo |
| `vandalismo` | Vandalismo / Dano | Spray / dano (ardósia) | Vandalismo, dano ao patrimônio público ou privado, depredação, pichação, quebra de vidros/veículos |
| `estelionato` | Estelionato / Golpe | Cartão com alerta (azul escuro) | Estelionato, golpe presencial (falso funcionário, bilhete premiado, falso parente), extorsão, falsificação, fraude local |
| `operacao_policial` | Operação / Prisão | Algemas (azul polícia) | Operação policial, cumprimento de mandado de prisão, captura de foragido, prisão em flagrante, receptação, perseguição policial |
| `outro` | Outra Ocorrência | Alerta policial (grafite) | Qualquer outra ocorrência criminal relevante que não se encaixe diretamente nas categorias acima |

> **Observação:** o site também aceita acentos ou termos compostos (ex: `"homicídio"`, `"tráfico"`, `"roubo de moto"`, `"arrombamento"`) e normaliza automaticamente para o ícone correspondente, mas prefira sempre usar as chaves exatas da primeira coluna acima.

## Prompt pronto para o Grokbot (Ocorrências)

```text
Você é um coletor de ocorrências policiais recentes em Maringá - PR (todas as zonas e bairros da cidade).
Retorne APENAS um JSON válido para atualizar o arquivo data/crimes.json no formato:

{
  "atualizado_em": "YYYY-MM-DDTHH:MM:SS-03:00",
  "fonte": "Grokbot",
  "cidade": "Maringá - PR",
  "ocorrencias": [
    {
      "id": "fonte-YYYY-MM-DD-slug-unico",
      "data": "YYYY-MM-DD",
      "tipo": "furto|roubo|invasao|veiculo|homicidio|trafico|agressao|violencia_domestica|violencia_sexual|arma|incendio|vandalismo|estelionato|operacao_policial|outro",
      "titulo": "Manchete objetiva da ocorrência",
      "cidade": "Maringá",
      "bairro": "Zona 07",
      "endereco": "Rua X (se houver na matéria, senão deixe vazio)",
      "lat": -23.4105,
      "lng": -51.9378,
      "precisao": "rua|bairro",
      "fonte": "G1",
      "link": "https://..."
    }
  ]
}

Regras:
1. Inclua apenas ocorrências reais com fonte verificável e "link" direto para a notícia.
2. Escolha em "tipo" o valor da tabela de crimes que melhor se encaixa na ocorrência (use preferencialmente: homicidio, roubo, furto, invasao, veiculo, trafico, agressao, violencia_domestica, violencia_sexual, arma, incendio, vandalismo, estelionato, operacao_policial ou outro).
3. Use "precisao": "rua" apenas quando houver rua/avenida/esquina confirmada e coordenadas exatas; caso só haja bairro, use "precisao": "bairro".
4. Se não tiver "lat" e "lng", preencha "bairro" corretamente (ex: "Zona 01", "Zona 02", "Zona 07", "Jardim Alvorada") que o site posiciona automaticamente no mapa.
5. Mantenha "id" estável para evitar duplicatas entre atualizações.
```

---

# Guia de Integração — Grokbot → `data/transito.json` (Mapa de Acidentes de Trânsito)

Para exibir acidentes de trânsito no mapa de Maringá com ícones de advertência viária por categoria e filtros por data, o Grokbot deve gerar ou atualizar o arquivo **`data/transito.json`**.

O site aceita tanto um objeto com `"ocorrencias": [ ... ]` (ou `"acidentes": [ ... ]`) quanto um array JSON direto `[ { ... }, ... ]`.

## Formato de `data/transito.json`

```json
{
  "atualizado_em": "2026-11-24T13:00:00-03:00",
  "fonte": "Grokbot",
  "cidade": "Maringá - PR",
  "observacao": "Acidentes de trânsito recentes coletados em portais locais.",
  "ocorrencias": [
    {
      "id": "gmc-2026-11-20-colisao-av-colombo",
      "data": "2026-11-20",
      "tipo": "colisao",
      "titulo": "Colisão entre carro e moto na Av. Colombo deixa ferido",
      "cidade": "Maringá",
      "bairro": "Zona 07",
      "endereco": "Av. Colombo esquina com Av. Paraná",
      "lat": -23.4095,
      "lng": -51.9382,
      "precisao": "rua",
      "gravidade": "leve",
      "fonte": "GMC Online",
      "link": "https://..."
    }
  ]
}
```

## Lista de Acidentes de Trânsito para o Grok consultar (1 ícone por tipo)

| Valor de `"tipo"` | Rótulo no Mapa | Ícone (Placa Viária) | Lista de acidentes que se encaixam |
|---|---|---|---|
| `fatal` | Acidente Fatal | Cruz de alerta (vermelho escuro) | Qualquer acidente de trânsito com morte/óbito no local ou posterior |
| `atropelamento` | Atropelamento | Pedestre + alerta (vermelho) | Atropelamento de pedestre em via urbana, faixa, calçada ou rodovia |
| `moto` | Acidente de Moto | Motocicleta (laranja vivo) | Queda de moto, colisão carro x moto, acidente com motoboy/entregador ou motoneta |
| `colisao` | Colisão / Batida | Impacto entre carros (âmbar) | Colisão frontal, lateral ou traseira, engavetamento, batida em cruzamento, choque contra poste/muro/árvore |
| `capotamento` | Capotamento / Tomb. | Giro / capotamento (âmbar escuro) | Capotamento de carro, tombamento de veículo, saída de pista, queda em barranco/valeta |
| `ciclista` | Ciclista / Bike | Bicicleta (verde-azulado) | Atropelamento ou colisão envolvendo ciclista, bike elétrica, patinete ou ciclovia |
| `onibus_caminhao` | Ônibus / Caminhão | Veículo pesado (azul escuro) | Acidente envolvendo caminhão, carreta, ônibus urbano/rodoviário ou van escolar |
| `embriaguez` | Embriaguez / Perigo | Alerta embriaguez (roxo) | Acidente por embriaguez ao volante, bafômetro positivo, racha, direção perigosa ou fuga sem socorro |
| `rodovia` | Rodovia / Trevo | Estrada / rodovia (ardósia) | Acidente em rodovia, trevo ou contorno (ex.: BR-376, PR-317, Contorno Norte, Contorno Sul) |
| `outro` | Outro Acidente | Triângulo viário (ocre) | Incêndio em veículo na via, queda de árvore/carga bloqueando rua, animal na pista ou outras ocorrências viárias |

> **Campo opcional `"gravidade"`:** `"fatal"`, `"grave"`, `"leve"` ou `"sem_vitimas"`.
> **Normalização automática:** o site aceita acentos ou termos compostos (ex.: `"colisão"`, `"atropelamento de ciclista"`, `"caminhão tombado"`), mas prefira usar a chave exata da primeira coluna.

## Prompt pronto para o Grokbot (Acidentes de Trânsito)

```text
Você é um coletor de acidentes de trânsito recentes em Maringá - PR (vias urbanas, avenidas, ciclovias e contornos/rodovias locais).
Retorne APENAS um JSON válido para atualizar o arquivo data/transito.json no formato:

{
  "atualizado_em": "YYYY-MM-DDTHH:MM:SS-03:00",
  "fonte": "Grokbot",
  "cidade": "Maringá - PR",
  "ocorrencias": [
    {
      "id": "fonte-YYYY-MM-DD-slug-unico",
      "data": "YYYY-MM-DD",
      "tipo": "fatal|atropelamento|moto|colisao|capotamento|ciclista|onibus_caminhao|embriaguez|rodovia|outro",
      "titulo": "Manchete objetiva do acidente",
      "cidade": "Maringá",
      "bairro": "Zona 07",
      "endereco": "Rua/Avenida/Cruzamento ou km da rodovia (se houver)",
      "lat": -23.4105,
      "lng": -51.9378,
      "precisao": "rua|bairro",
      "gravidade": "fatal|grave|leve|sem_vitimas",
      "fonte": "GMC Online",
      "link": "https://..."
    }
  ]
}

Regras:
1. Inclua apenas acidentes reais com fonte verificável e "link" direto para a notícia.
2. Se houve óbito, use "tipo": "fatal" (e "gravidade": "fatal"). Caso contrário, escolha o tipo que melhor descreve o acidente na tabela acima.
3. Use "precisao": "rua" apenas quando houver rua/avenida/cruzamento/km confirmado e coordenadas exatas; caso contrário use "precisao": "bairro".
4. Mantenha "id" estável para evitar duplicatas entre atualizações.
```
