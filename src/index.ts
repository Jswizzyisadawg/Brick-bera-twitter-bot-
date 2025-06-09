import { Integration } from '@botpress/sdk';
import axios, { AxiosRequestConfig } from 'axios';
import OAuth from 'oauth-1.0a';
import crypto from 'crypto';

interface PostTweetInput { text: string; }
interface PostTweetOutput { success: boolean; }
interface SearchTweetsInput { query: string; }
interface SearchTweetsOutput { tweets: string[]; }
interface FollowUserInput { targetUserId: string; }
interface FollowUserOutput { success: boolean; }

interface Configuration {
  apiKey: string;
  apiSecret: string;
  accessToken: string;
  accessSecret: string;
}

export default new Integration({
  register: async () => {},
  unregister: async () => {},
  actions: {
    postTweet: async ({ input, ctx }: { input: PostTweetInput; ctx: { configuration: Configuration } }): Promise<PostTweetOutput> => {
      const { text } = input;
      const { apiKey, apiSecret, accessToken, accessSecret } = ctx.configuration;

      const oauth = new OAuth({
        consumer: { key: apiKey, secret: apiSecret },
        signature_method: 'HMAC-SHA1',
        hash_function(base_string: string, key: string): string {
          return crypto.createHmac('sha1', key).update(base_string).digest('base64');
        },
      });

      const token = { key: accessToken, secret: accessSecret };
      const requestData = {
        url: 'https://api.twitter.com/2/tweets',
        method: 'POST',
        data: { text },
      };

      try {
        const authHeader = oauth.toHeader(oauth.authorize(requestData, token));
        const headers: AxiosRequestConfig['headers'] = {
          ...authHeader,
          'Content-Type': 'application/json',
        };
        await axios.post(requestData.url, requestData.data, { headers });
        return { success: true };
      } catch (error) {
        console.error('Tweet failed:', error);
        return { success: false };
      }
    },
    searchTweets: async ({ input, ctx }: { input: SearchTweetsInput; ctx: { configuration: Configuration } }): Promise<SearchTweetsOutput> => {
      const { query } = input;
      const { apiKey, apiSecret, accessToken, accessSecret } = ctx.configuration;

      const oauth = new OAuth({
        consumer: { key: apiKey, secret: apiSecret },
        signature_method: 'HMAC-SHA1',
        hash_function(base_string: string, key: string): string {
          return crypto.createHmac('sha1', key).update(base_string).digest('base64');
        },
      });

      const token = { key: accessToken, secret: accessSecret };
      const requestData = {
        url: `https://api.twitter.com/2/tweets/search/recent?query=${encodeURIComponent(query)}&max_results=10`,
        method: 'GET',
      };

      try {
        const authHeader = oauth.toHeader(oauth.authorize(requestData, token));
        const headers: AxiosRequestConfig['headers'] = {
          ...authHeader,
        };
        const response = await axios.get(requestData.url, { headers });
        const data = response.data.data || [];
        const tweets = data.map((tweet: any) => tweet.text);
        return { tweets };
      } catch (error) {
        console.error('Search failed:', error);
        return { tweets: [] };
      }
    },
    followUser: async ({ input, ctx }: { input: FollowUserInput; ctx: { configuration: Configuration } }): Promise<FollowUserOutput> => {
      const { targetUserId } = input;
      const { apiKey, apiSecret, accessToken, accessSecret } = ctx.configuration;

      const oauth = new OAuth({
        consumer: { key: apiKey, secret: apiSecret },
        signature_method: 'HMAC-SHA1',
        hash_function(base_string: string, key: string): string {
          return crypto.createHmac('sha1', key).update(base_string).digest('base64');
        },
      });

      const token = { key: accessToken, secret: accessSecret };
      const userId = 'YOUR_USER_ID'; // Replace with Brick’s Twitter user ID
      const requestData = {
        url: `https://api.twitter.com/2/users/${userId}/following`,
        method: 'POST',
        data: { target_user_id: targetUserId },
      };

      try {
        const authHeader = oauth.toHeader(oauth.authorize(requestData, token));
        const headers: AxiosRequestConfig['headers'] = {
          ...authHeader,
          'Content-Type': 'application/json',
        };
        await axios.post(requestData.url, requestData.data, { headers });
        return { success: true };
      } catch (error) {
        console.error('Follow failed:', error);
        return { success: false };
      }
    }
  },
  channels: {},
  handler: async () => {}
});