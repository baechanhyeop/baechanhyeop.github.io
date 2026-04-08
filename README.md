# GitHub Pages Image Portfolio

This is a ready-to-publish static portfolio site for GitHub Pages.

## Quick setup

1. Put your own images in the `images` folder.
2. Replace image paths/titles/categories in `index.html`.
3. Push this folder to a GitHub repository.
4. In GitHub:
   - Go to **Settings** -> **Pages**
   - Under **Build and deployment**, set **Source** to **Deploy from a branch**
   - Choose your branch (`main`) and root folder (`/root`)
   - Save and wait for deployment

Your site URL will be:
- `https://<your-username>.github.io/<repo-name>/`

If this repository is named exactly `<your-username>.github.io`, URL will be:
- `https://<your-username>.github.io/`

## Notes

- `index.html` must stay at the repository root for this setup.
- Use relative paths like `images/my-photo.jpg`.
- Keep image names lowercase with hyphens for cleaner URLs.
