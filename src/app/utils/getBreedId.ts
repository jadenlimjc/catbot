import { CAT_API_KEY } from '../catapi';

// Helper function to fetch breed IDs
export async function getBreedId(breedName: string): Promise<string | null> {
    try {
        const response = await fetch('https://api.thecatapi.com/v1/breeds', {
            headers: {
                "x-api-key": CAT_API_KEY,
            },
        });

        if (!response.ok) {
            console.error("Failed to fetch breeds:", response.status, response.statusText);
            return null;
        }

        const breeds = await response.json();
        console.log("Available breeds:", breeds); // Log all available breeds

        const breed = breeds.find((b: any) => b.name.toLowerCase() === breedName.toLowerCase());
        return breed ? breed.id : null;
    } catch (error) {
        console.error("Error fetching breed list:", error);
        return null;
    }
}