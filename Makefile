build:
	docker build -t jobify-express-react . --no-cache
start:
	docker run -it --env-file .env --rm -p 8080:8080 jobify-express-react
