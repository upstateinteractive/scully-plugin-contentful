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
  try {
    const contentfulClientOptions = {
      space: conf.config.spaceId,
      accessToken: conf.config.accessToken
    };
    const client = contentful.createClient(contentfulClientOptions);

    const entries: any = await client.getEntries({
      content_type: conf.config.contentType
    })

    return entries.map(e => ({
      route: `article/${e.sys.id}`,
      type: 'contentful',
      ...e.fields
    }))
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
};

const validator = async conf => [];
export const Contentful = 'contentful';
registerPlugin('router', Contentful, contentfulRoutePlugin, validator);
