import React, { Component } from 'react'
import { API_URL, API_KEY } from '../../config'
import Navigation from '../elements/Navigation/Navigation'
import FourColGrid from '../elements/FourColGrid/FourColGrid'
import MovieInfo from '../elements/MovieInfo/MovieInfo'
import MovieInfoBar from '../elements/MovieInfoBar/MovieInfoBar'
import Actor from '../elements/Actor/Actor'
import Spinner from '../elements/Spinner/Spinner'
import './Movie.css'

class Movie extends Component {
  state = {
    movie: null,
    actors: null,
    directors: [],
    loading: false
  }

  componentDidMount() {
    this.setState({ loading: true })
    // First fetch the movie data 
    const endpoint = `${API_URL}movie/${this.props.match.params.movieId}?api_key=${API_KEY}&language=en-US`
    this.fetchItems(endpoint)
  }

  fetchItems = (endpoint) => {
    fetch(endpoint)
    .then(result => result.json())
    .then(result => {
// If status code exists that means we haven't got any movie data to display
      if(result.status_code) {
        this.setState ({ loading: false })
      } else {
        this.setState({ movie: result }, () => {
// ... then fetch actors in the setState callback function
          const endpoint = `${API_URL}movie/${this.props.match.params.movieId}/credits?api_key=${API_KEY}`
          fetch(endpoint)
          .then(result => result.json())
          .then(result => {
            const directors = result.crew.filter( (member) => member.job === 'Director')

            this.setState({ 
              actors: result.cast,
              directors: directors,
              loading: false
            })
          })
        })
      }

    })
    .catch(error => console.error('Error:', error))
  }

  render() {
    return (
      <div className='rmdb-movie'>
        <Navigation />
        <MovieInfo />
        <MovieInfoBar />
        <FourColGrid />
        <Spinner />
      </div>
    )
  }
}

export default Movie
