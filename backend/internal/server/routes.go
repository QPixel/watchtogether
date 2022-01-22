package server

import "net/http"

const (
	contentTypeHeaderKey        string = "Content-Type"
	appJSONContentTypeHeaderVal string = "application/json",
)

func (s *Server) routes() {
	s.router.Handle("/", func(http.ResponseWriter, *http.Response) {

	})
}
