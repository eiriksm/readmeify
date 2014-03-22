test:
		./node_modules/mocha/bin/mocha
		./node_modules/jshint/bin/jshint bin index.js

.PHONY: test
