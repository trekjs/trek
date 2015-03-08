SRC = lib/*.js

MOCHA = ./node_modules/.bin/_mocha
BABEL = ./node_modules/.bin/babel-node
ISTANBUL = ./node_modules/.bin/istanbul

BABEL_BLACKLIST = 'regenerator,es6.blockScoping,es6.constants,es6.templateLiterals'

TESTS = test/*.test.js
IOJS_ENV ?= test

BIN = iojs

ifeq ($(findstring io.js, $(shell which node)),)
	BIN = node
endif

ifeq (node, $(BIN))
	FLAGS = --harmony
endif

test:
	@IOJS_ENV=$(IOJS_ENV) $(BIN) $(FLAGS) \
		$(MOCHA) \
		--require test/babel \
		--require should \
		$(TESTS) \
		--bail

test-cov:
	@IOJS_ENV=$(IOJS_ENV) $(BIN) $(FLAGS) \
		$(ISTANBUL) cover \
		$(MOCHA) \
		-- -u exports \
		--require test/babel \
		--require should \
		$(TESTS) \
		--bail

bench:
	@$(MAKE) -C benchmarks

helloworld:
	@DEBUG=* $(BABEL) -r -g --blacklist $(BABEL_BLACKLIST) \
		examples/hello-world/server.js

.PHONY: test bench