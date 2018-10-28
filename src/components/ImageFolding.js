import React from 'react';

const buttonStyles = {
  border: '2px solid gray',
  color: 'gray',
  backgroundColor: 'white',
  padding: '8px 10px',
  borderRadius: '8px',
  fontSize: '20px',
  fontWeight: 'bold',
};

export default class ImageFolding extends React.Component {
  static defaultProps = {
    canvasRef: null,
    resizedImageData: null,
  };

  // We stare these as instance properties rather than on state because we
  // don't need React to re-render at all, all redering is done by us on the canvas
  isDragging = false;
  draggingTop = false; // we're either moving the top or the bottom half
  topOffset = 0;
  bottomOffset = 0;
  dragX = 0;
  dragY = 0;

  componentDidMount() {
    this.updateCanvas();
    const canvas = this.props.canvasRef.current;

    canvas.addEventListener('mousedown', this.startDrag);
    canvas.addEventListener('mousemove', this.updateDrag);
    canvas.addEventListener('mouseup', this.endDrag);
    canvas.addEventListener('mouseleave', this.endDrag);
    canvas.addEventListener('touchstart', this.startDrag);
    canvas.addEventListener('touchend', this.endDrag);
    canvas.addEventListener('touchmove', this.updateDrag);
  }

  updateCanvas = () => {
    if (!this.props.canvasRef) return;
    const { resizedImageData, canvasRef } = this.props;
    const ctx = canvasRef.current.getContext('2d');
    const { height: imgHeight, width: imgWidth } = resizedImageData;
    const { height: canvasHeight, width: canvasWidth } = canvasRef.current;
    const verticalCenteringOffset = (canvasHeight - imgHeight) / 2;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Now we need to draw the image in two halves, top and bottom, being careful to
    // // cut them off in the middle. Start with the top:
    ctx.putImageData(
      resizedImageData,
      0,
      this.topOffset + verticalCenteringOffset * 2,
      0,
      0,
      imgWidth,
      // Need to round this up because on mobile, we're getting a rounded offsetTop >:(
      Math.ceil(imgHeight / 2 - this.topOffset - verticalCenteringOffset)
    );
    // Now the bottom
    const ySrcOffset =
      imgHeight / 2 + this.bottomOffset - verticalCenteringOffset;
    ctx.putImageData(
      resizedImageData,
      0,
      canvasHeight / 2 - ySrcOffset,
      0,
      ySrcOffset,
      imgWidth,
      imgHeight
    );

    // Draw dividing line
    // ctx.beginPath();
    // ctx.moveTo(0, canvasHeight / 2);
    // ctx.lineTo(canvasWidth, canvasHeight / 2);
    // ctx.strokeStyle = '#ff0000';
    // ctx.stroke();
  };

  startDrag = e => {
    this.isDragging = true;
    const canvas = this.props.canvasRef.current;
    let startY = e.offsetY;

    if (e.touches) {
      e.preventDefault();
      startY = e.touches[0].clientY - e.touches[0].target.offsetTop;
    }
    this.draggingTop = startY < canvas.height / 2;
    this.dragY = startY;
  };

  updateDrag = e => {
    if (this.isDragging) {
      let newY = e.offsetY;
      if (e.touches) {
        newY = e.touches[0].clientY - e.touches[0].target.offsetTop;
      }
      if (this.draggingTop) {
        this.topOffset -= this.dragY - newY;
      } else {
        this.bottomOffset += this.dragY - newY;
      }

      this.dragY = newY;
      this.updateCanvas();
    }
  };

  endDrag = e => {
    if (e.touches) {
      e.preventDefault();
    }
    this.isDragging = false;
  };

  render() {
    return <button style={{ ...buttonStyles, margin: '0 10px' }}>Done</button>;
  }
}
