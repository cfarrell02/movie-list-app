const BASE_URL = 'https://openlibrary.org';

export const getBooks = async (page,limit = 10) => {
    try {
        const response = await fetch(`${BASE_URL}/trending/weekly.json?limit=${limit}&page=${page}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching books:', error);
    }   
}

export const getBookSearchResults = async (page, query, limit = 10) => {
    try {
        const response = await fetch(`${BASE_URL}/search.json?title=${query}&page=${page}&limit=${limit}`);	
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching book search results:', error);
    }
}

export const getBook = async (id) => {
    try {
        const response = await fetch(`${BASE_URL}/works/${id}.json`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching book:', error);
    }
}

export const getAuthor = async (id) => {
    try {
        const response = await fetch(`${BASE_URL}/authors/${id}.json`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching author:', error);
    }
}