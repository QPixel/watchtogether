package server

import (
	"github.com/justinas/alice"
	"github.com/qpixel/tlogbuilder"
	"github.com/qpixel/tloghttp"
	"net/http"
	"time"
)

// MIT License
//
//Copyright (c) 2017 Dan Gillis
//
//Permission is hereby granted, free of charge, to any person obtaining a copy
//of this software and associated documentation files (the "Software"), to deal
//in the Software without restriction, including without limitation the rights
//to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
//copies of the Software, and to permit persons to whom the Software is
//furnished to do so, subject to the following conditions:
//
//The above copyright notice and this permission notice shall be included in all
//copies or substantial portions of the Software.
//
//THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
//SOFTWARE.

// LoggerChain returns a middleware chain (via alice.Chain)
// initialized with all the standard middleware handlers for logging. The logger
// will be added to the request context for subsequent use with pre-populated
// fields, including the request method, url, status, size, duration, remote IP,
// user agent, referer. A unique Request ID is also added to the logger, context
// and response headers.
func (s *Server) loggerChain() alice.Chain {
	ac := alice.New(tloghttp.NewHandler(s.logger),
		tloghttp.AccessHandler(func(r *http.Request, status, size int, duration time.Duration) {
			tlogbuilder.CreateBuilder(tloghttp.FromRequest(r)).
				Info().
				Str("method", r.Method).
				Stringer("url", r.URL).
				Int("status", status).
				Int("size", size).
				Dur("duration", duration).
				Msg("request logged").
				Build()
		}),
		tloghttp.RemoteAddrHandler("remote_ip"),
		tloghttp.UserAgentHandler("user_agent"),
		tloghttp.RefererHandler("referer"),
		//tloghttp.RequestIDHandler("request_id", "Request-Id"),
	)

	return ac
}
