import Flickr from '../src/Flickr'

// describe('blah', () => {
//   it('works', () => {
//     FetchProxy.get('www.google.com');
//     const flickr = new Flickr('2a03dd37dabb2c41b6dc45866141593e');
//     flickr.searchByName('car');
//   });
// });

const flickr = new Flickr('2a03dd37dabb2c41b6dc45866141593e');
flickr.searchByName('car');
