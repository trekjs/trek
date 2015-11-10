SRC = lib/*.js

MOCHA = ./node_modules/.bin/_mocha
BABEL = ./node_modules/.bin/babel
BABEL_NODE = ./node_modules/.bin/babel-node
ISTANBUL = ./node_modules/.bin/istanbul
ESLINT = ./node_modules/.bin/eslint

TESTS = test/*.test.js
TREK_ENV ?= test

BIN = node

FLAGS = --harmony_array_includes \
				--harmony_rest_parameters

build:
	mkdir -p lib
	$(BIN) $(BABEL) src --out-dir lib

clean:
	rm -rf lib

test:
		@TREK_ENV=$(TREK_ENV) $(BIN) $(FLAGS) \
		$(MOCHA) \
		--compilers js:babel-core/register \
		--check-leaks \
		$(TESTS) \
		--bail

test-ci:
	@TREK_ENV=$(TREK_ENV) $(BIN) $(FLAGS) \
		$(ISTANBUL) cover \
		$(MOCHA) \
		--compilers js:babel-core/register \
		--report lcovonly \
		-- -u exports \
		--check-leaks \
		$(TESTS) \
		--bail

test-cov:
	rm -rf coverage
	@TREK_ENV=$(TREK_ENV) $(BIN) $(FLAGS) \
		$(ISTANBUL) cover \
		$(MOCHA) \
		--compilers js:babel-core/register \
		-- -u exports \
		--check-leaks \
		$(TESTS) \
		--bail

bench:
	@$(MAKE) -C benchmarks

lint:
	@$(ESLINT) src

api:
	@esdoc -c esdoc.json

.PHONY: test bench
