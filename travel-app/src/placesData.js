const placesData = {
   india: {
    images: ["/jammu.jpg", "/redfort.jpg", "/goa.jpg"],
    description: "Experience India's rich culture, history, and breathtaking landscapes.",
    detailedDescription: 
      "India is a land of diverse landscapes, cultures, and traditions. From the bustling streets of Delhi to the serene beaches of Goa, there's something for everyone. Explore the majestic palaces of Rajasthan, the backwaters of Kerala, and the snow-capped mountains of Himachal Pradesh."
    ,
    transportation: "Flights from major cities. Private vehicle for local travel.",
    duration: "7 Days / 6 Nights",
    numberOfPlaces: 5,
    accommodation: "3-star & 5-star hotels with breakfast included.",
    meals: "Indian & Continental cuisine. Breakfast, Lunch & Dinner included.",
    totalCost: 1200,
    defaultPlaces: [
      { name: "Goa", price: 200, image:"/goa.jpg" },
      { name: "Delhi", price: 150, image:"/redfort.jpg" },
      { name: "Mumbai", price: 180 , image:"/Mumbai.jpg"},
      { name: "Andhra Pradesh", price: 170,image:"/godavari.jpg" },
      { name: "Karnataka", price: 270,image:"/karnataka.jpg"},
      { name: "Himachal Pradesh", price: 270,image:"/himachal.webp"},
      { name: "Varanasi", price: 270,image:"/ganga.jpg"},
      { name: "Taj Mahal", price: 270,image:"/TajMahal.jpg"}
      
    ],
    otherPlaces: [
      { name: "Manali", price: 140, image: "/manali.jpg" },
      { name: "Valley Of Flowers", price: 220, image: "/Valleyofflowers.jpg" },
      { name: "Kerala", price: 190, image: "/kerala.jpg" },
      { name: "Jammu & Kashmir", price: 210, image: "/jammu.jpg" }
    ]
  },
  arizona: {
    images: ["/arizona1.jpg", "/arizona2.jpg", "/arizona3.jpg"],
    description: "Discover Arizona’s stunning landscapes and adventure-filled trips.",
    detailedDescription: `
      Arizona is home to breathtaking natural wonders like the Grand Canyon, Sedona, and Monument Valley. Explore the red rock formations, take scenic hikes, and enjoy adventurous road trips.
    `,
    transportation: "Domestic flights and private transport for sightseeing.",
    duration: "5 Days / 4 Nights",
    numberOfPlaces: 4,
    accommodation: "Luxury resorts & boutique hotels.",
    meals: "Traditional American, Mexican & Vegetarian options included.",
    totalCost: 1400,
    defaultPlaces: [
      { name: "Grand Canyon", price: 300, image: "/grandcanyon.jpg" },
      { name: "Phoenix", price: 250, image: "/phoenix.jpg" },
      { name: "Sedona", price: 270, image: "/sedona.jpg" },
      { name: "Monument Valley", price: 270, image: "/monumentvalley.jpg" },
      { name: "Jerome", price: 270, image: "/herome.jpg" },

    ],
    otherPlaces: [
      { name: "Flagstaff", price: 200, image: "/flagstaff.jpg" },
      { name: "Tucson", price: 180, image: "/tucson.jpg" },
      { name: "Lake Havasu", price: 220, image: "/lakehavasu.jpg" }
    ]
  },
  newyork: {
    images: ["/nyc1.jpg", "/nyc2.jpg", "/nyc3.jpg"],
    description: "Explore the city that never sleeps – New York City!",
    detailedDescription: `
      New York City is a hub of culture, history, and entertainment. Visit iconic landmarks such as Times Square, the Statue of Liberty, Central Park, and Broadway theaters.
    `,
    transportation: "Subway, taxis, and guided city tours.",
    duration: "5 Days / 4 Nights",
    numberOfPlaces: 5,
    accommodation: "Luxury hotels in Manhattan.",
    meals: "Diverse cuisines including American, Italian, and Asian.",
    totalCost: 1800,
    defaultPlaces: [
      { name: "Statue of Liberty", price: 250, image: "/statueofliberty.jpg" },
      { name: "Times Square", price: 200, image: "/timessquare.jpg" },
      { name: "Central Park", price: 180, image: "/centralpark.webp" },
      { name: "Niagra Falls", price: 180, image: "/niagrafalls.jpg" },
      { name: "Brooklyn Bridge", price: 180, image: "/brooklynbridge.jpg" }
    ],
    otherPlaces: [
      { name: "High Line", price: 150, image: "/highline.jpg" },
      { name: "Empire State Building", price: 230, image: "/empirestate.jpg" },
      { name: "Broadway Show", price: 300, image: "/broadway.jpg" },
      { name: "Madame Tussauds", price: 180, image: "/madame.jpg" }
    ]
  },
  georgia: {
    images: ["/georgia1.jpg", "/georgia2.jpg", "/georgia3.webp"],
    description: "Discover the charm of Georgia’s landscapes and history.",
    detailedDescription: `
      Georgia offers a blend of history, nature, and culture. Visit the vibrant city of Atlanta, hike through the Blue Ridge Mountains, or explore historic Savannah.
    `,
    transportation: "Rental cars and public transport available.",
    duration: "6 Days / 5 Nights",
    numberOfPlaces: 4,
    accommodation: "Cozy cabins, hotels, and resorts.",
    meals: "Southern cuisine and international options.",
    totalCost: 1300,
    defaultPlaces: [
      { name: "Atlanta", price: 300, image: "/atlanta.jpg" },
      { name: "Savannah", price: 250, image: "/savannah.jpg" },
      { name: "Blue Ridge Mountains", price: 270, image: "/blueridge.jpg" },
      { name: "amicalola falls", price: 270, image: "/amicalola.jpg" },
      { name: "Tybee Island", price: 270, image: "/tybee.jpg" }
    ],
    otherPlaces: [
      { name: "Cumberland Island", price: 180, image: "/cumber.jpg" },
      { name: "Tybee Island", price: 190, image: "/tybee.jpg" },
      { name: "Jarrell Plantation Historic Site", price: 190, image: "/jarrell.webp" },
      { name: "Columbus", price: 190, image: "/columbus.webp" }
    ]
  },
  australia: {
    images: ["/australia1.jpg", "/australia2.png", "/australia3.webp"],
    description: "Experience Australia’s stunning landscapes and vibrant cities.",
    detailedDescription: `
      From the Great Barrier Reef to Sydney’s Opera House, Australia is a paradise for travelers. Enjoy pristine beaches, unique wildlife, and thrilling adventures.
    `,
    transportation: "Domestic flights and rental cars.",
    duration: "7 Days / 6 Nights",
    numberOfPlaces: 6,
    accommodation: "Beach resorts and luxury hotels.",
    meals: "Seafood, Australian BBQ, and gourmet dining.",
    totalCost: 2500,
    defaultPlaces: [
      { name: "Sydney", price: 350, image: "/sydney.webp" },
      { name: "Brisbane", price: 400, image: "/brisbane.jpg" },
      { name: "Melbourne", price: 300, image: "/melbourne.webp" },
      { name: "Kangaroo Island", price: 300, image: "/kangaroo.jpeg" },
      { name: "Uluru", price: 300, image: "/uluru.jpg" }
    ],
    otherPlaces: [
      { name: "Gold Coast", price: 250, image: "/goldcoast.jpg" },
      { name: "Tasmania", price: 280, image: "/tasmania.jpg" },
      { name: "Queensland", price: 300, image: "/queensland.jpg" },
      { name: "Philip Island", price: 300, image: "/philip.jpeg" },
    ]
  },
  canada: {
    images: ["/canada1.webp", "/canada2.jpg", "/canada3.jpg"],
    description: "Explore Canada's breathtaking nature and vibrant cities.",
    detailedDescription: `
      Canada is home to stunning landscapes, from the Rocky Mountains to Niagara Falls. Discover the beauty of Vancouver, Toronto, and Quebec.
    `,
    transportation: "Flights and scenic train rides.",
    duration: "6 Days / 5 Nights",
    numberOfPlaces: 5,
    accommodation: "Mountain lodges and city hotels.",
    meals: "Canadian and international cuisine.",
    totalCost: 2200,
    defaultPlaces: [
      { name: "Toronto", price: 300, image: "/toronto.jpg" },
      { name: "Banff National Park", price: 350, image: "/banff.jpg" },
      { name: "Niagara Falls", price: 250, image: "/nfcanada.jpg" },
      { name: "Vancouver", price: 250, image: "/vancouver.jpg" },
      { name: "Quebec", price: 250, image: "/quebec.jpg" }
    ],
    otherPlaces: [
      { name: "Tofino", price: 320, image: "/tofino.jpg" },
      { name: "Churchill", price: 280, image: "/churchill.jpg" },
      { name: "Alberta", price: 280, image: "/alberta.jpg" },
      { name: "Yukon", price: 280, image: "/yukon.jpg" }
    ]
  }
};

export default placesData;
