const { User, Thought } = require('../models');

module.exports = {
    //GET all users
    async getUsers(req, res) {
        try {
          const users = await User.find({}).select('-__v');
          res.json(users); 
        } catch (err) {
          res.status(500).json(err);
        }
      },
      
    
    //GET a single user by its _id and populated thought and friend data
    async getSingleUser({ params }, res) {
        console.log(params)
        try {
          const user = await User.findOne({ _id: params.id }) 
            .select('-__v')
            .populate({
                path: "thoughts",
                select: "-__v"
            })
            .populate({
                path: "friends",
                select: "-__v",
            })
          if (!user) {
            return res.status(404).json({ message: 'No user with that ID' });
          }
          res.json(user); 
        } catch (err) {
          res.status(500).json(err);
        }
      },
      
    //POST a new user
    async createUser(req, res) {
        try {
          const dbUserData = await User.create(req.body);
          res.json(dbUserData);
        } catch (err) {
          res.status(500).json(err);
        }
      },

    //PUT to update a user by its _id
    async updateUser(req, res) {
        try {
            const updatedUser = await User.findOneAndUpdate(
                { _id: req.params.id }, 
                { $set: req.body }, 
                { new: true } 
            );
            
            if (!updatedUser) {
                return res.status(404).json({ message: 'No user found with that ID' });
            }
            
            res.json(updatedUser);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    //DELETE to remove user by its _id
    async deleteUser(req, res) {
        try {
            const deletedUser = await User.findOneAndDelete({ _id: req.params.id });

            if (!deletedUser) {
                return res.status(404).json({ message: 'No user found with that ID' });
            }

            res.json({ message: 'User deleted successfully', deletedUser });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    //POST to add a new friend to a user's friend list

    async addFriend(req, res) {
    try {
        const { id, friendId } = req.params;

        // const user = await User.findById(id);
        const updatedUser = await User.findOneAndUpdate({
            _id: id
        }, {
            $addToSet: {friends: friendId}
        }, {new: true})

        if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
        }

        // if (user.friends.includes(friendId)) {
        // return res.status(400).json({ message: "Friend already exists in the user's friend list" });
        // }

        // user.friends.push(id);

        // await user.save();

        res.status(200).json({ message: 'Friend added successfully', updatedUser });
        
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error', error: err });
    }
    },

    //DELETE to remove a friend from a user's friend list
   
    async removeFriend(req, res) {
    try {
        const { id, friendId } = req.params;

        console.log(req.params);

        const updatedUser = await User.findOneAndUpdate({
            _id: id
        }, {
            $pull: {friends: friendId}
        }, {new: true})

        if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
        }

        // const user = await User.findById(id);

        // if (!user) {
        // return res.status(404).json({ message: 'User not found' });
        // }

        // if (!user.friends.includes(friendId)) {
        // return res.status(400).json({ message: "Friend does not exist in the user's friend list" });
        // }

        // user.friends = user.friends.filter(friend => friend !== friendId);

        // await user.save();

        res.status(200).json({ message: 'Friend removed successfully', updatedUser });
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error', error: err });
    }
    },

}