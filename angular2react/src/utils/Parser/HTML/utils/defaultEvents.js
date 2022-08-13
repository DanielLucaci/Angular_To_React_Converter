const defaultEvents = {
    // Mouse Events
    'click': 'onClick',
    'dblclick': 'onDoubleClick',
    'mouseover': 'onMouseOver',
    'mouseout': 'onMouseOut',

    // Touch Events
    'touchstart': 'onTouchStart',
    'touchmove': 'onTouchMove',
    'touchend': 'onTouchEnd',
    'touchcancel': 'onTouchCancel',

    // Keyboard Events
    'keydown': 'onKeyDown',
    'keypress': 'onKeyPress',
    'keyup': 'onKeyUp',

    // Form Events
    'focus': 'onFocus', 
    'blur': 'onBlur', 
    'change': 'onChange', 
    'submit': 'onSubmit'
};

export default defaultEvents;