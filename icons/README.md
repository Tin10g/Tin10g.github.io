# Browser Icon Files

Put your site icon files in this folder.

Recommended files:

- `favicon.svg`
- `favicon.png` if you prefer PNG and want to change `params.app.svgFavicon`
- `favicon-32x32.png`
- `favicon-16x16.png`
- `favicon.ico`
- `apple-touch-icon.png`
- `safari-pinned-tab.svg`

Current default:

- browser tab icon: `/icons/favicon.svg`

If you only want to use PNG for the browser tab icon, update this line in `hugo.toml`:

```toml
svgFavicon = "/icons/favicon.png"
```
