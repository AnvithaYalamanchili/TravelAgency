const placesData = {
india: {
    images: ["/jammu.jpg", "/redfort.jpg", "/goa.jpg"],
    description: "Experience India's rich culture, history, and breathtaking landscapes.",
    detailedDescription:
      "India is a land of diverse landscapes, cultures, and traditions. From the bustling streets of Delhi to the serene beaches of Goa, there's something for everyone. Explore the majestic palaces of Rajasthan, the backwaters of Kerala, and the snow-capped mountains of Himachal Pradesh.",
    transportation: "Flights from major cities. Private vehicle for local travel.",
    duration: "7 Days / 6 Nights",
    numberOfPlaces: 5,
    accommodation: "3-star & 5-star hotels with breakfast included.",
    meals: "Indian & Continental cuisine. Breakfast, Lunch & Dinner included.",
    totalCost: 1200,
    defaultPlaces: [
      { name: "Goa", price: 200, image: "/goa.jpg", lat: 15.019690781712866, lon: 74.00160104548475 },
      { name: "Delhi", price: 150, image: "/redfort.jpg", lat: 28.6559299,  lon: 77.2378497 },
      { name: "Mumbai", price: 180, image: "/Mumbai.jpg", lat: 18.922137229602686, lon: 72.83466457107671},
      { name: "AndhraPradesh", price: 170, image: "/godavari.jpg", lat: 16.4971451, lon: 80.581826},
      { name: "Karnataka", price: 270, image: "/karnataka.jpg", lat: 12.3044878, lon: 76.6561619},
      { name: "HimachalPradesh", price: 270, image: "/himachal.webp", lat: 31.1048, lon: 77.1734},
      { name: "Varanasi", price: 270, image: "/ganga.jpg", lat: 25.3107307, lon: 83.0112723},
      { name: "Taj Mahal", price: 270, image: "/TajMahal.jpg", lat: 27.1733067, lon: 78.0423063}
    ],
    states: {
      AndhraPradesh: {
        places: [
          { name: "Visakhapatnam", image: "/vizag.jpg", lat: 17.6868, lon: 83.2185 },
          { name: "Tirupati", image: "/tirupati.jpg", lat: 13.6288, lon: 79.4192 },
          { name: "Araku Valley", image: "/araku.jpg", lat: 18.3272, lon: 82.8763 },
          { name: "Undavalli Cave Temple",image:"/undavalli.jpg",lat:16.4971412,lon:80.5821896 },
          { name: "Eastern Ghats",image:"/ghats.jpg",lat:18.2781837,lon:82.9897564 },
          { name: "Kakinada",image:"/kakinada.jpg",lat:17.1071161,lon:82.2456527 },
          { name: "Draksharamam",image:"/draksha.jpg",lat:16.7929155,lon:82.0634689 },
          
          
        ]
      },Karnataka: {
        places: [
          { name: "Bangalore", price: 200, image: "/bangalore.jpg", lat: 12.9716, lon: 77.5946 },
          { name: "Mysore", price: 160, image: "/mysore.jpg", lat: 12.2958, lon: 76.6394 },
          { name: "Coorg", price: 180, image: "/coorg.jpg", lat: 12.3375, lon: 75.8069 },
          { name: "Jog Falls", price: 180, image: "/jog.jpg", lat: 14.2294389, lon: 74.8125229 },
          { name: "Anshi National Park", price: 180, image: "/anshi.jpg", lat: 14.9980998, lon: 74.3587473 },
          { name: "Mirjan Fort", price: 180, image: "/mirjan.jpg", lat: 14.4896832, lon: 74.4177475 },
          { name: "Badami Cave Temples",image:"/badami.jpg",lat:15.9165254,lon:75.6903904 },
          
        ]
      },
      HimachalPradesh: {
        places: [
          { name: "Shimla", price: 220, image: "/shimla.jpg", lat: 31.1048, lon: 77.1734 },
          { name: "Manali", price: 230, image: "/manali.jpg", lat: 32.2396, lon: 77.1887 },
          { name: "Dharamshala", price: 210, image: "/dharamshala.jpg", lat: 32.2190, lon: 76.3234 },
          { name: "Dainkund Peak", price: 210, image: "/daikund.jpg", lat: 32.5209778, lon: 76.0348494},
          { name: "Great Himalayan National Park", price: 210, image: "/himalayashimachal.jpg", lat: 31.795181, lon: 77.6086235},
          { name: "Nehru Kund", price: 210, image: "/nehrukund.jpg", lat: 32.2896439, lon: 77.1788672},
          { name: "Magic Valley", price: 210, image: "/magicValley.jpg", lat: 32.0972672, lon: 77.2854004},
        ]
      },
      Goa:{
        places:[
          { name: "Dudhsagar Water falls", price: 220, image: "/dudhsagar.jpg", lat: 15.3144375, lon: 74.3143073 },
          { name: "Velsao Beach", price: 230, image: "/velsao.jpg", lat: 15.3544232, lon: 73.8838637 },
          { name: "Butterfly Beach", price: 210, image: "/butterfly.jpg", lat: 15.0194842, lon: 74.0016359 },
          { name: "Chapora Fort", price: 210, image: "/chapora.jpg", lat: 15.6074278, lon: 73.7324935},
          { name: "St. Cajetan Church", price: 210, image: "/cajetan.jpg", lat: 15.5053872, lon: 73.9138038},
          { name: "Aguada Fort", price: 210, image: "/Aguada.jpg", lat: 15.4920138, lon: 73.7732882},
          { name: "Big Foot Goa", price: 210, image: "/BigFoot.jpg", lat: 15.3398314, lon: 73.987582},
        ]
      },
      Delhi:{
        places:[
          { name: "India Gate", price: 220, image: "/indiagate.jpg", lat: 28.6128883, lon: 77.2298283 },
          { name: "Lotus Temple", price: 230, image: "/velsao.jpg", lat: 28.5535641, lon: 77.2579346 },
          { name: "Red Fort", price: 210, image: "/butterfly.jpg", lat: 28.6561592, lon: 77.2410203 },
          { name: "Birla Mandir", price: 210, image: "/chapora.jpg", lat: 28.6326666, lon: 77.1989963},
          { name: "Bhool Bhulaiya", price: 210, image: "/bhool.jpg", lat: 28.5228163, lon: 77.1820946},
          { name: "National Gandhi Museum", price: 210, image: "/Aguada.jpg", lat: 28.6389073, lon: 77.2459101},
          { name: "Jantar Mantar", price: 210, image: "/BigFoot.jpg", lat: 28.6270547, lon: 77.2166267},
        ]
      },
      Mumbai:{
        places:[
          { name: "Chhatrapathi Sivaji Maharaj Vastu Sangrahalaya ", price: 220, image: "/indiagate.jpg", lat: 18.9269015, lon: 72.8326916 },
          { name: "Gateway Of India", price: 230, image: "/velsao.jpg", lat: 18.9219841, lon: 72.8346543 },
          { name: "Marine Drive", price: 210, image: "/butterfly.jpg", lat: 18.931953, lon: 72.8227914 },
          { name: "Elephanta Caves", price: 210, image: "/chapora.jpg", lat: 18.9633474, lon: 72.9314864},
          { name: "South Mumbai", price: 210, image: "/bhool.jpg", lat: 18.9333437, lon: 72.8279228},
          { name: "Kumbhe Waterfalls", price: 210, image: "/Aguada.jpg", lat: 18.3093544, lon: 73.3742969},
          { name: "Sinhagad Fort", price: 210, image: "/BigFoot.jpg", lat: 18.366277, lon: 73.7558777},
        ]
      },
      Varanasi:{
        places:[
          { name: "Sri Kashi Viswanath Temple ", price: 220, image: "/indiagate.jpg", lat: 25.3107307, lon: 83.0112723 },
          { name: "Manikarnika Ghat", price: 230, image: "/velsao.jpg", lat: 25.3107888, lon: 83.0140845 },
          { name: "Manas Mandir", price: 210, image: "/butterfly.jpg", lat: 25.2871082, lon: 83.0004165 },
          { name: "Golden Mandir", price: 210, image: "/chapora.jpg", lat: 25.3841578, lon: 83.0257939},
          { name: "Tulsi Ghat", price: 210, image: "/bhool.jpg", lat: 25.2904159, lon: 83.0064002},
          { name: "Banaras", price: 210, image: "/Aguada.jpg", lat: 25.2883025, lon: 83.0066889},
        ]
      }
    },
    otherPlaces: [
      { name: "Manali", price: 140, image: "/manali.jpg", lat: 32.275795, lon: 77.1807569},
      { name: "Valley Of Flowers", price: 220, image: "/Valleyofflowers.jpg", lat: 30.7274108, lon: 79.6097704},
      { name: "Kerala", price: 190, image: "/kerala.jpg", lat: 10.2851072, lon: 76.5697643},
      { name: "Jammu & Kashmir", price: 210, image: "/jammu.jpg", lat: 33.715416, lon: 74.5184174}
    ]
  },
  arizona: {
    images: ["/arizona1.jpg", "/arizona2.jpg", "/arizona3.jpg"],
    description: "Discover Arizona’s stunning landscapes and adventure-filled trips.",
    detailedDescription:
      "Arizona is home to breathtaking natural wonders like the Grand Canyon, Sedona, and Monument Valley. Explore the red rock formations, take scenic hikes, and enjoy adventurous road trips.",
    transportation: "Domestic flights and private transport for sightseeing.",
    duration: "5 Days / 4 Nights",
    numberOfPlaces: 4,
    accommodation: "Luxury resorts & boutique hotels.",
    meals: "Traditional American, Mexican & Vegetarian options included.",
    totalCost: 1400,
    defaultPlaces: [
      { name: "GrandCanyon", price: 300, image: "/grandcanyon.jpg", lat: 36.1069, lon: -112.1129 },
      { name: "Phoenix", price: 250, image: "/phoenix.jpg", lat: 33.4562542, lon: -111.9452649 },
      { name: "Sedona", price: 270, image: "/sedona.jpg", lat: 34.8191463, lon: -111.7923253 },
      { name: "Monument Valley", price: 270, image: "/monumentvalley.jpg", lat: 36.9926248, lon: -110.0838564 },
      { name: "Jerome", price: 270, image: "/herome.jpg", lat: 34.7684871, lon: -112.026835 },
      { name: "AntelopeCanyon", price: 500, image: "/antelope.jpg", lat:36.8619103, lon:-111.3743302}
    ],


    states: {
      GrandCanyon: {
        places: [
          { name: "Mather Point", image: "/vizag.jpg", lat: 36.0617408, lon:-112.1077097 },
          { name: "Grand Canyon National Park", image: "/tirupati.jpg", lat: 36.1069, lon: -112.1129 },
          { name: "Hopi Point", image: "/araku.jpg", lat: 36.0744051, lon: -112.1549328 },
          { name: "South Rim Trail",image:"/undavalli.jpg",lat:36.0589399,lon:-112.1281615 },
          { name: "Desert View Watchtower",image:"/ghats.jpg",lat:36.0439148,lon:-111.8263779 },
          { name: "Yaki Point",image:"/kakinada.jpg",lat:36.0583668,lon:-112.0814258 },
          { name: "Plateau Point",image:"/draksha.jpg",lat:36.093312,lon:-112.1163705 }
          ]
        },
          Phoenix:{
            places:[
              { name: "Papago Park", image: "/vizag.jpg", lat: 33.4538562, lon:-111.9534178 },
              { name: "Heard Museum", image: "/tirupati.jpg", lat: 33.4724737, lon: -112.0722009 },
              { name: "Friendship Garden", image: "/araku.jpg", lat: 33.4610101, lon: -112.0763266 },
              { name: "Geographical center",image:"/undavalli.jpg",lat:33.4476959,lon:-112.0738772 },
              { name: "Civic Space Park",image:"/ghats.jpg",lat:33.4538496,lon:-112.0744973 },
              { name: "Encanto Park",image:"/kakinada.jpg",lat:33.4742548,lon:-112.0891785 },
              { name: "Arizona Capitol Museum",image:"/draksha.jpg",lat:33.4480967,lon:-112.0970236 },
            ]
          },
          Sedona:{
            places:[
              { name: "Sedona Airport scenic lookout", image: "/vizag.jpg", lat: 34.8535953, lon:-111.7894691 },
              { name: "Canyon trail", image: "/tirupati.jpg", lat: 34.9154863, lon: -111.8501581 },
              { name: "Montezuma Castle National Monument", image: "/araku.jpg", lat: 34.6123999, lon: -111.8415217 },
              { name: "Sedona Heritage Museum",image:"/undavalli.jpg",lat:34.8780064,lon:-111.7622868 },
              { name: "Palatki Heritage site",image:"/ghats.jpg",lat:34.9164006,lon:-111.9007447 },
              { name: "Seven Sacred Pools",image:"/kakinada.jpg",lat:34.8902596,lon:-111.7859221 },
              { name: "Submarine Rock",image:"/draksha.jpg",lat:34.8383614,lon:-111.7482949 },
            ]
          },
          MonumentValley:{
            places:[
              { name: "Monument Valley", image: "/vizag.jpg", lat: 36.9806846, lon:-110.1037861 },
              { name: "John Ford Point", image: "/tirupati.jpg", lat: 36.9545095, lon: -110.087407 },
              { name: "Monument Vallet Tribal Park", image: "/araku.jpg", lat: 36.9824736, lon: -110.1118923 },
              { name: "Wildcat Trail",image:"/undavalli.jpg",lat:36.9852667,lon:-110.1137305 }
            ]
          },
          Jerome:{
            places:[
              { name: "Jerome State Historic park", image: "/vizag.jpg", lat: 34.7533004, lon:-112.1106881 },
              { name: "Jerome Ghost Town", image: "/tirupati.jpg", lat: 34.7591876, lon: -112.127608 },
              { name: "Audrey Headframe Park", image: "/araku.jpg", lat: 34.7541986, lon: -112.1132497 },
              { name: "Tuzigoot National Monument",image:"/undavalli.jpg",lat:34.7689881,lon:-112.0270346 }
            ]
          },
          AntelopeCanyon:{
            places:[
              { name: "Antelope Canyon", image: "/vizag.jpg", lat:36.8619103, lon:-111.3743302 },
              { name: "Lower Antelope Canyon", image: "/tirupati.jpg", lat: 36.846485, lon: -111.448698 },
              { name: "Secret Canyon", image: "/araku.jpg", lat: 36.8033747, lon: -111.4623391 },
              { name: "Horsehoe Bend",image:"/undavalli.jpg",lat:36.879779,lon:-111.510396 }
            ]
          },
        
        },

    otherPlaces: [
      { name: "Flagstaff", price: 200, image: "/flagstaff.jpg", lat: 35.1683956, lon: -111.5108287 },
      { name: "Tucson", price: 180, image: "/tucson.jpg", lat: 32.2237913, lon: -111.1442677 },
      { name: "Lake Havasu", price: 220, image: "/lakehavasu.jpg", lat: 36.2554863, lon: -112.69837},
    ]
  },
  newyork: {
    images: ["/nyc1.jpg", "/nyc2.jpg", "/nyc3.jpg"],
    description: "Explore the city that never sleeps – New York City!",
    detailedDescription:
      "New York City is a hub of culture, history, and entertainment. Visit iconic landmarks such as Times Square, the Statue of Liberty, Central Park, and Broadway theaters.",
    transportation: "Subway, taxis, and guided city tours.",
    duration: "5 Days / 4 Nights",
    numberOfPlaces: 5,
    accommodation: "Luxury hotels in Manhattan.",
    meals: "Diverse cuisines including American, Italian, and Asian.",
    totalCost: 1800,
    defaultPlaces: [
      { name: "Statue of Liberty", price: 250, image: "/statueofliberty.jpg", lat: 40.6892, lon: -74.0445 },
      { name: "Times Square", price: 200, image: "/timessquare.jpg", lat: 40.7580, lon: -73.9855 },
      { name: "Central Park", price: 180, image: "/centralpark.webp", lat: 40.7825547, lon: -73.9655834 },
      { name: "Niagara Falls", price: 180, image: "/niagrafalls.jpg", lat: 43.0867014, lon: -79.0664748 },
      { name: "Brooklyn Bridge", price: 180, image: "/brooklynbridge.jpg", lat: 40.7061, lon: -73.9969 }
    ],
    otherPlaces: [
      { name: "High Line", price: 150, image: "/highline.jpg", lat: 40.7480, lon: -74.0047 },
      { name: "Empire State Building", price: 230, image: "/empirestate.jpg", lat: 40.7485625, lon: -73.9856565 },
      { name: "Broadway Show", price: 300, image: "/broadway.jpg", lat: 40.7553, lon: -73.9870 },
      { name: "Madame Tussauds", price: 180, image: "/madame.jpg", lat: 40.7562187, lon: -73.9885631 }
    ]
  },
  georgia: {
    images: ["/georgia1.jpg", "/georgia2.jpg", "/georgia3.webp"],
    description: "Discover the charm of Georgia’s landscapes and history.",
    detailedDescription:
      "Georgia offers a blend of history, nature, and culture. Visit the vibrant city of Atlanta, hike through the Blue Ridge Mountains, or explore historic Savannah.",
    transportation: "Rental cars and public transport available.",
    duration: "6 Days / 5 Nights",
    numberOfPlaces: 4,
    accommodation: "Cozy cabins, hotels, and resorts.",
    meals: "Southern cuisine and international options.",
    totalCost: 1300,
    defaultPlaces: [
      { name: "Atlanta", price: 300, image: "/atlanta.jpg", lat: 33.760463, lon: -84.3930831 },
      { name: "Savannah", price: 250, image: "/savannah.jpg", lat: 32.0675356, lon: -81.0962384 },
      { name: "Amicalola Falls", price: 270, image: "/amicalola.jpg", lat: 34.5668, lon: -84.2448451 },
      { name: "Rock City Gardens", price: 270, image: "/rockcity.jpg", lat: 34.9740677, lon: -85.3477631 },
      { name: "Tybee Island", price: 270, image: "/tybee.jpg", lat: 32.0226161, lon: -80.8455685 }
    ],
    otherPlaces: [
      { name: "Cumberland Island", price: 180, image: "/cumber.jpg", lat: 30.8532764, lon: -81.4388858 },
      { name: "Georgia Aquarium", price: 200, image: "/aqua.webp", lat: 33.7632353, lon: -84.3944658 },      
      { name: "Jarrell Plantation Historic Site", price: 190, image: "/jarrell.webp", lat: 33.0528971, lon: -83.7231357 },
      { name: "Columbus", price: 190, image: "/columbus.webp", lat: 32.4672894, lon: -84.99191 }
    ]
  },
  australia: {
    images: ["/australia1.jpg", "/australia2.png", "/australia3.webp"],
    description: "Experience Australia’s stunning landscapes and vibrant cities.",
    detailedDescription:
      "From the Great Barrier Reef to Sydney’s Opera House, Australia is a paradise for travelers. Enjoy pristine beaches, unique wildlife, and thrilling adventures.",
    transportation: "Domestic flights and rental cars.",
    duration: "7 Days / 6 Nights",
    numberOfPlaces: 6,
    accommodation: "Beach resorts and luxury hotels.",
    meals: "Seafood, Australian BBQ, and gourmet dining.",
    totalCost: 2500,
    defaultPlaces: [
      { name: "Sydney", price: 350, image: "/sydney.webp", lat: -33.8567844, lon: 151.2152967 },
      { name: "Brisbane", price: 400, image: "/brisbane.jpg", lat: -27.5575926, lon: 151.9635397 },
      { name: "Melbourne", price: 300, image: "/melbourne.webp", lat: -37.8188965, lon: 144.9675658 },
      { name: "Kangaroo Island", price: 300, image: "/kangaroo.jpeg", lat: -36.0633532, lon: 136.7049274 },
      { name: "Uluru", price: 300, image: "/uluru.jpg", lat: -25.3444, lon: 131.0369 }
    ],
    otherPlaces: [
      { name: "Gold Coast", price: 250, image: "/goldcoast.jpg", lat: -28.0167, lon: 153.4000 },
      { name: "Tasmania", price: 280, image: "/tasmania.jpg", lat: -43.139995, lon: 147.851107},
      { name: "Queensland", price: 300, image: "/queensland.jpg", lat: -20.245342, lon: 149.020422 },
      { name: "Philip Island", price: 300, image: "/philip.jpeg", lat: -38.4645796, lon: 145.1764187 }
    ]
  },
  canada: {
    images: ["/canada1.webp", "/canada2.jpg", "/canada3.jpg"],
    description: "Explore Canada's breathtaking nature and vibrant cities.",
    detailedDescription:
      "Canada is home to stunning landscapes, from the Rocky Mountains to Niagara Falls. Discover the beauty of Vancouver, Toronto, and Quebec.",
    transportation: "Flights and scenic train rides.",
    duration: "6 Days / 5 Nights",
    numberOfPlaces: 5,
    accommodation: "Mountain lodges and city hotels.",
    meals: "Canadian and international cuisine.",
    totalCost: 2200,
    defaultPlaces: [
      { name: "Toronto", price: 300, image: "/toronto.jpg", lat: 43.6425662, lon: -79.3870568 },
      { name: "Banff National Park", price: 350, image: "/banff.jpg", lat: 51.4968464, lon: -115.9280562 },
      { name: "Niagara Falls", price: 250, image: "/nfcanada.jpg", lat: 43.0837674, lon: -79.0639941 },
      { name: "Vancouver", price: 250, image: "/vancouver.jpg", lat: 49.2893165, lon: -123.117696 },
      { name: "Quebec", price: 250, image: "/quebec.jpg", lat: 46.8854356, lon: -71.1449472 }
    ],
    otherPlaces: [
      { name: "Tofino", price: 320, image: "/tofino.jpg", lat: 49.1068959, lon: -125.8805758 },
      { name: "Churchill", price: 280, image: "/churchill.jpg", lat: 56.9544155, lon: 8.6886912 },
      { name: "Alberta", price: 280, image: "/alberta.jpg", lat:51.3405856, lon: -116.2216884 },
      { name: "Yukon", price: 280, image: "/yukon.jpg", lat: 60.66224, lon: -135.02889 }
    ]
  }
};

export default placesData;
