package main

import (
	"flag"
	"fmt"
	"github.com/peterbourgon/ff/v3"
	"github.com/qpixel/watchtogether/internal/logger"
	"github.com/qpixel/watchtogether/internal/server"
	"github.com/ubergeek77/tinylog"
	"os"
	"runtime"
)

type flags struct {
	loglvl int
	port   int
}

func newFlags(args []string) (flgs flags, err error) {
	fs := flag.NewFlagSet(args[0], flag.ContinueOnError)

	var (
		loglvl = fs.Int("loglvl", tinylog.TraceLevel, "sets the log level (also via LOG_LEVEL)")
		port   = fs.Int("port", 4000, "sets the port to use (also via PORT)")
	)
	// Parse the command line flags from above
	err = ff.Parse(fs, args[1:], ff.WithEnvVarNoPrefix())
	if err != nil {
		return flgs, err
	}
	return flags{
		loglvl: *loglvl,
		port:   *port,
	}, nil
}

func main() {
	if err := run(os.Args); err != nil {
		tinylog.DefaultLogger().Errorf("error from main.run(): %s\n", err)
		os.Exit(1)
	}

}

func run(args []string) error {

	flgs, err := newFlags(args)
	if err != nil {
		return err
	}
	// setup logger with defaults
	lgr := logger.NewLogger(flgs.loglvl, "WatchTogether")

	lgr.Infof("go runtime ver: %s", runtime.Version())
	lgr.Infof("Logging level has been set to %d", lgr.LogLevel)

	mr := server.NewMuxRouter()

	serverDriver := server.NewDriver()

	params := server.NewServerParams(lgr, serverDriver)

	s, err := server.NewServer(mr, params)
	if err != nil {
		lgr.Errorf("err: %s", err)
		lgr.Fatal("error in server.NewServer")
	}

	s.Addr = fmt.Sprintf(":%d", flgs.port)

	return s.ListenAndServe()
}
