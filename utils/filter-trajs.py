#!/usr/bin/python

import json
import sys
from pprint import pprint

inputfile = sys.argv[1]
#maxdollars = int(sys.argv[2])
#mincalories = int(sys.argv[3])

with open(inputfile) as f:
    trajs = json.load(f)
#pprint(data)

#mintime = 9999999
d2t = {}
for traj in trajs:
    #print "Trajectory: " + str(traj["duration"]) + "sec " + str(round(traj["cost"],2)) + "$ " + str(round(traj["cal"],2)) + "cal"
    d2t[traj["duration"]] = traj
    #if traj["cal"] < mincalories or traj["cost"] > maxdollars:
    #    continue
    #if traj["duration"] < mintime:
    #    mintraj = traj
    #    mintime = traj["duration"]


#print len(trajs)
#print len(d2t.keys())

newtrajs = []
for k in d2t.keys():
    newtrajs.append(d2t[k])

print json.dumps(newtrajs)
#print json.dumps(newtrajs, indent=4, sort_keys=True)

#if mintime == 9999999:
#    print "Can't find path for this constrains!"
#else:
#    print "Best trajectory: " + str(mintraj["duration"]) + "sec" 
#    pprint(traj)
