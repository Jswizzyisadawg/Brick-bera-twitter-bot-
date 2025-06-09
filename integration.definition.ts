import { IntegrationDefinition, z } from '@botpress/sdk';

export default new IntegrationDefinition({
  name: 'x-integration',
  version: '0.1.0',
  description: "Brick's X API for $bera hype",
  configuration: {
    schema: z.object({
      apiKey: z.string().describe('API Key'),
      apiSecret: z.string().describe('API Secret'),
      accessToken: z.string().describe('Access Token'),
      accessSecret: z.string().describe('Access Secret')
    })
  },
  actions: {
    postTweet: {
      input: {
        schema: z.object({
          text: z.string().describe('Tweet Text')
        })
      },
      output: {
        schema: z.object({
          success: z.boolean().describe('Success')
        })
      }
    },
    searchTweets: {
      input: {
        schema: z.object({
          query: z.string().describe('Search Query')
        })
      },
      output: {
        schema: z.object({
          tweets: z.array(z.string()).describe('Tweets')
        })
      }
    },
    followUser: {
      input: {
        schema: z.object({
          targetUserId: z.string().describe('Target User ID to Follow')
        })
      },
      output: {
        schema: z.object({
          success: z.boolean().describe('Success')
        })
      }
    }
  }
});