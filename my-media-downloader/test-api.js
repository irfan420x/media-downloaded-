const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000';

// Test cases
const testCases = [
  {
    name: 'Test API Status',
    method: 'GET',
    url: '/',
    data: null
  },
  {
    name: 'Download Sample Image',
    method: 'POST',
    url: '/api/download',
    data: { url: 'https://picsum.photos/800/600' }
  },
  {
    name: 'Test Missing URL',
    method: 'POST',
    url: '/api/download',
    data: {}
  },
  {
    name: 'Test Invalid URL',
    method: 'POST',
    url: '/api/download',
    data: { url: 'invalid-url' }
  }
];

async function runTests() {
  console.log('🧪 Testing Media Downloader API\n');
  
  for (const testCase of testCases) {
    console.log(`\n📋 ${testCase.name}`);
    console.log('─'.repeat(50));
    
    try {
      const config = {
        method: testCase.method,
        url: `${API_BASE_URL}${testCase.url}`,
        headers: {
          'Content-Type': 'application/json'
        }
      };
      
      if (testCase.data) {
        config.data = testCase.data;
      }
      
      const response = await axios(config);
      console.log('✅ Success');
      console.log('📊 Status:', response.status);
      console.log('📄 Response:', JSON.stringify(response.data, null, 2));
      
    } catch (error) {
      console.log('❌ Error');
      if (error.response) {
        console.log('📊 Status:', error.response.status);
        console.log('📄 Response:', JSON.stringify(error.response.data, null, 2));
      } else {
        console.log('💥 Error:', error.message);
      }
    }
  }
  
  console.log('\n🎉 Test suite completed!');
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { runTests };