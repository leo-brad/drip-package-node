import React from 'react';
import OfflineResize from '~/render/script/component/OfflineResize';
import renderToNode from '~/render/script/lib/renderToNode';

class RegionListOffline extends OfflineResize {
  constructor(props) {
    super(props);
    this.data = [];

    const id = new Date().getTime().toString();
    this.id = id;

    this.doms = [];
    this.heights = [];
    this.dealScroll = this.dealScroll.bind(this);
  }

  async dealScroll(e) {
    const {
      status: {
        scrollTop,
      },
      id,
      ul,
    } = this;
    if (ul.scrollTop > scrollTop) {
      this.type = 1;
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
      this.type = 0;
      await this.updateView('u');
      if (last < this.data.length) {
        await this.syncRemove('u');
      }
    }
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, 1000 / 29);
    });
    let diffScroll = this.status.scrollTop - ul.scrollTop;
    while (true) {
      if (Math.abs(diffScroll) <= 45) {
        if (Math.abs(diffScroll) > 0) {
          ul.scrollIntoView(this.status.scrollTop + diffScroll);
        }
        break;
      } else {
        diffScroll = diffScroll / 2;
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
    if (ul) {
      ul.removeEventListener('scroll', this.dealScroll);
    }
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

  getHeight(key, dom) {
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
    if (dom) {
      const { ul, } = this;
      const height = this.getHeight(key, ul);
      return dom.offsetTop - height;
    }
  }

  getDomUpBottom(key) {
    const top = this.getDomUpTop(key);
    const dom = this.getDom(key);
    const { ul, } = this;
    const height = this.getHeight(key, ul);
    return top + height;
  }

  getDomDownBottom(key) {
    const top = this.getDomDownTop(key);
    const dom = this.getDom(key);
    const height = this.getHeight(key, dom);
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
    let count = 0;
    if (first >= 0) {
      const bottom = this.getDomUpBottom(this.getKey(first));
      if (bottom >= status.top) {
        if (first - 1 >= 0) {
          count += 1;
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
          if (top >= this.getHeight(id, ul)) {
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
          if (bottom < status.top - 4) {
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
