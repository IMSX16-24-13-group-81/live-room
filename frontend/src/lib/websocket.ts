import { PUBLIC_BACKEND_WEBSOCKET_URL } from "$env/static/public"

const websocketURL = PUBLIC_BACKEND_WEBSOCKET_URL || undefined

export const setupWebsocket = () => {
  if (websocketURL === undefined) {
    console.log("COULD NOT GET WEBSOCKET URL VARIABLE. WILL NOT TRY TO CONNECT.")
    return
  }

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
