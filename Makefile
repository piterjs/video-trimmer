app: app-deps app-lint build
watcher: w-deps w-lint
app-deps:
	npm i -g npm
	cd app && npm install
	cd server && npm install
	cd shared && npm install
app-lint:
	cd app && npm run lint
	cd server && npm run lint
	cd shared && npm run lint
w-deps:
	npm i -g npm
	cd watcher && npm install
	cd shared && npm install
w-lint:
	cd watcher && npm run lint
	cd shared && npm run lint
build:
	cd app && npm run build
