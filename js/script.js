const formSearch = document.querySelector('.form_search'),
	inputSearch = document.querySelector('.input_search'),
	moviesWrap = document.getElementById('movies_wrap'),
	urlPoster = 'https://image.tmdb.org/t/p/w500';
	//urlApi = 'https://www.themoviedb.org/?language=ru',
	//API_KEY = 'bbcb0cb26efaceeec9fcb84d3e4be945',
	//API_Trends = 'https://api.themoviedb.org/3/trending/all/day?api_key=<<api_key>>';
	
let showFullFilmInfo = (event) => {
	let target = event.target;
	if(target.matches('img[data-id]')){
		let url = '';
		if(target.dataset.type === 'movie'){
			url = `https://api.themoviedb.org/3/movie/${target.dataset.id}?api_key=bbcb0cb26efaceeec9fcb84d3e4be945&language=ru`;
		}else if(target.dataset.type === 'tv'){
			url = `https://api.themoviedb.org/3/tv/${target.dataset.id}?api_key=bbcb0cb26efaceeec9fcb84d3e4be945&language=ru`
		}else{
			let card = '<h2 class="col-12">Ошибка</h2>';
		}
		
		///метод датасет находит наши атрибуты, а через точку именно какой дата атрибут
	fetch(url)
     .then((result) => {
		return result.json();
	})
     .then((data) => {
		 console.log(data);
     })
     .catch((error) => {
     	moviesWrap.innerHTML = 'Упс, что-то пошло не так!';
     	console.error(error.status + ':' + error.status);
     });
	};
};

let createCards = (data) => {
	console.log(data);

	let card = '<h2 class="col-12">Популярное за месяц</h2>';
	if(data.results.length === 0){
		card = '<h2>По вашему запросу ничего не найдено</h2>';
	}
	data.results.forEach((item) => {
		let name = item.name || item.title;
		const poster = item.poster_path ? urlPoster + item.poster_path : './img/noposter.jpg';
		let dataInfo = '';
		if(item.media_type !== 'person') dataInfo = `data-id="${item.id}" data-type="${item.media_type}"`;
		card += `
			<div class="col-3">
			<div class="outer_img_wrap">
			<div class="img_wrap">
			<img src="${poster}" alt="${name}" ${dataInfo}>
			</div>
			<h5>${name}</h5>
			</div>
			</div>`;
	});
	moviesWrap.innerHTML = card;
	moviesWrap.addEventListener('click', (event) => {
		showFullFilmInfo(event);
	});
};

const requestApi = (url) => {
		////Вариант c new XMLHttpRequest
	// const request = new XMLHttpRequest();
	// request.open('GET', url);
	// request.addEventListener('readystatechange', () => {
	// 	if(request.readyState !== 4) return;
	// 	if(request.status === 200){
	// 		let data = JSON.parse(request.response);
	// 		createCards(data);
	// 	}else{
	// 		moviesWrap.innerHTML = 'Упс, что-то пошло не так!';
	// 		console.error(request.status + ':' + request.status.text)
	// 	}
	// })
	// request.send();
	
	///Вариант с промисом
	// return new Promise((resolve, reject) => {
	// 	const request = new XMLHttpRequest();
	// 	request.open('GET', url);
	// 	request.addEventListener('load', () => {
	// 		if(request.status !== 200){  // 404 ошибка не обрабатывается ерором (ниже), поэтому здесь пишем еще одно условие
	// 			reject({status: request.status});
	// 			return;
	// 		}
	// 		resolve(request.response);
	// 	});
	// 	request.addEventListener('error', () => {
	// 		reject({status: request.status});
	// 	});
	// 	request.send();
	// })
}



const apiSearch = (event) => {
	event.preventDefault();
	const inputValue = inputSearch.value;
	if (inputValue.trim().length === 0){  //// метод trim() обрезает пробелы справа и слева (если много ввели пробелов, то выведет всеравно поле не должно быть пустым, а иначе пройдет дальше)
		moviesWrap.innerHTML = '<h2>Поле ввода не должно быть пустым</h2>';
		return;
	}
	let urlApi = `https://api.themoviedb.org/3/search/multi?api_key=bbcb0cb26efaceeec9fcb84d3e4be945&language=ru&query=${inputValue}`;
	moviesWrap.innerHTML = '<div class="spinner"></div>';
		
	////Вариант c new XMLHttpRequest
	////requestApi(urlApi);

	////Вариант с промисами
	// requestApi(urlApi)
	// .then((result) => {
	// 	let data = JSON.parse(result);
	// 	console.log(data)
	// 	createCards(data)
	// })
	// .catch((error) => {
	// 	moviesWrap.innerHTML = 'Упс, что-то пошло не так!';
	// 	console.error(error.status + ':' + error.status.text);
	// });

     ////Вариант с фетчем
     fetch(urlApi)
     .then((result) => {
		// if(result !== 200){
		// 	return Promise.reject(new Error(result.status));
		// }
		return result.json();
	})
     .then((data) => {
     	createCards(data);
     })
     .catch((error) => {
     	moviesWrap.innerHTML = 'Упс, что-то пошло не так!';
     	console.error(error.status + ':' + error.status);
     });
 }

 formSearch.addEventListener('submit', (event) => {
 	apiSearch(event);
 });

 document.addEventListener('DOMContentLoaded', () => {
	fetch('https://api.themoviedb.org/3/trending/all/day?api_key=bbcb0cb26efaceeec9fcb84d3e4be945&language=ru')
	.then((result) => {
	   return result.json();
   })
	.then((data) => {
		createCards(data);
	})
	.catch((error) => {
		moviesWrap.innerHTML = 'Упс, что-то пошло не так!';
		console.error(error.status + ':' + error.status);
	}); 
 })
