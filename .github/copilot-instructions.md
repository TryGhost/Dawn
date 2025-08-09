# Copilot Instructions for Dawn Ghost Theme

## Repository Overview

This is a **Ghost theme** called "Dawn" - a highly functional theme that adapts to reader preferences. It's forked from TryGhost/Dawn and uses modern web technologies with a Gulp-based build system.

### Technology Stack
- **Ghost Theme Engine**: Handlebars (.hbs) templates
- **Build System**: Gulp 5.0.1 with PostCSS
- **CSS Processing**: PostCSS with autoprefixer, cssnano, easy-import
- **JavaScript**: Concatenated and minified with gulp-uglify
- **Package Manager**: Yarn (v1.22.22)
- **Node.js**: v20.19.4
- **Theme Validation**: gscan 5.0.0

## Quick Start Commands

**Trust these exact commands - they work reliably:**

```bash
# Install dependencies (takes ~3-4 minutes)
yarn install

# Validate theme (0.4s)
yarn test

# Build assets only (2s)
npx gulp build

# Development with live reload
yarn dev

# Build and package theme for upload (3s)
yarn zip
```

## Project Architecture

### Template Structure (33 .hbs files)
- **Root templates**: `index.hbs`, `post.hbs`, `page.hbs`, `tag.hbs`, `author.hbs`, `default.hbs`
- **Custom templates**: `custom-full-feature-image.hbs`, `custom-narrow-feature-image.hbs`, `custom-no-feature-image.hbs`
- **Partials directory**: `partials/` contains reusable components like `loop.hbs`, `pagination.hbs`, `comments.hbs`

### Asset Structure
```
assets/
├── built/           # Generated files (DO NOT EDIT)
├── css/            # Source CSS files
├── fonts/          # Font files
├── images/         # Theme images
└── js/             # JavaScript source files
```

### Build System Files
- **gulpfile.js**: Main build configuration with CSS/JS processing
- **package.json**: Dependencies and scripts configuration

## Development Workflow

### CSS Development
1. Edit files in `assets/css/` (source)
2. Run `yarn dev` for live compilation to `assets/built/`
3. CSS is processed through PostCSS pipeline: easy-import → autoprefixer → cssnano

### Template Development  
1. Edit `.hbs` files in root or `partials/`
2. Changes trigger live reload when using `yarn dev`
3. Follow Ghost's Handlebars template syntax

### JavaScript Development
1. Edit files in `assets/js/`
2. Files are concatenated in order: shared-theme-assets → lib/*.js → main.js
3. Output is minified to `assets/built/main.min.js`

## Ghost Theme Specifics

### Theme Configuration
- **Ghost compatibility**: >=5.0.0
- **Posts per page**: 5
- **Image sizes**: xs(150), s(400), m(750), l(960), xl(1140), xxl(1920)
- **Custom settings**: Navigation layout, fonts, color scheme, featured posts

### Key Ghost Features
- Card assets enabled
- Custom navigation layouts
- Dark/light mode support  
- Featured posts section
- Related posts
- Author pages
- Search functionality

## Validation & Testing

### Theme Validation
```bash
yarn test  # Runs gscan validation
```
This validates Ghost theme compliance and compatibility.

### Build Validation
```bash
npx gulp build  # Test CSS/JS compilation
yarn zip        # Test full packaging
```

## Common Build Issues & Solutions

### Missing Dependencies
```bash
yarn install  # Reinstall if node_modules issues
```

### CSS Not Compiling
- Check `assets/css/screen.css` exists (main entry point)
- Verify PostCSS syntax in CSS files
- Run `npx gulp build` to test compilation

### JavaScript Errors
- Check `assets/js/main.js` exists
- Verify no syntax errors in JS files
- Shared theme assets are automatically included

### Theme Upload Issues
- Use `yarn zip` to create `dist/dawn.zip`
- Upload the generated zip file to Ghost admin
- Ensure all required template files are present

## Key Dependencies

### Build Tools
- **gulp**: Task runner for asset processing
- **postcss**: CSS transformation pipeline
- **autoprefixer**: Automatic vendor prefix addition
- **cssnano**: CSS minification
- **gulp-uglify**: JavaScript minification

### Ghost Specific
- **gscan**: Ghost theme validation tool
- **@tryghost/shared-theme-assets**: Shared JavaScript utilities

## File Structure Quick Reference

```
├── *.hbs                    # Ghost template files
├── partials/                # Reusable template components  
├── assets/
│   ├── css/                # Source stylesheets
│   ├── js/                 # Source JavaScript
│   └── built/              # Generated assets (auto-created)
├── gulpfile.js             # Build configuration
├── package.json            # Dependencies & scripts
└── dist/                   # Generated theme package
```

## Tips for Efficient Development

1. **Always run `yarn dev`** for development - provides live reload
2. **Test theme with `yarn test`** before making major changes
3. **Use `yarn zip`** to package for Ghost upload
4. **Don't edit `assets/built/`** - files are auto-generated
5. **Check gscan output** for Ghost compatibility issues
6. **Validate builds frequently** with `npx gulp build`

This theme follows Ghost's best practices and uses industry-standard tooling. The build system is stable and well-tested.