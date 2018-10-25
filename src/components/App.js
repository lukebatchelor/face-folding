import React from 'react';

import ImageUpload from './ImageUpload';
import ImageResize from './ImageResize';

const buttonStyles = {
  border: '2px solid gray',
  color: 'gray',
  backgroundColor: 'white',
  padding: '8px 10px',
  borderRadius: '8px',
  fontSize: '20px',
  fontWeight: 'bold',
};

export default class App extends React.Component {
  state = {
    backEnabled: true,
    nextEnabled: true,
    loadedImage: null,
    curState: 'IMAGE_UPLOAD',
  };
  canvasRef = React.createRef();

  onBackClick = () => {
    if (this.state.curState === 'IMAGE_RESIZE') {
      this.setState({ curState: 'IMAGE_UPLOAD' });
    }
  };

  onNextClick = () => {
    if (this.state.curState === 'IMAGE_UPLOAD') {
      this.setState({ curState: 'IMAGE_RESIZE' });
    }
  };

  onFileLoaded = e => {
    const img = new Image();
    img.onload = () => {
      this.setState({ loadedImage: img, nextEnabled: true });
    };
    img.src = e.target.result;
  };

  render() {
    return (
      <>
        <canvas
          style={{
            border: '1px solid grey',
            maxWidth: '380px',
            margin: '10px',
            resize: 'both',
            overflow: 'hidden',
          }}
          height="300"
          ref={this.canvasRef}
        />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-evenly',
            padding: '10px',
          }}
        >
          {this.state.curState === 'IMAGE_UPLOAD' && (
            <ImageUpload
              canvasRef={this.canvasRef}
              onFileLoaded={this.onFileLoaded}
              loadedImage={this.state.loadedImage}
            />
          )}
          {this.state.curState === 'IMAGE_RESIZE' && (
            <ImageResize
              canvasRef={this.canvasRef}
              loadedImage={this.state.loadedImage}
            />
          )}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button
            style={buttonStyles}
            disabled={!this.state.backEnabled}
            onClick={this.onBackClick}
          >
            Back
          </button>
          <button
            style={buttonStyles}
            disabled={!this.state.nextEnabled}
            onClick={this.onNextClick}
          >
            Next
          </button>
        </div>
      </>
    );
  }
}
