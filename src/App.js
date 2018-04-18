import React, { Component } from 'react';
import loader from './images/loader.svg';
import clearButton from './images/close-icon.svg';
import Gif from './Gif.js';

const randomChoice = arr => {
  const randIndex = Math.floor(Math.random() * arr.length);
  return arr[randIndex];
};

const Header = ({ clearSearch, hasResults }) => (
  <div className="header grid">
    {hasResults ? (
      <button onClick={clearSearch}>
        <img src={clearButton} />
      </button>
    ) : (
      <h1 className="title">Jiffy</h1>
    )}
  </div>
);

const UserHint = ({ loading, hintText }) => (
  <div className="user-hint">
    {loading ? <img className="block mx-auto" src={loader} /> : hintText}
  </div>
);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      searchTerm: '',
      hintText: '',
      gif: null,
      gifs: []
    };
  }

  searchGiphy = async searchTerm => {
    this.setState({
      loading: true
    });

    try {
      const response = await fetch(
        `https://api.giphy.com/v1/gifs/search?api_key=EfoX3Vwk7mlE0AEro9rXiCptJkaOudvL&q=${searchTerm}&limit=50&offset=0&rating=R&lang=en`
      );

      const { data } = await response.json();

      //check if array is empty - if it is throw error and stop code
      if (!data.length) {
        throw `Nothing found for ${searchTerm}`;
      }

      //random choice data
      const randomGif = randomChoice(data);

      this.setState((prevState, props) => ({
        ...prevState,
        gif: randomGif,
        //spread previous gifs into array
        gifs: [...prevState.gifs, randomGif],
        loading: false,
        hintText: `Hit Enter to see more ${searchTerm}`
      }));
    } catch (error) {
      this.setState((prevState, props) => ({
        ...prevState,
        hintText: error,
        loading: false
      }));
      console.log(error);
    }
  };

  handleChange = event => {
    const { value } = event.target;
    this.setState((prevState, props) => ({
      // take old props and spread them out and overwrite with current search value
      ...prevState,
      searchTerm: value,
      hintText: value.length > 2 ? `Hit Enter to search ${value}` : ''
    }));
  };

  handleKeyPress = event => {
    const { value } = event.target;
    //when we have 3 or more characters and press enter - run search
    if (value.length > 2 && event.key === 'Enter') {
      //call Giphy search function
      this.searchGiphy(value);
    }
  };

  //clears search array and back to default state
  clearSearch = () => {
    this.setState((prevState, props) => ({
      ...prevState,
      searchTerm: '',
      hintText: '',
      gifs: []
    }));

    //re-focus cursor on input
    this.textInput.focus();
  };

  render() {
    const { searchTerm, gifs } = this.state;
    const hasResults = gifs.length;
    return (
      <div className="page">
        <Header clearSearch={this.clearSearch} hasResults={hasResults} />

        <div className="search grid">
          {/* create multiple videos from array */}
          {this.state.gifs.map(gif => <Gif {...gif} />)}

          <input
            className="input grid-item"
            placeholder="Type Something"
            onChange={this.handleChange}
            onKeyPress={this.handleKeyPress}
            value={searchTerm}
            ref={input => {
              this.textInput = input;
            }}
          />
        </div>
        {/* pass userhint with spread */}
        <UserHint {...this.state} />
      </div>
    );
  }
}

export default App;
