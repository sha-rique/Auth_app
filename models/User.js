let mongoose= require ('mongoose');

let userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        trim: true
    },
    email: {
        type: String,
        require: true,
        trim: true,
    },
    password: {
        type: String,
        require: true,
    },
    role: {
        type: String,
        enum: ["admin", "Student", "Visitor"]
    }
})

module.exports = mongoose.model("user", userSchema);