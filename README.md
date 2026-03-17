
  # Premium Boutique Website Design (copia)

  This is a code bundle for Premium Boutique Website Design (copia). The original project is available at https://www.figma.com/design/GOlzbp9fkDGwbqb2fMKlBJ/Premium-Boutique-Website-Design--copia-.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

  ## Despliegue (Completamente Gratis)

  ### Backend (Render.com - Gratis)

  1. **Crear cuenta en Render**: https://render.com/ (con tu email)
  
  2. **Conectar repositorio GitHub**:
     - Autoriza Render a acceder a tu GitHub
     - Elige este repositorio

  3. **Crear nuevo servicio Web**:
     - Click en **New +** → **Web Service**
     - Selecciona tu repositorio
     - Nombre: `premium-boutique-backend`
     - Rama: `main`
     - Build Command: `npm install`
     - Start Command: `node server/index.cjs`
     - Plan: **Free** ✅

  4. **Configurar variables de entorno en Render Dashboard**:
     - `CLOUDINARY_CLOUD_NAME` = tu cloud name
     - `CLOUDINARY_API_KEY` = tu api key
     - `CLOUDINARY_API_SECRET` = tu api secret
     - `PORT` = `4000`

  5. **Obtener URL del backend**:
     - Render te dará una URL tipo: `https://premium-boutique-backend.onrender.com`
     - Copia esta URL para usarla en Vercel

  ⚠️ **Nota**: El plan gratis de Render "hiberna" después de 15 minutos de inactividad. La primera solicitud tardará ~30 segundos. Para evitar esto, puedes usar un "uptime monitor" gratis o el plan pagado.

  ### Frontend (Vercel - Gratis)

  1. **Crear cuenta en Vercel**: https://vercel.com/

  2. **Conectar repositorio**:
     - Importa desde GitHub/GitLab/Bitbucket
     - Elige rama `main`

  3. **Configurar Build Settings**:
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`

  4. **Agregar variables de entorno** en Vercel Dashboard:
     - `VITE_API_BASE_URL` = URL del backend de Render (ej: `https://premium-boutique-backend.onrender.com`)

  5. **Desplegar dominio propio**:
     - Ir a **Domains** en Vercel
     - Agregar tu dominio
     - Actualizar DNS según indicaciones de Vercel

  ### En local (desarrollo)

  Terminal 1 - Backend:
  ```bash
  npm run server
  ```

  Terminal 2 - Frontend:
  ```bash
  npm run dev
  ```

  El proxy de Vite (`vite.config.ts`) automáticamente redirige `/api/*` a `http://localhost:4000`.
  