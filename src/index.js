import './sass/main.scss';
import ApiService from './js/api-service';
import LoadMoreBtn from './js/load-more-btn';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import axios from 'axios';

const refs = {
    searchForm: document.querySelector('#search-form'),
    imagesContainer: document.querySelector('.gallery'),
    loadMoreBtn: document.querySelector('.load-more-btn'),
}

refs.searchForm.addEventListener('submit', searchImagesByWord);
refs.loadMoreBtn.addEventListener('click', loadMoreImages);
    


const apiService = new ApiService();
const loadMoreBtn = new LoadMoreBtn('.load-more-btn');



function searchImagesByWord(e) {
    e.preventDefault();

    loadMoreBtn.show();
    loadMoreBtn.disable();
        
    refs.imagesContainer.innerHTML = '';
    apiService.resetPage();
    apiService.query = e.currentTarget.elements.searchQuery.value;
    if (apiService.query === '') {
        loadMoreBtn.hide();
        return Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    }
    apiService.fetchImages()
        .then(renderMarkup)
        .catch(() => { loadMoreBtn.hide() });
}

function loadMoreImages() {
    loadMoreBtn.disable();
    apiService.fetchImages().then(renderMarkup);
    // if ((imgPerPage*this.page) >= data.total) {
    //     Notify.info(`We're sorry, but you've reached the end of search results.`);
    //     loadMoreBtn.hide();
    //     return;
    // }
    loadMoreBtn.enable();
}


function renderMarkup(elements) {
    const markup = elements.map(element => {
        return `
        <div class="photo-card">
            <img src="${element.webformatURL}" alt="${element.tags}" loading="lazy" />
                <div class="info">
                    <p class="info-item">
                        <b>Likes</b>
                        ${element.likes}
                    </p>

                    <p class="info-item">
                        <b>Views</b>
                        ${element.views}
                    </p>

                    <p class="info-item">
                        <b>Comments</b>
                        ${element.comments}
                    </p>

                    <p class="info-item">
                        <b>Downloads</b>
                        ${element.downloads}
                    </p>
                </div>
        </div>`;
    }).join('');

    refs.imagesContainer.insertAdjacentHTML('beforeend', markup);

    loadMoreBtn.enable();
}

        

