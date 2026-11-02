import graphql from 'graphql';
const { GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLFloat } = graphql;

const ProductType = new GraphQLObjectType({
    name: "Product",
    fields: () => ({
        id: { type: GraphQLString },
        title: { type: GraphQLString },
        description: { type: GraphQLString },
        price: { type: GraphQLFloat },
    }),
});

export default ProductType;
