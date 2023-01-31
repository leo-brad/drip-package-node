import React from 'react';

class OfflineResize extends React.Component {
  constructor(props) {
    super(props);
    this.resize = this.resize.bind(this);
  }

  async componentDidMount() {
    const {
      share: {
        emitter,
      },
      instance,
    } = this.props;
    const { ownDidMount, } = this;
    if (typeof ownDidMount === 'function') {
      await this.ownDidMount();
    }
    this.bind();
    emitter.on('window/focus', this.bind);
    emitter.on('window/blur', this.remove);
    emitter.on('window/resize', this.resize);
  }

  dealMountAndUnmount(data) {
    const [event] = data;
    switch (event) {
      case 'unmount':
        this.unmount();
        break;
    }
  }

  async unmount() {
    const {
      share: {
        emitter,
      },
    } = this.props;
    const { ownWillUnmount, } = this;
    if (typeof ownWillUnmount === 'function') {
      await this.ownWillUnmount();
    }
    this.remove();
    emitter.remove('window/focus', this.bind);
    emitter.remove('window/blur', this.remove);
    emitter.remove('window/resize', this.resize);
  }
}

export default OfflineResize;
