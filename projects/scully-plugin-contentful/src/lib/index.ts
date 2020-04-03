import {
  registerPlugin,
  HandledRoute,
  routeSplit
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
  const { createPath } = routeSplit(route);

  try {
    const contentfulClientOptions: any = {
      space: conf.config.spaceId,
      accessToken: conf.config.accessToken
    };

    if (conf.config.host) {
      contentfulClientOptions.host = conf.config.host;
    }

    if (conf.config.environment) {
      contentfulClientOptions.environment = conf.config.environment;
    }

    if (!conf.config.spaceId) {
      throw 'A space ID is required. Check if setting is correct.'
    }

    if (!conf.config.accessToken) {
      throw 'Authorization error. Check if setting is correct.'
    }

    if (!conf.config.contentType) {
      throw 'A content type is required. Check if setting is correct.'
    }

    const client = contentful.createClient(contentfulClientOptions);

    const entries = await client.getEntries({
      content_type: conf.config.contentType
    });

    return entries.items.map(e => ({
      route: createPath(e.sys.id),
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
        details = `Endpoint not found. Check if host and spaceId settings are correct`;
      } else if (e.response.status === 401) {
        // authorization error
        details = `Authorization error. Check if accessToken and environment are correct`;
      }
    } else if (e) {
      console.error(`Accessing your Contentful space failed.
      ${details ? `\n${details}\n` : ``}`);
    }

  }
};

const validator = ({ config }) => {
  const errors = [];

  if (!config.spaceId) {
    errors.push('A Space ID is required. You can find your Space ID in your Contentful account.')
  }

  if (!config.accessToken) {
    errors.push('An access token is required. You can find your access tokens in your Contentful account')
  }

  if (!config.contentType) {
    errors.push('A content type is required.')
  }

  return errors
};

export const Contentful = 'contentful';
registerPlugin('router', Contentful, contentfulRoutePlugin, validator);
