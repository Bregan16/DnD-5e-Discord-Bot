// Import necessary GraphQL modules and dependencies.
import graphql from 'graphql';
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLFloat,
    GraphQLNonNull,
    GraphQLList,
} = graphql;

// Import data models for products and orders.
import Product from '../models/products.js';
import Character from '../models/characters.js';

// Import user-defined data types for GraphQL.
import ProductType from './typeDefs/productType.js';
import UserType from './typeDefs/userType.js';
import CharacterType, { CharacterInputType } from './typeDefs/characterType.js';

const CharacterSummaryType = new GraphQLObjectType({
    name: 'CharacterSummary',
    fields: {
        id: { type: GraphQLString },
        name: {
            type: GraphQLString,
            resolve: character => character.character.basicInfo.name,
        },
    },
});

// Define the RootQuery, which is the entry point for querying data.
const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        getAllCharacters: {
            type: new GraphQLList(CharacterSummaryType),
            async resolve() {
                return Character.find({}, { 'character.basicInfo.name': 1 });
            },
        },
        getCharacter: {
            type: CharacterType,
            args: { id: { type: new GraphQLNonNull(GraphQLString) } },
            async resolve(parent, args) {
                return Character.findById(args.id);
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

        updateCharacter: {
            type: CharacterType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLString) },
                name: { type: new GraphQLNonNull(GraphQLString) },
            },
            async resolve(parent, args) {
                return Character.findByIdAndUpdate(
                    args.id,
                    { $set: { 'character.basicInfo.name': args.name } },
                    { returnDocument: 'after', runValidators: true },
                );
            },
        },

        deleteCharacter: {
            type: CharacterType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLString) },
            },
            async resolve(parent, args) {
                return Character.findByIdAndDelete(args.id);
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
