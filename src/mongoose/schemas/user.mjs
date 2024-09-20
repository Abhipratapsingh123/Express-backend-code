import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: {
        type: String, // Simpler way to define the type as String
        required: true,
        unique: true, // Ensure username is unique in the collection
    },

    displayName: {
        type: String, // Simpler type definition
    }, 

    password: {
        type: String, // Again, using the simplified type syntax
        required: true, // Password must be provided
    }
});

// Export the user model based on the schema
export const User = mongoose.model("User", UserSchema);
