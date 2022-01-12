import { Notify } from 'notiflix/build/notiflix-notify-aio';
import axios from 'axios';
import 'simplelightbox/dist/simple-lightbox.min.css';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '25171774-7b79c52a8837e6f3634106172';
const imgPerPage = 40;

export default class ApiService {
    constructor() {
        this.searchQuery = '';
        this.page = 1;
    }    

    async fetchImages() {
        const url = `${BASE_URL}?image_type=photo&orientation=horizontal&safesearch=true&q=${this.searchQuery}&page=${this.page}&per_page=${imgPerPage}&key=${API_KEY}`
        const response = await axios.get(url);

        if (response.data.hits.length === 0) {
            Notify.failure('Sorry, there are no images matching your search query. Please try again.');
            throw new Error(data.statusText);
        }

        if (this.page === 1) {
            Notify.success(`Hooray! We found ${response.data.totalHits} images.`);
        }

        if ((imgPerPage * this.page) >= response.data.totalHits) {      
            document.querySelector('.load-more-btn').classList.add('visually-hidden');
            Notify.info(`We're sorry, but you've reached the end of search results.`);                
        } else {
            this.page += 1;
        }

        return response.data.hits;            
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

