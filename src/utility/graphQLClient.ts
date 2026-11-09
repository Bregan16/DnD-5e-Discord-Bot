type GraphQLResponse<T> = {
	data?: T;
	errors?: { message: string }[];
};

export default async function GraphQLClient<T>(
	query: string,
	isInternal: boolean = true,
	variables?: Record<string, unknown>,
): Promise<T> {
	const url = isInternal
		? 'http://localhost:5000/graphql'
		: 'https://www.dnd5eapi.co/graphql/2024';
	const response = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json',
		},
		body: JSON.stringify({ query, ...(variables ? { variables } : {}) }),
	});

	if (!response.ok) {
		throw new Error(`GraphQL request failed with status ${response.status}`);
	}

	const result = await response.json() as GraphQLResponse<T>;
	if (result.errors?.length) {
		throw new Error(result.errors.map(error => error.message).join('; '));
	}
	if (result.data === undefined) {
		throw new Error('GraphQL response did not contain data');
	}
	return result.data;
}
