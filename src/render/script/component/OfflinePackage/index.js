import React from 'react';

class OfflinePackage extends React.Component {
  constructor(props) {
    console.log(props);
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

  dealMountAndUnmount(data) {
    const [event] = data;
    switch (event) {
      case 'mount':
        this.mount();
        break;
      case 'unmount':
        this.unmount();
        break;
    }
  }

 async mount() {
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
