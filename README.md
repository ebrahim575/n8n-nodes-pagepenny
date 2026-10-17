# n8n-nodes-pagepenny

An [n8n](https://n8n.io) community node for [PagePenny](https://pagepenny.com): turn JSON into PDFs and images from a template or your own HTML. One cent per render, 100 free renders a month.

## Install

In n8n, go to **Settings > Community Nodes > Install** and enter `n8n-nodes-pagepenny`.

## Credentials

1. Sign up at [pagepenny.com](https://pagepenny.com/login) and copy your API key from the dashboard (it starts with `pp_live_`).
2. In n8n, create a **PagePenny API** credential and paste the key.

## Operations

**Render > From Template**: pick a starter template (invoice, receipt, quote, certificate, report, OG image, social square), pass your data as JSON, get the file back as binary.

**Render > From HTML**: send your own HTML and CSS. Jinja placeholders like `{{ name }}` are filled from the data JSON.

Output formats: PDF, PNG, JPEG, WebP. The file lands in the binary field you choose (default `data`), ready for Gmail, Google Drive, S3, Slack and so on.

## Example

Data for the `Invoice (classic)` template:

```json
{
  "seller": { "name": "Northwind Studio" },
  "customer": { "name": "Acme Corp" },
  "invoice": { "number": "INV-1042", "date": "2026-10-15" },
  "items": [{ "description": "Website redesign", "quantity": 1, "unit_price": 2400 }]
}
```

Each template's full sample data is in the [docs](https://pagepenny.com/docs).

## Links

- [PagePenny docs](https://pagepenny.com/docs)
- [Pricing](https://pagepenny.com/pricing)
- [n8n community nodes](https://docs.n8n.io/integrations/#community-nodes)

## License

[MIT](LICENSE.md)
