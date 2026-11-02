// Import necessary GraphQL modules and dependencies.
const graphql = require("graphql");
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLFloat,
} = graphql;

// Import data models for products and orders.
const { Product } = require("../models/products");
const { Order } = require("../models/orders");

// Import user-defined data types for GraphQL.
const ProductType = require("./TypeDefs/ProductType");
const UserType = require("./TypeDefs/UserType");
const OrderType = require("./TypeDefs/OrderType");

// Define the RootQuery, which is the entry point for querying data.
const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
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

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation, //add mutations here
});