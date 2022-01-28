package ws

//todo better data deserialization

type IdentityData struct {
	ClientID string `json:"clientID"`
	User     User   `json:"user"`
}

func handleIdentifyEvent(message *Message) {
	d := message.Data.(map[string]interface{})
	if id, ok := d["clientID"]; ok {
		log.Infof("Client %s has sent identify event", id.(string))
	}
	m := Message{
		MessageData: MessageData{
			Type: Identify,
			Data: map[string]interface{}{
				"admin":      true,
				"playlist":   "http://localhost:8081/BelleOpening.m3u8",
				"controller": true,
				"playhead":   0,
				"user":       d["user"],
			},
		},
	}
	message.send <- m.SerializeMessage().Data
}

func handlePingEvent(message *Message) {
	m := Message{
		message.Client,
		MessageData{
			Type: Pong,
			Data: nil,
		},
	}
	message.send <- m.SerializeMessage().Data
}

func handleGetPlayhead(message *Message) {

}

func handleSetPlayhead(message *Message) {
	d := message.Data.(map[string]interface{})
	m := Message{
		MessageData: MessageData{
			Type: SetPlayhead,
			Data: map[string]interface{}{
				"playhead": d["playhead"],
				"paused":   d["paused"],
			},
		},
	}
	log.Infof("Received SetPlayhead event. playhead is at %s", d["playhead"])
	for client := range message.Client.hub.Clients {
		if client == message.Client {
			continue
		}
		client.send <- m.SerializeMessage().Data
	}
}
