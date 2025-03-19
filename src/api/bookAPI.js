const BASE_URL = 'https://openlibrary.org';

export const getBooks = async () => {
    try {
        const response = await fetch(`${BASE_URL}/trending/weekly.json`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching books:', error);
    }   
}

export const getBookSearchResults = async (page, query) => {
    try {
        const response = await fetch(`${BASE_URL}/search.json?title=${query}&page=${page}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching book search results:', error);
    }
}