import React from 'react';
import ReactDOM from 'react-dom/client';
import style from './index.module.css';
import renderToNode from '~/render/script/lib/renderToNode';
import RegionListOffline from '~/render/script/component/RegionListOffline';
import Segment from '~/render/script/component/Segment';
import check from '~/render/script/lib/check';

class Node extends RegionListOffline {
  constructor(props) {
    console.log(props);
    super(props);
    const { data, instance, } = this.props;
    const id = new Date().getTime().toString() + instance;
    this.id = id;

    this.state = {
      data,
    };
    this.hasDom = false;
    this.first = true;
    this.hasData = false;
    this.roots = {};
    this.dealEvent = this.dealEvent.bind(this);
    this.updateUi = this.updateUi.bind(this);
    this.checkDom = this.checkDom.bind(this);
  }

  async ownDidMount() {
    const { id, } = this;
    const ul = document.getElementById(id);
    this.ul = ul;

    const { first, } = this;
    if (first) {

      const scrollTop = ul.scrollTop;
      const height = ul.clientHeight;
      const status = {
        first: 0,
        top: scrollTop,
        bottom: scrollTop + height,
        scrollTop: ul.scrollTop,
      };
      this.status = status;

      const { data, } = this.props
      this.setData(data);
      await this.init();
    } else {
      const { ul, innerHTML, } = this;
      if (innerHTML) {
        ul.innerHTML = innerHTML;
        ul.scrollIntoView(this.state.scrollTop);
      }
    }
    this.hasDom = true;
    const { dirty, } = this;
    if (dirty) {
      await this.init();
      this.dirty = false;
    }
  }

  async syncInsert(i, t) {
    const e = this.data[i];
    if (e) {
      const { id, ul, } = this;
      const k = id + i;
      const { field, string, } = e;
      const component = <Segment id={k} key={i} situation={field} string={string} serial={i+1} />;
      const li = renderToNode(<li id={k} key={i} />);
      if (document.getElementById(k) === null) {
        switch (t) {
          case 'd':
            ul.append(li);
            break;
          case 'u':
            ul.prepend(li);
            break;
        }
        this.renderElement(li, component, id);
        await check(() => this.checkDom(k));
      }
    }
  }

  dealEvent(data) {
    const {
      share: {
        focus,
      },
    } = this.props;
    if (focus) {
      const [event] = data;
      switch (event) {
        case 'content/update':
          this.updateUi();
          break;
        default:
          break;
      }
    }
  }

  async updateUi() {
    const { data, } = this.props;
    this.setData(data);
    const { hasDom, } = this;
    if (!hasDom) {
      this.dirty = true;
    } else {
      await this.init();
    }
  }

  setData(data) {
    if (data.length !== 0) {
      const { hasData, } = this;
      if (!hasData) {
        this.data = data;
        this.hasData = true;
      }
    }
    const { hasDom, } = this;
    if (!hasDom) {
      this.dirty = true;
    }
  }

  async init() {
    const { first, hasDom, } = this;
    if (first) {
      if (hasDom) {
        await this.initLast();
        this.bindEvent();
        this.first = false;
      } else {
        this.dirty = true;
      }
    }
    await this.updateView('d');
    await this.updateView('u');
  }

  bind() {
    const {
      instance,
      share: {
        emitter,
      },
    } = this.props;
    emitter.on(instance, this.dealEvent);
  }

  remove() {
    const {
      instance,
      share: {
        emitter,
      },
    } = this.props;
    emitter.remove(instance, this.dealEvent);
    this.removeEvent();
  }

  renderElement(container, component, id) {
    if (container) {
      const { roots, } = this;
      let root;
      if (roots[id] === undefined) {
        root = ReactDOM.createRoot(container);
      } else {
        root = roots[id];
      }
      root.render(component);
    }
  }

  checkDom(key) {
    let ans = false;
    if (document.getElementById(key) !== null) {
      const dom = document.getElementById(key);
      if (dom) {
        ans = true;
      }
    }
    return ans;
  }

  ownWillUnmount() {
    const { first, } = this;
    if (!first) {
      const { ul, } = this;
      if (ul) {
        this.innerHTML = ul.innerHTML;
      }
    }
    this.hasDom = false;
  }

  render() {
    const { id, } = this;
    return(
      <ul id={id} className={style.nodes} />
    );
  }
}

export default Node;
