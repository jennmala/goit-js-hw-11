import '/sass/main.scss';
import 'simplelightbox/dist/simple-lightbox.min.css';
import ApiService from '/js/api-service';
import LoadMoreBtn from '/js/load-more-btn';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';


const apiService = new ApiService();
const loadMoreBtn = new LoadMoreBtn('.load-more-btn');
const lightbox = new SimpleLightbox('.gallery a');

const refs = {
    searchForm: document.querySelector('#search-form'),
    imagesContainer: document.querySelector('.gallery'),
    loadMoreBtn: document.querySelector('.load-more-btn'),
}

refs.searchForm.addEventListener('submit', searchImagesByWord);
refs.loadMoreBtn.addEventListener('click', loadMoreImages);

async function searchImagesByWord(e) {
    e.preventDefault();
    loadMoreBtn.show();
    loadMoreBtn.disable();        
    refs.imagesContainer.innerHTML = '';
    apiService.resetPage();
    apiService.query = e.currentTarget.elements.searchQuery.value;

    if (apiService.query === '') {
        loadMoreBtn.hide();
        Notify.failure('Еnter text!');
        return; 
    }
    try {
        const images = await apiService.fetchImages();
        renderMarkup(images);
    } catch {
        loadMoreBtn.hide();
    }   
    loadMoreBtn.enable();

}

async function loadMoreImages() {
    loadMoreBtn.disable();
    try {
        const images = await apiService.fetchImages();
        renderMarkup(images);

        // плавная прокрутка
        const { height: cardHeight } = document.querySelector('.gallery').firstElementChild.getBoundingClientRect();

        window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
        });
    } catch {
        loadMoreBtn.hide();
    }
    loadMoreBtn.enable();    
}


function renderMarkup(elements) {
    const markup = elements.map(element => {
        return `
        <div class="photo-card">
            <a href ="${element.largeImageURL}">
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
            </a>
        </div>`;
    }).join('');

    refs.imagesContainer.insertAdjacentHTML('beforeend', markup);
    lightbox.refresh();   
}