import axios from 'axios'

const api = 'https://api.unsplash.com/photos/random?client_id=4d833d0ba438cf2647969e3295c673f13f8db399ab6c4a288e13a371c201625c&query=landscape,desert,nature,cloud,wallpaper,mountain,lake,sunshine,backgrounds'

export function getWallpaper() {
    return axios.get(api)
        .then(response => {
            return response.data
        })
}
