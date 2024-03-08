const { User, Thought } = require('../models');

module.exports = {

    //GET to get all thoughts
    async getThoughts(req, res) {
        try {
          const thoughts = await Thought.find()
          .populate({
            path: 'reactions',
            select: '-__v'
          })
          .select('-__v');
          res.json(thoughts); 
        } catch (err) {
          res.status(500).json(err);
        }
      },
    
    //GET to get a single thought by its _id
    async getSingleThought({ params }, res) {
        try {
          const thought = await Thought.findOne({ _id: params.id }) 
            .populate({
                path: 'reactions',
                select: '-__v'
            })
            .select('-__v')
            if (!thought) {
                return res.status(404).json({ message: 'No thought with that ID' });
              }
              res.json(thought); 
            } catch (err) {
              res.status(500).json(err);
            }
          },

    //POST to create a new thought (don't forget to push the created thought's _id to the associated user's thoughts array field)
    async createThought({ body }, res){
        try {
            const createdThought = await Thought.create(body);

            const thoughtId = createdThought._id;

            console.log('body:');
            console.log(body);

            const updatedUser = await User.findOneAndUpdate(
                { username: body.username },
                { $push: { thoughts: thoughtId } },
                { new: true } 
            );
            console.log(updatedUser);

            if (!updatedUser) {
                return res.status(404).json({ message: 'Error updating user' });
            }

            return res.status(201).json({ message: 'Thought created successfully', thought: createdThought });
        } catch (error) {
        
            return res.status(500).json({ message: 'Internal Server Error', error });
        }
    },

    //PUT to update a thought by its _id
    async updateThought({ params, body }, res){
        try {
            const { id } = params;
    
            const updatedThought = await Thought.findOneAndUpdate(
                { _id: id },
                body, 
                { new: true, runValidators: true } 
            );
    
            if (!updatedThought) {
                return res.status(404).json({ message: 'Thought not found' });
            }
            return res.status(200).json({ message: 'Thought updated successfully', thought: updatedThought });
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error', error });
        }
    },
    
    //DELETE to remove a thought by its _id
    async deleteThought({ params }, res) {
        try {
            const { id, userId } = params;

            const deletedThought = await Thought.findOneAndDelete({ _id: id });
    
            if (!deletedThought) {
                return res.status(404).json({ message: 'Thought not found' });
            };

            const updatedUser = await User.findOneAndUpdate(
                { thoughts: params.id },
                { $pull: { thoughts: params.id } },
                { new: true }
            );
    
            if (!updatedUser) {
                return res.status(404).json({ message: 'User not found' });
            };
            
            return res.status(200).json({ message: 'Thought deleted successfully', thought: deletedThought });
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error', error });
        }
    },
    
    //POST to create a reaction stored in a single thought's reactions array field

    async createReaction(req, res) {
        try {
            const { thoughtId } = req.params; 
            const { reactionBody, username } = req.body; 
    
            const updatedThought = await Thought.findByIdAndUpdate(
                thoughtId,
                { $push: { reactions: {reactionBody, username} } },
                { new: true, runValidators: true }
            );

            console.log('reaction');
            console.log(updatedThought);
    
            if (!updatedThought) {
                return res.status(404).json({ message: 'Thought not found' });
            }
    
            return res.status(200).json(updatedThought);
        } catch (error) {
            console.error('Error creating reaction:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    },

    //DELETE to pull and remove a reaction by the reaction's reactionId value

    async deleteReaction({ params }, res) {
        try {
            const thoughtId = params.thoughtId; 
            const reactionId = params.reactionId; 

            const updatedThought = await Thought.findOneAndUpdate(
                { _id: thoughtId },
                { $pull: { reactions: { _id: reactionId } } },
                { new: true }
            );

            if (!updatedThought) {
                return res.status(404).json({ message: 'Thought not found' });
            }

            return res.status(200).json(updatedThought);
        } catch (error) {
            console.error('Error deleting reaction:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    },
        
}

