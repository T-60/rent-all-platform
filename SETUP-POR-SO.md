# 🖥️ **GUÍA DE SETUP POR SISTEMA OPERATIVO**

## 📋 **SETUP ESPECÍFICO POR SO**

### 🍎 **macOS / Linux**

#### **Prerrequisitos:**
```bash
# Instalar Homebrew (macOS)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Instalar Node.js
brew install node

# Instalar PNPM
npm install -g pnpm
```

#### **Ejecutar proyecto:**
```bash
# Dar permisos al script
chmod +x start-demo.sh

# Ejecutar
./start-demo.sh
```

---

### 🪟 **Windows**

#### **Prerrequisitos:**
1. **Descargar Node.js**: [https://nodejs.org/](https://nodejs.org/)
2. **Instalar Git**: [https://git-scm.com/](https://git-scm.com/)
3. **Abrir PowerShell como Administrador**:
   ```powershell
   # Instalar PNPM
   npm install -g pnpm
   ```

#### **Ejecutar proyecto:**
```batch
# Doble clic en el archivo o desde cmd:
start-demo.bat
```

#### **Alternativa PowerShell:**
```powershell
# Backend
cd backend
Start-Process node -ArgumentList "server.js"

# Frontend  
cd ..
Start-Process pnpm -ArgumentList "dev", "--hostname", "0.0.0.0"
```

---

### 🐧 **Linux (Ubuntu/Debian)**

#### **Prerrequisitos:**
```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar PNPM
npm install -g pnpm

# Verificar instalación
node --version
pnpm --version
```

#### **Ejecutar proyecto:**
```bash
# Dar permisos
chmod +x start-demo.sh

# Ejecutar
./start-demo.sh
```

---

## 🌐 **CONFIGURACIÓN DE RED POR SO**

### **Obtener IP local:**

#### **macOS:**
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1 | head -1 | awk '{print $2}'
```

#### **Windows:**
```batch
ipconfig | findstr "IPv4"
```

#### **Linux:**
```bash
hostname -I | awk '{print $1}'
```

---

## 🔧 **COMANDOS DE TROUBLESHOOTING**

### **Matar procesos en puertos:**

#### **macOS/Linux:**
```bash
# Matar proceso en puerto 3000
lsof -ti:3000 | xargs kill -9

# Matar proceso en puerto 3001  
lsof -ti:3001 | xargs kill -9
```

#### **Windows:**
```batch
# Ver procesos en puerto
netstat -ano | findstr :3000

# Matar proceso por PID
taskkill /f /pid [PID]
```

---

## 🚨 **PROBLEMAS COMUNES**

### **❌ "Permission denied" (macOS/Linux)**
```bash
sudo chmod +x start-demo.sh
```

### **❌ "Execution policy" (Windows)**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### **❌ "PNPM not found"**
```bash
# Reinstalar PNPM
npm uninstall -g pnpm
npm install -g pnpm
```

### **❌ "Port already in use"**
```bash
# Método universal - cambiar puertos
PORT=3002 node backend/server.js
pnpm dev --port 3001
```

---

## 📱 **TESTING MULTI-DISPOSITIVO**

### **URLs de prueba por IP típicas:**

#### **Redes domésticas:**
- `http://192.168.1.XXX:3000` (routers comunes)
- `http://192.168.0.XXX:3000` (algunos routers)
- `http://10.0.0.XXX:3000` (redes empresariales)

#### **Hotspot móvil:**
- `http://192.168.43.XXX:3000` (Android)
- `http://172.20.10.XXX:3000` (iPhone)

---

## ✅ **VERIFICACIÓN POR SO**

### **Checklist macOS:**
- [ ] Homebrew instalado
- [ ] Node.js 18+ (`node --version`)
- [ ] PNPM instalado (`pnpm --version`)
- [ ] Script ejecutable (`ls -la start-demo.sh`)
- [ ] Puertos libres (`lsof -i :3000`)

### **Checklist Windows:**
- [ ] Node.js instalado desde nodejs.org
- [ ] PNPM instalado (`pnpm --version`)
- [ ] Git instalado y configurado  
- [ ] PowerShell con permisos
- [ ] Firewall permite Node.js

### **Checklist Linux:**
- [ ] Node.js 18+ desde repositorio oficial
- [ ] PNPM instalado globalmente
- [ ] Permisos de ejecución en scripts
- [ ] UFW/iptables permite puertos 3000/3001

---

**💡 Tip**: Si tienes problemas, siempre puedes usar el método manual:
```bash
# Terminal 1
cd backend && node server.js

# Terminal 2  
pnpm dev --hostname 0.0.0.0
```
