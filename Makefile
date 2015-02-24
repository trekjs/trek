
MOCHA = ./node_modules/.bin/mocha
BABEL = ./node_modules/.bin/babel-node
SRC = lib/*.js

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
	@IOJS_ENV=$(IOJS_ENV) $(BIN) $(FLAGS) $(MOCHA) \
		--require test/babel \
		--require should \
		$(TESTS) \
		--bail

bench:
	@$(MAKE) -C benchmarks

helloworld:
	@DEBUG=* $(BABEL) -r -g --blacklist 'regenerator,es6.templateLiterals' examples/hello-world/app.js

.PHONY: test bench
