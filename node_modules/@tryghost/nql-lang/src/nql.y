%parse-param opt

%start expressions

%{
 /*
  * This chunk is included in the parser code, before the lexer definition section and after the parser has been defined.
  */

 parser.parseError = function(errStr, object) {
     var lines = errStr.split("\n");
     lines[0] = "Query Error: unexpected character in filter at char " + (object.loc.first_column + 1);
     throw new Error(lines.join("\n"));
 };

%}

%% /* language grammar */

expressions
    : expression {
        yy.debug('expression', $1);
        yy.debug('opt', opt);
        if ($1 && $1.yg) {
            return $1.yg; // Unwrap from 'yg' if present
        }
        return $1;
    }
    ;

expression
    : andCondition { yy.debug('andCondition', $1); $$ = $1; }
    | expression OR andCondition {
        yy.debug('expression OR andCondition', $1, $3);
        $1 = $1.$or ? $1 : {$or: [yy.ungroup($1)]};
        $1.$or.push(yy.ungroup($3)); $$ = $1;
    }
    ;

andCondition
    : filterExpr { yy.debug('filterExpr', $1); $$ = $1 }
    | andCondition AND filterExpr {
        yy.debug('andCondition AND filterExpr', $1, $3);
        $1 = $1.$and ? $1 : {$and: [yy.ungroup($1)]};
        $1.$and.push(yy.ungroup($3));
        $$ = $1;
    }
    ;

filterExpr
    : LPAREN expression RPAREN { yy.debug('LPAREN expression RPAREN', $2); $$ = {yg: $2}; }
    | propExpr valueExpr { $$ = {[$1]: $2}; }
    ;

propExpr
    : PROP { $1 = $1.replace(/:$/, ''); $1 = opt.aliases && opt.aliases[$1] ? opt.aliases[$1] : $1; $$ = $1; }
    ;

valueExpr
    : NOT REGEXPOP { $$ = {$not: $2}; }
    | REGEXPOP { $$ = {$regex: $1}; }
    | NOT LBRACKET inExpr RBRACKET { $$ = {$nin: $3}; }
    | LBRACKET inExpr RBRACKET { $$ = {$in: $2}; }
    | OP VALUE { $$ = {}; $$[$1] = $2; }
    | VALUE { $$ = $1; }
    ;

inExpr
    : inExpr OR VALUE { $$.push($3); }
    | VALUE { $$ = [$1]; }
    ;

VALUE
    : NULL { $$ = null }
    | TRUE { $$ = true }
    | FALSE { $$ = false }
    | NUMBER { $$ = parseInt(yytext); }
    | NOW DATEOP AMOUNT INTERVAL { $$ = yy.relDateToAbsolute($2, $3, $4) }
    | LITERAL { $$ = yy.unescape($1); }
    | STRING  { $1 = $1.replace(/^'|'$/g, ''); $$ = yy.unescape($1); }
    ;

DATEOP
   : ADD      { $$ = "add"; }
   | SUB      { $$ = "sub"; }
   ;

REGEXPOP
    : CONTAINS STRING { $2 = $2.replace(/^'|'$/g, ''); $2 = yy.unescape($2); $$ = yy.stringToRegExp($2); }
    | STARTSWITH STRING { $2 = $2.replace(/^'|'$/g, ''); $2 = yy.unescape($2); $$ = yy.stringToRegExp($2, '^'); }
    | ENDSWITH STRING { $2 = $2.replace(/^'|'$/g, ''); $2 = yy.unescape($2); $$ = yy.stringToRegExp($2, '$'); }
    ;

OP
    : NOT { $$ = "$ne"; }
    | GT { $$ = "$gt"; }
    | LT { $$ = "$lt"; }
    | GTE { $$ = "$gte"; }
    | LTE { $$ = "$lte"; }
    ;
