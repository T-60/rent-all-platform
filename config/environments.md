# 🌍 CONFIGURACIÓN POR AMBIENTES

## 📁 ESTRUCTURA RECOMENDADA:

```
rent-all-platform/
├── .env.example                 # ✅ Template con todas las variables
├── .env.development            # ✅ Configuración de desarrollo
├── .env.production             # ✅ Configuración de producción
├── .env.local                  # ❌ NO sincronizar (solo local)
├── config/
│   ├── development.js          # ✅ Config específica desarrollo
│   ├── production.js           # ✅ Config específica producción
│   └── index.js                # ✅ Selector de ambiente
└── scripts/
    ├── deploy-dev.sh           # ✅ Script de deploy desarrollo
    ├── deploy-prod.sh          # ✅ Script de deploy producción
    └── setup-env.sh            # ✅ Setup automático de variables
```

## 🎯 VARIABLES POR AMBIENTE:

### DESARROLLO:
- API_URL: http://localhost:3001/api
- PORT: 3001
- DB: MongoDB local

### PRODUCCIÓN:
- API_URL: http://34.23.76.150:8080/api  
- PORT: 3001
- DB: MongoDB Atlas o local
