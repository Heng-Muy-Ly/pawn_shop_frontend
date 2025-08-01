#!/bin/bash

# Enable Docker BuildKit for faster builds
export DOCKER_BUILDKIT=1

# Build with cache optimization
echo "Building Docker image with BuildKit optimization..."

# Build the image with cache from previous builds
docker build \
  --build-arg BUILDKIT_INLINE_CACHE=1 \
  --cache-from node:18-alpine \
  --tag pawn-shop-frontend:latest \
  .

echo "Build completed successfully!"

# Optional: Run the container for testing
if [ "$1" = "--run" ]; then
  echo "Starting container for testing..."
  docker run -d --name pawn-shop-test -p 3000:3000 pawn-shop-frontend:latest
  echo "Container started on http://localhost:3000"
fi 