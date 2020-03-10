import {
  registerPlugin,
  HandledRoute,
} from '@scullyio/scully';
import * as contentful from 'contentful';

export interface ScullyContentfulOptions {
  spaceId: string;
  accessToken: string;
  contentType: string;
  environment?: string;
  host?: string;
}

export const contentfulRoutePlugin = async (route: string, conf): Promise<HandledRoute[]> => {
  try {
    const contentfulClientOptions = {
      space: conf.config.spaceId,
      accessToken: conf.config.accessToken,
      host: null,
      environment: null
    };

    if (conf.config.host) {
      contentfulClientOptions.host = conf.config.host;
    }

    if (conf.config.environment) {
      contentfulClientOptions.environment = conf.config.environment;
    }

    const client = contentful.createClient(contentfulClientOptions);

    const entries = await client.getEntries({
      content_type: conf.config.contentType
    });

    return entries.items.map(e => ({
      route: `/article/${e.sys.id}`,
      type: 'contentful',
      data: e.fields
    }));
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
