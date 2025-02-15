import type { Meta, StoryObj } from '@storybook/react';

import { Controls } from './Controls';
import * as ExampleStories from '../examples/ControlsParameters.stories';

const meta: Meta<typeof Controls> = {
  component: Controls,
  parameters: {
    relativeCsfPaths: ['../examples/ControlsParameters.stories'],
  },
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const OfStory: Story = {
  args: {
    of: ExampleStories.NoParameters,
  },
};

// NOTE: this will throw with no of prop
export const OfStoryUnattached: Story = {
  parameters: { attached: false },
  args: {
    of: ExampleStories.NoParameters,
  },
};

export const IncludeProp: Story = {
  args: {
    of: ExampleStories.NoParameters,
    include: ['a'],
  },
};

export const IncludeParameter: Story = {
  args: {
    of: ExampleStories.Include,
  },
};

export const ExcludeProp: Story = {
  args: {
    of: ExampleStories.NoParameters,
    exclude: ['a'],
  },
};

export const ExcludeParameter: Story = {
  args: {
    of: ExampleStories.Exclude,
  },
};

export const SortProp: Story = {
  args: {
    of: ExampleStories.NoParameters,
    sort: 'alpha',
  },
};

export const SortParameter: Story = {
  args: {
    of: ExampleStories.Sort,
  },
};
