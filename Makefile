install:
	npm install

start:
	npx babel-node src/bin/gendiff.js -h

publish:
	npm publish --dry-run
	npm link

lint:
	npx eslint .