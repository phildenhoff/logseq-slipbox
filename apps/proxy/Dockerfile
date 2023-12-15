# Start with a Debian base image
FROM debian:latest

# Install necessary packages
RUN apt-get update && \
    apt-get install -y curl iptables iproute2 curl unzip

# Install Tailscale
RUN curl -fsSL https://tailscale.com/install.sh | sh

# Install Deno
RUN curl -fsSL https://deno.land/x/install/install.sh | sh
ENV PATH="/root/.deno/bin:$PATH"

# Create directories for your app and Tailscale
RUN mkdir -p /data/app /data/tailscale

# Create a symlink from Tailscale's default state directory to the volume
RUN ln -s /data/tailscale /var/lib/tailscale

# Copy your Deno application files to the container
COPY . /app
WORKDIR /app

# Expose the port your Deno app will run on
EXPOSE 8000

# Start Tailscale in userspace mode and then start Deno server
CMD tailscaled --tun=userspace-networking & sleep 10 \
  && tailscale up --hostname=slipbox\
  && deno run --allow-net --allow-read --allow-write main.ts /data/app/slipbox.db
