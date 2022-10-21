// RESOLVERS
const Article = require("../../models/Article")
const User = require("../../models/User")

module.exports = {
    Query: {
        async article(_, { ID }) {
            return await Article.findById(ID)
        },
        async getArticlesByCategory(_, { category }) {
            return await Article.find({ category })
        },
        async getArticles(_, { amount }) {
            return Article.find().sort({ createdAt: -1 }).limit(amount)
        }
    },

    Mutation: {
        async createArticle(
            _,
            {
                articleInput: {
                    title,
                    body,
                    tags,
                    category,
                    article_type,
                    author
                }
            }
        ) {
            const createdArticle = new Article({
                title: title,
                body: body,
                tags: tags,
                category: category,
                article_type: article_type,
                author: author,
                createdAt: new Date().toISOString()
            })
            const res = await createdArticle.save()

            return {
                id: res.id,
                ...res._doc
            }
        },
        async deleteArticle(_, { ID }) {
            const wasDeleted = (await Article.deleteOne({ _id: ID }))
                .deletedCount
            return wasDeleted
        },
        async editArticle(
            _,
            { ID, articleInput: { title, body, tags, category } }
        ) {
            const wasEdited = (
                await Article.updateOne(
                    { _id: ID },
                    { title: title, body: body, tags: tags, category: category }
                )
            ).modifiedCount
            return wasEdited
        }
    }
}
