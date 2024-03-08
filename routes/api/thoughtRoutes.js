const { getThoughts, getSingleThought, createThought, updateThought, deleteThought, createReaction, deleteReaction} = require('../../controllers/thoughtController');

const router = require('express').Router();

// /api/thoughts
// get all, create thought

router.route('/').get(getThoughts).post(createThought);

//get one, update/delete
// /api/thoughts/:id 

router.route('/:id').get(getSingleThought).put(updateThought).delete(deleteThought);

// create reaction

router.route('/:thoughtId/reactions').post(createReaction);

// delete reaction

router.route('/:thoughtId/reactions/:reactionId').delete(deleteReaction);



module.exports = router;