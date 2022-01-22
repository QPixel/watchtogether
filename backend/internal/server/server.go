// Copyright 2018 The Go Cloud Development Kit Authors
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
// @QPixel edits - I have made a copy of the go-api-basic server code and made
// the following changes:
//
// - removed zerolog dependency

package server

import (
	"context"
	"errors"
	"github.com/gorilla/mux"
	"github.com/qpixel/watchtogether/internal/driver"
	"github.com/ubergeek77/tinylog"
	"io"
	"net/http"
	"time"
)

const pathPrefix = "/api"

// Server represents an HTTP server
type Server struct {
	router *mux.Router
	driver driver.Server

	logger *tinylog.Logger

	Addr string

	// Authorization

	// Services
}

//type LoggerService interface {
//	Read() logger.LoggerResponse
//
//}

// SvrParams is the set of configuration parameters for a Server
type SvrParams struct {
	// Logger is used for the server logging
	Logger *tinylog.Logger

	// Driver serves HTTP requests
	Driver driver.Server
}

// NewServerParams is an initializer for ServerParams
func NewServerParams(lgr *tinylog.Logger, d driver.Server) *SvrParams {
	options := &SvrParams{
		Logger: lgr,
		Driver: d,
	}
	return options
}

// NewServer initializes a new Server and registers
// routes to the router mux
// todo add error checking
func NewServer(r *mux.Router, params *SvrParams) (*Server, error) {
	s := &Server{router: r}
	s.logger = params.Logger
	s.driver = params.Driver

	return s, nil
}

func (s *Server) ListenAndServe() error {
	if s.Addr == "" {
		return errors.New("server Addr is empty")
	}
	if s.router == nil {
		return errors.New("server router is nil")
	}
	if s.driver == nil {
		return errors.New("server driver is nil")
	}
	s.logger.Infof("server is listening on %s", s.Addr)
	return s.driver.ListenAndServe(s.Addr, s.router)
}

// Shutdown will gracefully shut down the server without interrupting any active connections
func (s *Server) Shutdown(ctx context.Context) error {
	if s.driver == nil {
		return nil
	}
	return s.driver.Shutdown(ctx)
}

// Driver implements the driver.Server interface. The zero value is a valid http.Server
type Driver struct {
	Server http.Server
}

// NewDriver intializes a Driver with http.Server using default timeouts
func NewDriver() *Driver {
	return &Driver{
		Server: http.Server{
			ReadTimeout:  30 * time.Second,
			WriteTimeout: 30 * time.Second,
			IdleTimeout:  120 * time.Second,
		},
	}
}

// ListenAndServe sets the address and handler on Driver's http.Server
func (d *Driver) ListenAndServe(addr string, h http.Handler) error {
	d.Server.Addr = addr
	d.Server.Handler = h
	return d.Server.ListenAndServe()
}

// Shutdown gracefully shuts down the server without interrupting any active connections,
// by calling Shutdown on Driver's http.Server
func (d *Driver) Shutdown(ctx context.Context) error {
	return d.Server.Shutdown(ctx)
}

// NewMuxRouter initializes a gorilla/mux router and
// adds the /api subroute to it
func NewMuxRouter() *mux.Router {
	// initializer gorilla/mux router
	r := mux.NewRouter()

	// send Router through PathPrefix method to validate any standard
	// subroutes you may want for your APIs. e.g. I always want to be
	// sure that every request has "/api" as part of its path prefix
	// without having to put it into every handle path in my various
	// routing functions
	s := r.PathPrefix(pathPrefix).Subrouter()

	return s
}

func decoderErr(err error) error {
	switch {
	case err == io.EOF:
		return errors.New("request body cannot be empty")
	case err == io.ErrUnexpectedEOF:
		return errors.New("malformed json")
	case err != nil:
		return err
	}
	return nil
}
