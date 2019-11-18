const city = document.getElementById('city')
const weatherIcon = document.getElementById('weatherIcon')
const country = document.getElementById('country')
const main = document.getElementById('main')
const description = document.getElementById('description')
const temp = document.getElementById('temp')
const pressure = document.getElementById('pressure')
const humidity = document.getElementById('humidity')
const cityInput = document.getElementById('cityInput')
const history_container = document.getElementById('history_container')
const card = document.getElementById('card')


const API_keys = '27e5c8a53aacc1aac2424df2b262f9a0'
const BASE_URL = `https://api.openweathermap.org/data/2.5/weather?appid=${API_keys}`
const ICON_URL = `http://openweathermap.org/img/wn/`
const DEFUALT_CITY = 'tallinn,estonia'

window.onload = function() {
    navigator.geolocation.getCurrentPosition(s => {
        getWeatherData(null, s.coords)
    }, e => {
        getWeatherData()
    })

    axios.get('/api/history')
        .then(({ data }) => {
            if (data.length > 0) {
                updateHistory(data)
            } else {
                history_container.innerHTML = "There is no history"
            }

        }).catch(e => {
            console.log(e)
            //alert('Error Occured')
        })

    cityInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            if (e.target.value) {
                getWeatherData(e.target.value, null, weather => {
                    e.target.value = ''
                    axios.post('/api/history', weather)
                        .then(({ data }) => updateHistory(data))
                        .catch(e => {
                            console.loe(e)
                            alert('Error Occured ..!!')
                        })
                })

            }
        }
    })
}

let getWeatherData = function(city = DEFUALT_CITY, coords, cb) {
    let url = BASE_URL

    city === null ?
        url = `${url}&lat=${coords.latitude}&lon=${coords.longitude}` :
        url = `${url}&q=${city}`

    axios.get(url)
        .then(({ data }) => {
            //console.log(data)
            let weather = {
                icon: data.weather[0].icon,
                name: data.name,
                country: data.sys.country,
                main: data.weather[0].main,
                description: data.weather[0].description,
                temp: data.main.temp,
                pressure: data.main.pressure,
                humidity: data.main.humidity

            }

            setWeather(weather)
            if (cb) cb(weather)
        }).catch(e => {
            //console.log(e)
            alert('City Not found !!..')
        })


}

let setWeather = function(weather) {
    weatherIcon.src = `${ICON_URL}${weather.icon}.png`
    city.innerHTML = weather.name
    country.innerHTML = weather.country
    main.innerHTML = weather.main
    description.innerHTML = weather.description
    temp.innerHTML = weather.temp
    pressure.innerHTML = weather.pressure
    humidity.innerHTML = weather.humidity


}

let updateHistory = (history) => {
    history_container.innerHTML = ''

    history = history.reverse()
    history.forEach(h => {
        let tempHist = card.cloneNode(true)
        tempHist.id = ''
        tempHist.getElementsByClassName('weatherIcon')[0].src = `${ICON_URL}${h.icon}.png`
        tempHist.getElementsByClassName('city')[0].innerHTML = h.name
        tempHist.getElementsByClassName('country')[0].innerHTML = h.country
        tempHist.getElementsByClassName('main')[0].innerHTML = h.main
        tempHist.getElementsByClassName('description')[0].innerHTML = h.description
        tempHist.getElementsByClassName('temp')[0].innerHTML = h.temp
        tempHist.getElementsByClassName('pressure')[0].innerHTML = h.pressure
        tempHist.getElementsByClassName('humidity')[0].innerHTML = h.humidity

        history_container.appendChild(tempHist)
    })
}