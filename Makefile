up:
	docker-compose -f docker-compose.local.yml up -d

stop:
	docker-compose -f docker-compose.local.yml stop

exec-api:
	docker exec -it ticket-box-api sh
