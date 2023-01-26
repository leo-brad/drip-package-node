import React from 'react';
import SegmentSuccess from '~/render/script/component/SegmentSuccess';
import SegmentFail from '~/render/script/component/SegmentFail';

class Segment extends React.Component {
 render() {
    const { string='', serial=1, situation, } = this.props;
    let ans;
    switch (situation) {
      case 'stdout':
        ans = <SegmentSuccess serial={serial} content={string} />
        break;
      case 'stderr':
        ans = <SegmentFail serial={serial} content={string} />
        break;
    }
    return ans;
  }
}

export default Segment;
