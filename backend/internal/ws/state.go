package ws

import (
	"errors"
	"sync"
)

type State struct {
	sync.RWMutex

	playhead         float64
	controllerUserId string
	adminUserId      string
	paused           bool
}

func NewState() *State {
	return &State{
		playhead:         0,
		controllerUserId: "218072060923084802",
		adminUserId:      "218072060923084802",
	}
}

func (s *State) setPlayhead(playhead float64) error {
	if s == nil {
		return errors.New("unable to find state")
	}
	s.Lock()
	defer s.Lock()
	s.playhead = playhead
	return nil
}

func (s *State) IsController(userID string) bool {
	if userID == s.controllerUserId {
		return true
	}
	return false
}
func (s *State) IsAdmin(userID string) bool {
	if userID == s.adminUserId {
		return true
	}
	return false
}
