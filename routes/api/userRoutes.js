const { getUsers, getSingleUser, createUser, updateUser, deleteUser, addFriend, removeFriend } = require('../../controllers/userController');

const router = require('express').Router();

// /api/users
// get all, create user

router.route('/').get(getUsers).post(createUser);

//get one, update/delete
// /api/users/:id 

router.route('/:id').get(getSingleUser).put(updateUser).delete(deleteUser);

// add friend, remove friend
// /api/users/:userId/friends/:friendId

router.route('/:id/friends/:friendId').post(addFriend).delete(removeFriend);


module.exports = router;