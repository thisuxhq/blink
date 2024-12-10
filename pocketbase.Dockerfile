FROM alpine:latest

ARG PB_VERSION=0.22.27

# Install required tools
RUN apk add --no-cache \
    ca-certificates \
    unzip \
    wget \
    bash

# Download and unzip PocketBase
ADD https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip /tmp/pb.zip
RUN unzip /tmp/pb.zip -d /pb/

# Create required directories
WORKDIR /pb
RUN mkdir -p /pb/pb_data /pb/pb_migrations /pb/pb_hooks

# Copy migrations
COPY ./pocketbase/pb_migrations /pb/pb_migrations/

# Set correct permissions
RUN chmod 755 /pb/pocketbase && \
    chown -R nobody:nobody /pb

USER nobody

EXPOSE 8092

# Start PocketBase with automigrate and CORS enabled
CMD ["/pb/pocketbase", "serve", "--http=0.0.0.0:8092", "--automigrate"]