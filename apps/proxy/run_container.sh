# create a volume for app state, like the database & tailscale config
# no-op if it already exists
docker volume create slipbox

docker run \
  --platform linux/amd64\
  --name=slipbox \
  -v slipbox:/data \
  ghcr.io/phildenhoff/logseq-slipbox:main
