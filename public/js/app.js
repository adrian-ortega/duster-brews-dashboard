const ws = new WebSocket('ws://localhost:8080/websockets');
ws.onopen = () => {
    console.log('Connected')
}

ws.onerror = (error) => {
    console.log(error)
}

ws.onmessage = (message) => {
    let json
    try {
        json = JSON.parse(message.data)
    } catch (e) {
        console.log('Invalid JSON received');
        return;
    }

    console.log({ json })
}

let lastTimestamp = performance.now()
let interval = 3000
const heartbeat = (timestamp) => {
    if(timestamp - lastTimestamp < interval) {
        return;
    }

    lastTimestamp = timestamp
    window.requestAnimationFrame(heartbeat)
}

window.requestAnimationFrame(heartbeat)