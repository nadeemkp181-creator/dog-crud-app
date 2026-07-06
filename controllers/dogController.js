const Dog = require('../models/Dog');

exports.getAllDogs = async (req, res) => {
  try {
    const dogs = await Dog.find().sort({ createdAt: -1 });
    res.render('dogs/index', {title: 'Dogs List',
      dogs: dogs,
      searchQuery: ''
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
    const dogs = await Dog.find({
      $or: [
        { name: { $regex: searchTerm }},
        { breeds: { $regex: searchTerm }}
      ]
    }).sort({ createdAt: -1 });

    res.render('dogs/index', {
      title: 'Search Results',
      dogs: dogs,
      searchQuery: searchTerm
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

    if (!name) {
      return res.status(400).render('dogs/create', {
        title: 'Add New Dog',
        error: 'Please provide a name'
      });
    }

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

    await newDog.save();
    res.redirect(`/dogs/${newDog._id}`);
  } catch (error) {
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
      return res.status(404).json({ title: 'Dog Not Found' });
    }

    res.redirect(`/dogs/${id}`);
  } catch (error) {
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
    res.redirect('/dogs');
  } catch (error) {
    res.status(500).render('error', {
title: 'Error',
      message: 'Failed to delete dog'
    });
  }
};
