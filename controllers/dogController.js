const Dog = require('../models/Dog');

const parseBreeds = (breeds) => {
  if (!breeds) return [];
  if (typeof breeds === 'string') {
    return breeds.split(',').map(b => b.trim()).filter(b => b !== '');
  }
  if (Array.isArray(breeds)) {
    return breeds.map(b => (typeof b === 'string' ? b.trim() : '')).filter(b => b !== '');
  }
  return [];
};

const validateDogInput = (name, breeds) => {
  const errors = [];
  const trimmedName = typeof name === 'string' ? name.trim() : '';
  const breedArray = parseBreeds(breeds);

  if (!trimmedName) {
    errors.push('Name is required.');
  } else if (trimmedName.length > 50) {
    errors.push('Name cannot exceed 50 characters.');
  }

  const invalidBreed = breedArray.find(b => b.length > 100);
  if (invalidBreed) {
    errors.push('Each breed must be 100 characters or fewer.');
  }

  return { errors, trimmedName, breedArray };
};

exports.getAllDogs = async (req, res) => {
  try {

        console.log("Received Data:", req.body);

    const validSortFields = ['name', 'createdAt'];
    const sortField = validSortFields.includes(req.query.sort) ? req.query.sort : 'createdAt';
    const sortDir = req.query.dir === 'asc' ? 1 : -1;

    console.log("Sort Field:", sortField, "Sort Direction:", sortDir);
    const dogs = await Dog.find().sort({ [sortField]: sortDir });
    res.render('dogs/index', {
      title: 'Dogs List',
      dogs: dogs,
      searchQuery: '',
      sortBy: sortField,
      sortDir: req.query.dir === 'asc' ? 'asc' : 'desc'
    });
  } catch (error) {
    res.status(500).render('error', {
      title: 'Error',
      message: 'Failed to fetch dogs'
    });
  }
};

exports.searchDogs = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.redirect('/dogs');
    }

    const searchTerm = query.trim();
    const validSortFields = ['name', 'createdAt'];
    const sortField = validSortFields.includes(req.query.sort) ? req.query.sort : 'createdAt';
    const sortDir = req.query.dir === 'asc' ? 1 : -1;

    const dogs = await Dog.find({
      $or: [
        { name: { $regex: searchTerm, }},
        { breeds: { $regex: searchTerm }}
      ]
    }).sort({ [sortField]: sortDir });
    console.log(dogs);

    res.render('dogs/index', {
      title: 'Search Results',
      dogs: dogs,
      searchQuery: searchTerm,
      sortBy: sortField,
      sortDir: req.query.dir === 'asc' ? 'asc' : 'desc'
    });
  } catch (error) {
    res.status(500).render('error', {
      title: 'Error',
      message: 'Failed to search dogs'
    });
  }
};

exports.getDog = async (req, res) => {
  try {
    const { id } = req.params;
    const dog = await Dog.findById(id);
    
    if (!dog) {
    return res.status(404).json({ title: 'Dog Not Found' });
    }
    res.render('dogs/show', {
       title: dog.name,
       dog: dog
    });
  } catch (error) {
    
    res.status(500).render('error', {title: 'Error',
       message: 'Failed to fetch dog details'
    });
  }
};

exports.showCreateForm = (req, res) => {
  res.render('dogs/create', { title: 'Add New Dog' });
};

exports.createDog = async (req, res) => {
  try {
    const { name, breeds } = req.body; 

    console.log("Received Data:", req.body);

    const { errors, trimmedName, breedArray } = validateDogInput(name, breeds);
    if (errors.length) {
      const errorMessage = errors.join(' ');
      if (req.xhr || req.headers['x-requested-with'] === 'XMLHttpRequest' || req.accepts('json')) {
        return res.status(400).json({ success: false, message: errorMessage });
      }

      return res.status(400).render('dogs/create', {
        title: 'Add New Dog',
        error: errorMessage,
        name: name,
        breeds: typeof breeds === 'string' ? breeds : Array.isArray(breeds) ? breeds.join(', ') : ''
      });
    }

    let findexistingdog = await Dog.find({ name: trimmedName });

    if (findexistingdog.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Dog already exists."
      });
    }

    const newDog = new Dog({
      name: trimmedName,
      breeds: breedArray
    });

    console.log("New Dog Data:", newDog);

    await newDog.save();
    if (req.xhr || req.headers['x-requested-with'] === 'XMLHttpRequest' || req.accepts('json')) {
      return res.json({ success: true, redirect: `/dogs/${newDog._id}` });
    }

    res.redirect(`/dogs/${newDog._id}`);
  } catch (error) {
    if (req.xhr || req.headers['x-requested-with'] === 'XMLHttpRequest' || req.accepts('json')) {
      return res.status(500).json({ success: false, message: 'Failed to create dog' });
    }

    res.status(500).render('dogs/create', {
      title: 'Add New Dog',
      error: 'Failed to create dog',
      name: req.body.name,
      breeds: typeof req.body.breeds === 'string' ? req.body.breeds : Array.isArray(req.body.breeds) ? req.body.breeds.join(', ') : ''
    });
  }
};

exports.showEditForm = async (req, res) => {
  try {
    const { id } = req.params;
    const dog = await Dog.findById(id);
    
    if (!dog) {
      return res.status(404).json({ title: 'Dog Not Found' });
    }
    
    res.render('dogs/edit', {
      title: `Edit ${dog.name}`,
      dog: dog
    });
  } catch (error) {
    res.status(500).render('error', {title: 'Error',
      message: 'Failed to fetch dog details'
    });
  }
};

exports.updateDog = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, breeds } = req.body;

       let findexistingdog = await Dog.find({ name: name });

          console.log("Existing Dogs Found:", findexistingdog);

    if (findexistingdog.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Dog already exists."
      });
    }
    
    const { errors, trimmedName, breedArray } = validateDogInput(name, breeds);
    if (errors.length) {
      const errorMessage = errors.join(' ');
      if (req.xhr || req.headers['x-requested-with'] === 'XMLHttpRequest' || req.accepts('json')) {
        return res.status(400).json({ success: false, message: errorMessage });
      }

      const dog = await Dog.findById(id);
      if (!dog) {
        return res.status(404).render('404', { title: 'Dog Not Found' });
      }



      return res.status(400).render('dogs/edit', {
        title: `Edit ${dog.name}`,
        dog: {
          _id: id,
          name: trimmedName || dog.name,
          breeds: breedArray.length > 0 ? breedArray : dog.breeds
        },
        error: errorMessage,
        name: name,
        breeds: typeof breeds === 'string' ? breeds : Array.isArray(breeds) ? breeds.join(', ') : ''
      });
    }

    const dog = await Dog.findByIdAndUpdate(
      id,
      { name: trimmedName, breeds: breedArray },
      { new: true, runValidators: true }
    );

    console.log(dog)
    if (!dog) {
      if (req.xhr || req.headers['x-requested-with'] === 'XMLHttpRequest' || req.accepts('json')) {
        return res.status(404).json({ success: false, message: 'Dog not found' });
      }
      return res.status(404).render('404', { title: 'Dog Not Found' });
    }

    if (req.xhr || req.headers['x-requested-with'] === 'XMLHttpRequest' || req.accepts('json')) {
      return res.json({ success: true, redirect: `/dogs/${id}` });
    }

    res.redirect(`/dogs/${id}`);
  } catch (error) {
    if (req.xhr || req.headers['x-requested-with'] === 'XMLHttpRequest' || req.accepts('json')) {
      return res.status(500).json({ success: false, message: 'Failed to update dog' });
    }

    res.status(500).render('error', { title: 'Error',
      message: 'Failed to update dog'
    });
  }
};

exports.deleteDog = async (req, res) => {
  try {
    const { id } = req.params;
    const dog = await Dog.findByIdAndDelete(id);
    
    if (!dog) {
      return res.status(404).json({ title: 'Dog Not Found' });
    }
    if (req.xhr || req.headers['x-requested-with'] === 'XMLHttpRequest' || req.accepts('json')) {
      return res.json({ success: true });
    }

    res.redirect('/dogs');
  } catch (error) {
    if (req.xhr || req.headers['x-requested-with'] === 'XMLHttpRequest' || req.accepts('json')) {
      return res.status(500).json({ success: false, message: 'Failed to delete dog' });
    }

    res.status(500).render('error', {
      title: 'Error',
      message: 'Failed to delete dog'
    });
  }
};
