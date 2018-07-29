#!/usr/bin/env bash

yarn build

scp -C -r build/* apps1@cmlteam.com:~/hack.cmlteam.com/
