#!/usr/bin/env node

const axios = require('axios');

const API_URL = 'http://localhost:3000';

async function testAPI() {
    console.log('🧪 Testing Media Downloader API\n');
    
    try {
        // Test 1: Health check
        console.log('1️⃣ Testing health check endpoint...');
        const healthResponse = await axios.get(API_URL);
        console.log('✅ Health check passed:', healthResponse.data.message);
        console.log('');
        
        // Test 2: Download a sample image
        console.log('2️⃣ Testing image download...');
        const imageResponse = await axios.post(`${API_URL}/api/download`, {
            url: 'https://httpbin.org/image/jpeg'
        });
        console.log('✅ Image download successful:');
        console.log(`   File: ${imageResponse.data.filename}`);
        console.log(`   Size: ${imageResponse.data.size} bytes`);
        console.log(`   Time: ${imageResponse.data.downloadTime}`);
        console.log('');
        
        // Test 3: Test error handling with invalid URL
        console.log('3️⃣ Testing error handling...');
        try {
            await axios.post(`${API_URL}/api/download`, {
                url: 'not-a-valid-url'
            });
        } catch (error) {
            if (error.response && error.response.status === 400) {
                console.log('✅ Error handling works correctly:');
                console.log(`   Status: ${error.response.status}`);
                console.log(`   Error: ${error.response.data.message}`);
            } else {
                throw error;
            }
        }
        console.log('');
        
        // Test 4: Get API documentation
        console.log('4️⃣ Testing API documentation endpoint...');
        const docsResponse = await axios.get(`${API_URL}/api/download`);
        console.log('✅ API documentation available');
        console.log(`   Endpoint: ${docsResponse.data.endpoint}`);
        console.log(`   Supported formats: ${docsResponse.data.supportedFormats.length} types`);
        console.log('');
        
        console.log('🎉 All tests passed! Your Media Downloader API is working perfectly!');
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        console.log('\n💡 Make sure the API server is running with: npm start');
    }
}

// Run tests
testAPI();