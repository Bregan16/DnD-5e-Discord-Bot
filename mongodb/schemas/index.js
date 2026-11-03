// Import necessary GraphQL modules and dependencies.
import graphql from 'graphql';
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLFloat,
    GraphQLNonNull,
} = graphql;

// Import data models for products and orders.
import Product from '../models/products.js';
import Order from '../models/orders.js';
import Character from '../models/characters.js';

// Import user-defined data types for GraphQL.
import ProductType from './typeDefs/productType.js';
import UserType from './typeDefs/userType.js';
import OrderType from './typeDefs/orderType.js';
import CharacterType, { CharacterInputType } from './typeDefs/characterType.js';

// Define the RootQuery, which is the entry point for querying data.
const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        getCharacter: {
            type: CharacterType,
            args: { id: { type: new GraphQLNonNull(GraphQLString) } },
            async resolve(parent, args) {
                return Character.findById(args.id);
            },
        },
        // Products Queries
        getAllProduct: {
            type: new GraphQLList(ProductType), // Define the type of data to be returned (a list of products).
            args: { id: { type: GraphQLString } }, // Specify any input arguments that can be used in the query (in this case, an 'id').
            async resolve(parent, args) {
                // The 'resolve' function specifies how to fetch and return the requested data.
                // In this case, it fetches and returns a list of all products.
                const productList = await Product.find();
                return productList;
            },
        },
        getProduct: {
            type: ProductType, // Define the type of data to be returned (a single product).
            args: { id: { type: GraphQLString } }, // Specify an input argument 'id'.
            async resolve(parent, args) {
                // The 'resolve' function fetches and returns a specific product based on the provided 'id'.
                const product = await Product.findById(args.id);
                return product;
            },
        },

        // Orders Queries
        getAllOrders: {
            type: new GraphQLList(OrderType), // Define the type of data to be returned (a list of orders).
            args: { id: { type: GraphQLString } }, // Specify an input argument 'id'.
            async resolve(parent, args, req) {
                // The 'resolve' function fetches and returns a list of orders for a specific user, but only if the user is authenticated.
                if (!req.isAuth) {
                    throw new Error("Unauthenticated");
                }
                const orderList = await Order.find({ userId: args.id });
                return orderList;
            },
        },
    },
});

const Mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        createCharacter: {
            type: CharacterType,
            args: {
                character: { type: new GraphQLNonNull(CharacterInputType) },
            },
            async resolve(parent, args) {
                const character = new Character({ character: args.character });
                await character.save();
                return character;
            },
        },
        //Product mutations
        createProduct: {
            type: ProductType,
            args: {
                title: { type: GraphQLString },
                description: { type: GraphQLString },
                price: { type: GraphQLFloat },
            },
            async resolve(parent, args, req) {
                const newProduct = new Product({
                    title: args.title,
                    description: args.description,
                    price: args.price,

                });

                await newProduct.save();

                return newProduct;
            },
        },

        updateProduct: {
            type: ProductType,
            args: {
                id: { type: GraphQLString },
                title: { type: GraphQLString },
                description: { type: GraphQLString },
                price: { type: GraphQLFloat },
            },
            async resolve(parent, args, req) {
                const newProduct = await Product.findByIdAndUpdate(args.id, {
                    brand: args.brand,
                    title: args.title,
                    description: args.description,
                    price: args.price,
                });

                return newProduct;
            },
        },

        deleteProduct: {
            type: ProductType,
            args: {
                id: { type: GraphQLString },
            },
            async resolve(parent, args) {
                console.log(args.id);

                const deletedProduct = await Product.findByIdAndDelete(args.id);

                return args;
            },
        },

    }});

const schema = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation, //add mutations here
});

export default schema;
