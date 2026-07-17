# Main Services — card illustrations

Drop the service-card artwork here, then wire each file up in
[`src/data/mainServices.js`](../../data/mainServices.js). No JSX changes are needed —
each card renders its `image` when present and falls back to the gradient + `icon`
tile when `image` is `null`.

## How to add one

1. Add the file to this folder, e.g. `web-design.webp`.
2. Import it at the top of `src/data/mainServices.js`:
   ```js
   import webDesign from "@/assets/mainServices/web-design.webp";
   ```
3. Set it on the matching service:
   ```js
   image: webDesign,
   imageAlt: "Custom website design illustration",
   ```

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
