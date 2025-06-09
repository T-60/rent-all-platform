# ⚡ INICIO RÁPIDO - RENT+ALL

<div align="center">

## 🚀 De 0 a funcionando en 5 minutos

</div>

---

## 📋 Lo que necesitas tener instalado

```bash
✅ Node.js 18+     (https://nodejs.org/)
✅ Git             (git --version)
✅ Editor de código (VS Code recomendado)
```

**¿MongoDB?** No te preocupes, usaremos MongoDB Atlas (gratis y en la nube) 

---

## 🎯 Pasos (copia y pega cada comando)

### **1. Clonar e instalar**
```bash
# Clonar repositorio
git clone [URL_DEL_REPOSITORIO]
cd rent-all-platform

# Instalar pnpm si no lo tienes
npm install -g pnpm

# Instalar dependencias
pnpm install
cd backend && npm install && cd ..
```

### **2. Configurar base de datos (2 minutos)**

#### **Opción A: MongoDB Atlas (Recomendado - Sin instalaciones)**
1. Ve a https://www.mongodb.com/atlas
2. Crea cuenta gratis
3. Crea cluster gratis
4. Crea usuario de BD
5. Copia la URL de conexión

#### **Opción B: MongoDB Local**
```bash
# macOS
brew install mongodb-community
brew services start mongodb-community

# Linux
sudo apt install mongodb
sudo systemctl start mongodb
```

### **3. Configurar entorno**
```bash
# Crear archivo de configuración
cp .env.example .env.local

# Editar con tu editor favorito
code .env.local  # VS Code
# o
nano .env.local  # Terminal
```

**Edita solo esta línea en .env.local:**
```env
# Si usas MongoDB Atlas, pega tu URL aquí:
MONGODB_URI=mongodb+srv://tu-usuario:tu-password@cluster.mongodb.net/rentall

# Si usas MongoDB local, deja como está:
MONGODB_URI=mongodb://localhost:27017/rentall
```

### **4. Ejecutar la aplicación**
```bash
# Terminal 1: Backend
cd backend
npm start

# Terminal 2: Frontend (nueva terminal)
cd rent-all-platform
pnpm dev
```

### **5. ¡Verificar que funciona!**
- **Abre tu navegador:** http://localhost:3000
- **Deberías ver:** La página principal de RENT+ALL
- **Si hay errores:** Mira los logs en las terminales

---

## 🧪 Crear datos de prueba

```bash
# Crear usuario de prueba automáticamente
node create-test-user.js

# Ahora puedes hacer login con:
# Email: usuario1@universidad.edu
# Password: 123456
```

---

## 🔧 Verificación automática

```bash
# Ejecutar verificación completa
./verify-setup.sh

# Te dirá exactamente qué falta (si algo)
```

---

## 🆘 ¿Algo no funciona?

### **Error: "MongoDB connection failed"**
```bash
# Verifica tu URL en .env.local
cat .env.local | grep MONGODB_URI

# Para MongoDB Atlas: Asegúrate de que la URL es correcta
# Para MongoDB local: brew services start mongodb-community
```

### **Error: "Port 3000 already in use"**
```bash
# Mata el proceso en puerto 3000
lsof -ti:3000 | xargs kill -9

# O usa otro puerto
pnpm dev -- --port 3002
```

### **Error: "Cannot find module"**
```bash
# Reinstalar dependencias
rm -rf node_modules
pnpm install

cd backend
rm -rf node_modules
npm install
```

### **Error: "Permission denied"**
```bash
# macOS/Linux
sudo chown -R $(whoami) ~/.npm

# Windows: Ejecutar PowerShell como administrador
```

---

## 📱 URLs importantes una vez que funcione

| Página | URL | Descripción |
|--------|-----|-------------|
| **Principal** | http://localhost:3000 | Homepage |
| **Login** | http://localhost:3000/auth/login | Iniciar sesión |
| **Registro** | http://localhost:3000/auth/register | Crear cuenta |
| **Dashboard** | http://localhost:3000/dashboard | Panel principal |
| **Perfil** | http://localhost:3000/profile | Tu perfil |
| **API Health** | http://localhost:3001/health | Estado del backend |
| **Debug Imágenes** | http://localhost:3000/image-debug | Pruebas de imágenes |

---

## 📚 Documentación completa

- **[README.md](README.md)** - Documentación completa del proyecto
- **[SETUP.md](SETUP.md)** - Guía detallada de instalación
- **[INSTALLATION-GUIDE.md](INSTALLATION-GUIDE.md)** - Guía por sistema operativo

---

## 🎉 ¡Ya está!

Si llegaste hasta aquí y todo funciona, ¡felicidades! 

**Próximos pasos:**
1. Explora la aplicación
2. Crea algunos productos de prueba
3. Prueba el sistema de alquileres
4. Revisa el código para entender la estructura

---

<div align="center">

**¿Todo funcionando? ¡Genial! 🚀**

**¿Problemas?** Revisa la documentación completa o contacta al equipo.

</div>
