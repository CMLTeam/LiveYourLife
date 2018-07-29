#!/bin/bash

set -e

locfile="$1"
maxdollars=100
mincallories=0

echo Generating SDPAIRS
./gen-sdpairs.py "$locfile" > "$locfile.sdpairs.json"
echo Generate TRAJS
./gen-json-from-sdpairs.py "$locfile.sdpairs.json" > "$locfile.sdpairs.json.trajs.json"
echo Picking best trajectory 
./pick-traj.py "$locfile.sdpairs.json.trajs.json" $maxdollars $mincallories > "$locfile.json.stats"
