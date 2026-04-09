# ─── Stage 1: Build frontend ──────────────────────────────────────────────────
FROM node:22-alpine AS frontend-builder

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10.4.1 --activate

# Copy package manifests
COPY package.json pnpm-lock.yaml ./

# Install dependencies (frozen lockfile)
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build frontend (outputs to /app/dist)
RUN pnpm build

# ─── Stage 2: Backend + serve static ─────────────────────────────────────────
FROM python:3.13-slim AS production

# Security: non-root user
RUN groupadd --gid 1001 appgroup && \
    useradd --uid 1001 --gid 1001 --no-create-home appuser

WORKDIR /app

# Install Python dependencies first (layer cache)
COPY backend/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source
COPY backend/ ./

# Copy built frontend into Flask's static folder
COPY --from=frontend-builder /app/dist ./static

# Drop to non-root
RUN chown -R appuser:appgroup /app
USER appuser

EXPOSE 5000

ENV FLASK_ENV=production \
    FLASK_DEBUG=false \
    CACHE_DURATION=60

HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:5000/api/health')" || exit 1

CMD ["gunicorn", "app:app", "--bind", "0.0.0.0:5000", "--workers", "2", "--timeout", "60", "--access-logfile", "-", "--error-logfile", "-"]
