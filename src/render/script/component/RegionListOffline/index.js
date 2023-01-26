import React from 'react';
import OfflinePackage from '~/render/script/component/OfflinePackage';
import renderToNode from '~/render/script/lib/renderToNode';
import check from '~/render/script/lib/check';

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
        this.syncRemove('d');
      }
    } else if (ul.scrollTop < scrollTop) {
      const {
        status: {
          last,
        }
      } = this;
      await this.updateView('u');
      if (last < this.data.length) {
        this.syncRemove('u');
      }
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

  checkDom(key) {
    let ans = false;
    if (document.getElementById(key) !== null) {
      this.dom = document.getElementById(key);
      ans = true;
    }
    return ans;
  }

  async getDom(key) {
    const { id, doms, } = this;
    if (doms[key] === undefined) {
      await check(() => this.checkDom(key));
      doms[key] = this.dom;
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

  initLast() {
    const { top, bottom, } = this.status;
    if (bottom - top > 0) {
      this.syncInsert(0, 'd');
      this.status.last = 0;
    }
  }

  getKey(k) {
    const { id, } = this;
    return id + k;
  }

  async getDomUpTop(key) {
    const dom = await this.getDom(key);
    const top = dom.offsetTop;
    return top;
  }

  async getDomUpBottom(key) {
    const top = await this.getDomUpTop(key);
    const dom = await this.getDom(key);
    const height = this.getHeight(dom, key);
    return top + height;
  }

  async getDomDownBottom(key) {
    const top = await this.getDomDownTop(key);
    const dom = await this.getDom(key);
    const height = this.getHeight(dom, key);
    return top + height;
  }

  async getDomDownTop(key) {
    const dom = await this.getDom(key);
    if (dom) {
      const offsetTop = dom.offsetTop;
      const { id, } = this;
      const ul = await this.getDom(id);
      const scrollTop = ul.scrollTop;
      return offsetTop - scrollTop;
    }
  }

  async downView() {
    const { status, } = this;
    const { last, } = status;
    if (last < this.data.length) {
      const top = await this.getDomDownTop(this.getKey(last));
      if (top <= status.bottom) {
        if (last + 1 < this.data.length) {
          this.addDownItem(last + 1);
          this.downView();
        }
      }
    }
  }

  addDownItem(k) {
    this.syncInsert(k, 'd');
    if (k < this.data.length) {
      this.status.last = k;
    }
  }

  async upView() {
    const { status, } = this;
    const { first, } = status;
    if (first >= 0) {
      const bottom = await this.getDomUpBottom(this.getKey(first));
      if (bottom >= status.top) {
        if (first - 1 >= 0) {
          this.addUpItem(first - 1);
          this.upView();
        }
      }
    }
  }

  addUpItem(k) {
    this.syncInsert(k, 'u');
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
          const top = await this.getDomUpTop(this.getKey(k));
          const { id, ul, } = this;
          if (top >= this.status.scrollTop + this.getHeight(ul, id)) {
            const dom = await this.getDom(this.getKey(k));
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
          const bottom = await this.getDomDownBottom(this.getKey(k));
          if (this.status.scrollTop >= bottom) {
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
