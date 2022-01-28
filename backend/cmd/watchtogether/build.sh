#!/bin/bash
VERSION=v1.0.0
COMMIT_HASH=$(git rev-parse --short HEAD)
ENVIRONMENT=$ENV
BUILDSTRING="$VERSION-$COMMIT_HASH-$ENVIRONMENT"
echo The environment is "$ENVIRONMENT"
echo Building watch together backend "$VERSION-$COMMIT_HASH"
if [[ "$ENVIRONMENT" == "dev" ]]; then
  go build -gcflags="all=-N -l" -ldflags "-X github.com/qpixel/watchtogether/cmd/watchtogether/main.VERSION=${BUILDSTRING} -X github.com/qpixel/watchtogether/cmd/watchtogether/main.ENVIRONMENT=${ENVIRONMENT}";
else
  go build -ldflags "-X github.com/qpixel/watchtogether/cmd/watchtogether/main.VERSION=${BUILDSTRING} -X github.com/ubergeek77/uberbot/v2/core.ENVIRONMENT=${ENVIRONMENT}";
fi