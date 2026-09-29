# Downloadable resources

The three buttons at the foot of the left-hand panel in the **Book Your Free
Consultation** section link straight at files in this folder. They are plain
`<a download>` links — no form, no gate, no JavaScript — so a file becomes live
the moment it is uploaded, with no rebuild and no code change.

Drop these three in, spelled exactly like this:

| Button on the site         | File this folder must contain        |
| -------------------------- | ------------------------------------ |
| Technical Audit Checklist  | `technical-audit-checklist.pdf`      |
| Sales Deck                 | `sales-deck.pdf`                     |
| Brochures                  | `brochures.pdf`                      |

Until a file is uploaded its button returns a 404 on click. Nothing else
breaks, and the button still renders — so it is safe to ship the section before
all three PDFs exist.

## Changing a name, a link or the copy

Everything the buttons say and point at lives in
`src/data/content/consultationCta.json` under `content.resources`:

```json
"resources": {
  "label": "Take something with you",
  "items": [
    {
      "label": "Technical Audit Checklist",
      "desc": "The 20-point check we run on every site.",
      "file": "/downloads/technical-audit-checklist.pdf"
    }
  ]
}
```

`file` is a URL, not a path on disk, so it does not have to stay in this
folder — point it at an external host and the button follows, no other change
needed. Add or remove an entry in `items` and the section renders one more or
one fewer button; nothing is hard-coded to three.

## Why the files are not in the repo

They are marketing collateral that changes on its own schedule and does not
need a deploy to update — on a static export, `public/` is copied verbatim into
`out/`, so uploading a PDF straight to `public_html/downloads/` on the server
is enough. Keep this README here so the folder survives in git even when it is
otherwise empty.
