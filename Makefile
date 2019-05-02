app: app-deps app-lint build
watcher: w-deps w-lint
shared: s-deps s-lint
dep:
	cd app && npm install
	cd server && npm install
	cd watcher && npm install
	cd shared && npm install
templates:
	cp server/.env.tpl server/.env
	mkdir server/secrets
	mkdir watcher/secrets
app-deps:
	npm i -g npm
	cd app && npm install
	cd server && npm install
app-lint:
	cd app && npm run lint
	cd server && npm run lint
w-deps:
	npm i -g npm
	cd watcher && npm install
w-lint:
	cd watcher && npm run lint
s-deps:
	npm i -g npm
	cd shared && npm install
s-lint:
	cd shared && npm run lint
build:
	cd app && npm run build
