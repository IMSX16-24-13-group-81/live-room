export const setupWebsocket = () => {
  const websocketURL = import.meta.env.BACKEND_WEBSOCKET_URL || "ws://localhost:8079"
  const ws = new WebSocket(websocketURL)

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
