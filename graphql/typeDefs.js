const { gql } = require("apollo-server")

module.exports = gql`
    type User {
        id: ID!
        username: String!
        displayname: String
        email: String!
        articles: [Article]
        password: String!
        token: String!
        role: USERROLE
    }

    input EditUserInput {
        displayname: String
        email: String
        role: USERROLE
    }

    enum USERROLE {
        Admin
        Editor
        Journalist
        Subscriber
        User
    }

    input RegisterInput {
        username: String!
        displayname: String
        email: String!
        password: String!
        confirmPassword: String
    }

    input LoginInput {
        username: String!
        password: String!
    }

    ## Articles

    type Article {
        id: ID
        title: String!
        body: String!
        excerpt: String!
        imagecredit: String
        image: String!
        tags: [String]
        article_type: String!
        category: String
        age_group: String
        createdAt: String!
        author: User!
        published: Boolean!
    }

    input NewsArticleInput {
        title: String
        body: String
        imagecredit: String
        excerpt: String!
        image: String!
        tags: [String]
        category: String
        article_type: String!
        published: Boolean!
        author: String!
    }

    input EditArticleInput {
        title: String
        body: String
        imagecredit: String
        excerpt: String
        image: String
        tags: [String]
        age_group: String
        category: String
        published: Boolean
    }
    # input EditNewsArticleInput {
    #     title: String
    #     body: String
    #     imagecredit: String
    #     excerpt: String
    #     image: String
    #     tags: [String]
    #     category: String
    #     article_type: String
    #     published: Boolean
    # }

    # EDU

    input EduArticleInput {
        title: String
        image: String!
        imagecredit: String
        excerpt: String!
        body: String
        age_group: String
        tags: [String]
        article_type: String!
        category: String
        published: Boolean!
        author: String!
    }

    # input EditEduArticleInput {
    #     title: String
    #     body: String
    #     imagecredit: String
    #     excerpt: String
    #     age_group: String
    #     image: String
    #     tags: [String]
    #     category: String
    #     article_type: String
    #     published: Boolean
    # }

    # TRAVEL
    input TravelArticleInput {
        title: String
        body: String
        imagecredit: String
        excerpt: String!
        image: String!
        tags: [String]
        category: String
        article_type: String!
        published: Boolean!
        author: String!
    }

    # input EditTravelArticleInput {
    #     title: String
    #     body: String
    #     imagecredit: String
    #     excerpt: String
    #     image: String
    #     tags: [String]
    #     category: String
    #     article_type: String
    #     published: Boolean
    # }

    type Query {
        # ARTICLES
        getArticleById(ID: ID!): Article
        getArticles(amount: Int): [Article]!
        getArticlesByType(article_type: String): [Article]!

        # USERS
        getUserById(ID: ID!): User
        getUser(token: String): User
        getUsers(amount: Int): [User]
    }

    type Mutation {
        deleteArticle(ID: ID!): Boolean
        # NEWS
        createNewsArticle(newsArticleInput: NewsArticleInput): Article

        #  EDUCATION
        createEduArticle(eduArticleInput: EduArticleInput): Article

        # TRAVEL
        createTravelArticle(travelArticleInput: TravelArticleInput): Article

        # EDIT ALL ARTICLES
        editArticle(ID: ID!, editArticleInput: EditArticleInput): Boolean

        # User Mutations
        registerUser(registerInput: RegisterInput): User
        loginUser(loginInput: LoginInput): User
        deleteUser(ID: ID!): Boolean
        editUser(ID: ID!, editUserInput: EditUserInput): User
    }
`
