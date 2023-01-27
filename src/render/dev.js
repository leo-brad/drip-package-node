import '~/render/style/index.css';
import ReactDOM from 'react-dom/client';
import React from 'react';
import Node from '~/render/script/component/Node';
import Emitter from '~/render/script/class/Emitter';

const data = [
  { field: 'stderr', string: 'Applications', },
  { field: 'stderr', string: 'Applications', },
  { field: 'stdout', string: 'Applications', },
  { field: 'stdout', string: 'Applications', },
  { field: 'stdout', string: 'Applications', },
  { field: 'stdout', string: 'Applications', },
  { field: 'stdout', string: 'Applications', },
  { field: 'stdout', string: 'Applications', },
  { field: 'stdout', string: 'Applications', },
  { field: 'stdout', string: 'Applications', },
];
const emitter = new Emitter();
const share = {
  focus: true,
  emitter,
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Node instance="[node]:node1" data={data} share={share} />);

setTimeout(() => {
  const instance = '[node]:node1';
  emitter.send(instance, ['window/focus']);
  data.push({ field: 'stdout', string: 'Library', });
  emitter.send(instance, ['content/update']);
  emitter.send(instance, ['mount']);
}, 0);
