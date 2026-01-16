require('./utils');
const {lex} = require('../');

describe('Lexer', function () {
    const lexicalError = /^Query Error: unrecognized text/;

    describe('Symbols', function () {
        it('can recognise -', function () {
            lex('-').should.eql([{token: 'NOT', matched: '-'}]);
        });
        it('can recognise +', function () {
            lex('+').should.eql([{token: 'AND', matched: '+'}]);
        });
        it('can recognise ,', function () {
            lex(',').should.eql([{token: 'OR', matched: ','}]);
        });
        it('can recognise [', function () {
            lex('[').should.eql([{token: 'LBRACKET', matched: '['}]);
        });
        it('can recognise ]', function () {
            lex(']').should.eql([{token: 'RBRACKET', matched: ']'}]);
        });
        it('can recognise (', function () {
            lex('(').should.eql([{token: 'LPAREN', matched: '('}]);
        });
        it('can recognise )', function () {
            lex(')').should.eql([{token: 'RPAREN', matched: ')'}]);
        });
        it('can recognise >', function () {
            lex('>').should.eql([{token: 'GT', matched: '>'}]);
        });
        it('can recognise <', function () {
            lex('<').should.eql([{token: 'LT', matched: '<'}]);
        });
        it('can recognise >=', function () {
            lex('>=').should.eql([{token: 'GTE', matched: '>='}]);
        });
        it('can recognise <=', function () {
            lex('<=').should.eql([{token: 'LTE', matched: '<='}]);
        });
        it('can recognise ~', function () {
            lex('~').should.eql([{token: 'CONTAINS', matched: '~'}]);
        });
        it('can recognise ~^', function () {
            lex('~^').should.eql([{token: 'STARTSWITH', matched: '~^'}]);
        });
        it('can recognise ~$', function () {
            lex('~$').should.eql([{token: 'ENDSWITH', matched: '~$'}]);
        });

        it('cannot recognise :', function () {
            (function () {
                lex(':');
            }).should.throw(lexicalError);
        });
        it('cannot recognise =', function () {
            (function () {
                lex('=');
            }).should.throw(lexicalError);
        });
        it('cannot recognise "', function () {
            (function () {
                lex('"');
            }).should.throw(lexicalError);
        });
        it('cannot recognise \'', function () {
            (function () {
                lex('\'');
            }).should.throw(lexicalError);
        });
    });

    describe('VALUES', function () {
        it('can recognise null', function () {
            lex('null').should.eql([{token: 'NULL', matched: 'null'}]);
        });

        it('can recognise true', function () {
            lex('true').should.eql([{token: 'TRUE', matched: 'true'}]);
        });

        it('can recognise false', function () {
            lex('false').should.eql([{token: 'FALSE', matched: 'false'}]);
        });

        it('can recognise NULL', function () {
            lex('NULL').should.eql([{token: 'NULL', matched: 'NULL'}]);
        });

        it('can recognise TRUE', function () {
            lex('TRUE').should.eql([{token: 'TRUE', matched: 'TRUE'}]);
        });

        it('can recognise FALSE', function () {
            lex('FALSE').should.eql([{token: 'FALSE', matched: 'FALSE'}]);
        });

        it('can recognise Null', function () {
            lex('Null').should.eql([{token: 'NULL', matched: 'Null'}]);
        });

        it('can recognise True', function () {
            lex('True').should.eql([{token: 'TRUE', matched: 'True'}]);
        });

        it('can recognise False', function () {
            lex('False').should.eql([{token: 'FALSE', matched: 'False'}]);
        });

        it('can recognise a LITERAL', function () {
            lex('six').should.eql([{token: 'LITERAL', matched: 'six'}]);
        });

        it('can recognise a STRING', function () {
            lex('\'six\'').should.eql([{token: 'STRING', matched: '\'six\''}]);
        });

        it('can recognise a NUMBER', function () {
            lex('6').should.eql([{token: 'NUMBER', matched: '6'}]);
        });

        it('does not confuse keywords in LITERALs', function () {
            lex('strueth').should.eql([{token: 'LITERAL', matched: 'strueth'}]);
            lex('trueth').should.eql([{token: 'LITERAL', matched: 'trueth'}]);
            lex('true_thing').should.eql([{token: 'LITERAL', matched: 'true_thing'}]);
            lex('true-thing').should.eql([{token: 'LITERAL', matched: 'true-thing'}]);
            lex('nullable').should.eql([{token: 'LITERAL', matched: 'nullable'}]);
            lex('its-nullable').should.eql([{token: 'LITERAL', matched: 'its-nullable'}]);
            lex('notnullable').should.eql([{token: 'LITERAL', matched: 'notnullable'}]);
            lex('null-thing').should.eql([{token: 'LITERAL', matched: 'null-thing'}]);
            lex('its-a-null-thing').should.eql([{token: 'LITERAL', matched: 'its-a-null-thing'}]);
        });

        it('does not confuse keywords in STRINGs', function () {
            lex('\'strueth\'').should.eql([{token: 'STRING', matched: '\'strueth\''}]);
            lex('\'trueth\'').should.eql([{token: 'STRING', matched: '\'trueth\''}]);
            lex('\'true_thing\'').should.eql([{token: 'STRING', matched: '\'true_thing\''}]);
            lex('\'true-thing\'').should.eql([{token: 'STRING', matched: '\'true-thing\''}]);
            lex('\'nullable\'').should.eql([{token: 'STRING', matched: '\'nullable\''}]);
            lex('\'its-nullable\'').should.eql([{token: 'STRING', matched: '\'its-nullable\''}]);
            lex('\'notnullable\'').should.eql([{token: 'STRING', matched: '\'notnullable\''}]);
            lex('\'null-thing\'').should.eql([{token: 'STRING', matched: '\'null-thing\''}]);
            lex('\'its-a-null-thing\'').should.eql([{token: 'STRING', matched: '\'its-a-null-thing\''}]);
        });
    });

    describe('LITERAL values', function () {
        it('should match literals', function () {
            lex('myvalue').should.eql([
                {token: 'LITERAL', matched: 'myvalue'}
            ]);
            lex('my value').should.eql([
                {token: 'LITERAL', matched: 'my'},
                {token: 'LITERAL', matched: 'value'}
            ]);
            lex('my-value').should.eql([
                {token: 'LITERAL', matched: 'my-value'}
            ]);
            lex('my&value!').should.eql([
                {token: 'LITERAL', matched: 'my&value!'}
            ]);
            lex('my&valu\\\'e!').should.eql([
                {token: 'LITERAL', matched: 'my&valu\\\'e!'}
            ]);
            (function () {
                lex('my&valu\'e!');
            }).should.throw(lexicalError);
            lex('a').should.eql([
                {token: 'LITERAL', matched: 'a'}
            ]);
            lex('a-b').should.eql([
                {token: 'LITERAL', matched: 'a-b'}
            ]);
            lex('a+bc').should.eql([
                {token: 'LITERAL', matched: 'a'},
                {token: 'AND', matched: '+'},
                {token: 'LITERAL', matched: 'bc'}
            ]);
        });

        it('should separate NOT at beginning of literal', function () {
            lex('-photo').should.eql([
                {token: 'NOT', matched: '-'},
                {token: 'LITERAL', matched: 'photo'}
            ]);

            lex('-photo-graph').should.eql([
                {token: 'NOT', matched: '-'},
                {token: 'LITERAL', matched: 'photo-graph'}
            ]);
        });

        it('should NOT permit special chars inside a literal', function () {
            (function () {
                lex('t,st');
            }).should.throw(lexicalError);
            (function () {
                lex('t(st');
            }).should.throw(lexicalError);
            (function () {
                lex('t)st');
            }).should.throw(lexicalError);
            (function () {
                lex('t>st');
            }).should.throw(lexicalError);
            (function () {
                lex('t<st');
            }).should.throw(lexicalError);
            (function () {
                lex('t=st');
            }).should.throw(lexicalError);
            (function () {
                lex('t[st');
            }).should.throw(lexicalError);
            (function () {
                lex('t]st');
            }).should.throw(lexicalError);
            (function () {
                lex('t\'st');
            }).should.throw(lexicalError);
            (function () {
                lex('t"st');
            }).should.throw(lexicalError);
        });

        it('should not match special chars at the start of a literal', function () {
            lex('+test').should.eql([
                {token: 'AND', matched: '+'},
                {token: 'LITERAL', matched: 'test'}
            ]);
            lex(',test').should.eql([
                {token: 'OR', matched: ','},
                {token: 'LITERAL', matched: 'test'}
            ]);
            lex('(test').should.eql([
                {token: 'LPAREN', matched: '('},
                {token: 'LITERAL', matched: 'test'}
            ]);
            lex(')test').should.eql([
                {token: 'RPAREN', matched: ')'},
                {token: 'LITERAL', matched: 'test'}
            ]);
            lex('>test').should.eql([
                {token: 'GT', matched: '>'},
                {token: 'LITERAL', matched: 'test'}
            ]);
            lex('<test').should.eql([
                {token: 'LT', matched: '<'},
                {token: 'LITERAL', matched: 'test'}
            ]);
            lex('[test').should.eql([
                {token: 'LBRACKET', matched: '['},
                {token: 'LITERAL', matched: 'test'}
            ]);
            lex(']test').should.eql([
                {token: 'RBRACKET', matched: ']'},
                {token: 'LITERAL', matched: 'test'}
            ]);
            lex('>=test').should.eql([
                {token: 'GTE', matched: '>='},
                {token: 'LITERAL', matched: 'test'}
            ]);
            lex('<=test').should.eql([
                {token: 'LTE', matched: '<='},
                {token: 'LITERAL', matched: 'test'}
            ]);

            (function () {
                lex('=test');
            }).should.throw(lexicalError);
            (function () {
                lex('"test');
            }).should.throw(lexicalError);
            (function () {
                lex('\'test');
            }).should.throw(lexicalError);
        });

        it('should not match special chars at the end of a literal', function () {
            lex('test+').should.eql([
                {token: 'LITERAL', matched: 'test'},
                {token: 'AND', matched: '+'}
            ]);
            lex('test,').should.eql([
                {token: 'LITERAL', matched: 'test'},
                {token: 'OR', matched: ','}
            ]);
            lex('test(').should.eql([
                {token: 'LITERAL', matched: 'test'},
                {token: 'LPAREN', matched: '('}
            ]);
            lex('test)').should.eql([
                {token: 'LITERAL', matched: 'test'},
                {token: 'RPAREN', matched: ')'}
            ]);
            lex('test>').should.eql([
                {token: 'LITERAL', matched: 'test'},
                {token: 'GT', matched: '>'}
            ]);
            lex('test<').should.eql([
                {token: 'LITERAL', matched: 'test'},
                {token: 'LT', matched: '<'}
            ]);
            lex('test[').should.eql([
                {token: 'LITERAL', matched: 'test'},
                {token: 'LBRACKET', matched: '['}
            ]);
            lex('test]').should.eql([
                {token: 'LITERAL', matched: 'test'},
                {token: 'RBRACKET', matched: ']'}
            ]);
            lex('test>=').should.eql([
                {token: 'LITERAL', matched: 'test'},
                {token: 'GTE', matched: '>='}
            ]);
            lex('test<=').should.eql([
                {token: 'LITERAL', matched: 'test'},
                {token: 'LTE', matched: '<='}
            ]);
            (function () {
                lex('test=');
            }).should.throw(lexicalError);
            (function () {
                lex('test"');
            }).should.throw(lexicalError);
            (function () {
                lex('test\'');
            }).should.throw(lexicalError);
        });

        it('should permit escaped special chars inside a literal', function () {
            lex('t\\+st').should.eql([{token: 'LITERAL', matched: 't\\+st'}]);
            lex('t\\,st').should.eql([{token: 'LITERAL', matched: 't\\,st'}]);
            lex('t\\(st').should.eql([{token: 'LITERAL', matched: 't\\(st'}]);
            lex('t\\)st').should.eql([{token: 'LITERAL', matched: 't\\)st'}]);
            lex('t\\>st').should.eql([{token: 'LITERAL', matched: 't\\>st'}]);
            lex('t\\<st').should.eql([{token: 'LITERAL', matched: 't\\<st'}]);
            lex('t\\=st').should.eql([{token: 'LITERAL', matched: 't\\=st'}]);
            lex('t\\[st').should.eql([{token: 'LITERAL', matched: 't\\[st'}]);
            lex('t\\]st').should.eql([{token: 'LITERAL', matched: 't\\]st'}]);
            lex('t\\\'st').should.eql([{token: 'LITERAL', matched: 't\\\'st'}]);
            lex('t\\"st').should.eql([{token: 'LITERAL', matched: 't\\"st'}]);
        });
    });

    describe('LITERAL vs PROP', function () {
        it('should match colon in string as PROP before, literal after', function () {
            lex(':test').should.eql([
                {token: 'LITERAL', matched: ':test'}
            ]);

            lex('te:st').should.eql([
                {token: 'PROP', matched: 'te:'},
                {token: 'LITERAL', matched: 'st'}
            ]);

            lex('test:').should.eql([
                {token: 'PROP', matched: 'test:'}
            ]);
        });

        it('should only match colon-at-end as PROP if PROP is valPROP', function () {
            lex('te!:st').should.eql([
                {token: 'LITERAL', matched: 'te!:st'}
            ]);

            lex('post-count:6').should.eql([
                {token: 'LITERAL', matched: 'post-count:6'}
            ]);

            lex('post_count:6').should.eql([
                {token: 'PROP', matched: 'post_count:'},
                {token: 'NUMBER', matched: '6'}
            ]);
        });
    });

    describe('STRING values', function () {
        it('can recognise simple STRING', function () {
            lex('\'magic\'').should.eql([{token: 'STRING', matched: '\'magic\''}]);
            lex('\'magic mystery\'').should.eql([{token: 'STRING', matched: '\'magic mystery\''}]);
            lex('\'magic 123\'').should.eql([{token: 'STRING', matched: '\'magic 123\''}]);
        });

        it('can recognise multiple STRING values', function () {
            lex('\'magic\'\'mystery\'').should.eql([
                {token: 'STRING', matched: '\'magic\''},
                {token: 'STRING', matched: '\'mystery\''}
            ]);
            lex('\'magic\' \'mystery\'').should.eql([
                {token: 'STRING', matched: '\'magic\''},
                {token: 'STRING', matched: '\'mystery\''}
            ]);
            lex('\'magic\',\'mystery\'').should.eql([
                {token: 'STRING', matched: '\'magic\''},
                {token: 'OR', matched: ','},
                {token: 'STRING', matched: '\'mystery\''}
            ]);
            lex('[\'magic\',\'mystery\']').should.eql([
                {token: 'LBRACKET', matched: '['},
                {token: 'STRING', matched: '\'magic\''},
                {token: 'OR', matched: ','},
                {token: 'STRING', matched: '\'mystery\''},
                {token: 'RBRACKET', matched: ']'}
            ]);
        });

        it('can recognise a single character STRING', function () {
            lex('\'x\'').should.eql([{token: 'STRING', matched: '\'x\''}]);
            lex('\'+\'').should.eql([{token: 'STRING', matched: '\'+\''}]);
            lex('\',\'').should.eql([{token: 'STRING', matched: '\',\''}]);
            lex('\'-\'').should.eql([{token: 'STRING', matched: '\'-\''}]);
            lex('\'>\'').should.eql([{token: 'STRING', matched: '\'>\''}]);
            lex('\'<\'').should.eql([{token: 'STRING', matched: '\'<\''}]);
            lex('\'~\'').should.eql([{token: 'STRING', matched: '\'~\''}]);
        });

        it('can recognise STRING with special characters', function () {
            lex('\'magic+\'').should.eql([{token: 'STRING', matched: '\'magic+\''}]);
            lex('\'magic,\'').should.eql([{token: 'STRING', matched: '\'magic,\''}]);
            lex('\'magic-\'').should.eql([{token: 'STRING', matched: '\'magic-\''}]);
            lex('\'magic>\'').should.eql([{token: 'STRING', matched: '\'magic>\''}]);
            lex('\'magic<\'').should.eql([{token: 'STRING', matched: '\'magic<\''}]);
            lex('\'magic~\'').should.eql([{token: 'STRING', matched: '\'magic~\''}]);
        });

        it('should permit special chars inside a STRING, not including quotes', function () {
            lex('\'t+st\'').should.eql([{token: 'STRING', matched: '\'t+st\''}]);
            lex('\'t,st\'').should.eql([{token: 'STRING', matched: '\'t,st\''}]);
            lex('\'t(st\'').should.eql([{token: 'STRING', matched: '\'t(st\''}]);
            lex('\'t)st\'').should.eql([{token: 'STRING', matched: '\'t)st\''}]);
            lex('\'t>st\'').should.eql([{token: 'STRING', matched: '\'t>st\''}]);
            lex('\'t<st\'').should.eql([{token: 'STRING', matched: '\'t<st\''}]);
            lex('\'t=st\'').should.eql([{token: 'STRING', matched: '\'t=st\''}]);
            lex('\'t[st\'').should.eql([{token: 'STRING', matched: '\'t[st\''}]);
            lex('\'t]st\'').should.eql([{token: 'STRING', matched: '\'t]st\''}]);
            lex('\'t~st\'').should.eql([{token: 'STRING', matched: '\'t~st\''}]);
            lex('\'t^st\'').should.eql([{token: 'STRING', matched: '\'t^st\''}]);
            lex('\'t$st\'').should.eql([{token: 'STRING', matched: '\'t$st\''}]);
        });

        it('should NOT permit quotes inside a STRING', function () {
            (function () {
                lex('\'t\'st\'');
            }).should.throw(lexicalError);
            (function () {
                lex('\'t"st\'');
            }).should.throw(lexicalError);
        });

        it('should permit escaped quotes inside a String', function () {
            lex('\'t\\\'st\'').should.eql([{token: 'STRING', matched: '\'t\\\'st\''}]);
            lex('\'t\\"st\'').should.eql([{token: 'STRING', matched: '\'t\\"st\''}]);
            lex(`'t\\'st'`).should.eql([{token: 'STRING', matched: '\'t\\\'st\''}]);
            lex(`'john o\\'nolan'`).should.eql([{token: 'STRING', matched: '\'john o\\\'nolan\''}]);
        });

        // Would be amazing if we could support this
        it.skip('should permit quotes in the middle of a string', function () {
            lex(`'john o'nolan'`).should.eql([{token: 'STRING', matched: '\'john o\'nolan\''}]);
        });
    });

    describe('single & double QUOTE marks', function () {
        it('CANNOT match an UNescaped double quote in a LITERAL', function () {
            (function () {
                lex('thing"amabob');
            }).should.throw(lexicalError);
        });
        it('CANNOT match an UNescaped single quote in a LITERAL', function () {
            (function () {
                lex('thing\'amabob');
            }).should.throw(lexicalError);
        });
        it('CANNOT match an UNescaped double quote in a STRING', function () {
            (function () {
                lex('\'thing"amabob\'');
            }).should.throw(lexicalError);
        });
        it('CANNOT match an UNescaped single quote in a STRING', function () {
            (function () {
                lex('\'thing\'amabob\'');
            }).should.throw(lexicalError);
        });
        it('CAN match an escaped double quote in a LITERAL', function () {
            lex('thing\\"amabob').should.eql([{token: 'LITERAL', matched: 'thing\\"amabob'}]);
        });
        it('CAN match an escaped single quote in a LITERAL', function () {
            lex('thing\\\'amabob').should.eql([{token: 'LITERAL', matched: 'thing\\\'amabob'}]);
        });
        it('CAN match an escaped double quote in a STRING', function () {
            lex('\'thing\\"amabob\'').should.eql([{token: 'STRING', matched: '\'thing\\"amabob\''}]);
        });
        it('CAN match an escaped single quote in a STRING', function () {
            lex('\'thing\\\'amabob\'').should.eql([{token: 'STRING', matched: '\'thing\\\'amabob\''}]);
        });
    });

    describe('Filter expressions', function () {
        it('should separate NOT at beginning of literal', function () {
            lex('tag:-photo').should.eql([
                {token: 'PROP', matched: 'tag:'},
                {token: 'NOT', matched: '-'},
                {token: 'LITERAL', matched: 'photo'}
            ]);

            lex('tag:-photo-graph').should.eql([
                {token: 'PROP', matched: 'tag:'},
                {token: 'NOT', matched: '-'},
                {token: 'LITERAL', matched: 'photo-graph'}
            ]);

            lex('tags:[-getting-started]').should.eql([
                {token: 'PROP', matched: 'tags:'},
                {token: 'LBRACKET', matched: '['},
                {token: 'NOT', matched: '-'},
                {token: 'LITERAL', matched: 'getting-started'},
                {token: 'RBRACKET', matched: ']'}
            ]);
        });

        it('should permit NOT inside a literal', function () {
            lex('tags:getting-started').should.eql([
                {token: 'PROP', matched: 'tags:'},
                {token: 'LITERAL', matched: 'getting-started'}
            ]);

            lex('tags:[getting-started]').should.eql([
                {token: 'PROP', matched: 'tags:'},
                {token: 'LBRACKET', matched: '['},
                {token: 'LITERAL', matched: 'getting-started'},
                {token: 'RBRACKET', matched: ']'}
            ]);

            lex('tags:-[getting-started]').should.eql([
                {token: 'PROP', matched: 'tags:'},
                {token: 'NOT', matched: '-'},
                {token: 'LBRACKET', matched: '['},
                {token: 'LITERAL', matched: 'getting-started'},
                {token: 'RBRACKET', matched: ']'}
            ]);

            lex('id:-1+tags:[getting-started]').should.eql([
                {token: 'PROP', matched: 'id:'},
                {token: 'NOT', matched: '-'},
                {token: 'NUMBER', matched: '1'},
                {token: 'AND', matched: '+'},
                {token: 'PROP', matched: 'tags:'},
                {token: 'LBRACKET', matched: '['},
                {token: 'LITERAL', matched: 'getting-started'},
                {token: 'RBRACKET', matched: ']'}
            ]);
        });

        it('should permit contains operators with and without not', function () {
            lex('email:~gmail.com').should.eql([
                {token: 'PROP', matched: 'email:'},
                {token: 'CONTAINS', matched: '~'},
                {token: 'LITERAL', matched: 'gmail.com'}
            ]);

            lex('email:-~gmail.com').should.eql([
                {token: 'PROP', matched: 'email:'},
                {token: 'NOT', matched: '-'},
                {token: 'CONTAINS', matched: '~'},
                {token: 'LITERAL', matched: 'gmail.com'}
            ]);

            lex('email:~^gmail.com').should.eql([
                {token: 'PROP', matched: 'email:'},
                {token: 'STARTSWITH', matched: '~^'},
                {token: 'LITERAL', matched: 'gmail.com'}
            ]);

            lex('email:-~^gmail.com').should.eql([
                {token: 'PROP', matched: 'email:'},
                {token: 'NOT', matched: '-'},
                {token: 'STARTSWITH', matched: '~^'},
                {token: 'LITERAL', matched: 'gmail.com'}
            ]);

            lex('email:~$gmail.com').should.eql([
                {token: 'PROP', matched: 'email:'},
                {token: 'ENDSWITH', matched: '~$'},
                {token: 'LITERAL', matched: 'gmail.com'}
            ]);

            lex('email:-~$gmail.com').should.eql([
                {token: 'PROP', matched: 'email:'},
                {token: 'NOT', matched: '-'},
                {token: 'ENDSWITH', matched: '~$'},
                {token: 'LITERAL', matched: 'gmail.com'}
            ]);
        });
    });

    describe('Relative Date expressions', function () {
        it('Does not confuse LITERALs when they are almost relative dates with sub', function () {
            const cases = [
                'now-2',
                'now-12',
                'now-2Q',
                'now-2dQ',
                'now-2d1',
                'now-2D',
                'now-2W',
                'now-2Y',
                'its-now-2d',
                'its-now-2dY',
                'snow-2d',
                'snow-2dY'
            ];

            cases.forEach(function (testCase) {
                lex(testCase).should.eql([{token: 'LITERAL', matched: testCase}]);
            });
        });

        it('Does not confuse expressions when they are almost relative dates with add', function () {
            const cases = [
                'now+2',
                'now+12',
                'now+2Q',
                'now+2dQ',
                'now+2d1',
                'now+2D',
                'now+2W',
                'now+2Y'
            ];

            cases.forEach(function (testCase) {
                const result = lex(testCase);
                result.should.be.an.Array().with.lengthOf(3);
                result[0].should.eql({token: 'LITERAL', matched: 'now'});
                result[1].should.eql({token: 'AND', matched: '+'});
            });

            lex('its-now+2d').should.eql([
                {token: 'LITERAL', matched: 'its-now'},
                {token: 'AND', matched: '+'},
                {token: 'LITERAL', matched: '2d'}
            ]);
            lex('its-now+2dY').should.eql([
                {token: 'LITERAL', matched: 'its-now'},
                {token: 'AND', matched: '+'},
                {token: 'LITERAL', matched: '2dY'}
            ]);
            lex('snow+2d').should.eql([
                {token: 'LITERAL', matched: 'snow'},
                {token: 'AND', matched: '+'},
                {token: 'LITERAL', matched: '2d'}
            ]);
            lex('snow+2dY').should.eql([
                {token: 'LITERAL', matched: 'snow'},
                {token: 'AND', matched: '+'},
                {token: 'LITERAL', matched: '2dY'}
            ]);
        });

        it('can expand all valid intervals', function () {
            const intervals = {
                d: 'days',
                w: 'weeks',
                M: 'months',
                y: 'years',
                h: 'hours',
                m: 'minutes',
                s: 'seconds'
            };

            const cases = [
                'now-2d',
                'now-2w',
                'now-2M',
                'now-2y',
                'now-2h',
                'now-2m',
                'now-2s'
            ];

            cases.forEach(function (testCase, i) {
                const result = lex(testCase);
                result.should.be.an.Array().with.lengthOf(4);
                result[0].should.eql({token: 'NOW', matched: 'now'});
                result[1].should.eql({token: 'SUB', matched: '-'});
                result[2].should.eql({token: 'AMOUNT', matched: '2'});
                result[3].should.eql({token: 'INTERVAL', matched: Object.keys(intervals)[i]});
            });
        });

        describe('Full relative date expressions', function () {
            it('last_seen_at:>=now-2d', function () {
                lex('last_seen_at:>=now-2d').should.eql([
                    {token: 'PROP', matched: 'last_seen_at:'},
                    {token: 'GTE', matched: '>='},
                    {token: 'NOW', matched: 'now'},
                    {token: 'SUB', matched: '-'},
                    {token: 'AMOUNT', matched: '2'},
                    {token: 'INTERVAL', matched: 'd'}
                ]);
            });

            it('last_seen_at:>=now+2d', function () {
                lex('last_seen_at:>=now+2d').should.eql([
                    {token: 'PROP', matched: 'last_seen_at:'},
                    {token: 'GTE', matched: '>='},
                    {token: 'NOW', matched: 'now'},
                    {token: 'ADD', matched: '+'},
                    {token: 'AMOUNT', matched: '2'},
                    {token: 'INTERVAL', matched: 'd'}
                ]);
            });

            it('last_seen_at:>=now+2d+foo:bar', function () {
                lex('last_seen_at:>=now+2d+foo:bar').should.eql([
                    {token: 'PROP', matched: 'last_seen_at:'},
                    {token: 'GTE', matched: '>='},
                    {token: 'NOW', matched: 'now'},
                    {token: 'ADD', matched: '+'},
                    {token: 'AMOUNT', matched: '2'},
                    {token: 'INTERVAL', matched: 'd'},
                    {token: 'AND', matched: '+'},
                    {token: 'PROP', matched: 'foo:'},
                    {token: 'LITERAL', matched: 'bar'}
                ]);
            });

            it('foo:bar+last_seen_at:>=now+2d', function () {
                lex('foo:bar+last_seen_at:>=now+2d').should.eql([
                    {token: 'PROP', matched: 'foo:'},
                    {token: 'LITERAL', matched: 'bar'},
                    {token: 'AND', matched: '+'},
                    {token: 'PROP', matched: 'last_seen_at:'},
                    {token: 'GTE', matched: '>='},
                    {token: 'NOW', matched: 'now'},
                    {token: 'ADD', matched: '+'},
                    {token: 'AMOUNT', matched: '2'},
                    {token: 'INTERVAL', matched: 'd'}
                ]);
            });
        });
    });

    describe('Complex examples', function () {
        it('many expressions', function () {
            lex('tag:photo+featured:true,tag.count:>5').should.eql([
                {token: 'PROP', matched: 'tag:'},
                {token: 'LITERAL', matched: 'photo'},
                {token: 'AND', matched: '+'},
                {token: 'PROP', matched: 'featured:'},
                {token: 'TRUE', matched: 'true'},
                {token: 'OR', matched: ','},
                {token: 'PROP', matched: 'tag.count:'},
                {token: 'GT', matched: '>'},
                {token: 'NUMBER', matched: '5'}
            ]);

            lex('true:null+false:true,null:false').should.eql([
                {token: 'PROP', matched: 'true:'},
                {token: 'NULL', matched: 'null'},
                {token: 'AND', matched: '+'},
                {token: 'PROP', matched: 'false:'},
                {token: 'TRUE', matched: 'true'},
                {token: 'OR', matched: ','},
                {token: 'PROP', matched: 'null:'},
                {token: 'FALSE', matched: 'false'}
            ]);

            lex('tag:photo+created_at:>=now-1d,tag.count:>5').should.eql([
                {token: 'PROP', matched: 'tag:'},
                {token: 'LITERAL', matched: 'photo'},
                {token: 'AND', matched: '+'},
                {token: 'PROP', matched: 'created_at:'},
                {token: 'GTE', matched: '>='},
                {token: 'NOW', matched: 'now'},
                {token: 'SUB', matched: '-'},
                {token: 'AMOUNT', matched: '1'},
                {token: 'INTERVAL', matched: 'd'},
                {token: 'OR', matched: ','},
                {token: 'PROP', matched: 'tag.count:'},
                {token: 'GT', matched: '>'},
                {token: 'NUMBER', matched: '5'}
            ]);

            lex('tag:photo+image:-null,tag.count:>5').should.eql([
                {token: 'PROP', matched: 'tag:'},
                {token: 'LITERAL', matched: 'photo'},
                {token: 'AND', matched: '+'},
                {token: 'PROP', matched: 'image:'},
                {token: 'NOT', matched: '-'},
                {token: 'NULL', matched: 'null'},
                {token: 'OR', matched: ','},
                {token: 'PROP', matched: 'tag.count:'},
                {token: 'GT', matched: '>'},
                {token: 'NUMBER', matched: '5'}
            ]);

            lex('tag:photo+image:-null,tag.count:>5+foo:~\'bar\'').should.eql([
                {token: 'PROP', matched: 'tag:'},
                {token: 'LITERAL', matched: 'photo'},
                {token: 'AND', matched: '+'},
                {token: 'PROP', matched: 'image:'},
                {token: 'NOT', matched: '-'},
                {token: 'NULL', matched: 'null'},
                {token: 'OR', matched: ','},
                {token: 'PROP', matched: 'tag.count:'},
                {token: 'GT', matched: '>'},
                {token: 'NUMBER', matched: '5'},
                {token: 'AND', matched: '+'},
                {token: 'PROP', matched: 'foo:'},
                {token: 'CONTAINS', matched: '~'},
                {token: 'STRING', matched: '\'bar\''}
            ]);
        });

        it('grouped expressions', function () {
            lex('author:-joe+(tag:photo,image:-null,featured:true)').should.eql([
                {token: 'PROP', matched: 'author:'},
                {token: 'NOT', matched: '-'},
                {token: 'LITERAL', matched: 'joe'},
                {token: 'AND', matched: '+'},
                {token: 'LPAREN', matched: '('},
                {token: 'PROP', matched: 'tag:'},
                {token: 'LITERAL', matched: 'photo'},
                {token: 'OR', matched: ','},
                {token: 'PROP', matched: 'image:'},
                {token: 'NOT', matched: '-'},
                {token: 'NULL', matched: 'null'},
                {token: 'OR', matched: ','},
                {token: 'PROP', matched: 'featured:'},
                {token: 'TRUE', matched: 'true'},
                {token: 'RPAREN', matched: ')'}
            ]);

            lex('author:-joe+(tag:photo,image:-null,created_at:>=now-1d)').should.eql([
                {token: 'PROP', matched: 'author:'},
                {token: 'NOT', matched: '-'},
                {token: 'LITERAL', matched: 'joe'},
                {token: 'AND', matched: '+'},
                {token: 'LPAREN', matched: '('},
                {token: 'PROP', matched: 'tag:'},
                {token: 'LITERAL', matched: 'photo'},
                {token: 'OR', matched: ','},
                {token: 'PROP', matched: 'image:'},
                {token: 'NOT', matched: '-'},
                {token: 'NULL', matched: 'null'},
                {token: 'OR', matched: ','},
                {token: 'PROP', matched: 'created_at:'},
                {token: 'GTE', matched: '>='},
                {token: 'NOW', matched: 'now'},
                {token: 'SUB', matched: '-'},
                {token: 'AMOUNT', matched: '1'},
                {token: 'INTERVAL', matched: 'd'},
                {token: 'RPAREN', matched: ')'}
            ]);
        });

        it('in expressions', function () {
            lex('author:-joe+tag:[photo,video]').should.eql([
                {token: 'PROP', matched: 'author:'},
                {token: 'NOT', matched: '-'},
                {token: 'LITERAL', matched: 'joe'},
                {token: 'AND', matched: '+'},
                {token: 'PROP', matched: 'tag:'},
                {token: 'LBRACKET', matched: '['},
                {token: 'LITERAL', matched: 'photo'},
                {token: 'OR', matched: ','},
                {token: 'LITERAL', matched: 'video'},
                {token: 'RBRACKET', matched: ']'}
            ]);

            lex('author:-joe+tag:-[photo,video]').should.eql([
                {token: 'PROP', matched: 'author:'},
                {token: 'NOT', matched: '-'},
                {token: 'LITERAL', matched: 'joe'},
                {token: 'AND', matched: '+'},
                {token: 'PROP', matched: 'tag:'},
                {token: 'NOT', matched: '-'},
                {token: 'LBRACKET', matched: '['},
                {token: 'LITERAL', matched: 'photo'},
                {token: 'OR', matched: ','},
                {token: 'LITERAL', matched: 'video'},
                {token: 'RBRACKET', matched: ']'}
            ]);

            lex('author:-joe+tag:[photo,video]+post.count:>5+post.count:<100').should.eql([
                {token: 'PROP', matched: 'author:'},
                {token: 'NOT', matched: '-'},
                {token: 'LITERAL', matched: 'joe'},
                {token: 'AND', matched: '+'},
                {token: 'PROP', matched: 'tag:'},
                {token: 'LBRACKET', matched: '['},
                {token: 'LITERAL', matched: 'photo'},
                {token: 'OR', matched: ','},
                {token: 'LITERAL', matched: 'video'},
                {token: 'RBRACKET', matched: ']'},
                {token: 'AND', matched: '+'},
                {token: 'PROP', matched: 'post.count:'},
                {token: 'GT', matched: '>'},
                {token: 'NUMBER', matched: '5'},
                {token: 'AND', matched: '+'},
                {token: 'PROP', matched: 'post.count:'},
                {token: 'LT', matched: '<'},
                {token: 'NUMBER', matched: '100'}
            ]);

            lex('author:-joe+created_at:[now-1d,now+1d]').should.eql([
                {token: 'PROP', matched: 'author:'},
                {token: 'NOT', matched: '-'},
                {token: 'LITERAL', matched: 'joe'},
                {token: 'AND', matched: '+'},
                {token: 'PROP', matched: 'created_at:'},
                {token: 'LBRACKET', matched: '['},
                {token: 'NOW', matched: 'now'},
                {token: 'SUB', matched: '-'},
                {token: 'AMOUNT', matched: '1'},
                {token: 'INTERVAL', matched: 'd'},
                {token: 'OR', matched: ','},
                {token: 'NOW', matched: 'now'},
                {token: 'ADD', matched: '+'},
                {token: 'AMOUNT', matched: '1'},
                {token: 'INTERVAL', matched: 'd'},
                {token: 'RBRACKET', matched: ']'}
            ]);
        });

        it('creating strings with JS - double quotes', function () {
            const slug = 'test';
            const op = '>';
            const publishedAt = '2022-03-04 10:15:04';
            let filter = "slug:-" + slug + "+published_at:" + op + "'" + publishedAt + "'"; /* eslint-disable-line quotes */

            lex(filter).should.eql([
                {token: 'PROP', matched: 'slug:'},
                {token: 'NOT', matched: '-'},
                {token: 'LITERAL', matched: 'test'},
                {token: 'AND', matched: '+'},
                {token: 'PROP', matched: 'published_at:'},
                {token: 'GT', matched: '>'},
                {token: 'STRING', matched: '\'2022-03-04 10:15:04\''}
            ]);
        });

        it('creating strings with JS - single quotes', function () {
            const slug = 'test';
            const op = '>';
            const publishedAt = '2022-03-04 10:15:04';
            let filter = 'slug:-' + slug + '+published_at:' + op + '\'' + publishedAt + '\'';

            lex(filter).should.eql([
                {token: 'PROP', matched: 'slug:'},
                {token: 'NOT', matched: '-'},
                {token: 'LITERAL', matched: 'test'},
                {token: 'AND', matched: '+'},
                {token: 'PROP', matched: 'published_at:'},
                {token: 'GT', matched: '>'},
                {token: 'STRING', matched: '\'2022-03-04 10:15:04\''}
            ]);
        });

        it('creating strings with JS - template strings', function () {
            const slug = 'test';
            const op = '>';
            const publishedAt = '2022-03-04 10:15:04';
            let filter = `slug:-${slug}+published_at:${op}'${publishedAt}'`;

            lex(filter).should.eql([
                {token: 'PROP', matched: 'slug:'},
                {token: 'NOT', matched: '-'},
                {token: 'LITERAL', matched: 'test'},
                {token: 'AND', matched: '+'},
                {token: 'PROP', matched: 'published_at:'},
                {token: 'GT', matched: '>'},
                {token: 'STRING', matched: '\'2022-03-04 10:15:04\''}
            ]);
        });
    });
});
