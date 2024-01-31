build:
	docker build -t jobify-express-react . --no-cache
start:
	docker run -it --env-file .env --rm -p 8000:8000 jobify-express-react
