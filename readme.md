# slipbox

A plugin & self-hosted server for writing notes on-the-go, and saving them to Logseq later.

<p align="center">
  <picture style="max-width: 800px">
    <source media="(prefers-color-scheme: dark)" srcset="./assets/screenshots/plugin_dark.png">
    <img src="./assets/screenshots/plugin_light.png" style="max-width:800px;">
  </picture>
</p>

## Setup

Deploy the docker container, add it to your Tailscale net, and you're good to go!

### 1. Download the container

```fish
docker pull ghcr.io/phildenhoff/logseq-slipbox:main
```

### 2. Run the container

We need to create two folders in our app config folder: `tailscale` and `app`.

You can either create a new volume, or mount /data in the container to a folder
on your host machine. In this example, we'll create a new volume called `slipbox`.

```fish
cd /path/to/your/config
mkdir tailscale app

docker run \
  # optional, required if you're on an M1 Mac
  --platform linux/amd64\
  --name=slipbox \
  -v /path/to/your/config:/data \
  ghcr.io/phildenhoff/logseq-slipbox:main
```

### 3. Add the server to your Tailscale network

Open the container's logs. At the bottom, you'll see a prompt asking you to
go to the Tailscale website to authenticate the server.

```text

To authenticate, visit:

        https://login.tailscale.com/a/<uuid>

```

Click the link, and add the server to your network.
You should see a success page. Once you do, you can close the browser tab; slipbox is now ready to use!

If you've set up Magic DNS, you can now go to `https://slipbox.<your tailnet>.ts.net` to access the server.
