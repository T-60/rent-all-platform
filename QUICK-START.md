# ⚡ **RENT+ALL - QUICK START**

## 🚀 **Inicio en 3 comandos**

```bash
# 1. Instalar dependencias
pnpm install && cd backend && npm install && cd ..

# 2. Ejecutar aplicación
./start-demo.sh

# 3. ¡Abrir navegador!
# http://localhost:3000
```

---

## 📋 **Requisitos mínimos**
- Node.js 18+
- PNPM (`npm install -g pnpm`)

---

## 🌐 **URLs importantes**
- **App**: http://localhost:3000
- **API**: http://localhost:3001
- **Health**: http://localhost:3001/api/health

---

## 📱 **Para pruebas en red local**
```bash
# Usar tu IP para acceso desde móviles/tablets
./start-demo.sh
# Te mostrará: http://TU-IP:3000
```

---

## 🔧 **Scripts útiles**
```bash
pnpm demo           # Inicio automático
pnpm dev:network    # Solo frontend en red
pnpm backend        # Solo backend
pnpm build          # Compilar proyecto
pnpm type-check     # Verificar TypeScript
```

---

## 🆘 **Problemas comunes**

### PNPM no encontrado:
```bash
npm install -g pnpm
```

### Puerto ocupado:
```bash
lsof -ti:3000 | xargs kill -9
lsof -ti:3001 | xargs kill -9
```

### Permisos (macOS/Linux):
```bash
chmod +x start-demo.sh
```

---

## 📚 **Documentación completa**
- `README-INSTALACION.md` - Guía detallada
- `SETUP-POR-SO.md` - Configuración por SO
- `GUIA-PRUEBA-RED-LOCAL.md` - Testing multi-dispositivo

---

**¡Listo para desarrollar!** 🎉
