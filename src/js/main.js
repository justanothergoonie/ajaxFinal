console.log('hello');
class Main {
	currentPlaces = [];
	currentPokemonType = '';
	p = new Pokedex.Pokedex();
	constructor() {
		this.setupEventListeners();
	}
	setupEventListeners() {
		const buttonEl = document.querySelector('[name="search"]');
		buttonEl.addEventListener('click', this.handleSearch);
		const bodyEl = document.querySelector('body');
		bodyEl.addEventListener('got-geocode', this.handleGotGeocode);
		bodyEl.addEventListener('got-places', this.handleGotPlaces);
		bodyEl.addEventListener('got-weather', this.handleWeather);
		bodyEl.addEventListener('got-error', this.handleSearchError);
	}

	handleGotGeocode = (event) => {
		console.log('handleGotGeocode', this.currentLocation, event.detail);
		this.currentLocation = new google.maps.LatLng(
			event.detail.lat,
			event.detail.lng
		);
	};

	searchPlacesByType = () => {
		console.log('searchPlacesByType', this.currentPokemonType);
		let type = 'normal';
		if (
			this.currentPokemonType === 'grass' ||
			this.currentPokemonType === 'bug'
		) {
			const types = ['park', 'campground', 'florist'];
			const index = Math.floor(Math.random() * types.length);
			console.log(index);
			type = types[index];
		} else if (this.currentPokemonType === 'water') {
			const types = ['fire_station', 'aquarium'];
			const index = Math.floor(Math.random() * types.length);
			console.log(index);
			type = types[index];
		} else if (this.currentPokemonType === 'ground') {
			type = 'campground';
		} else if (this.currentPokemonType === 'electric') {
			const types = ['electrician', 'electronics_store'];
			const index = Math.floor(Math.random() * types.length);
			console.log(index);
			type = types[index];
		} else if (this.currentPokemonType === 'fairy') {
			type = 'beauty_salon';
		} else if (this.currentPokemonType === 'dragon') {
			type = 'amusement_park';
		} else if (
			this.currentPokemonType === 'dark' ||
			this.currentPokemonType === 'ghost'
		) {
			const types = ['funeral_home', 'cemetery'];
			const index = Math.floor(Math.random() * types.length);
			console.log(index);
			type = types[index];
		} else if (
			this.currentPokemonType === 'steel' ||
			this.currentPokemonType == 'flying'
		) {
			type = 'airport';
		} else if (this.currentPokemonType === 'psychic') {
			type = 'university';
		} else if (this.currentPokemonType === 'poison') {
			type = 'bar';
		} else if (this.currentPokemonType === 'fighting') {
			type = 'gym';
		}
	};

	handleGotPlaces = (event) => {
		this.currentPlaces = event.detail;
		console.log('handleGotPlaces', this.currentPlaces);
		const pokePlaces = this.currentPlaces.map((place) => {
			const pokeMarkerLocation = {
				lat: place.geometry.location.lat(),
				lng: place.geometry.location.lng(),
			};

			return {
				marker: pokeMarkerLocation,
				icon: null,
				infoWindowContent: null,
				name: null,
				type: null,
			};
		});
		const pokeEvent = new CustomEvent('place-markers', {
			detail: pokePlaces,
		});
		document.querySelector('body').dispatchEvent(pokeEvent);
	};

	handleSearch = (event) => {
		event.preventDefault();

		const locationEl = document.querySelector('[name="location"]');
		const locationTerm = locationEl.value;

		const pokemonEl = document.querySelector('[name="pokemon"]');
		const pokemonTerm = pokemonEl.value;

		console.log('searching..', locationTerm, pokemonTerm);

		this.p.getPokemonByName(pokemonTerm.toLowerCase()).then((response) => {
			this.currentPokemonType = response.types[0].type.name;
			console.log(this.currentPokemonType);
			document.body.addEventListener(
				'got-geocode',
				() => {
					console.log('google got the city');
					this.searchPlacesByType();
				},
				{ once: true }
			);
			const evt = new CustomEvent('get-geocode', {
				detail: locationTerm,
			});
			document.querySelector('body').dispatchEvent(evt); // google replies with a got-geocode event on body
		});

		const api = new WeatherApi();
		api.weatherSearch(locationTerm);
	};

	handleWeather = (event) => {
		const results = event.detail;
		console.log('showing results from map', results);
	};
}
new Main();
