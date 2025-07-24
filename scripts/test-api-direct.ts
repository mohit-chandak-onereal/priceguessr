// Test the API directly to see what's being returned
const testUrl = 'https://priceguessr-git-additional-feature-mohit-chandaks-projects.vercel.app/api/items/02a87e0f-1021-4b14-9f4d-ed01b5875d03/images?index=0';

console.log('Testing API:', testUrl);

fetch(testUrl)
  .then(response => {
    console.log('Status:', response.status);
    console.log('Headers:', Object.fromEntries(response.headers.entries()));
    console.log('URL:', response.url);
    console.log('Type:', response.type);
    console.log('Redirected:', response.redirected);
    
    if (response.redirected) {
      console.log('Redirected to:', response.url);
    }
    
    return response.text();
  })
  .then(text => {
    console.log('Response length:', text.length);
    console.log('First 100 chars:', text.substring(0, 100));
    
    // Check if it's JSON (error response)
    try {
      const json = JSON.parse(text);
      console.log('JSON response:', json);
    } catch (e) {
      console.log('Not JSON, likely binary image data');
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });