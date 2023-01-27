import React from 'react';
import OfflinePackage from '~/render/script/component/OfflinePackage';
import renderToNode from '~/render/script/lib/renderToNode';

class RegionListOffline extends OfflinePackage {
  constructor(props) {
    super(props);
    this.data = [];

    const id = new Date().getTime().toString();
    this.id = id;

    this.doms = [];
    this.heights = [];
    this.dealScroll = this.dealScroll.bind(this);
  }

  componentDidMount() {
    const { id, } = this;

    const ul = document.getElementById(id);
    this.ul = ul;

    const scrollTop = ul.scrollTop;
    const height = ul.clientHeight;
    const status = {
      first: 0,
      top: scrollTop,
      bottom: scrollTop + height,
      scrollTop: ul.scrollTop,
    };
    this.status = status;
  }

  async dealScroll(e) {
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, 1000 / 29);
    });
    const {
      status: {
        scrollTop,
      },
      id,
      ul,
    } = this;
    if (ul.scrollTop > scrollTop) {
      await this.updateView('d');
      if (this.status.first >= 0) {
        await this.syncRemove('d');
      }
    } else if (ul.scrollTop < scrollTop) {
      const {
        status: {
          last,
        }
      } = this;
      await this.updateView('u');
      //if (last < this.data.length) {
        //await this.syncRemove('u');
      //}
    }
    this.status.scrollTop = ul.scrollTop;
  }

  bindEvent() {
    const { ul, } = this;
    ul.addEventListener('scroll', this.dealScroll);
  }

  removeEvent() {
    const { ul, } = this;
    ul.removeEventListener('scroll', this.dealScroll);
  }

  async updateView(t) {
    switch (t) {
      case 'd':
        await this.downView();
        break;
      case 'u':
        await this.upView();
        break;
    }
  }

  getDom(key) {
    const { id, doms, } = this;
    if (doms[key] === undefined) {
      doms[key] = document.getElementById(key);
    }
    return doms[key];
  }

  getHeight(dom, key) {
    const { heights, } = this;
    if (heights[key] === undefined) {
      heights[key] = dom.clientHeight;
    }
    return heights[key];
  }

  async initLast() {
    const { top, bottom, } = this.status;
    if (bottom - top > 0) {
      await this.syncInsert(0, 'd');
      this.status.last = 0;
    }
  }

  getKey(k) {
    const { id, } = this;
    return id + k;
  }

  getDomUpTop(key) {
    const dom = this.getDom(key);
    const top = dom.offsetTop;
    return top;
  }

  getDomUpBottom(key) {
    const top = this.getDomUpTop(key);
    const dom = this.getDom(key);
    const height = this.getHeight(dom, key);
    return top + height;
  }

  getDomDownBottom(key) {
    const top = this.getDomDownTop(key);
    const dom = this.getDom(key);
    const height = this.getHeight(dom, key);
    return top + height;
  }

  getDomDownTop(key) {
    const dom = this.getDom(key);
    if (dom) {
      const offsetTop = dom.offsetTop;
      const { id, } = this;
      const ul = this.getDom(id);
      const scrollTop = ul.scrollTop;
      return offsetTop - scrollTop;
    }
  }

  async downView() {
    const { last, } = this.status;
    if (last < this.data.length) {
      const top = this.getDomDownTop(this.getKey(last));
      const { status, } = this;
      if (top <= status.bottom) {
        if (last + 1 < this.data.length) {
          await this.addDownItem(last + 1);
          await this.downView();
        }
      }
    }
  }

  async addDownItem(k) {
    await this.syncInsert(k, 'd');
    if (k < this.data.length) {
      this.status.last = k;
    }
  }

  async upView() {
    const { status, } = this;
    const { first, } = status;
    if (first >= 0) {
      const bottom = this.getDomUpBottom(this.getKey(first));
      console.log('bottom', bottom);
      if (bottom >= status.top) {
        if (first - 1 >= 0) {
          await this.addUpItem(first - 1);
          this.upView();
        }
      }
    }
  }

  async addUpItem(k) {
    await this.syncInsert(k, 'u');
    if (k >= 0) {
      this.status.first = k;
    }
  }

  async syncRemove(t) {
    switch (t) {
      case 'u': {
        const { status, } = this;
        const k = status.last;
        if (k < this.data.length) {
          const top = this.getDomUpTop(this.getKey(k));
          const { id, ul, } = this;
          if (top >= this.status.scrollTop + this.getHeight(ul, id)) {
            const dom = this.getDom(this.getKey(k));
            dom.remove();
            this.doms[this.getKey(k)] = undefined;
            this.status.last = k - 1;
          }
        }
        break;
      }
      case 'd': {
        const { status, } = this;
        const k = status.first;
        if (k >= 0) {
          const bottom = this.getDomDownBottom(this.getKey(k));
          if (bottom < -4) {
            const dom = this.getDom(this.getKey(k));
            dom.remove();
            this.doms[this.getKey(k)] = undefined;
            this.status.first = k + 1;
          }
        }
        break;
      }
    }
  }
}

export default RegionListOffline;
