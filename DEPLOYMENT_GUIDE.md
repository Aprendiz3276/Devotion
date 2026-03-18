# 🚀 GUÍA COMPLETA DE DESPLIEGUE - DEVOTION

## 📋 TABLA DE CONTENIDOS
1. [Despliegue Backend (Render)](#paso-1-despliegue-backend-render)
2. [Despliegue Frontend (Vercel)](#paso-2-despliegue-frontend-vercel)
3. [Configurar Dominio (GoDaddy)](#paso-3-configurar-dominio-godaddy)
4. [Verificación Final](#paso-4-verificación-final)

---

# PASO 1: DESPLIEGUE BACKEND (RENDER)

## 1.1 CREAR CUENTA EN RENDER

1. Ve a **https://render.com**
2. Haz clic en **"Sign Up"**
3. Elige **"Sign up with GitHub"**
4. Autoriza Render a acceder a tu GitHub
5. Completa los datos de registro

✅ **Ya tienes cuenta en Render**

---

## 1.2 CREAR WEB SERVICE

1. En el dashboard de Render, haz clic en **"New +"**
2. Selecciona **"Web Service"**
3. En "Connect a repository", busca y selecciona: **`Devotion`**
4. Haz clic en **"Select Repository"**

---

## 1.3 CONFIGURAR SERVICIO WEB

**Completa estos campos exactamente:**

```
Name: premium-boutique-backend
Region: São Paulo (South America)
Branch: main
Runtime: Node
Build Command: npm install
Start Command: node server/index.cjs
Plan: Free ✅
```

**Haz clic en "Create Web Service"**

⏳ **Espera 5-10 minutos a que se depliegue**

---

## 1.4 AGREGAR VARIABLES DE ENTORNO

1. En tu servicio en Render (ya debe estar desplegado)
2. En la barra lateral izquierda, haz clic en **"Environment"**
3. Haz clic en **"Add Environment Variable"**

**Agrega estas 4 variables una por una:**

### Variable 1:
```
Key: CLOUDINARY_CLOUD_NAME
Value: Raíz
```
Click "Add"

### Variable 2:
```
Key: CLOUDINARY_API_KEY
Value: 382766134594775
```
Click "Add"

### Variable 3:
```
Key: CLOUDINARY_API_SECRET
Value: ib895vnSPtuWX298O0iC-z8mnD4
```
Click "Add"

### Variable 4:
```
Key: PORT
Value: 4000
```
Click "Add"

✅ **Backend desplegado en Render**

---

## 1.5 COPIAR URL DEL BACKEND

1. En tu servicio en Render, busca la URL en la parte superior
2. Debería verse algo como: `https://premium-boutique-backend.onrender.com`
3. **Copia esta URL completa** (la necesitarás en el siguiente paso)

---

# PASO 2: DESPLIEGUE FRONTEND (VERCEL)

## 2.1 IR A VERCEL

1. Ve a **https://vercel.com**
2. Si no tienes cuenta, haz clic en **"Sign Up"**
3. Elige **"Continue with GitHub"**
4. Autoriza Vercel a acceder a tu GitHub

✅ **Ya tienes cuenta en Vercel**

---

## 2.2 CREAR PROYECTO

1. En el dashboard de Vercel, haz clic en **"Add New"**
2. Selecciona **"Project"**
3. Bajo "Import Git Repository", busca: **`Devotion`**
4. Haz clic en **"Import"**

---

## 2.3 CONFIGURAR PROYECTO

**Vercel detectará automáticamente que es un proyecto Vite**

En la página de configuración:

```
Project Name: premium-boutique-website
Framework Preset: Vite (ya seleccionado)
Root Directory: . (vacío, por defecto)
Build Command: npm run build (automático)
Output Directory: dist (automático)
```

---

## 2.4 AGREGAR VARIABLE DE ENTORNO

1. En la misma página, baja a **"Environment Variables"**
2. Haz clic en el campo de entrada
3. Agrega esta variable:

```
Variable Name: VITE_API_BASE_URL
Value: https://premium-boutique-backend.onrender.com
```

(Reemplaza con la URL que copiaste de Render en paso 1.5)

4. Haz clic en **"Add"**

5. Haz clic en **"Deploy"**

⏳ **Espera 3-5 minutos a que se depliegue**

---

## 2.5 VERIFICAR VERCEL

1. Una vez terminado, Vercel te mostrará una URL tipo:
   ```
   https://premium-boutique-website.vercel.app
   ```
2. Haz clic en esa URL
3. ✅ Debería cargar tu sitio web completo

---

## 2.6 AGREGAR DOMINIO EN VERCEL

1. En tu proyecto en Vercel
2. Haz clic en **"Settings"** (arriba a la derecha)
3. En la barra lateral, haz clic en **"Domains"**
4. Haz clic en **"Add Domain"**
5. Escribe tu dominio: **`devotion.com`** (sin www)
6. Haz clic en **"Add"**

**Vercel mostrará 2 opciones, elige: "Usar Nameservers de Vercel"**

Vercel te mostrará estos nameservers:
```
ns1.vercel-dns.com
ns2.vercel-dns.com
```

📝 **Copia estos nameservers** (los necesitarás en GoDaddy)

---

# PASO 3: CONFIGURAR DOMINIO (GODADDY)

## 3.1 ENTRAR A GODADDY

1. Ve a **https://godaddy.com**
2. Inicia sesión con tu cuenta
3. Busca tu dominio en **"Mis Productos"**

---

## 3.2 CAMBIAR NAMESERVERS

1. Haz clic en tu dominio
2. En el menú, buscaLocalizarás **"DNS"** o **"Nameservers"**
3. Busca la opción **"Cambiar Nameservers"** o **"Edit Nameservers"**
4. Elige **"Usar nameservers personalizados"** o similar

---

## 3.3 INGRESAR NAMESERVERS DE VERCEL

1. Elimina los nameservers actuales (si existen)
2. Agrega los de Vercel:

**Nameserver 1:**
```
ns1.vercel-dns.com
```

**Nameserver 2:**
```
ns2.vercel-dns.com
```

3. Haz clic en **"Guardar"**

✅ **Dominio actualizado**

⏳ **Propagación DNS: 24-48 horas** (a veces más rápido)

---

# PASO 4: VERIFICACIÓN FINAL

## 4.1 VERIFICAR BACKEND

Abre una terminal y corre:

```bash
curl https://premium-boutique-backend.onrender.com/
```

✅ Deberías ver una respuesta JSON

---

## 4.2 VERIFICAR FRONTEND (URL VERCEL)

1. Abre **https://premium-boutique-website.vercel.app**
2. Debería cargar completamente
3. Prueba:
   - ✅ Agrega producto al carrito
   - ✅ Busca productos
   - ✅ Abre el admin (ícono usuario arriba a la derecha)

---

## 4.3 VERIFICAR DOMINIO CUSTOM

⏳ **ESPERA a que propaguen los DNS (puede tardar hasta 48 horas)**

Cuando sea listo:

1. Abre **https://devotion.com** (tu dominio)
2. Debería mostrar el mismo contenido que la URL de Vercel
3. ✅ Es tu sitio en producción

---

## 4.4 PROBAR CREDENCIALES ADMIN

1. En tu sitio (vercel o dominio)
2. Arriba a la derecha, busca el **ícono de usuario**
3. Haz clic
4. Ingresa:

```
Email: devotionstore8@gmail.com
Contraseña: Devotion2610
```

✅ Deberías entrar al panel administrativo

---

## 4.5 PROBAR COMPRA EN ADMIN

1. En el sitio, agrega productos al carrito
2. Abre el carrito
3. Haz clic en **"Finalizar Pedido por WhatsApp"**
4. Completa el formulario:
   - Nombre: Test
   - Email: test@test.com
   - Teléfono: 3001234567
   - Dirección: Calle 10 #20
   - Método: Efectivo
5. Haz clic en **"Completar Compra"**

✅ Debería:
- Abrir WhatsApp con el pedido formateado
- Guardarse automáticamente en el admin
- Generar una notificación

---

## 4.6 VERIFICAR EN ADMIN

1. Abre el admin (ícono usuario)
2. Ve a **"Órdenes"** → deberías ver la orden reciente
3. Ve a **"Notificaciones"** → deberías ver la notificación de la compra

✅ **TODO FUNCIONA**

---

# 🎯 RESUMEN URLS FINALES

```
📱 Sitio Web: https://devotion.com
📱 Vercel alternativo: https://premium-boutique-website.vercel.app
🔧 Backend: https://premium-boutique-backend.onrender.com
👨‍💼 Admin: En el sitio (ícono usuario arriba a la derecha)

Credenciales Admin:
Email: devotionstore8@gmail.com
Contraseña: Devotion2610
```

---

# ⚠️ PROBLEMAS COMUNES

| Problema | Solución |
|----------|----------|
| Backend devuelve error 500 | Verifica las variables de entorno en Render |
| Frontend no conecta al backend | Verifica `VITE_API_BASE_URL` en Vercel Environment Variables |
| Dominio No funciona después de 48h | Verifica nameservers en GoDaddy (debe mostrar los de Vercel) |
| Panel admin no carga | Limpia cache (Ctrl+Shift+Supr) o abre en incógnito |
| Subir imágenes no funciona | Verifica credenciales Cloudinary |

---

# ✅ CHECKLIST FINAL

- [ ] Backend deployado en Render con variables de entorno
- [ ] Frontend deployado en Vercel
- [ ] `VITE_API_BASE_URL` configurado en Vercel
- [ ] Dominio agregado en Vercel
- [ ] Nameservers cambiados en GoDaddy
- [ ] Backend responde en la URL de Render
- [ ] Frontend carga sin errores
- [ ] Puedo entrar al admin con las credenciales
- [ ] Puedo hacer una compra de prueba
- [ ] La orden aparece en el admin automáticamente
- [ ] Dominio custom carga el sitio (después de propagación DNS)

---

🎉 **¡DEPLOYADO A PRODUCCIÓN!**

Si tienes algún problema, revisa la tabla de problemas comunes arriba.
