#!/bin/sh

giturl=GIT_URL_HERE
gitbranch=GIT_BRANCH_HERE

mkdir -p APP_NAME_HERE
cd APP_NAME_HERE

oldhash=nohash

if [ $(ls | wc -l) -eq 0 ]
then
  git clone --single-branch --branch $gitbranch $giturl .
else
  oldhash=$(git rev-parse HEAD)
  git pull
fi

newhash=$(git rev-parse HEAD)

if [ $oldhash != $newhash ]
then
  #DOCKERONLY
  systemctl start docker
  docker compose pull
  docker compose build
  docker compose down
  docker compose up -d
  #END
  #PODMANONLY
  podman compose pull
  podman compose build
  podman compose down
  podman compose up -d
  #END
  
  echo "Updated from $oldhash to $newhash"
else
  echo "No update, staying on $oldhash"
fi
