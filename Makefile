
MOCHA = ./node_modules/.bin/mocha
BABEL = ./node_modules/.bin/babel-node
SRC = lib/*.js

TESTS = test/*.test.js
IOJS_ENV ?= test


test:
	@IOJS_ENV=$(IOJS_ENV) $(MOCHA) \
		--require test/babel \
		--require should \
		$(TESTS) \
		--bail

bench:
		@$(MAKE) -C benchmarks

.PHONY: test bench

