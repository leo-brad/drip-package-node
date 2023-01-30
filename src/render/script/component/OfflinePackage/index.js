import React from 'react';

class OfflinePackage extends React.Component {
  constructor(props) {
    super(props);
    const {
      instance,
      share: {
        emitter,
      },
    } = this.props;
    this.dealMountAndUnmount = this.dealMountAndUnmount.bind(this);
    emitter.on(instance, this.dealMountAndUnmount);
  }

  async componentDidMount() {
    const {
      share: {
        emitter,
      },
    } = this.props;
    const { ownDidMount, } = this;
    if (typeof ownDidMount === 'function') {
      await this.ownDidMount();
    }
    this.bind();
    emitter.on('window/focus', this.bind);
    emitter.on('window/blur', this.remove);
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
  }
}

export default OfflinePackage;
