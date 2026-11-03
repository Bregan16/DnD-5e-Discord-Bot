import graphql from 'graphql';
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLList,
} = graphql;

import Character from '../models/characters.js';


// import UserType from './typeDefs/userType.js';
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
    }});

const schema = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation,
});

export default schema;
