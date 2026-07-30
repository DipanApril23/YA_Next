# Main Services — card illustrations

Drop the service-card artwork here, then reference it from the content file
[`src/data/content/mainServices.json`](../../data/content/mainServices.json).
No JSX changes are needed — each card renders its `image` when present and falls
back to the gradient + `icon` tile when `image` is absent.

> **Note:** the Main Services section is built but **not currently mounted** on any
> page. See "Component Inventory" in the root README.

## How to add one

1. Add the file to this folder, e.g. `web-design.webp`.
2. Reference it on the matching service in `src/data/content/mainServices.json`:

   ```json
   {
     "title": "Custom Website Design & Development",
     "image": "/assets/mainServices/web-design.webp",
     "imageAlt": "Custom website design illustration"
   }
   ```

Because the data layer is plain JSON (so it can be handed to a CMS), images are
referenced by **path string**, not by a JS `import`. If you want `next/image`'s
build-time optimisation of a local import instead, add that import in
[`src/data/mainServices.js`](../../data/mainServices.js) — the loader is the one
place allowed to turn data into JS values — and keep the JSON carrying only the
filename.

## Art direction

- Roughly square (~1:1) artwork.
- Transparent or white background suits the light cards best.

## Suggested filenames (one per card, in data order)

| Card | Suggested file |
| ---- | -------------- |
| Custom Website Design & Development | `web-design.webp` |
| SEO Services | `seo.webp` |
| AI Automation | `ai-automation.webp` |
| Content Marketing | `content-marketing.webp` |
| Facebook Ads | `facebook-ads.webp` |
| Google Ads | `google-ads.webp` |
| Social Media Marketing | `social-media.webp` |
| Custom CRM for Your Business | `crm.webp` |
