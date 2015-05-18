BIN = ./node_modules/.bin

lint:
	@$(BIN)/eslint lib

release-major: lint
	@$(BIN)/bump --major

release-minor: lint
	@$(BIN)/bump --minor

release-patch: lint
	@$(BIN)/bump --patch

publish:
	git push --tags origin HEAD:master
	npm publish
