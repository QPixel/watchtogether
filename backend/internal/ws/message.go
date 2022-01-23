package ws

import (
	"encoding/json"
	tlog "github.com/ubergeek77/tinylog"
	"strconv"
)

var log = tlog.NewTaggedLogger("WS", tlog.NewColor("38;5;111"))

type MessageTypes float64

// todo rewrite to use an event handler system
const (
	Ping MessageTypes = iota
	Pong
	Identify
	Position
	SetPosition
)

type MessageData struct {
	Type    MessageTypes    `json:"type"`
	RawData json.RawMessage `json:"data,omitempty"`
	Data    interface{}     `json:"-"`
}

type Message struct {
	*Client
	MessageData
}

type RawMessage struct {
	Client *Client
	Data   []byte
}

func (rm RawMessage) UnSerializeData() Message {
	s, _ := strconv.Unquote(string(rm.Data))
	var md MessageData
	if err := json.Unmarshal([]byte(s), &md); err != nil {
		log.Errorf("error unmarshalling message, %s", err.Error())
	}
	if md.RawData != nil && len(md.RawData) > 0 {
		if err := json.Unmarshal(md.RawData, &md.Data); err != nil {
			// handle error
			log.Errorf("error unmarshalling message, %s", err.Error())
		}
	}

	m := Message{
		Client:      rm.Client,
		MessageData: md,
	}
	return m
}

func (m Message) SerializeMessage() RawMessage {
	var err error
	if m.Data != nil {
		m.RawData, err = json.Marshal(m.Data)
		if err != nil {
			log.Errorf("unable to marshal data, %s", err.Error())
		}
	}
	data, err := json.Marshal(m.MessageData)
	if err != nil {
		log.Errorf("unable to marshal message, %s", err.Error())
	}
	return RawMessage{
		Data: data,
	}
}
