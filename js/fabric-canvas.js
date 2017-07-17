this.__canvases = [];
fabric.Object.prototype.originX = fabric.Object.prototype.originY = 'center';
fabric.Object.prototype.borderColor = '#59bfe5';
fabric.Object.prototype.borderScaleFactor = 2;
fabric.Object.prototype.borderDashArray = [3, 3];
fabric.Object.prototype.hasRotatingPoint = true;
fabric.Object.prototype.rotatingPointOffset = 0;
fabric.Object.prototype.cornerSize = 20;

fabric.Object.prototype.setControlsVisibility( {
   // ml: false,
   // mr: false,
   // 'mt': false,
   'mtr': false
   // mb: false
});

// using customizing lib

fabric.Canvas.prototype.customiseControls( {
    tl: {
        action: 'remove',
        cursor: 'pointer'
    },
    tr: {
        action: 'rotate',
        cursor: 'pointer'
    },
    bl: {
        action: 'scale',
        cursor: 'ne-resize'
    },
    br: {
        action: 'scale',
        cursor: 'se-resize'
    }
} );

// basic settings
fabric.Object.prototype.customiseCornerIcons( {
    settings: {
        borderColor: '#0094dd',
        // borderColor: 'transparent',
        cornerSize: 30,
        cornerShape: 'rect',
        cornerBackgroundColor: 'transparent',
        cornerPadding: 0
    },
    tl: {
        icon: 'image/close.svg'
    },
    bl: {
        icon: 'image/scale1.svg'
    },
    br: {
        icon: 'image/scale.svg'
    },
    tr: {
        icon: 'image/rotate1.svg'
    }
} );

// fabric.Object.prototype.cornerStyle 		= 'circle';
// fabric.Object.prototype.strokeDashArray 	= [3, 3];
var canvas = new fabric.Canvas('myCanvas',{ preserveObjectStacking: true });

// canvas.add(new fabric.Circle({ radius: 50, fill: '#f55', top: 300, left: 600, }));
// canvas.add(new fabric.Circle({ radius: 40, fill: '#cde', top: 100, left: 100, }));

canvas.selectionColor = 'rgba(221, 200, 200, 0.3)';
canvas.selectionBorderColor = 'gray';
canvas.selectionLineWidth = 1;

this.__canvases.push(canvas);
