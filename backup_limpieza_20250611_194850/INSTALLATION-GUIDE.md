# 🖥️ Guía de Instalación por Sistema Operativo

## 🍎 macOS

### **Prerequisitos**
```bash
# 1. Instalar Homebrew (si no lo tienes)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 2. Instalar Node.js
brew install node

# 3. Instalar pnpm
npm install -g pnpm

# 4. Instalar MongoDB
brew tap mongodb/brew
brew install mongodb-community

# 5. Instalar Git (si no lo tienes)
xcode-select --install
```

### **Iniciar MongoDB**
```bash
# Iniciar MongoDB como servicio
brew services start mongodb-community

# Verificar que funciona
mongosh --eval "db.runCommand({ping: 1})"
```

### **Configurar Proyecto**
```bash
# Clonar repositorio
git clone [URL_DEL_REPO]
cd rent-all-platform

# Instalar dependencias
pnpm install
cd backend && npm install && cd ..

# Configurar entorno
cp .env.example .env.local
nano .env.local  # Editar configuración

# Ejecutar
# Terminal 1:
cd backend && npm start

# Terminal 2:
pnpm dev
```

---

## 🪟 Windows

### **Prerequisitos**

#### **1. Node.js**
- Descargar desde: https://nodejs.org/
- Ejecutar instalador
- Verificar: `node --version` en PowerShell/CMD

#### **2. pnpm**
```powershell
npm install -g pnpm
```

#### **3. Git**
- Descargar desde: https://git-scm.com/download/win
- Ejecutar instalador con opciones por defecto

#### **4. MongoDB**
**Opción A: MongoDB Local**
- Descargar desde: https://www.mongodb.com/try/download/community
- Ejecutar instalador
- Instalar como servicio

**Opción B: MongoDB Atlas (Recomendado)**
- Crear cuenta en: https://www.mongodb.com/atlas
- Más fácil que instalación local

### **Configurar Proyecto**
```powershell
# Abrir PowerShell como administrador

# Clonar repositorio
git clone [URL_DEL_REPO]
cd rent-all-platform

# Instalar dependencias
pnpm install
cd backend
npm install
cd ..

# Configurar entorno
copy .env.example .env.local
notepad .env.local  # Editar configuración

# Ejecutar (dos terminales separadas)
# Terminal 1:
cd backend
npm start

# Terminal 2:
pnpm dev
```

---

## 🐧 Linux (Ubuntu/Debian)

### **Prerequisitos**
```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# 1. Instalar Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 2. Instalar pnpm
npm install -g pnpm

# 3. Instalar Git
sudo apt-get install git

# 4. Instalar MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
```

### **Iniciar MongoDB**
```bash
# Iniciar servicio
sudo systemctl start mongod
sudo systemctl enable mongod

# Verificar
mongosh --eval "db.runCommand({ping: 1})"
```

### **Configurar Proyecto**
```bash
# Clonar repositorio
git clone [URL_DEL_REPO]
cd rent-all-platform

# Instalar dependencias
pnpm install
cd backend && npm install && cd ..

# Configurar entorno
cp .env.example .env.local
nano .env.local  # Editar configuración

# Ejecutar
# Terminal 1:
cd backend && npm start

# Terminal 2:
pnpm dev
```

---

## 🐳 Docker (Opcional - Para todos los OS)

Si prefieres usar Docker para evitar configurar MongoDB localmente:

### **docker-compose.yml**
```yaml
version: '3.8'
services:
  mongodb:
    image: mongo:6.0
    container_name: rentall-mongo
    restart: always
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password
      MONGO_INITDB_DATABASE: rentall
    volumes:
      - mongodb_data:/data/db

volumes:
  mongodb_data:
```

### **Uso con Docker**
```bash
# Iniciar MongoDB con Docker
docker-compose up -d

# En .env.local usar:
MONGODB_URI=mongodb://admin:password@localhost:27017/rentall?authSource=admin

# Detener
docker-compose down
```

---

## 🔧 Verificación Post-Instalación

### **1. Verificar Versiones**
```bash
node --version    # Debe ser 18.0+
pnpm --version    # Cualquier versión reciente
git --version     # Cualquier versión reciente
mongosh --version # Si usas MongoDB local
```

### **2. Verificar Servicios**
```bash
# Verificar que MongoDB funciona
mongosh --eval "db.runCommand({ping: 1})"

# Verificar puertos disponibles
# macOS/Linux:
lsof -i :3000  # Debe estar libre
lsof -i :3001  # Debe estar libre

# Windows:
netstat -an | findstr :3000
netstat -an | findstr :3001
```

### **3. Verificar Instalación del Proyecto**
```bash
cd rent-all-platform

# Verificar dependencias frontend
pnpm list

# Verificar dependencias backend
cd backend && npm list && cd ..

# Ejecutar verificación automática
./verify-profile-images.sh  # Si existe
```

---

## 🆘 Solución de Problemas por OS

### **macOS**
```bash
# Error: "command not found: brew"
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Error: "MongoDB connection failed"
brew services restart mongodb-community

# Error: "Permission denied"
sudo chown -R $(whoami) ~/.npm
```

### **Windows**
```powershell
# Error: "ejecución de scripts está deshabilitada"
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Error: "MongoDB no inicia"
# Ir a Servicios de Windows y iniciar "MongoDB"

# Error: "Puerto en uso"
netstat -ano | findstr :3000
taskkill /PID [PID_NUMBER] /F
```

### **Linux**
```bash
# Error: "Permission denied" con npm
sudo chown -R $(whoami) ~/.npm

# Error: "MongoDB failed to start"
sudo systemctl status mongod
sudo systemctl restart mongod

# Error: "Port already in use"
sudo lsof -ti:3000 | xargs kill -9
```

---

## 📞 Soporte Específico por OS

### **macOS**
- **Homebrew Issues:** https://brew.sh/
- **Node.js Issues:** https://nodejs.org/en/download/
- **MongoDB Issues:** https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/

### **Windows**
- **PowerShell Issues:** Ejecutar como administrador
- **Node.js Issues:** Reiniciar después de instalación
- **MongoDB Issues:** Verificar servicios de Windows

### **Linux**
- **Package Manager Issues:** `sudo apt update`
- **Permission Issues:** Usar `sudo` cuando sea necesario
- **Service Issues:** `systemctl status [service]`

---

<div align="center">

**¡Tu sistema está listo para RENT+ALL! 🚀**

Si sigues estos pasos específicos para tu sistema operativo, deberías tener todo funcionando sin problemas.

</div>
