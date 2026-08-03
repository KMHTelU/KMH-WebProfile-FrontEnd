
  # Website Builder

  This is a code bundle for Website Builder. The original project is available at https://www.figma.com/design/X5yGuTkN73Vrau3gZLK8rr/Website-Builder.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

  ## Menjalankan dengan Docker

  Image dibangun dua tahap: Node membangun bundle Vite, lalu hasilnya disajikan
  oleh nginx. Nginx juga meneruskan `/api` dan `/docs` ke backend, sehingga
  `VITE_API_BASE_URL` bisa tetap bernilai `/api` dan tidak perlu setup CORS.

  ```bash
  cp .env.example .env   # lalu isi nilainya, termasuk APP_PORT & API_PROXY_TARGET
  docker compose up -d --build
  ```

  Aplikasi akan tersedia di `http://<ip-vps>:${APP_PORT}` (default `5173`, sama
  seperti `npm run dev`), dengan endpoint `/healthz` untuk pengecekan status.

  Variabel `VITE_*` ditanamkan ke bundle **saat build**, jadi setiap kali nilainya
  berubah image harus dibangun ulang dengan `docker compose up -d --build`.
  Sebaliknya `API_PROXY_TARGET` dibaca saat container start, sehingga cukup
  `docker compose up -d` untuk menerapkannya.

  Untuk HTTPS dan domain, arahkan reverse proxy di host (nginx, Caddy, atau
  Traefik) ke port `APP_PORT`.
  