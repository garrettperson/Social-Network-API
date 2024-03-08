const { Schema, model, Types } = require("mongoose");

const ReactionSchema = new Schema(
    {
        reactionId: {
            type: Schema.Types.ObjectId,
            default: () => new Types.ObjectId()
        },
        reactionBody: {
            type: String,
            required: "Body is required",
            maxlength: 280,
        },
        username: {
            type: String,
            required: "Username is required",
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get:  function (ddata) {
                return new Date(ddata).toLocaleString()
            } 
            // Use a getter method to format the timestamp on query
        },
    },
   
);

const ThoughtSchema = new Schema(
    {
        thoughtText: {
            type: String,
            required: "Thought is required",
            minlength: 1,
            maxlength: 280,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: function (ddata) {
                return new Date(ddata).toLocaleString()
            } 
            //Use a getter method to format the timestamp on query 
        },
        username: {
            type: String,
            required: "Username is required",
        },
        reactions: [ReactionSchema]
        //Array of nested documents created with the reactionSchema
    },
  
);


ThoughtSchema.virtual("reactionCount").get(function () {
    return this.reactions.length;
})

const Thought = model("Thought", ThoughtSchema);

module.exports = Thought;