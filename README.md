Multiplayer.js
==============

Multiplayer allows one to interact with different videos players in a unique way.

Example
-------

This code will create a youtube player, and play the video when the player is ready.

```html
<div class="my-player"></div>
```

```js
var multiplayer = require( 'multiplayer' );

multiplayer( 'http://www.youtube.com/watch?v=gus0b8Z-Ez8', {
	id: 'my-player',
	width: 800,
	height: 600
}).then( function( player ) {
	player.play( );
}, function( error ) {
	alert( error );
});
```
