#!/bin/bash

locfile="$1"
maxdollars=100
mincallories=0

echo Generating JSON
./gen-json.py "$locfile" > "$locfile.json"
echo Picking trajectory
./pick-traj.py "$locfile.json" $maxdollars $mincallories > "$locfile.json.stats"
