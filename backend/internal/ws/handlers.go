package ws

//todo better data deserialization

type IdentityData struct {
	ClientID string `json:"clientId"`
	User     User   `json:"user"`
}

func handleIdentifyEvent(message *Message) {
	d := message.Data.(map[string]interface{})
	m := Message{
		MessageData: MessageData{
			Type: Identify,
			Data: map[string]interface{}{
				"admin":    true,
				"playlist": "",
				"playHead": 0,
				"user":     d["user"],
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
