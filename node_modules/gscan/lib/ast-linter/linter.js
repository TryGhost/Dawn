const Handlebars = require('handlebars');
const {normalizePath} = require('../utils');
const defaultRules = require('./rules');

class Linter {
    /**
     *
     * @param {Object} [options]
     * @param {string[]?} options.partials - list of known theme partial names in ['mypartial', 'logo'] format
     * @param {string[]?} options.helpers - list of registered theme helper names in ['is', 'has'] format
     * @param {string[]?} options.inlinePartials - list of known local partial names in ['mypartial', 'logo'] format
     * @param {Object?} options.customThemeSettings - list of registered custom theme settings in {'main_accent':{}} format
     */
    constructor(options = {partials: [], helpers: [], inlinePartials: [], customThemeSettings: {}}) {
        this.options = options;
        // Ignore OS-specific path separator as Handlebars only uses forward-separators in its syntax
        this.options.partials = this.options.partials.map(partial => normalizePath(partial));

        this.partials = [];
        this.helpers = [];
        this.inlinePartials = [];
        this.customThemeSettings = [];
        this.usedPageProperties = [];
    }

    /**
     *
     * @param {Object} config
     * @param {Object[]} config.rules - instances of AST Rule classes
     * @param {Function} config.log - rule check reporting log function
     * @param {string} config.source - content on the Handlebars template to be checked
     *
     * @returns {Scanner} instance of a Scanner class
     */
    buildScanner(config) {
        const nodeHandlers = [];

        for (const ruleName in config.rules) {
            let Rule = config.rules[ruleName];
            let rule = new Rule({
                name: ruleName,
                log: config.log,
                source: config.source,
                partials: this.options.partials,
                helpers: this.options.helpers,
                inlinePartials: this.options.inlinePartials,
                customThemeSettings: this.options.customThemeSettings
            });

            nodeHandlers.push({
                rule,
                visitor: rule.getVisitor()
            });
        }

        function Scanner() {
            this.context = {
                partials: [],
                helpers: [],
                inlinePartials: [],
                customThemeSettings: [],
                usedPageProperties: []
            };
        }
        Scanner.prototype = new Handlebars.Visitor();

        const nodeTypes = [
            'Program',
            'MustacheStatement',
            'BlockStatement',
            'PartialStatement',
            'PartialBlockStatement',
            'PathExpression',
            'SubExpression',
            'DecoratorBlock'
            // the following types are not used in Ghost or we don't validate
            // 'ContentStatement',
            // 'CommentStatement,
            // 'Decorator',
        ];

        nodeTypes.forEach((nodeType) => {
            Scanner.prototype[nodeType] = function (node) {
                nodeHandlers.forEach((handler) => {
                    if (handler.visitor[nodeType]) {
                        handler.visitor[nodeType].call(handler.rule, node, this);
                    }
                });

                Handlebars.Visitor.prototype[nodeType].call(this, node);
            };
        });

        const scanner = new Scanner();

        nodeHandlers.forEach((handler) => {
            handler.rule.scanner = scanner;
        });

        return scanner;
    }

    /**
   * The main function for the Linter class.  It takes the source code to lint
   * and returns the results.
   *
   * @param {Object} options
   * @param {string} options.source - The source code to verify.
   * @param {Object} options.parsed - The parsing results.
   * @param {Object} options.parsed.ast - The ast tree to lint.
   * @param {Object} options.parsed.error - An error that happened when parsing.
   * @param {string} options.moduleId - Name of the source code to identify by.
   * @param {BaseRule[]} options.rules - Array of Rule class instances to use for verification.
   *
   * @returns {LintResult[]} messages - lint results.
   */
    verify(options) {
        const messages = [];

        function addToMessages(_message) {
            let message = Object.assign({}, {moduleId: options.moduleId}, _message);
            messages.push(message);
        }

        const scannerConfig = {
            rules: options.rules || defaultRules,
            log: addToMessages,
            source: options.source
        };

        const scanner = this.buildScanner(scannerConfig);

        if (options.parsed.error) {
            const err = options.parsed.error;
            addToMessages({
                message: err.message,
                fatal: true,
                column: err.column,
                line: err.lineNumber
            });

            return messages;
        }

        scanner.accept(options.parsed.ast);

        if (scanner.context.partials) {
            this.partials = scanner.context.partials;
        }

        if (scanner.context.helpers) {
            this.helpers = scanner.context.helpers.map(p => ({
                name: p.node,
                helperType: p.helperType
            }));
        }

        if (scanner.context.customThemeSettings) {
            this.customThemeSettings = scanner.context.customThemeSettings;
        }

        if (scanner.context.inlinePartials) {
            this.inlinePartials = scanner.context.inlinePartials;
        }

        if (scanner.context.usedPageProperties) {
            this.usedPageProperties = scanner.context.usedPageProperties;
        }

        return messages;
    }
}

module.exports = Linter;

/**
 * @typedef {Object} LintResult
 *  @prop {string} rule - The name of the rule that triggered this warning/error.
 *  @prop {string} message - The message that should be output.
 *  @prop {number} line - The line on which the error occurred.
 *  @prop {number} column - The column on which the error occurred.
 *  @prop {string} moduleId - The module path for the file containing the error.
 *  @prop {string} source - The source that caused the error.
 *  @prop {string} fix - An object describing how to fix the error.
 */

/**
 * @typedef {import('./rules/base')} BaseRule
 */
