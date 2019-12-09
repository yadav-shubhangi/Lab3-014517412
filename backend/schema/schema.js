const graphql = require('graphql')
const _ = require('lodash')

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLBoolean,
    GraphQLFloat,
    GraphQLNonNull
} = graphql

// dummy data
var books = [
    { name: 'Name of the Wind', genre: 'Fantasy', id: '1', authorId: '1' },
    { name: 'The Final Empire', genre: 'Fantasy', id: '2', authorId: '2' },
    { name: 'The Hero of Ages', genre: 'Fantasy', id: '4', authorId: '2' },
    { name: 'The Long Earth', genre: 'Sci-Fi', id: '3', authorId: '3' },
    { name: 'The Colour of Magic', genre: 'Fantasy', id: '5', authorId: '3' },
    { name: 'The Light Fantastic', genre: 'Fantasy', id: '6', authorId: '3' },
]

var authors = [
]

var users = [
    {
        id: '001', 
        email: "test@gmail.com", 
        firstname: "Jayasurya", 
        lastname: "Pinaki", 
        password: "ajsd", 
        isOwner: false,
        restaurantInfo : {
            name: "Restaurant Name",
            cuisine: "Indian",
            sections: [{
                id: "1",
                name: "Section1",
                items: [{
                    id: "1",
                    name: "Item 1",
                    description: "Item description",
                    price: "10.00"
                }]
            }]
        }
    },
    {
        "id": "1",
        "firstname": "Jayasurya",
        "lastname": "Pinaki",
        "email": "jayasurya1@gmail.com",
        "password": "sha1$242bc193$1$b60e56e21c598966b271b0f57a5d8e92485022d5",
        "isOwner": false
    }
]

const itemsType = new GraphQLObjectType({
    name: 'Items',
    fields: () => ({
        id : {
            type : GraphQLID
        },
        name: {
            type: GraphQLString
        },
        description: {
            type: GraphQLString
        },
        price: {
            type: GraphQLFloat
        }
    })
})

const sectionsType = new GraphQLObjectType({
    name: 'Sections',
    fields: () => ({
        id : {
            type : GraphQLID
        },
        name: {
            type: GraphQLString
        },
        items: {
            type: new GraphQLList(itemsType)
        }
    })
})

const restaurantType = new GraphQLObjectType({
    name: 'Restaurant',
    fields: () => ({
        name: {
            type: GraphQLString
        },
        cuisine: {
            type: GraphQLString
        },
        sections: {
            type: new GraphQLList(sectionsType)
        }
    })
})

const userType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id : {
            type : GraphQLID
        },
        email : {
            type: GraphQLString
        },
        firstname : {
            type: GraphQLString
        },
        lastname : {
            type: GraphQLString
        },
        password : {
            type: GraphQLString
        },
        isOwner : {
            type: GraphQLBoolean
        },
        restaurantInfo: {
            type: restaurantType
        }
    })
})

const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        author: {
            type: AuthorType,
            resolve(parent, args) {
                return _.find(authors, { id: parent.authorId })
            }
        }
    })
})

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                return _.filter(books, { authorId: parent.id })
            }
        }
    })
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        book: {
            type: BookType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return _.find(books, { id: args.id })
            }
        },
        author: {
            type: AuthorType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return _.find(authors, { id: args.id })
            }
        },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                return books
            }
        },
        authors: {
            type: new GraphQLList(AuthorType),
            resolve(parent, args) {
                return authors
            }
        },
        userByEmail: {
            type: userType,
            args: {
                email: {
                    type: GraphQLString
                }
            },
            resolve(parent, args) {
                return _.find(users, {
                    email: args.email
                })
            }
        },
        allUsers: {
            type: new GraphQLList(userType),
            resolve(parent, args) {
                return users
            }
        }
    }
})

var userCount = 101,
    sectionCount = 101,
    itemCount = 101
const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addAuthor: {
            type: AuthorType,
            args: {
                name: { type: GraphQLString },
                age: { type: GraphQLInt },
                id: { type: GraphQLID }
            },
            resolve(parent, args) {
                let author = {
                    name: args.name,
                    age: args.age,
                    id: args.id
                }
                authors.push(author)
                console.log("Authors", authors)
                return author
            }
        },

        addBook: {
            type: BookType,
            args: {
                name: { type: GraphQLString },
                genre: { type: GraphQLString },
                authorId: { type: GraphQLID },
            },
            resolve(parent, args) {
                let book = {
                    name: args.name,
                    genre: args.genre,
                    authorId: args.authorId,
                    id: count++
                }
                books.push(book)
                return book
            }
        },

        addUser: {
            type: userType,
            args: {
                firstname: {
                    type: GraphQLString
                },
                lastname: {
                    type: GraphQLString
                },
                email: {
                    type: GraphQLString
                },
                password: {
                    type: GraphQLString
                },
                isOwner: {
                    type: GraphQLBoolean
                }
            },
            resolve(parent, args) {
                let user = {
                    id: userCount++,
                    firstname: args.firstname,
                    lastname: args.lastname,
                    email: args.email,
                    password: args.password,
                    isOwner: args.isOwner,
                    restaurantInfo: {
                        name: "",
                        cuisine: "",
                        sections: []
                    }
                }
                users.push(user)
                return user
            }
        },

        updateProfile: {
            type: userType,
            args: {
                userId: {
                    type: GraphQLString
                },
                firstname: {
                    type: GraphQLString
                },
                lastname: {
                    type: GraphQLString
                },
                email: {
                    type: GraphQLString
                },
                password: {
                    type: GraphQLString
                },
            },
            resolve(parent, args) {
                let index,
                    isAdded = false
                for (index in users) {
                    if(users[index].id == args.userId) {
                        users[index].firstname = args.firstname
                        users[index].lastname = args.lastname
                        users[index].email = args.email
                        users[index].password = args.password
                        isAdded = true
                        break
                    }
                }
                return isAdded
            }
        },

        restaurantInfo: {
            type: userType,
            args: {
                userId: {
                    type: GraphQLString
                },
                name: {
                    type: GraphQLString
                },
                cuisine: {
                    type: GraphQLString
                },
            },
            resolve(parent, args) {
                let index
                for (index in users) {
                    if(users[index].id == args.userId) {
                        users[index].restaurantInfo.name = args.name
                        users[index].restaurantInfo.cuisine = args.cuisine
                        isAdded = true
                        break
                    }
                }
                return isAdded
            }
        },

        addSection: {
            type: userType,
            args: {
                userId: {
                    type: GraphQLString
                },
                sectionName: {
                    type: GraphQLString
                },
            },
            resolve(parent, args) {
                let index,
                    isAdded = false
                    newSection = {}
                for (index in users) {
                    if(users[index].id == args.userId) {
                        newSection['id'] = sectionCount++
                        newSection['name'] = args.sectionName
                        newSection['items'] = []
                        users[index].restaurantInfo.sections.push(newSection)
                        isAdded = true
                        break
                    }
                }
                return isAdded
            }
        },

        addItem: {
            type: userType,
            args: {
                userId: {
                    type: GraphQLString
                },
                sectionId: {
                    type: GraphQLString
                },
                itemName: {
                    type: GraphQLString
                },
                itemDescription: {
                    type: GraphQLString
                },
                itemPrice: {
                    type: GraphQLString
                },
            },
            resolve(parent, args) {
                let index,
                    index1,
                    isAdded = false
                    newItem = {}
                for (index in users) {
                    if(users[index].id == args.userId) {
                        for(index1 in users[index].restaurantInfo.sections) {
                            if(users[index].restaurantInfo.sections[index1].id == args.sectionId) {
                                newItem = {
                                    id: itemCount++,
                                    name: args.itemName,
                                    description: args.itemDescription,
                                    price: args.itemPrice,
                                }
                                users[index].restaurantInfo.sections[index1].items.push(newItem)
                            }
                        }
                        isAdded = true
                        break
                    }
                }
                return isAdded
            },
        }

    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})