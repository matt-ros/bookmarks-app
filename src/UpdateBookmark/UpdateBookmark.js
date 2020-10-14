import React, { Component } from  'react';
import BookmarksContext from '../BookmarksContext';
import config from '../config'
import './UpdateBookmark.css';

const Required = () => (
  <span className='UpdateBookmark__required'>*</span>
)

class UpdateBookmark extends Component {
  static contextType = BookmarksContext;

  state = {
    error: null,
    bookmark: {}
  };

  handleSubmit = e => {
    e.preventDefault()
    // get the form fields from the event
    const { title, url, description, rating } = this.state
    if (!title && !url && !description && !rating) {
      return this.setState({
        error: {
          message: `You must update at least one of 'Title', 'URL', 'Description', or 'Rating'.`
        }
      })
    }
    if (!url.match(new RegExp(/^https?:\/\//))) {
      return this.setState({
        error: {
          message: `URL must begin with http(s)://`
        }
      })
    }
    const bookmark = { title, url, description, rating }
      
    this.setState({ error: null })
    fetch(`${config.API_ENDPOINT}/${this.props.match.params.id}`, {
      method: 'PATCH',
      body: JSON.stringify(bookmark),
      headers: {
        'content-type': 'application/json',
        'authorization': `bearer ${config.API_KEY}`
      }
    })
      .then(res => {
        if (!res.ok) {
          // get the error message from the response,
          return res.json().then(resJson => {
            // then throw it
            throw new Error(resJson.error.message)
          })
        }
        return res
      })
      .then(data => {
        bookmark.id = this.state.bookmark.id
        this.context.updateBookmark(bookmark)
        this.props.history.push('/')
      })
      .catch(error => {
        this.setState({ error })
      })
  }

  handleClickCancel = () => {
    this.props.history.push('/')
  }

  handleChangeTitle = (e) => {
    this.setState({ title: e.target.value })
  }

  handleChangeUrl = (e) => {
    this.setState({ url: e.target.value })
  }

  handleChangeDescription = (e) => {
    this.setState({
      description: e.target.value,
      bookmark: {
        ...this.state.bookmark,
        description: e.target.value
      }
    })
  }

  handleChangeRating = (e) => {
    this.setState({ rating: e.target.value })
  }

  componentDidMount() {
    const bookmarkId = this.props.match.params.id;
    fetch(`${config.API_ENDPOINT}/${bookmarkId}`, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${config.API_KEY}`
      }
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(res.status)
        }
        return res.json()
      })
      .then(bookmark => {
        this.setState({ bookmark })
      })
      .catch(error => {
        this.setState({ error })
      })
  }

  render() {
    const { error, bookmark } = this.state
    return (
      <section className='UpdateBookmark'>
        <h2>Update a bookmark</h2>
        <form
          className='UpdateBookmark__form'
          onSubmit={this.handleSubmit}
        >
          <div className='UpdateBookmark__error' role='alert'>
            {error && <p>{error.message}</p>}
          </div>
          <div>
            <label htmlFor='title'>
              Title
              {' '}
              <Required />
            </label>
            <input
              type='text'
              name='title'
              id='title'
              placeholder='Great website!'
              defaultValue={bookmark.title}
              onChange={this.handleChangeTitle}
              required
            />
          </div>
          <div>
            <label htmlFor='url'>
              URL
              {' '}
              <Required />
            </label>
            <input
              type='url'
              name='url'
              id='url'
              placeholder='https://www.great-website.com/'
              defaultValue={bookmark.url}
              onChange={this.handleChangeUrl}
              required
            />
          </div>
          <div>
            <label htmlFor='description'>
              Description
            </label>
            <textarea
              name='description'
              id='description'
              value={this.state.bookmark.description}
              onChange={this.handleChangeDescription}
            />
          </div>
          <div>
            <label htmlFor='rating'>
              Rating
              {' '}
              <Required />
            </label>
            <input
              type='number'
              name='rating'
              id='rating'
              defaultValue={bookmark.rating}
              onChange={this.handleChangeRating}
              min='1'
              max='5'
              required
            />
          </div>
          <div className='UpdateBookmark__buttons'>
            <button type='button' onClick={this.handleClickCancel}>
              Cancel
            </button>
            {' '}
            <button type='submit'>
              Save
            </button>
          </div>
        </form>
      </section>
    );
  }
}

export default UpdateBookmark;
