import googlemaps
import json
import urllib2

apikey="AIzaSyCpPfnNhtN1ecsNLedF7GlfmPdLhlhqUm4"

gmaps = googlemaps.Client(key=apikey)

def locations(locstr):
    gr = gmaps.geocode(locstr)
    #print json.dumps(gr, indent=4, sort_keys=True)
    lat = gr[0]["geometry"]["location"]["lat"]
    lng = gr[0]["geometry"]["location"]["lng"]
    return (lat, lng)

locs = ["Golden Gate Appartments, San Francisco, CA",
        "Sightglass Coffee, San Francisco, CA"]

coords = {}

for loc in locs:
    # XXX: REMOVE 
    coords[loc] = (0,0)
    #coords[loc] = locations(loc)

for loc in locs:
    print coords[loc]

modes="bus%2Cmetro%2Cferry%2Crail%2Cbike"
priority="soon"
time="2018-07-29T04%3A46%3A27.543Z"
time_mode="depart"
bike_systems="FordGoBike%2CJumpSF"
access_key="qZxum2xJHdPljElFFrBpcFrftbSOL0aAs5joz-f8oH0"

orglat="37.7861238"
orglng="-122.4317792"
dstlat="37.7770356"
dstlng="-122.40845430000002"
numopts="5"

url="https://api.coord.co/v1/routing/route?origin_latitude={}&origin_longitude={}&destination_latitude={}&destination_longitude={}&modes={}&num_options={}&priority={}&time={}&time_mode={}&bike_systems={}&access_key={}".format(orglat, orglng, dstlat, dstlng, modes, numopts, priority, time, time_mode, bike_systems, access_key)

#contents = urllib2.urlopen("https://api.coord.co/v1/routing/route?origin_latitude=37.7861238&origin_longitude=-122.4317792&destination_latitude=37.7770356&destination_longitude=-122.40845430000002&modes=bus%2Cmetro%2Cferry%2Crail%2Cbike&num_options=3&priority=soon&time=2018-07-29T04%3A46%3A27.543Z&time_mode=depart&bike_systems=FordGoBike%2CJumpSF&access_key=qZxum2xJHdPljElFFrBpcFrftbSOL0aAs5joz-f8oH0").read()

contents = json.loads(urllib2.urlopen(url).read())
#print json.dumps(contents, indent=4, sort_keys=True)

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
    return (time, cost, cal)

print "Trips: " + str(len(contents["trips"]))

ti = 1
for trip in contents["trips"]:
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
