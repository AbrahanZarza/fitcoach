.PHONY: dev down build-pro install

## Arranca el entorno de desarrollo (contenedor Docker + servidor Vite)
dev:
	docker compose up -d --build
	@echo "✅ Entorno de desarrollo arrancado en http://localhost:5173"
	@echo "   Logs: docker compose logs -f"

## Para el entorno de desarrollo
down:
	docker compose down

## Instala las dependencias de node dentro del contenedor
install:
	@docker compose up -d
	docker compose exec app npm install
	@echo "✅ Dependencias instaladas"

## Construye los assets de producción (levanta el entorno si no está arrancado)
build-pro:
	@docker compose up -d
	docker compose exec app sh -c "npm install && npm run build"
	@echo "✅ Assets de producción generados en ./dist"
