import { useState, useEffect } from 'react';
import './App.css';

// A type definition for the data we expect to receive.
// This is a key benefit of TypeScript!
interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

function App() {
  // State to hold the data we fetch. Starts as null.
  const [data, setData] = useState<Todo | null>(null);
  // State to know when we are waiting for the response.
  const [loading, setLoading] = useState(true);
  // State to hold any potential errors.
  const [error, setError] = useState<string | null>(null);

  // The useEffect hook runs a function after the component renders.
  // The empty array [] at the end means it will only run ONCE.
  useEffect(() => {
    // Step 1: Initiate the request to the URL.
    fetch('https://jsonplaceholder.typicode.com/todos/1')
      // Step 2: Handle the initial response.
      .then(response => {
        // If the response is not 'ok' (e.g., status 404 or 500), throw an error.
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        // Step 3: Tell the program to parse the response body as JSON.
        return response.json();
      })
      // Step 4: We finally have the data!
      .then(fetchedData => {
        setData(fetchedData); // Put the data into our state.
        setError(null);       // Clear any previous errors.
      })
      // Step 5: This block runs if any step in the chain fails.
      .catch(err => {
        setError(err.message); // Put the error message into our state.
        setData(null);         // Clear any old data.
      })
      // This 'finally' block runs regardless of success or failure.
      .finally(() => {
        setLoading(false); // We are done loading.
      });
  }, []); // The empty dependency array means this effect runs only once on mount.

  // Conditional rendering based on our state
  if (loading) {
    return <div>Loading data, please wait...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="App">
      <h1>My Fetched Data</h1>
      {data ? (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      ) : (
        <p>No data found.</p>
      )}
    </div>
  );
}

export default App;
