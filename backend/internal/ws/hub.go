package ws

type Hub struct {
	// Registered Clients
	Clients map[*Client]bool

	// Inbound messages from the Clients
	broadcast chan RawMessage

	// Register requests from the Clients
	register chan *Client

	// Unregister requests from Clients
	unregister chan *Client
}

func NewHub() *Hub {
	return &Hub{
		broadcast:  make(chan RawMessage),
		register:   make(chan *Client),
		unregister: make(chan *Client),
		Clients:    make(map[*Client]bool),
	}
}

func (h *Hub) handleMessage(rm RawMessage) {
	m := rm.UnserializeData()
	switch m.Type {
	case Identify:
		handleIdentifyEvent(&m)
	case Ping:
		handlePingEvent(&m)
	case Position:
		handleGetPlayhead(&m)
	case SetPosition:
		handleSetPlayhead(&m)
	default:
		return
	}
	return
}

func (h *Hub) Run() {
	for {
		select {
		case client := <-h.register:
			h.Clients[client] = true
		case client := <-h.unregister:
			if _, ok := h.Clients[client]; ok {
				delete(h.Clients, client)
				close(client.send)
			}
		case message := <-h.broadcast:
			go h.handleMessage(message)
			//for client := range h.Clients {
			//	select {
			//	case client.send <- message:
			//	default:
			//		close(client.send)
			//		delete(h.Clients, client)
			//	}
			//}
		}
	}
}
