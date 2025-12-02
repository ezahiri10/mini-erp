.PHONY: help install dev backend frontend clean

help:
	@echo "Available commands:"
	@echo "  make install   - Install dependencies for backend and frontend"
	@echo "  make dev       - Run both backend and frontend in development mode"
	@echo "  make backend   - Run only backend"
	@echo "  make frontend  - Run only frontend"
	@echo "  make clean     - Clean dependencies"

install:
	cd backend && npm install
	cd frontend && npm install

dev:
	@echo "Starting backend and frontend..."
	@npm run dev --prefix backend & npm run dev --prefix frontend & wait

backend:
	cd backend && npm run dev

frontend:
	cd frontend && npm run dev

clean:
	rm -rf backend/node_modules frontend/node_modules