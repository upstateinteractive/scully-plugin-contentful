import {
  registerPlugin,
  HandledRoute,
} from '@scullyio/scully';

export const contentfulRoutePlugin = async (route: string, conf): Promise<HandledRoute[]> => {
  return [{
    route: '/article/1',
    type: 'contentful'
  }];
};

const validator = async conf => [];
export const Contentful = 'contentful';
registerPlugin('router', Contentful, contentfulRoutePlugin, validator);
