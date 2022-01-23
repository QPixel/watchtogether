package ws

type IdentityData struct {
	ClientID string `json:"client_id"`
	User     User   `json:"user"`
}

func handleIdentifyEvent(message *Message) {

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
