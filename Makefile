endpoint ?= http://localhost:3000/api/v1/ 

build: 
	ENDPOINT=$(endpoint) docker-compose up

test: 
	ENDPOINT=$(endpoint) docker-compose up

docker: 
	ENDPOINT=$(endpoint) docker-compose up

close: 
	docker-compose down
