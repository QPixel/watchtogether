package services

import "github.com/ubergeek77/tinylog"

// LoggerService reads and updates the logger state
type LoggerService struct {
	Logger tinylog.Logger
}

// NewLoggerService creates a new instance of the logging service
func NewLoggerService(logger tinylog.Logger) *LoggerService {
	return &LoggerService{Logger: logger}
}
