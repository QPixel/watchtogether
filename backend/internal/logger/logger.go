package logger

import (
	"github.com/ubergeek77/tinylog"
)

func NewLogger(lvl int, tag string) *tinylog.Logger {
	// cfg contains our custom config for tinylog
	cfg := tinylog.NewConfig()
	cfg.LogLevel = lvl
	cfg.LogPrefix = tinylog.GenerateTag(tag, tinylog.NewColor("38;5;133"), cfg)

	//initialize the instance of tinylog
	lgr := tinylog.NewLogger(cfg)

	return lgr
}
