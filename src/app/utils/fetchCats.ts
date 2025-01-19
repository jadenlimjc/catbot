import { CAT_API_KEY } from '../catapi';
import { getBreedId } from './getBreedId';

export async function fetchCats(breed: string | null, count: number): Promise<string[]> {
    console.log("fetchCats called with:", { breed, count }); // Log input arguments

    let breedId = null;
    if (breed) {
        // Convert breed name to breed ID
        breedId = await getBreedId(breed);
        if (!breedId) {
            console.warn(`Breed "${breed}" not found. Fetching random cats instead.`);
        }
    }

    const url = breedId
      ? `https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}&limit=${count}`
      : `https://api.thecatapi.com/v1/images/search?limit=${count}`;
    
    console.log("API URL constructed:", url); // Log the constructed URL

    try {
        const response = await fetch(url, {
            headers: {
                "x-api-key": CAT_API_KEY,
            },
        });

        console.log("API response status:", response.status, response.statusText); // Log API response status

        if (!response.ok) {
            console.error("API request failed:", response.status, response.statusText); // Log if the response is not OK
            throw new Error(`Failed to fetch cats. Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Raw API response data:", data); // Log the raw response from the API

        const urls = data.map((item: any) => item.url);

        return urls;
    } catch (error) {
        console.error("Error in fetchCats:", error); // Log any errors encountered
        return []; // Return an empty array in case of an error
    }
}
