SRC = lib/*.js

MOCHA = ./node_modules/.bin/_mocha
BABEL = ./node_modules/.bin/babel
BABEL_NODE = ./node_modules/.bin/babel-node
ISTANBUL = ./node_modules/.bin/istanbul
NODEMON = ./node_modules/.bin/nodemon

TESTS = test/*.test.js
TREK_ENV ?= test

BIN = iojs

ifeq ($(findstring io.js, $(shell which node)),)
	BIN = node
endif

ifeq (node, $(BIN))
	FLAGS = --harmony
endif

build:
	mkdir -p lib
	$(BIN) $(BABEL) src --out-dir lib --copy-files

clean:
	rm -rf lib

test:
		@TREK_ENV=$(TREK_ENV) $(BIN) $(FLAGS) \
		$(MOCHA) \
		--compilers js:babel/register \
		--require should \
		--check-leaks \
		$(TESTS) \
		--bail

test-cov:
	rm -rf coverage
	@TREK_ENV=$(TREK_ENV) $(BIN) $(FLAGS) \
		$(ISTANBUL) cover \
		$(MOCHA) \
		-- -u exports \
		--compilers js:babel/register \
		--require should \
		--check-leaks \
		$(TESTS) \
		--bail

bench:
	@$(MAKE) -C benchmarks

trek-auth:
	@DEBUG=* $(NODEMON) --exec $(BABEL_NODE) examples/trek-auth/server.js

.PHONY: test bench