require('dotenv').config();
const mongoose = require('mongoose');
const Dog = require('../models/Dog');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.MONGO_DB,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected for seeding');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

const dogBreeds = {
  "affenpinscher": [],
  "african": [],
  "airedale": [],
  "akita": [],
  "appenzeller": [],
  "basenji": [],
  "beagle": [],
  "bluetick": [],
  "borzoi": [],
  "bouvier": [],
  "boxer": [],
  "brabancon": [],
  "briard": [],
  "bulldog": ["boston", "french"],
  "bullterrier": ["staffordshire"],
  "cairn": [],
  "chihuahua": [],
  "chow": [],
  "clumber": [],
  "collie": ["border"],
  "corgi": ["cardigan"],
  "dachshund": [],
  "dane": ["great"],
  "deerhound": ["scottish"],
  "dhole": [],
  "dingo": [],
  "doberman": [],
  "elkhound": ["norwegian"],
  "entlebucher": [],
  "eskimo": [],
  "germanshepherd": [],
  "greyhound": ["italian"],
  "groenendael": [],
  "hound": ["ibizan", "afghan", "basset", "blood", "english", "walker"],
  "husky": [],
  "keeshond": [],
  "kelpie": [],
  "komondor": [],
  "kuvasz": [],
  "labrador": [],
  "leonberg": [],
  "lhasa": [],
  "malamute": [],
  "malinois": [],
  "maltese": [],
  "mastiff": ["bull", "tibetan"],
  "mexicanhairless": [],
  "mountain": ["bernese", "swiss"],
  "newfoundland": [],
  "otterhound": [],
  "papillon": [],
  "pekinese": [],
  "pembroke": [],
  "pinscher": ["miniature"],
  "pointer": ["german"],
  "pomeranian": [],
  "poodle": ["miniature", "standard", "toy"],
  "pug": [],
  "pyrenees": [],
  "redbone": [],
  "retriever": ["chesapeake", "curly", "flatcoated", "golden"],
  "ridgeback": ["rhodesian"],
  "rottweiler": [],
  "saluki": [],
  "samoyed": [],
  "schipperke": [],
  "schnauzer": ["giant", "miniature"],
  "setter": ["english", "gordon", "irish"],
  "sheepdog": ["english", "shetland"],
  "shiba": [],
  "shihtzu": [],
  "spaniel": ["blenheim", "brittany", "cocker", "irish", "japanese", "sussex", "welsh"],
  "springer": ["english"],
  "stbernard": [],
  "terrier": [
    "american",
    "australian",
    "bedlington",
    "border",
    "dandie",
    "fox",
    "irish",
    "kerryblue",
    "lakeland",
    "norfolk",
    "norwich",
    "patterdale",
    "scottish",
    "sealyham",
    "silky",
    "tibetan",
    "toy",
    "westhighland",
    "wheaten",
    "yorkshire"
  ],
  "vizsla": [],
  "weimaraner": [],
  "whippet": [],
  "wolfhound": ["irish"]
};

const seedDatabase = async () => {
  try {
    await connectDB();
    await Dog.deleteMany({});
    console.log('Cleared existing dogs');
    const dogsToInsert = [];
    Object.entries(dogBreeds).forEach(([mainBreed, subBreeds]) => {
      const breedName = mainBreed.charAt(0).toUpperCase() + mainBreed.slice(1);
      
      if (subBreeds.length === 0) {
        dogsToInsert.push({
          name: breedName,
          breeds: []
        });
      } else {
        const capitalizedBreeds = subBreeds.map(breed => breed.charAt(0).toUpperCase() + breed.slice(1));
        dogsToInsert.push({
          name: breedName,
          breeds: capitalizedBreeds
        });
      }
    });

    // insert all dogs
    const result = await Dog.insertMany(dogsToInsert);
    console.log(`Successfully inserte dog breeds into the database`);

    mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.log('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
