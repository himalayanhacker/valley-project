# Deploying Uttarshall Valley on an Oracle Cloud "Always Free" VM

This guide deploys the full stack — PostgreSQL + Django (gunicorn) + the React
SPA (Nginx) — on a single free Oracle Cloud VM using Docker Compose.

**Cost: $0/month.** The only thing that can cost money is the optional OpenAI
travel-agent feature (see [the agent section](#7-optional-the-ai-agent)).

**Architecture:** one machine runs three containers. Nginx is the only thing
exposed publicly (port 80/443); it serves the built React app and reverse-proxies
`/api`, `/admin`, `/static`, and `/media` to Django. Postgres stays private inside
the Docker network. Because the SPA and API share one origin, there is no CORS to
configure.

```
Internet ──▶ :80/:443  Nginx (frontend)  ─┬─ /            React SPA (static)
                                           ├─ /api, /admin  ─▶ gunicorn (backend)
                                           ├─ /static       ─▶ gunicorn (WhiteNoise)
                                           └─ /media         ─▶ shared volume
                                                      backend ─▶ Postgres (private)
```

---

## What's already in the repo for this

These files were added so the deploy "just works":

| File | Purpose |
|------|---------|
| `docker-compose.prod.yml` | Production stack (gunicorn + Nginx, DB not exposed) |
| `backend/Dockerfile.prod` | Backend image running gunicorn |
| `backend/entrypoint.prod.sh` | Migrates + collectstatic + starts gunicorn on each boot |
| `backend/config/settings/production.py` | `DEBUG=False`, WhiteNoise, security headers |
| `frontend/Dockerfile.prod` | Builds the SPA, serves it with Nginx |
| `frontend/nginx.conf` | SPA fallback + reverse proxy to the backend |
| `.env.prod.example` | Template for production secrets |

---

## 1. Create the free VM

1. Sign up at <https://www.oracle.com/cloud/free/> (a card is required for identity
   verification but Always-Free resources are never charged).
2. **Compute → Instances → Create Instance.**
   - **Image:** Canonical **Ubuntu 22.04**.
   - **Shape:** click *Change shape* → **Ampere (Arm)** → `VM.Standard.A1.Flex`.
     Set **2 OCPU / 12 GB RAM** (well within the always-free 4 OCPU / 24 GB).
   - **SSH keys:** *Generate a key pair* and **download the private key** (or paste
     your existing public key). You'll need this to log in.
3. Click **Create**.

> **"Out of host capacity" error?** This is the single most common Oracle
> frustration — the free Arm shape is in high demand. Just retry every few hours,
> or try a different Availability Domain in the dropdown. It almost always succeeds
> within a day. (An x86 `VM.Standard.E2.1.Micro` is also always-free as a fallback,
> but has only 1 GB RAM — tight for this stack.)

When ready, note the instance's **Public IP address**.

---

## 2. Open the firewall (the part everyone misses)

Oracle blocks ports in **two** places. You must open **both** for HTTP/HTTPS.

### 2a. Cloud-side: VCN Security List

In the console: **Networking → Virtual Cloud Networks → (your VCN) → Subnets →
(your subnet) → Security Lists → Default Security List → Add Ingress Rules.**

Add these two ingress rules:

| Source CIDR | IP Protocol | Destination Port |
|-------------|-------------|------------------|
| `0.0.0.0/0` | TCP | `80` |
| `0.0.0.0/0` | TCP | `443` |

(Port 22 for SSH is open by default.)

### 2b. Instance-side: Ubuntu's iptables

Ubuntu on Oracle ships with a restrictive `iptables`. SSH in first (step 3), then:

```bash
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 80 -j ACCEPT
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 443 -j ACCEPT
sudo netfilter-persistent save
```

> If you skip 2b, the site will look "down" even though the container is running.

---

## 3. Connect to the VM

```bash
chmod 600 /path/to/your-private-key.key
ssh -i /path/to/your-private-key.key ubuntu@YOUR_VM_PUBLIC_IP
```

---

## 4. Install Docker

```bash
sudo apt-get update && sudo apt-get upgrade -y
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker ubuntu      # run docker without sudo
newgrp docker                       # apply the group now (or log out/in)
docker --version && docker compose version
```

---

## 5. Get the code onto the VM

**Option A — clone from Git (recommended):**
```bash
git clone <your-repo-url> valley-project
cd valley-project
```

**Option B — copy from your laptop** (run this on your *laptop*, not the VM):
```bash
rsync -av -e "ssh -i /path/to/your-private-key.key" \
  --exclude node_modules --exclude venv --exclude .git \
  ./valley-project/ ubuntu@YOUR_VM_PUBLIC_IP:~/valley-project/
```

---

## 6. Configure and launch

```bash
cd ~/valley-project
cp .env.prod.example .env.prod
nano .env.prod
```

Fill in `.env.prod`:
- `POSTGRES_PASSWORD` — a strong random password.
- `SECRET_KEY` — generate one:
  ```bash
  python3 -c "import secrets; print(secrets.token_urlsafe(64))"
  ```
- `ALLOWED_HOSTS` — your public IP (add your domain later), e.g. `123.45.67.89`.
- Leave `USE_HTTPS=False` for now (we're on plain HTTP until step 8).

Build and start:
```bash
docker compose -f docker-compose.prod.yml --env-file .env.prod up -d --build
```

First build takes a few minutes. Watch progress / check health:
```bash
docker compose -f docker-compose.prod.yml ps
docker compose -f docker-compose.prod.yml logs -f
```

Create your admin user:
```bash
docker compose -f docker-compose.prod.yml exec backend python manage.py createsuperuser
```

**Visit `http://YOUR_VM_PUBLIC_IP/`** — the site should load. Admin is at
`http://YOUR_VM_PUBLIC_IP/admin/`.

---

## 7. Optional: the AI agent

The travel-guide agent (`apps/agent`) uses **OpenAI** for both embeddings
(`text-embedding-3-small`) and chat (`gpt-4o-mini`).

- **To run it:** put a key in `OPENAI_API_KEY` in `.env.prod`. Usage for a demo
  site is typically pennies, but it is *not* free.
- **To skip it:** leave `OPENAI_API_KEY` empty. The whole site works fine; only the
  chat widget will error when used.
- **Fully-free chat?** Groq offers a free OpenAI-compatible chat API, but it has
  **no embeddings endpoint**, so the current RAG flow (which embeds article chunks)
  can't move to Groq as-is without also swapping the embedding step. Tell me if you
  want this and I'll refactor `apps/agent/rag.py` to a free embedding option.

After adding article content in the admin, the chunks are indexed automatically
(see `apps/agent/signals.py`).

---

## 8. Optional: HTTPS with a free domain

HTTP works on the bare IP, but for HTTPS you need a domain name. A free one:

1. Get a free subdomain at <https://www.duckdns.org> (e.g. `valley.duckdns.org`)
   and point it at your VM's public IP.
2. Add it to `.env.prod`:
   ```
   ALLOWED_HOSTS=valley.duckdns.org,YOUR_VM_PUBLIC_IP
   CSRF_TRUSTED_ORIGINS=https://valley.duckdns.org
   USE_HTTPS=True
   ```
3. The simplest TLS path is to put **Caddy** in front (it gets & renews Let's
   Encrypt certs automatically). Ask me and I'll add a ready-made `caddy` service +
   `Caddyfile` and a compose override — it's about 15 extra lines and one command.
4. Re-deploy: `docker compose -f docker-compose.prod.yml --env-file .env.prod up -d --build`

> Set `USE_HTTPS=True` **only after** the certificate is live, otherwise Django's
> HTTPS redirect will loop on plain HTTP.

---

## 9. Day-to-day operations

```bash
# Update after pushing code changes
git pull
docker compose -f docker-compose.prod.yml --env-file .env.prod up -d --build

# Logs
docker compose -f docker-compose.prod.yml logs -f backend

# Django shell / management commands
docker compose -f docker-compose.prod.yml exec backend python manage.py <cmd>

# Stop / start
docker compose -f docker-compose.prod.yml down
docker compose -f docker-compose.prod.yml --env-file .env.prod up -d

# Back up the database
docker compose -f docker-compose.prod.yml exec db \
  pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB" > backup-$(date +%F).sql
```

---

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| Site unreachable, but `docker ps` shows containers up | You skipped firewall **step 2b** (iptables) or **2a** (security list). |
| `DisallowedHost` in backend logs | Add the IP/domain to `ALLOWED_HOSTS` in `.env.prod`, redeploy. |
| Admin login fails with CSRF error (on HTTPS) | Add `https://your-domain` to `CSRF_TRUSTED_ORIGINS`, redeploy. |
| Uploaded images 404 | Confirm the `media_files` volume is mounted in both `backend` and `frontend` (it is in the compose file). |
| Endless HTTPS redirect on plain HTTP | You set `USE_HTTPS=True` before having a certificate. Set it back to `False`. |
| Backend unhealthy at first start | It waits for Postgres; give it ~30s. Check `logs backend`. |
