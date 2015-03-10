SRC = lib/*.js

MOCHA = ./node_modules/.bin/_mocha
BABEL = ./node_modules/.bin/babel-node
ISTANBUL = ./node_modules/.bin/istanbul
NODEMON = ./node_modules/.bin/nodemon

TESTS = test/*.test.js
IOJS_ENV ?= test

BIN = iojs

ifeq ($(findstring io.js, $(shell which node)),)
	BIN = node
endif

ifeq (node, $(BIN))
	FLAGS = --harmony
endif

build:
	rm -rf $(SRC)
	gulp

test:
	@IOJS_ENV=$(IOJS_ENV) $(BIN) $(FLAGS) \
		$(MOCHA) \
		--compilers js:babel/register \
		--require should \
		$(TESTS) \
		--bail

test-cov:
	rm -rf coverage
	@IOJS_ENV=$(IOJS_ENV) $(BIN) $(FLAGS) \
		$(ISTANBUL) cover \
		$(MOCHA) \
		-- -u exports \
		--compilers js:babel/register \
		--require should \
		$(TESTS) \
		--bail

bench:
	@$(MAKE) -C benchmarks

helloworld:
	@DEBUG=* $(NODEMON) $(BABEL) examples/hello-world/server.js

.PHONY: test bench