import LoadMoreBtn from './load-more-btn';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const loadMoreBtn = new LoadMoreBtn('.load-more-btn');

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '25171774-7b79c52a8837e6f3634106172';
const imgPerPage = 40;

export default class ApiService {
    constructor() {
        this.searchQuery = '';
        this.page = 1;
    }    

    fetchImages() {
        const url = `${BASE_URL}?image_type=photo&orientation=horizontal&safesearch=true&q=${this.searchQuery}&page=${this.page}&per_page=${imgPerPage}&key=${API_KEY}`
        return fetch(url)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error(response.statusText);
            })
            .then(data => {
                if (data.hits.length === 0) {
                    Notify.failure('Sorry, there are no images matching your search query. Please try again.');
                    throw new Error(data.statusText);
                }

                if ((imgPerPage*this.page) >= data.totalHits) {
                    Notify.info(`We're sorry, but you've reached the end of search results.`);    
                    loadMoreBtn.hide();
                }
                console.log(data);
                this.page += 1;
                return data.hits;
            });
    }

    resetPage() {
        this.page = 1;
    }

    get query() {
        return this.searchQuery;
    }

    set query(newQuery) {
        this.searchQuery = newQuery;
    }
}

