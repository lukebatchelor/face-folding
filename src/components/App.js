import React from 'react';

import ImageUpload from './ImageUpload';
import ImageResize from './ImageResize';
import ImageFolding from './ImageFolding';

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
    resizedImageData: null,
    curState: 'IMAGE_UPLOAD',
  };
  canvasRef = React.createRef();
  xOffset = 0;
  yOffset = 0;
  zoomLevel = 1;

  onBackClick = () => {
    if (this.state.curState === 'IMAGE_RESIZE') {
      this.setState({ curState: 'IMAGE_UPLOAD' });
    }
    if (this.state.curState === 'IMAGE_FOLDING') {
      this.setState({ curState: 'IMAGE_RESIZE' });
    }
  };

  onNextClick = () => {
    if (this.state.curState === 'IMAGE_UPLOAD') {
      this.setState({ curState: 'IMAGE_RESIZE' });
    }
    if (this.state.curState === 'IMAGE_RESIZE') {
      const canvas = this.canvasRef.current;
      const ctx = canvas.getContext('2d');
      const { height: imgHeight, width: imgWidth } = this.state.loadedImage;
      const { height: canvasHeight, width: canvasWidth } = canvas;
      const newImgHeight = imgHeight * this.zoomLevel;
      const newImgWidth = imgWidth * this.zoomLevel;

      // Now we only want to get the image data for the parts of the image that
      // are visible in the canvas, so we clamp our values to those edges
      const resizedImageData = ctx.getImageData(
        Math.max(this.xOffset, 0),
        Math.max(this.yOffset, 0),
        Math.min(newImgWidth + this.xOffset, canvasWidth),
        Math.min(newImgHeight + this.yOffset, canvasHeight)
      );
      this.setState({ curState: 'IMAGE_FOLDING', resizedImageData });
    }
  };

  onFileLoaded = e => {
    const img = new Image();
    img.onload = () => {
      this.setState({ loadedImage: img, nextEnabled: true });
    };
    img.src = e.target.result;
  };

  onZoomUpdated = newZoom => {
    this.zoomLevel = newZoom;
  };

  onOffsetUpdated = ({ xOffset, yOffset }) => {
    this.xOffset = xOffset;
    this.yOffset = yOffset;
  };

  render() {
    console.log('Root render', this.zoomLevel, this.xOffset, this.yOffset);
    return (
      <>
        {this.state.curState === 'IMAGE_UPLOAD' && (
          <>
            <p>This is a super simple face folding app!</p>
            <p>To begin, upload an image!</p>
          </>
        )}
        {this.state.curState === 'IMAGE_RESIZE' && (
          <p>
            Now resize the image so that the face you want to fold is big and
            centered
          </p>
        )}
        {this.state.curState === 'IMAGE_FOLDING' && (
          <p>Now drag the two pieces together however you'd like</p>
        )}
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
              onZoomUpdated={this.onZoomUpdated}
              onOffsetUpdated={this.onOffsetUpdated}
            />
          )}
          {this.state.curState === 'IMAGE_FOLDING' && (
            <ImageFolding
              canvasRef={this.canvasRef}
              resizedImageData={this.state.resizedImageData}
              zoomLevel={this.zoomLevel}
              imgXOffset={this.xOffset}
              imgYOffset={this.yOffset}
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
