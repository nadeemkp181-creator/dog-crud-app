const express = require('express');
const router = express.Router();
const dogController = require('../controllers/dogController');

router.get('/', dogController.getAllDogs);
router.get('/search', dogController.searchDogs);
router.get('/new', dogController.showCreateForm);
router.post('/', dogController.createDog);
router.get('/:id', dogController.getDog);
router.get('/:id/edit', dogController.showEditForm);
router.post('/:id/edit', dogController.updateDog);
router.post('/:id/delete', dogController.deleteDog);

module.exports = router;
