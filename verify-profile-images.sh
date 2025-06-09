#!/bin/bash

echo "🔍 VERIFICACIÓN FINAL - Imágenes en Perfil"
echo "=========================================="

# Verificar que los servicios estén corriendo
echo "1. Verificando servicios..."
if curl -s http://localhost:3001/health > /dev/null 2>&1; then
    echo "✅ Backend corriendo en puerto 3001"
else
    echo "❌ Backend no está corriendo"
    exit 1
fi

if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Frontend corriendo en puerto 3000"
else
    echo "❌ Frontend no está corriendo"
    exit 1
fi

# Verificar que las imágenes estén disponibles
echo ""
echo "2. Verificando imágenes en backend..."
IMAGE_COUNT=$(ls backend/uploads/products/*.png 2>/dev/null | wc -l)
echo "📁 Imágenes disponibles: $IMAGE_COUNT"

if [ $IMAGE_COUNT -gt 0 ]; then
    # Probar acceso a una imagen
    FIRST_IMAGE=$(ls backend/uploads/products/*.png 2>/dev/null | head -1 | xargs basename)
    if [ ! -z "$FIRST_IMAGE" ]; then
        IMAGE_URL="http://localhost:3001/uploads/products/$FIRST_IMAGE"
        if curl -s -I "$IMAGE_URL" | grep -q "200 OK"; then
            echo "✅ Imágenes accesibles desde el servidor"
        else
            echo "❌ Imágenes no accesibles desde el servidor"
        fi
    fi
fi

# Verificar componentes clave
echo ""
echo "3. Verificando componentes..."

if [ -f "components/simple-smart-image.tsx" ]; then
    echo "✅ SimpleSmartImage existe"
    
    # Verificar que tenga la propiedad showLoadingIndicator
    if grep -q "showLoadingIndicator" components/simple-smart-image.tsx; then
        echo "✅ SimpleSmartImage tiene indicador de carga"
    else
        echo "❌ SimpleSmartImage no tiene indicador de carga"
    fi
else
    echo "❌ SimpleSmartImage no existe"
fi

if [ -f "app/profile/page.tsx" ]; then
    echo "✅ Página de perfil existe"
    
    # Verificar que use SimpleSmartImage
    if grep -q "SimpleSmartImage" app/profile/page.tsx; then
        echo "✅ Perfil usa SimpleSmartImage"
    else
        echo "❌ Perfil no usa SimpleSmartImage"
    fi
    
    # Verificar que tenga showLoadingIndicator
    if grep -q "showLoadingIndicator={true}" app/profile/page.tsx; then
        echo "✅ Perfil usa indicador de carga"
    else
        echo "❌ Perfil no usa indicador de carga"
    fi
else
    echo "❌ Página de perfil no existe"
fi

# Verificar función getImageUrl
echo ""
echo "4. Verificando utilidades..."
if [ -f "lib/utils-api.ts" ]; then
    echo "✅ utils-api.ts existe"
    
    if grep -q "getImageUrl" lib/utils-api.ts; then
        echo "✅ getImageUrl función existe"
    else
        echo "❌ getImageUrl función no existe"
    fi
else
    echo "❌ utils-api.ts no existe"
fi

# Verificar placeholder
echo ""
echo "5. Verificando placeholder..."
if [ -f "public/placeholder-product.svg" ]; then
    echo "✅ Placeholder existe"
    
    if curl -s -I "http://localhost:3000/placeholder-product.svg" | grep -q "200 OK"; then
        echo "✅ Placeholder accesible"
    else
        echo "❌ Placeholder no accesible"
    fi
else
    echo "❌ Placeholder no existe"
fi

echo ""
echo "=========================================="
echo "✅ VERIFICACIÓN COMPLETADA"
echo ""
echo "📋 Para probar las imágenes en el perfil:"
echo "   1. Ve a: http://localhost:3000/auth/login"
echo "   2. Login con: usuario1@universidad.edu / 123456"
echo "   3. Ve a: http://localhost:3000/profile"
echo "   4. Verifica que las imágenes pequeñas cargen correctamente"
echo ""
echo "🔧 Para debugging adicional:"
echo "   - Página de prueba: http://localhost:3000/image-debug"
echo "   - Abre DevTools y revisa la consola para logs"
