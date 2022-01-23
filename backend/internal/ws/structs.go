package ws

type User struct {
	Name   string `json:"name"`
	UserID string `json:"user_id"`
	Admin  bool   `json:"admin"`
}
