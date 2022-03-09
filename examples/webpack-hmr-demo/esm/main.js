import { say } from './a';

say();

if (module.hot) {
  module.hot.accept(['./a.js'], function () {
    say();
  });
}
