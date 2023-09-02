build:
	docker build -t kilo .
run:
	docker run -d -p 3042:3042 --name kilo --rm kilo