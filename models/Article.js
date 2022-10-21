// MODEL

const { default: mongoose, Schema, model } = require("mongoose")

const articleSchema = new Schema({
    title: { type: String },
    body: { type: String },
    excerpt: { type: String },
    image: { type: String },
    imagecredit: { type: String },
    author: String,
    age_group: { type: String },
    tags: [String],
    category: { type: String },
    article_type: { type: String, enum: ["News", "Education", "Travel"] },
    createdAt: String,
    published: Boolean
})

module.exports = model("Article", articleSchema)
