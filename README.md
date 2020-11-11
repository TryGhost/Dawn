# Dawn

A highly functional theme that adapts to the reader's preferences. Let them read, search, subscribe, navigate, and more with ease. Completely free and fully responsive, released under the MIT license.

**Demo: https://dawn.ghost.io**

&nbsp;

# Instructions

1. [Download this theme](https://github.com/TryGhost/Dawn/archive/master.zip)
2. Log into Ghost, and go to the `Design` settings area to upload the zip file

# Search

1. Generate a content API key in `Integrations` section which will be used to fetch posts from your site.
2. Insert the generated key in `Code injection > Site Header` field.

```html
<script>
    var gh_search_key = 'API_KEY';
    var gh_search_migration = 'v1';
</script>
```

The theme generates an index of posts for highly performant search. The index is updated automatically when posts are added or updated. However, it isn't updated when posts are unpublished or deleted.

To force update the index, increment the search index migration version like `'v2'`.

## Disable Content Search

When your site has lots of posts, including the post content in the index cache ends up with exceeding the browser local storage quota. In that case, disabling content search is recommended. Also make sure increase the migration version to force update the old index.

```html
<script>
    var gh_search_key = 'API_KEY';
    var gh_search_migration = 'v2'; // Increased from v1
    var gh_search_content = false; // Disables content search
</script>
```

# White Logo

If your logo image isn't recognizable in dark mode, you can set a white version of the logo in `Code injection > Site Header` field.

```html
<script>
    var gh_white_logo = 'https://example.com/content/images/white-logo.png';
</script>
```

# Development

Styles are compiled using Gulp/PostCSS to polyfill future CSS spec. You'll need [Node](https://nodejs.org/), [Yarn](https://yarnpkg.com/) and [Gulp](https://gulpjs.com) installed globally. After that, from the theme's root directory:

```bash
# Install
yarn

# Run build & watch for changes
$ yarn dev
```

Now you can edit `/assets/css/` files, which will be compiled to `/assets/built/` automatically.

The `zip` Gulp task packages the theme files into `dist/<theme-name>.zip`, which you can then upload to your site.

```bash
yarn zip
```

# PostCSS Features Used

- Autoprefixer - Don't worry about writing browser prefixes of any kind, it's all done automatically with support for the latest 2 major versions of every browser.

# Copyright & License

Copyright (c) 2013-2020 Ghost Foundation - Released under the [MIT license](LICENSE).
