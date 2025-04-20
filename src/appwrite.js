import { Client, Databases, ID, Query } from 'appwrite'

const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID; // This might be undefined or empty
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID; // This might be undefined or empty

const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject(PROJECT_ID)

const database = new Databases(client);

export const updateSearchCount = async (searchTerm, movie) => {
  // 1. Use Appwrite SDK to check if the search term exists in the database
 try {
  const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
    Query.equal('searchTerm', searchTerm),
  ])

  // 2. If it does, update the count
  if(result.documents.length > 0) {
   const doc = result.documents[0];

   await database.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, {
    count: doc.count + 1,
   })
  // 3. If it doesn't, create a new document with the search term and count as 1
  } else {
   await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
    searchTerm,
    count: 1,
    movie_id: movie.id,
    poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
   })
  }
 } catch (error) {
  console.error(error);
 }
}

// Add error handling and null checks
export const getTrendingMovies = async () => {
 try {
  // This check is failing because DATABASE_ID or COLLECTION_ID is missing
  if(!DATABASE_ID || !COLLECTION_ID) {
   throw new Error('Appwrite configuration missing');
  }

    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
        Query.limit(5), // Limit to 5 trending items
        Query.orderDesc("count")
    ]);

    // Map Appwrite document to a structure closer to what MovieCard expects
    // Add defaults for fields potentially not stored in Appwrite
    return result.documents.map(doc => ({
        id: doc.movie_id, // Use the stored TMDB movie ID
        poster_path: doc.poster_url?.replace('https://image.tmdb.org/t/p/w500', ''), // Store only the path if possible, otherwise extract
        title: doc.searchTerm || 'Unknown Title', // Use searchTerm as title, or fallback
        vote_average: doc.vote_average || 0, // Default if not stored
        release_date: doc.release_date || '', // Default if not stored
        original_language: doc.original_language || 'N/A' // Default if not stored
        // Add other fields if you store them in Appwrite
    }));
 } catch (error) {
  console.error('Appwrite Error fetching trending movies:', error); // This is where the error is logged
  return []; // Return empty array on error
 }
}