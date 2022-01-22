module github.com/qpixel/watchtogether

go 1.17

replace (
	github.com/qpixel/tloghttp => ../../tloghttp
	github.com/qpixel/tlogbuilder => ../../tlogbuilder
)

require (
	github.com/gorilla/mux v1.8.0
	github.com/justinas/alice v1.2.0
	github.com/peterbourgon/ff/v3 v3.1.2
	github.com/qpixel/tloghttp v0.0.0-20211222065322-cd8d1a945a36
	github.com/qpixel/tlogbuilder v0.0.0
	github.com/ubergeek77/tinylog v1.0.0
)
