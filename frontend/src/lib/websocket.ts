export const setupWebsocket = () => {
  const ws = new WebSocket("ws://localhost:8079")

  ws.onopen = () => {}

  ws.onmessage = (event) => {
    // Parse the JSON string back into an object
    //const receivedData = JSON.parse(event.data)
    console.log("Message from server: ", event.data)
  }

  ws.onclose = () => {
    console.log("Disconnected from the server")
  }

  ws.onerror = (err) => {
    console.error("WebSocket encountered an error: ", err)
  }
}
