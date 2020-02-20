import {
  registerPlugin,
  HandledRoute,
  configValidator,
  httpGetJson,
  routeSplit,
} from '@scullyio/scully';
import { scullyConfig } from '@scullyio/scully/utils/config';
import * as contentful from 'contentful';

// TODO: What to do about handling "HandledRoute" type?
export const contentfulRoutePlugin = async (route: string, conf): Promise<HandledRoute[]> => {
  console.dir(route);
  console.dir(conf);
  const space = 'ffdlnke80456';
  const accessToken = 'ddIqmAi-jlQc764wVeAB-flgIkjUu5PSVUTkX_HtRnU';
  const host = 'https://cdn.contentful.com';
  const environment = 'master';
  const proxy = null;
  try {
    // const contentfulClientOptions = {
    //   space: conf.config.spaceId,
    //   accessToken: conf.config.accessToken,
    //   host: conf.config.host,
    //   environment: conf.config.environment,
    //   proxy: conf.config.proxy
    // };
    const contentfulClientOptions = {
      space,
      accessToken,
      host,
      environment,
      proxy
    };
    const client = contentful.createClient(contentfulClientOptions);
    const contentfulSpace = await client.getSpace();
    return [{
      route: '',
      type: 'contentful'
    }];
  } catch (e) {
    let details;
    if (e.code === `ENOTFOUND`) {
      details = `You seem to be offline`
    } else if (e.code === `SELF_SIGNED_CERT_IN_CHAIN`) {
      console.error(
        // tslint:disable-next-line:max-line-length
        `We couldn't make a secure connection to your contentful space. Please check if you have any self-signed SSL certificates installed.`
      );
    } else if (e.response) {
      if (e.response.status === 404) {
        // host and space used to generate url
        details = `Endpoint not found. Check if
          host
        and spaceId settings are correct`;
      } else if (e.response.status === 401) {
        // authorization error
        details = `Authorization error. Check if
          accessToken
        and environment are correct`;
      }
    }
    console.error(`Accessing your Contentful space failed.
    Try setting GATSBY_CONTENTFUL_OFFLINE=true to see if we can serve from cache.
    ${details ? `\n${details}\n` : ``}`);
  }
  return [{
    route: '',
    type: 'contentful'
  }];
};

const validator = async conf => [];
export const Contentful = 'contentful';
registerPlugin('router', Contentful, contentfulRoutePlugin, validator);
