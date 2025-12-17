Basically 11ty in nunjucks flavor. Hosted on firebase hosting. Proxied through cloudlare.

General structure:

- `app` is the core of the website
  - `_data` is for 11ty variables, usually mappings and for consolidating highly-generated pages/content where it'd be annoying to create and manage many small files
  - `elements` is for reusable - or not - .html/.njk files that aren't intended to have their corresponding pages
  - `images` is for, well, images. Generally grouped by page.
  - `pages` contains the actual navigable-to pages. This is technically the input directory.
  - `static` is sorta like elements but for images. In general just css and other stuff that needs to be shipped to client as-is
  - _In general when it comes to size of content it'll be \_data<elements<pages_
- `.devcontainer`, `.github` and `config` have their own little READMES or comments
