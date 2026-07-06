const Dog = require('../models/Dog');

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

    let findexistingdog = await Dog.find({ name : name });

    if(findexistingdog.length > 0){
          return res.status(400).render('dogs/create', {
        title: 'Add New Dog',
        error: 'This dog already exist in the list'
      });
    }   

    let breedArray = [];
    if (breeds && breeds.trim() !== '') {
      if (typeof breeds === 'string') {
        breedArray = breeds.split(',').map(b => b.trim()).filter(b => b !== '');
      } else if (Array.isArray(breeds)) {
        breedArray = breeds.filter(b => b !== '');
      }
    }


    const newDog = new Dog({
      name,
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
      error: 'Failed to create dog'
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
    
    let breedArray = [];
    if (typeof breeds === 'string') {
      breedArray = breeds.split(',').map(b => b.trim()).filter(b => b !== '');
    } else if (Array.isArray(breeds)) {
      breedArray = breeds.filter(b => b !== '');
    }

    const dog = await Dog.findByIdAndUpdate(
      id,
      { name, breeds: breedArray },
      { new: true, runValidators: true }
    );

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
