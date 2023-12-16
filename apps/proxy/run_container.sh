# create a volume for app state, like the database & tailscale config
# no-op if it already exists
docker volume create slipbox

docker run \
  --platform linux/amd64\
  --name=slipbox \
  -v slipbox:/data \
  -p 8000:8000 \
  ghcr.io/phildenhoff/logseq-slipbox:main
