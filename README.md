Basically 11ty in nunjucks flavor. Hosted on firebase hosting. Proxied through cloudlare.

### 📊 Webpage Size Stats

| Browser | Transferred (WebP/Gzip) | Resting (Uncompressed) | Date |
| :------ | :---------------------- | :--------------------- | :--- |
| Chrome  | --                      | --                     | --   |

General structure:

- `src` is the core of the website
  - `data` is for 11ty variables, usually mappings and for consolidating highly-generated pages/content where it'd be annoying to create and manage many small files
  - `includes` is for reusable - or not - .html/.njk files that aren't intended to have their corresponding pages
  - `images` is for, well, images. Generally grouped by page.
  - `static` is sorta like elements but for images. In general just favicons and other stuff that needs to be shipped to client as-is.
  - Other stuff is the actual pages in the website.
- `.devcontainer`, `.github` and `config` have their own little READMES or comments
