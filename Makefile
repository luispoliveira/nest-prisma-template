all:
	@echo Make what?!

deploy: pull install migrate seed generate build reload

devLocal: install compose migrate seed generate

compose:
	docker-compose up -d

pull:
	git pull

install:
	yarn

migrate:
	yarn prisma migrate deploy

seed:
  yarn prisma db seed

generate:
	yarn prisma generate

build:
	yarnbuild

reload:
	pm2 restart ecosystem.config.js
