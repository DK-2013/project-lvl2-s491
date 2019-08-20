install:
	npm install

start:
	npx babel-node src/bin/gendiff.js -h

start_:
	npx babel-node src/bin/gendiff.js __tests__/__fixtures__/plain/before.json __tests__/__fixtures__/plain/after.json --format=plain

tmp:
	npx babel-node tmp.js

build:
	rm -rf dist
	npm run build

test:
	npm test

publish:
	npm publish --dry-run

republish:
	npm publish --dry-run
	npm link

lint:
	npx eslint .