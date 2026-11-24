# Maringá Casas

Site estático limpo e interativo para ajudar a encontrar casas em **Maringá — PR**, pensado para ser publicado no **GitHub Pages** a partir da branch `main` (raiz) e atualizado facilmente pelo **Grokbot** usando um único arquivo JSON.

## Estrutura do projeto

- `index.html` — página principal (lista + filtros + painel de detalhes + mapa interativo).
- `assets/css/style.css` — visual limpo e responsivo.
- `assets/js/app.js` — mapa (Leaflet), ícones SVG customizados, cálculo automático de distâncias, raio de caminhada/bike, notas pessoais em `localStorage`, comparador e pré-visualização de JSON.
- `data/casas.json` — **arquivo principal que o Grokbot atualiza** com as casas encontradas.
- `data/casas.schema.json` — schema JSON formal com todos os campos aceitos.
- `data/crimes.json` — **arquivo de ocorrências policiais** exibidas no mapa com ícones por categoria estilo **CrimeReports** (EUA) e menu de relatório com filtros de data.
- `data/crimes.schema.json` — schema JSON formal e catálogo de tipos de crime para o Grokbot consultar.
- `data/transito.json` — **arquivo de acidentes de trânsito** exibidos no mapa com placas de advertência viária por categoria e menu de relatório com filtros de data.
- `data/transito.schema.json` — schema JSON formal e catálogo de tipos de acidente de trânsito para o Grokbot consultar.
- `data/maringa-pois.json` — catálogo embutido de pontos de interesse em Maringá (áreas pet, ciclovias reais, academias, parques, mercados, cafés, saúde e educação).
- `GROKBOT.md` — guia e prompt pronto para copiar e colar no Grokbot.
- `.nojekyll` e `404.html` — suporte direto ao GitHub Pages, sem etapa de build.

## Como testar localmente

Sem build nem dependências para instalar. Na pasta do projeto:

```bash
python -m http.server 8000
```

Abra `http://localhost:8000` no navegador.

## Como publicar no GitHub Pages

1. Crie um repositório público no GitHub e faça push desta pasta para a branch `main`.
2. Em **Settings → Pages**, selecione **Deploy from a branch** → `main` → `/ (root)`.
3. Em poucos segundos o site estará no ar. Sempre que o Grokbot atualizar `data/casas.json` (via commit/PR/API do GitHub), o site reflete as novas casas automaticamente.

## Como o Grokbot atualiza o site

Basta substituir o arquivo [`data/casas.json`](data/casas.json) mantendo a estrutura simples:

```json
{
  "atualizado_em": "2026-11-22T15:00:00-03:00",
  "fonte": "Grokbot",
  "casas": [
    {
      "id": "casa-zona02-01",
      "titulo": "Casa térrea com quintal na Zona 02",
      "finalidade": "aluguel",
      "preco": 3400,
      "bairro": "Zona 02",
      "lat": -23.4319,
      "lng": -51.9318,
      "quartos": 3,
      "banheiros": 2,
      "vagas": 2,
      "area_m2": 150,
      "aceita_pets": true,
      "quintal": true,
      "nova": true,
      "nota_grokbot": "Perto do Parque do Ingá e da ciclovia.",
      "link": "https://..."
    }
  ]
}
```

- Se `lat` e `lng` não vierem no JSON, o site posiciona a casa automaticamente pelo `bairro` em Maringá.
- A propriedade `"nova"` (`true` ou `false`) destaca imóveis recém-adicionados com estrelinha e selo **Nova** no mapa ao lado do valor, nos cards e no filtro rápido.
- As distâncias para **áreas pet, ciclovias, academias, parques, mercados, cafés, saúde e educação** são calculadas automaticamente no navegador — o Grokbot não precisa calcular nada, mas pode enviar `proximidades` extras se quiser.
- Você também pode passar uma URL externa via query string: `?json=https://raw.githubusercontent.com/.../casas.json`.
- Veja [`GROKBOT.md`](GROKBOT.md) para o prompt pronto de integração.
