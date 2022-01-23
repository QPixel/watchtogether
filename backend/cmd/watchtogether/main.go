package main

import (
	"encoding/json"
	"github.com/gorilla/mux"
	"github.com/qpixel/watchtogether/internal/ws"
	tlog "github.com/ubergeek77/tinylog"
	"net/http"
)

var log = tlog.NewTaggedLogger("Logger", tlog.NewColor("38;5;111"))

func main() {
	r := mux.NewRouter()
	r.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		resp := make(map[string]string)
		resp["status"] = "ok"
		jsonResp, err := json.Marshal(resp)
		if err != nil {
			log.Fatalf("error in unmarshalling json. err: %s", err.Error())
		}
		_, err = w.Write(jsonResp)
		if err != nil {
			return
		}
		return
	})
	hub := ws.NewHub()
	go hub.Run()

	r.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		ws.ServeWs(hub, w, r)
	})

	err := http.ListenAndServe(":8080", r)
	if err != nil {
		log.Errorf("%s", err.Error())
		log.Fatalf("unable to serve on port 8080")
	}
}
