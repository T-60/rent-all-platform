# ⚡ COMANDOS ESENCIALES - RENT-ALL

## 🏠 DESARROLLO

### Iniciar todo
```bash
npm run dev:background
```

### Reiniciar después de cambios
```bash
npm run dev:stop:windows && npm run dev:background
```

### Parar todo
```bash
npm run dev:stop:windows
```

### Ver logs
```bash
type logs\backend.log
```

---

## 🌐 PRODUCCIÓN

### Subir cambios completo
```bash
git add . && git commit -m "descripción" && git push && npm run deploy:prod:silent
```

### Solo deploy (si ya hiciste git push)
```bash
npm run deploy:prod:silent
```

---

## 🔗 URLS

### Desarrollo
- http://localhost:3000

### Producción  
- http://34.23.76.150:8080

---

## 🆘 EMERGENCIA

### Limpiar todo en desarrollo
```bash
npm run dev:stop:windows
taskkill /f /im mongod.exe
taskkill /f /im node.exe
npm run dev:background
```

### Re-deploy forzado en producción
```bash
npm run deploy:prod:silent
```
