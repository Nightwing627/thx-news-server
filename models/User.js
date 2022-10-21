// MODEL

const { default: mongoose, Schema, model } = require("mongoose")

const userSchema = new Schema({
    username: { type: String, unique: true },
    displayname: String,
    password: String,
    email: { type: String, unique: true },
    role: {
        type: String,
        enum: ["Admin", "Editor", "Journalist", "Subscriber", "User"],
        default: "User"
    },
    articles: [String],
    token: String
})

module.exports = model("User", userSchema)
