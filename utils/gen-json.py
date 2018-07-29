import googlemaps
import json
import urllib2

apikey="AIzaSyCpPfnNhtN1ecsNLedF7GlfmPdLhlhqUm4"
gmaps = googlemaps.Client(key=apikey)

def location(locstr):
    gr = gmaps.geocode(locstr)
    #print json.dumps(gr, indent=4, sort_keys=True)
    lat = gr[0]["geometry"]["location"]["lat"]
    lng = gr[0]["geometry"]["location"]["lng"]
    return (lat, lng)

locs = ["Golden Gate Appartments, San Francisco, CA",
        "Sightglass Coffee, San Francisco, CA",
        "Valencia Street Medical Center, San Francisco, CA"
        ]

def get_trips(org, dst):
    (orglat, orglng) = location(org)
    (dstlat, dstlng) = location(dst)

    #orglat="37.7861238"
    #orglng="-122.4317792"
    #dstlat="37.7770356"
    #dstlng="-122.40845430000002"

    modes="bus%2Cmetro%2Cferry%2Crail%2Cbike"
    priority="soon"
    time="2018-07-29T04%3A46%3A27.543Z"
    time_mode="depart"
    bike_systems="FordGoBike%2CJumpSF"
    access_key="qZxum2xJHdPljElFFrBpcFrftbSOL0aAs5joz-f8oH0"

    numopts="5"

    url="https://api.coord.co/v1/routing/route?origin_latitude={}&origin_longitude={}&destination_latitude={}&destination_longitude={}&modes={}&num_options={}&priority={}&time={}&time_mode={}&bike_systems={}&access_key={}".format(orglat, orglng, dstlat, dstlng, modes, numopts, priority, time, time_mode, bike_systems, access_key)

    contents = json.loads(urllib2.urlopen(url).read())
    #print json.dumps(contents, indent=4, sort_keys=True)
    return contents


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

def print_sdpair(sdpair):
    print "Trips: " + str(len(sdpair["trips"]))
    ti = 1
    for trip in sdpair["trips"]:
        print "Trip " + str(ti)
        costs = calc_trip_cost(trip)
        print "  " + str(costs[0]) + "sec " + str(costs[1]) + "$ " + str(costs[2]) + "cal"
        print "  Legs " + str(len(trip["legs"]))
        calc_trip_cost(trip)
        li = 1
        for leg in trip["legs"]:
            lstats = leg["statistics"]
            print "    Leg " + str(ti) + "-" + str(li) + ": " + leg["mode"] + " " + str(lstats["distance_km"]) + "km " + str(lstats["duration_s"]) + "sec "
            li = li + 1
        ti = ti + 1

sdpairs = []

for i in range(len(locs) - 1):
    sdpair = get_trips(locs[i], locs[i + 1])
    print_sdpair(sdpair)
    print "------------------------------------------"
    sdpairs.append(sdpair)

#------------------------------------------------------------------------

#print json.dumps(contents, indent=4, sort_keys=True)

#curl "https://api.coord.co/v1/routing/route?origin_latitude=37.7861238&origin_longitude=-122.4317792&destination_latitude=37.7770356&destination_longitude=-122.40845430000002&modes=bus%2Cmetro%2Cferry%2Crail%2Cbike&num_options=3&priority=soon&time=2018-07-29T04%3A46%3A27.543Z&time_mode=depart&bike_systems=FordGoBike%2CJumpSF&access_key=qZxum2xJHdPljElFFrBpcFrftbSOL0aAs5joz-f8oH0"

#gmaps = googlemaps.Client(client_id=client_id, client_secret=client_secret)

# Geocoding and address
#geocode_result = gmaps.geocode('1600 Amphitheatre Parkway, Mountain View, CA')

# Look up an address with reverse geocoding
#reverse_geocode_result = gmaps.reverse_geocode((40.714224, -73.961452))

# Request directions via public transit
#now = datetime.now()
#directions_result = gmaps.directions("Sydney Town Hall", "Parramatta, NSW", mode="transit", departure_time=now)
