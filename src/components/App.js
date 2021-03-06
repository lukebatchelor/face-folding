import React from 'react';

import ImageUpload from './ImageUpload';
import ImageResize from './ImageResize';
import ImageFolding from './ImageFolding';
import ImageSaving from './ImageSaving';

const buttonStyles = enabled => ({
  border: '2px solid gray',
  color: 'gray',
  backgroundColor: 'white',
  padding: '8px 10px',
  borderRadius: '8px',
  fontSize: '20px',
  fontWeight: 'bold',
  outline: 'none',
  userSelect: 'none',
  visibility: enabled ? 'visible' : 'hidden',
});

const canvasStyles = curState => ({
  maxWidth: '380px',
  margin: '10px',
  resize: 'both',
  overflow: 'hidden',
  border: curState !== 'IMAGE_SAVING' ? '1px solid grey' : 0,
  borderRadius: curState !== 'IMAGE_SAVING' ? '6px' : 0,
});

export default class App extends React.Component {
  state = {
    backEnabled: false,
    nextEnabled: false,
    loadedImage: null,
    resizedImageData: null,
    foldedImageData: null,
    curState: 'IMAGE_UPLOAD',
  };
  canvasRef = React.createRef();
  // values from the resizing and centering step
  xOffset = 0;
  yOffset = 0;
  zoomLevel = 1;
  // values from the folding step
  topOffset = 0;
  bottomOffset = 0;

  onBackClick = e => {
    if (this.state.curState === 'IMAGE_RESIZE') {
      this.setState({
        curState: 'IMAGE_UPLOAD',
        backEnabled: false,
        nextEnabled: !!this.state.loadedImage,
      });
    }
    if (this.state.curState === 'IMAGE_FOLDING') {
      this.setState({
        curState: 'IMAGE_RESIZE',
        backEnabled: true,
        nextEnabled: true,
      });
    }
    if (this.state.curState === 'IMAGE_SAVING') {
      this.setState({
        curState: 'IMAGE_FOLDING',
        backEnabled: true,
        nextEnabled: true,
      });
    }
  };

  onNextClick = e => {
    if (this.state.curState === 'IMAGE_UPLOAD') {
      this.setState({ curState: 'IMAGE_RESIZE', backEnabled: true });
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
      this.setState({
        curState: 'IMAGE_FOLDING',
        resizedImageData,
        backEnabled: true,
      });
    }
    if (this.state.curState === 'IMAGE_FOLDING') {
      this.setState({
        curState: 'IMAGE_SAVING',
        backEnabled: false,
        nextEnabled: false,
      });
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
  onTopUpdated = newTopOffset => {
    this.topOffset = newTopOffset;
  };
  onBottomUpdated = newBottomOffset => {
    this.bottomOffset = newBottomOffset;
  };

  render() {
    return (
      <>
        {this.state.curState === 'IMAGE_UPLOAD' && (
          <p>To begin, upload an image!</p>
        )}
        {this.state.curState === 'IMAGE_RESIZE' && (
          <p>Now resize and center the face!</p>
        )}
        {this.state.curState === 'IMAGE_FOLDING' && (
          <p>Now fold! (drag from top or bottom)</p>
        )}
        {this.state.curState === 'IMAGE_SAVING' && (
          <p>That's it! Right click or long press to save your image!</p>
        )}
        <canvas
          style={canvasStyles(this.state.curState)}
          height="300"
          ref={this.canvasRef}
        />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-evenly',
            padding: '10px',
            height: '70px',
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
              onTopOffsetUpdated={this.onTopOffsetUpdated}
              onBottomOffsetUpdated={this.onBottomOffsetUpdated}
            />
          )}
          {this.state.curState === 'IMAGE_SAVING' && (
            <ImageSaving canvasRef={this.canvasRef} />
          )}
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '300px',
          }}
        >
          <button
            style={buttonStyles(this.state.backEnabled)}
            disabled={!this.state.backEnabled}
            onClick={this.onBackClick}
          >
            Back
          </button>
          <button
            style={buttonStyles(this.state.nextEnabled)}
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
