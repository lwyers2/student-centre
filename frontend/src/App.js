import React, { useEffect } from 'react';
import axios from 'axios';

function App() {
  useEffect(() => {
    // Make the API request to the backend
    axios
      .get('/api/users')  // Adjust URL if necessary
      .then((response) => {
        console.log(response.data);  // Log the API response data to the console
      })
      .catch((error) => {
        console.error('Error fetching data:', error);  // Handle any errors
      });
  }, []);  // Empty dependency array ensures this runs only once on mount

  return (
    <div>
      <h1>Welcome to My App</h1>
      <p>Check the console for the API response</p>
    </div>
  );
}

export default App;