import React from 'react';

function getDefaultOffsetsAndZoomLevel({
  imgHeight,
  imgWidth,
  canvasHeight,
  canvasWidth,
}) {
  // If the image is too big, we'll scale it and center it
  const xScaling = imgWidth > canvasWidth ? canvasWidth / imgWidth : 1;
  const yScaling = imgHeight > canvasHeight ? canvasHeight / imgHeight : 1;
  // We want to scale both dimensions evenly, so take the biggest scaling factor
  const maxScaling = Math.min(xScaling, yScaling);
  const newImgWidth = imgWidth * maxScaling;
  const newImgHeight = imgHeight * maxScaling;

  // Now center it using the new sizes
  const xOffset = (canvasWidth - newImgWidth) / 2;
  const yOffset = (canvasHeight - newImgHeight) / 2;

  return {
    xOffset,
    yOffset,
    zoomLevel: maxScaling,
  };
}

export default class ImageResize extends React.Component {
  static defaultProps = {
    canvasRef: null,
    loadedImage: null,
  };

  // We stare these as instance properties rather than on state because we
  // don't need React to re-render at all, all redering is done by us on the canvas
  isDragging = false;
  imgXOffset = 0;
  imgYOffset = 0;
  zoomLevel = 1;
  dragX = 0;
  dragY = 0;

  componentDidMount() {
    const canvas = this.props.canvasRef.current;
    const { height: imgHeight, width: imgWidth } = this.props.loadedImage;
    const { height: canvasHeight, width: canvasWidth } = canvas;
    const { xOffset, yOffset, zoomLevel } = getDefaultOffsetsAndZoomLevel({
      imgHeight,
      imgWidth,
      canvasHeight,
      canvasWidth,
    });
    this.imgXOffset = xOffset;
    this.imgYOffset = yOffset;
    this.zoomLevel = zoomLevel;
    this.updateCanvas();
    // Need to force an update to get the default zoomLevel set on the slider
    this.forceUpdate();

    canvas.addEventListener('mousedown', e => {
      this.isDragging = true;
      this.dragX = e.offsetX;
      this.dragY = e.offsetY;
    });
    canvas.addEventListener('mouseup', e => {
      this.isDragging = false;
    });
    canvas.addEventListener('mouseleave', e => {
      this.isDragging = false;
    });

    canvas.addEventListener('mousemove', e => {
      if (this.isDragging) {
        const newX = e.offsetX;
        const newY = e.offsetY;
        this.imgXOffset -= this.dragX - newX;
        this.imgYOffset -= this.dragY - newY;
        this.dragX = newX;
        this.dragY = newY;
        this.updateCanvas();
      }
    });
    canvas.addEventListener('touchstart', e => {
      e.preventDefault();
      this.isDragging = true;
      this.dragX = e.touches[0].clientX;
      this.dragY = e.touches[0].clientY;
    });
    canvas.addEventListener('touchend', e => {
      e.preventDefault();
      this.isDragging = false;
    });
    canvas.addEventListener('touchmove', e => {
      if (this.isDragging) {
        const newX = e.touches[0].clientX;
        const newY = e.touches[0].clientY;

        this.imgXOffset -= this.dragX - newX;
        this.imgYOffset -= this.dragY - newY;
        this.dragX = newX;
        this.dragY = newY;
        this.updateCanvas();
      }
    });
  }

  updateCanvas = () => {
    if (!this.props.canvasRef) return;
    const { loadedImage, canvasRef } = this.props;
    const ctx = canvasRef.current.getContext('2d');
    const { height: imgHeight, width: imgWidth } = loadedImage;
    const { height: canvasHeight, width: canvasWidth } = canvasRef.current;
    const newImgHeight = imgHeight * this.zoomLevel;
    const newImgWidth = imgWidth * this.zoomLevel;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    ctx.drawImage(
      this.props.loadedImage,
      this.imgXOffset,
      this.imgYOffset,
      newImgWidth,
      newImgHeight
    );
  };

  onZoomChange = e => {
    const newValue = e.target.value;
    this.zoomLevel = newValue;
    this.updateCanvas();
  };

  render() {
    return (
      <input
        type="range"
        onChange={this.onZoomChange}
        min="0"
        max="1"
        defaultValue={this.zoomLevel}
        step="0.01"
      />
    );
  }
}
