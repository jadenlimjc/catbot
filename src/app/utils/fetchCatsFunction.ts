export const fetchCatsFunction = {
    name: "fetch_cats",
    description: "Fetch cat images based on breed and count.",
    parameters: {
      type: "object",
      properties: {
        breed: { type: "string", description: "The breed of the cat" },
        count: { type: "integer", description: "Number of cat images to fetch" },
      },
      required: ["breed", "count"],
    },
  };