## Hubber Memory Game

The classic memory game, with your favorite hubbers

[![](http://i.imgur.com/KLl5oEO.jpg)](https://alysonla.github.io/hubber-memory-game/)

## Resources

Tutorial using [HTML5 Games development by Example: Beginners Guide](http://www.amazon.com/gp/product/B005KRUHXI/ref=kinw_myk_ro_title#).

Hosted using [GitHub Pages](https://pages.github.com/).

## Contributing

- Fork the repository.
- Create a branch (e.g. `my-awesome-feature`) for the work you’re going to do.
- Make your awesome changes in your topic branch.
- Send a pull request from your branch to this repository.

### Running locally

Just open the index.html file in a browser. No frameworks needed. :grin:

### Rebuilding the GitHubbers list

The [`js/Hubbers.js`](/js/Hubbers.js) file contains a list with all the public members in the [GitHub](https://github.com/github) organization.
It contains minimal information which is needed and used when the public API request rate limit exceeds.

This file is updated automatically using the [`build.js`](/build.js) script and a [token](https://github.com/settings/tokens):

```sh
$ npm i
$ node build.js <token>
```
