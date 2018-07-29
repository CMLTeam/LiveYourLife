#!/usr/bin/python

import sys
import itertools
import json
import logging

logging.basicConfig(stream=sys.stderr, level=logging.DEBUG)

sdpairsfile=sys.argv[1]

# THIS IS A COPY FROM gen-json.py, have to merge!
def calc_trip_cost(trip):
    cost = 0
    cal = 0
    time = 0
    for leg in trip["legs"]: 
        lstats = leg["statistics"]
        time = time + lstats["duration_s"]
        if leg["mode"] == "walk":
            cal = cal + lstats["distance_km"] * 53
            # cost is free
        elif leg["mode"] == "bike":
            cal = cal + lstats["distance_km"] * 31
            # XXX: add proper calculatoin. Typically per second, 3$/30min + min $3
            cost = cost + lstats["duration_s"]  * 0.001666667 + 3
        elif leg["mode"] == "bus":
            # no calories
            cost = cost + 2.25
        elif leg["mode"] == "metro":
            # no calories
            cost = cost + 2.25
        else:
            print "UNRECOGNIZED!"
    return (time, cost, cal)



with open(sdpairsfile) as f:
    sdpairs = json.load(f)

# generate all possible trajectories (permutations of Trips)
l = []
for sdpair in sdpairs:
    l.append(range(0, len(sdpair["trips"])))
perms = [s for s in itertools.product(*l)]

logging.debug(perms)

trajs = []
for perm in perms:
    traj = {}
    traj["trips"] = []
    for (sdpair, trip) in zip(sdpairs, perm):
        #traj.append(sdpair["trips"][trip]["statistics"]["distance_km"])
        traj["trips"].append(sdpair["trips"][trip])
    trajs.append(traj)

logging.debug(len(trajs))
             
# ok, now let's iterate over trajs and see their distances

i = 1
for traj in trajs:
    logging.debug("Traj " + str(i))
    j = 0
    traj_cost = 0
    traj_cal = 0
    traj_time = 0
    for trip in traj["trips"]:
        trip_time, trip_cost, trip_cal = calc_trip_cost(trip)
        traj_cost = traj_cost + trip_cost
        traj_cal = traj_cal + trip_cal
        traj_time = traj_time + trip_time
        #print "  Trip " + str(j) + ": " + str(trip["statistics"]["distance_km"])
        j = j + 1
    logging.debug("  " + str(traj_time) + "sec " + str(traj_cost) + "$ " + str(traj_cal) + "cal")
    traj["duration"] = traj_time
    traj["cost"] = traj_cost
    traj["cal"] = traj_cal
    i = i + 1

print json.dumps(trajs, indent=4, sort_keys=True)
