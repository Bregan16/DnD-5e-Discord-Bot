export default async function GraphQLClient(query: string) {
    const url = "http://localhost:5000/graphql";
//     const query = `
//   {
//     user(id: "1") {
//       name
//       email
//       posts {
//         title
//         content
//       }
//     }
//   }
// `;

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({ query })
    })
        .then(response => response.json())
        .then((data) => {
            console.log('Data:', data.data);
            return data.data;
        })
        .catch(error => console.error('Error:', error));
}