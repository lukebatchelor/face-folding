import React from 'react';

const buttonStyles = {
  border: '2px solid gray',
  color: 'gray',
  backgroundColor: 'white',
  padding: '8px 10px',
  borderRadius: '8px',
  fontSize: '20px',
  fontWeight: 'bold',
  outline: 'none',
  userSelect: 'none',
};

export default class ImageSaving extends React.Component {
  static defaultProps = {
    canvasRef: null,
    onFinalCanvasHeightCalculated: () => {},
  };
  anchorRef = React.createRef();

  onDownload = () => {
    const canvas = this.props.canvasRef.current;
    const ctx = canvas.getContext('2d');
    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    // Now we need to find how many pixels from the top and bottom are transparent
    // so we can resize the canvas
    let topTransparent, bottomTransparent;
    // Pixels are just a giant array or RGBA values, all in a row, we can move pixel by pixel by moving 4 values along
    // But we want to move down a column, so we need to move 4 * number of pixels in a row
    for (let i = 0; i < canvas.height; i += 1) {
      if (pixels[i * (canvas.width * 4) + 3] !== 0) {
        topTransparent = i;
        break;
      }
    }
    // Now do the same starting from the last pixel
    for (let i = canvas.height; i > 0; i -= 1) {
      if (pixels[i * (canvas.width * 4) + 3] !== 0) {
        bottomTransparent = i;
      }
    }
    const trimmedImageData = ctx.getImageData(
      0,
      topTransparent,
      canvas.width,
      canvas.height - topTransparent - bottomTransparent
    );

    const newCanvas = document.createElement('canvas');
    newCanvas.width = canvas.width;
    newCanvas.height = canvas.height - topTransparent - bottomTransparent;
    const newCtx = newCanvas.getContext('2d');
    newCtx.putImageData(trimmedImageData, 0, 0);
    const downloadableDataURL = newCanvas
      .toDataURL()
      .replace('image/png', 'image/octet-stream');
    const anchor = this.anchorRef.current;
    anchor.href = downloadableDataURL;
    anchor.download = 'facefold.png';
    anchor.click();
  };

  render() {
    return (
      <>
        <a ref={this.anchorRef} />
        <button style={buttonStyles} onClick={this.onDownload}>
          Download
        </button>
      </>
    );
  }
}
