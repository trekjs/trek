
MOCHA = ./node_modules/.bin/mocha
TO5 = ./node_modules/.bin/6to5-node
SRC = lib/*.js

TESTS = test/*.test.js

test:
	@IOJS_ENV=test $(MOCHA) \
		--require test/6to5 \
		--require should \
		$(TESTS) \
		--bail

bench:
		@$(MAKE) -C benchmarks

.PHONY: test bench

