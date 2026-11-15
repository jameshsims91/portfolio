import { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    async function loadMessage() {
      try {
        const response = await fetch("/api/hello")
        
        if (!response.ok) {
          throw new Error("Request failed with status " + response.status)
        }
        const data = await response.json()
        setMessage(data.message)
      } catch {
        setMessage("Could not connect to rails backend. Make sure the backend is running and accessible at http://localhost:3000/api/hello")
      }
    }

    loadMessage()
  }, [])

  return (
    <main>
      <h1>Portfolio</h1>
      <p>{message}</p>
    </main>
  )
}

export default App
