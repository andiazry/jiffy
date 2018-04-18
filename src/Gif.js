import React, { Component } from 'react';

class Gif extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false
    };
  }

  render() {
    const { loaded } = this.state;
    const { images } = this.props;
    return (
      <video
        // when video loads - class name loaded is added
        className={`grid-item video ${loaded && 'loaded'}`}
        autoPlay
        loop
        src={images.original.mp4}
        // when video is loaded - loaded state turns to true
        onLoadedData={() => this.setState({ loaded: true })}
      />
    );
  }
}

export default Gif;
