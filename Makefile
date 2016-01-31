BIN = ./node_modules/.bin

lint:
	@$(BIN)/eslint lib example

release-major: lint
	@npm version major

release-minor: lint
	@npm version minor

release-patch: lint
	@npm version patch

publish: lint
	git push --tags origin HEAD:master
	npm publish
