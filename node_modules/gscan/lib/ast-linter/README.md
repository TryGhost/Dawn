# ast-linter

ast-linter uses handlebars.js to generate an AST which is then walked, it
allows for more robust checks than our regex approach allows in certain cases.

Heavily inspired by, borrowed from, and generally ripped off of
https://github.com/ember-template-lint/ember-template-lint ❤️

## Usage

### Direct usage

```js
const ASTLinter = require('./lib/ast-linter'); // adapt path as needed

const linter = new ASTLinter();
const template = fs.readFileSync('some/path/to/template.hbs', {encoding: 'utf8'});
const parsed = ASTLinter.parse(template);
const results = linter.verify({parsed, moduleId: 'template.hbs', source: template});
```

`results` will be an array of objects which have the following properties:
* `rule` - The name of the rule that triggered this warning/error.
* `message` - The message that should be output.
* `line` - The line on which the error occurred.
* `column` - The column on which the error occurred.
* `moduleId` - The module path for the file containing the error.
* `source` - The source that caused the error.
* `fix` - An object describing how to fix the error.
