#!/bin/bash

# 🔍 Script de Verificación Automática - RENT+ALL
# Este script verifica que todos los prerequisitos estén instalados correctamente

echo "🚀 VERIFICACIÓN DE INSTALACIÓN - RENT+ALL"
echo "========================================"
echo ""

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Contadores
TOTAL_CHECKS=0
PASSED_CHECKS=0
FAILED_CHECKS=0

# Función para checks
check_command() {
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    local cmd=$1
    local name=$2
    local required_version=$3
    
    echo -n "Verificando $name... "
    
    if command -v $cmd &> /dev/null; then
        local version=$($cmd --version 2>/dev/null | head -n1)
        echo -e "${GREEN}✅ Instalado${NC} - $version"
        PASSED_CHECKS=$((PASSED_CHECKS + 1))
        return 0
    else
        echo -e "${RED}❌ No encontrado${NC}"
        if [[ ! -z "$required_version" ]]; then
            echo "   💡 Instalar: $required_version"
        fi
        FAILED_CHECKS=$((FAILED_CHECKS + 1))
        return 1
    fi
}

# Función para verificar servicios
check_service() {
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    local url=$1
    local name=$2
    
    echo -n "Verificando $name... "
    
    if curl -s --connect-timeout 5 "$url" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Ejecutándose${NC}"
        PASSED_CHECKS=$((PASSED_CHECKS + 1))
        return 0
    else
        echo -e "${RED}❌ No accesible${NC}"
        FAILED_CHECKS=$((FAILED_CHECKS + 1))
        return 1
    fi
}

# Función para verificar archivos
check_file() {
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    local file=$1
    local name=$2
    
    echo -n "Verificando $name... "
    
    if [[ -f "$file" ]]; then
        echo -e "${GREEN}✅ Existe${NC}"
        PASSED_CHECKS=$((PASSED_CHECKS + 1))
        return 0
    else
        echo -e "${RED}❌ No encontrado${NC}"
        FAILED_CHECKS=$((FAILED_CHECKS + 1))
        return 1
    fi
}

echo "1️⃣ PREREQUISITOS DEL SISTEMA"
echo "-----------------------------"

# Verificar Node.js
if check_command "node" "Node.js"; then
    NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [[ $NODE_VERSION -ge 18 ]]; then
        echo "   ✅ Versión de Node.js compatible (18+)"
    else
        echo -e "   ${YELLOW}⚠️  Versión de Node.js antigua. Recomendado: 18+${NC}"
    fi
fi

# Verificar pnpm
check_command "pnpm" "pnpm" "npm install -g pnpm"

# Verificar Git
check_command "git" "Git"

# Verificar MongoDB (opcional para desarrollo local)
if command -v mongosh &> /dev/null; then
    echo -n "Verificando MongoDB... "
    if mongosh --quiet --eval "db.runCommand({ping: 1})" &> /dev/null; then
        echo -e "${GREEN}✅ MongoDB ejecutándose${NC}"
        PASSED_CHECKS=$((PASSED_CHECKS + 1))
    else
        echo -e "${YELLOW}⚠️  MongoDB instalado pero no ejecutándose${NC}"
        echo "   💡 Iniciar con: brew services start mongodb-community (macOS)"
    fi
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
else
    echo -e "${BLUE}ℹ️  MongoDB no instalado localmente (puede usar Atlas)${NC}"
fi

echo ""
echo "2️⃣ ESTRUCTURA DEL PROYECTO"
echo "---------------------------"

# Verificar archivos principales
check_file "package.json" "package.json del frontend"
check_file "backend/package.json" "package.json del backend"
check_file ".env.example" "Archivo de ejemplo de configuración"

# Verificar si .env.local existe
if [[ -f ".env.local" ]]; then
    echo -e "Verificando .env.local... ${GREEN}✅ Configurado${NC}"
    PASSED_CHECKS=$((PASSED_CHECKS + 1))
else
    echo -e "Verificando .env.local... ${YELLOW}⚠️  No encontrado${NC}"
    echo "   💡 Ejecutar: cp .env.example .env.local"
fi
TOTAL_CHECKS=$((TOTAL_CHECKS + 1))

echo ""
echo "3️⃣ DEPENDENCIAS"
echo "----------------"

# Verificar node_modules del frontend
if [[ -d "node_modules" ]]; then
    echo -e "Dependencias frontend... ${GREEN}✅ Instaladas${NC}"
    PASSED_CHECKS=$((PASSED_CHECKS + 1))
else
    echo -e "Dependencias frontend... ${RED}❌ No instaladas${NC}"
    echo "   💡 Ejecutar: pnpm install"
    FAILED_CHECKS=$((FAILED_CHECKS + 1))
fi
TOTAL_CHECKS=$((TOTAL_CHECKS + 1))

# Verificar node_modules del backend
if [[ -d "backend/node_modules" ]]; then
    echo -e "Dependencias backend... ${GREEN}✅ Instaladas${NC}"
    PASSED_CHECKS=$((PASSED_CHECKS + 1))
else
    echo -e "Dependencias backend... ${RED}❌ No instaladas${NC}"
    echo "   💡 Ejecutar: cd backend && npm install"
    FAILED_CHECKS=$((FAILED_CHECKS + 1))
fi
TOTAL_CHECKS=$((TOTAL_CHECKS + 1))

echo ""
echo "4️⃣ SERVICIOS (si están ejecutándose)"
echo "------------------------------------"

# Verificar frontend
check_service "http://localhost:3000" "Frontend (Next.js)"

# Verificar backend
check_service "http://localhost:3001/health" "Backend API"

# Verificar archivos estáticos
check_service "http://localhost:3001/uploads" "Servidor de archivos estáticos"

echo ""
echo "5️⃣ ESTRUCTURA DE ARCHIVOS CRÍTICOS"
echo "-----------------------------------"

# Verificar componentes principales
check_file "app/page.tsx" "Página principal"
check_file "components/simple-smart-image.tsx" "Componente de imágenes"
check_file "contexts/auth-context.tsx" "Contexto de autenticación"
check_file "backend/server.js" "Servidor backend"
check_file "backend/routes/auth.js" "Rutas de autenticación"

echo ""
echo "6️⃣ DIRECTORIOS DE UPLOADS"
echo "--------------------------"

# Verificar directorio de uploads
if [[ -d "backend/uploads" ]]; then
    echo -e "Directorio uploads... ${GREEN}✅ Existe${NC}"
    PASSED_CHECKS=$((PASSED_CHECKS + 1))
    
    # Verificar subdirectorio products
    if [[ -d "backend/uploads/products" ]]; then
        echo -e "Directorio products... ${GREEN}✅ Existe${NC}"
        PASSED_CHECKS=$((PASSED_CHECKS + 1))
        
        # Contar archivos de imagen
        IMAGE_COUNT=$(find backend/uploads/products -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" -o -name "*.gif" 2>/dev/null | wc -l)
        if [[ $IMAGE_COUNT -gt 0 ]]; then
            echo -e "Imágenes de prueba... ${GREEN}✅ $IMAGE_COUNT archivos encontrados${NC}"
        else
            echo -e "Imágenes de prueba... ${YELLOW}⚠️  No se encontraron imágenes${NC}"
        fi
        PASSED_CHECKS=$((PASSED_CHECKS + 1))
    else
        echo -e "Directorio products... ${RED}❌ No existe${NC}"
        echo "   💡 Crear con: mkdir -p backend/uploads/products"
        FAILED_CHECKS=$((FAILED_CHECKS + 1))
    fi
    TOTAL_CHECKS=$((TOTAL_CHECKS + 2))
else
    echo -e "Directorio uploads... ${RED}❌ No existe${NC}"
    echo "   💡 Crear con: mkdir -p backend/uploads/products"
    FAILED_CHECKS=$((FAILED_CHECKS + 1))
fi
TOTAL_CHECKS=$((TOTAL_CHECKS + 1))

echo ""
echo "========================================"
echo "📊 RESUMEN DE VERIFICACIÓN"
echo "========================================"

echo -e "Total de verificaciones: ${BLUE}$TOTAL_CHECKS${NC}"
echo -e "Verificaciones exitosas: ${GREEN}$PASSED_CHECKS${NC}"
echo -e "Verificaciones fallidas: ${RED}$FAILED_CHECKS${NC}"

PERCENTAGE=$((PASSED_CHECKS * 100 / TOTAL_CHECKS))
echo -e "Porcentaje de éxito: ${BLUE}$PERCENTAGE%${NC}"

echo ""

if [[ $FAILED_CHECKS -eq 0 ]]; then
    echo -e "${GREEN}🎉 ¡PERFECTO! Todo está configurado correctamente.${NC}"
    echo -e "${GREEN}✅ Tu entorno está listo para desarrollar RENT+ALL${NC}"
    echo ""
    echo "🚀 Para iniciar la aplicación:"
    echo "   1. Terminal 1: cd backend && npm start"
    echo "   2. Terminal 2: pnpm dev"
    echo "   3. Abrir: http://localhost:3000"
    
elif [[ $FAILED_CHECKS -le 3 ]]; then
    echo -e "${YELLOW}⚠️  Casi listo. Hay algunos elementos faltantes menores.${NC}"
    echo -e "${YELLOW}🔧 Revisa las sugerencias marcadas con 💡 arriba.${NC}"
    echo ""
    echo "📋 Pasos siguientes recomendados:"
    
    if [[ ! -f ".env.local" ]]; then
        echo "   • cp .env.example .env.local"
    fi
    
    if [[ ! -d "node_modules" ]]; then
        echo "   • pnpm install"
    fi
    
    if [[ ! -d "backend/node_modules" ]]; then
        echo "   • cd backend && npm install"
    fi
    
    if [[ ! -d "backend/uploads/products" ]]; then
        echo "   • mkdir -p backend/uploads/products"
    fi
    
else
    echo -e "${RED}❌ Hay varios elementos faltantes importantes.${NC}"
    echo -e "${RED}🔧 Por favor revisa las instrucciones de instalación.${NC}"
    echo ""
    echo "📖 Consulta estos archivos:"
    echo "   • README.md - Documentación completa"
    echo "   • SETUP.md - Guía de instalación rápida"
    echo "   • INSTALLATION-GUIDE.md - Guía por sistema operativo"
fi

echo ""
echo "📞 ¿Necesitas ayuda?"
echo "   • Revisa SETUP.md para instalación paso a paso"
echo "   • Revisa la sección de solución de problemas en README.md"
echo "   • Contacta al equipo de desarrollo"

exit $FAILED_CHECKS
