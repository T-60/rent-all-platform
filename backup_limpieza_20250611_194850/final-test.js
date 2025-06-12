const axios = require('axios');

const BACKEND_URL = 'http://localhost:3001/api';

async function runFinalTest() {
    console.log('🚀 Ejecutando prueba final...\n');
    
    try {
        // Test backend health
        const health = await axios.get(`${BACKEND_URL}/health`);
        console.log('✅ Backend funcionando:', health.data.message);
        
        // Test user creation
        const userData = {
            name: 'Usuario Final',
            email: 'final@test.com',
            password: 'password123',
            university: 'Universidad Final'
        };
        
        try {
            await axios.post(`${BACKEND_URL}/auth/register`, userData);
            console.log('✅ Usuario creado');
        } catch (e) {
            console.log('ℹ️ Usuario ya existe');
        }
        
        // Test login
        const login = await axios.post(`${BACKEND_URL}/auth/login`, {
            email: userData.email,
            password: userData.password
        });
        console.log('✅ Login exitoso');
        
        const token = login.data.token;
        
        // Test profile
        const profile = await axios.get(`${BACKEND_URL}/users/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        console.log('✅ Perfil obtenido:', profile.data.user.name);
        
        console.log('\n🎉 TODAS LAS PRUEBAS EXITOSAS');
        console.log('\n📋 Credenciales para probar en navegador:');
        console.log('Email:', userData.email);
        console.log('Password:', userData.password);
        console.log('URL Frontend:', 'http://localhost:3002');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        }
    }
}

runFinalTest();
