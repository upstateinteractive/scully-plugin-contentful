# scully-plugin-contentful
> contentful plugin for [scully](https://scully.io/)

## Getting Started
```sh
# install in your existing scully project
npm i -S scully-plugin-contentful
```

```js
/**
 * scully.scully-example-contentful.config.js
 */
require('scully-plugin-contentful');
require('dotenv').config();

exports.config = {
  projectRoot: './src',
  projectName: 'scully-example-contentful',
  outDir: './dist/static',
  routes: {
    '/article/:articleId': {
      type: 'contentful',
      config: {
        spaceId: process.env.SPACE_ID,
        accessToken: process.env.ACCESS_TOKEN,
        contentType: 'article',
      }
    },
  }
};
```

[See Example Repository](https://github.com/upstateinteractive/scully-example-contentful)

## Configuration
**Required**  
| Name | Type | Description |
|---|---|---|
| spaceId | string | your contentful space id |
| accessToken | string | your contentful access token (note: this can be either production or preview key) |
| contentType | string | the contentful content type id |

**Optional**
| Name | Type | Description |
|---|---|---|
| host | string | contentful host URL. To use Preview API use `'preview.contentful.com'` |
| environment | string | your contentful environment |


## Community Support
[Scully on GitHub](https://www.scully.io)  
[Scully on Gitter](https://gitter.im/scullyio/community)  
[Upstate Interactive on Twitter](https://twitter.com/@upstateagency)