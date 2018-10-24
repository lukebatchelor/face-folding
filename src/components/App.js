import React from 'react';

// import '../../vendor/croppie.min.js';

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
    backEnabled: false,
    nextEnabled: false,
    loadedImage: null,
    curState: 'IMAGE_UPLOAD',
  };
  canvasRef = React.createRef();

  onBackClick = () => {
    alert('back');
  };

  onNextClick = () => {
    alert('next');
  };

  onFileChange = e => {
    const files = e.target.files;
    if (files.length !== 1) {
      console.error('Expected exactly 1 file');
      return;
    }
    if (!files[0].type.startsWith('image/')) {
      console.error('Expected an image');
      return;
    }
    const image = files[0];
    const fileReader = new FileReader();
    fileReader.onload = this.onFileLoaded;
    fileReader.readAsDataURL(image);
  };

  onFileLoaded = e => {
    const img = new Image();
    img.onload = () => {
      this.setState({ loadedImage: img }, this.updateCanvas);
    };
    img.src = e.target.result;
  };

  updateCanvas = () => {
    const ctx = this.canvasRef.current.getContext('2d');
    console.log(ctx, this.state.loadedImage);
    ctx.drawImage(this.state.loadedImage, 0, 0);
    console.log('done');
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
            <div
              style={{
                position: 'relative',
                overflow: 'hidden',
                display: 'inline-block',
              }}
            >
              <button style={{ ...buttonStyles, margin: '0 10px' }}>
                Upload a file
              </button>
              <input
                type="file"
                id="imageFile"
                style={{
                  fontSize: '100px',
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  opacity: 0,
                }}
                onChange={this.onFileChange}
              />
            </div>
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
