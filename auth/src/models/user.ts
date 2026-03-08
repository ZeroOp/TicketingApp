import mongoose from 'mongoose';

// An interface that describes the properties that are required to create a new User. 
// UserAttributes
interface UserAttrs {
    email: string;
    password: string;
}

// An interface that describes the properties that a UserModel has. 

interface UserModel extends mongoose.Model<UserDoc> {
    build(attrs: UserAttrs) : UserDoc ;
}

// An interface that describes the the properties that a User Document has. 

interface UserDoc extends mongoose.Document {
    email: string;
    password: string;

}

const userSchema = new mongoose.Schema({
    email: {
        type: String,  // this type is related to mongoose not related to the typescript at all. 
        required: true
    },
    password: {
        type: String, 
        required: true
    }
});

// this is how we add a custom function to the model. 
userSchema.statics.build = (attrs: UserAttrs) => {
    return new User(attrs);
}

const User : UserModel = mongoose.model<UserDoc, UserModel>('User', userSchema); 

export { User };

// now we never use the new User() directly , we are using buildUsers , typescript now know that we need to pass the email and password to the buildUser function.
// const buildUser = (attrs: UserAttrs) => {
//     return new User(attrs);
// }

// export { User, buildUser }; now we don't need to export two differnt things. 