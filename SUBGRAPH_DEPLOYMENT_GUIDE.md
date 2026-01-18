# Subgraph Deployment Guide

This guide walks you through deploying the Zali Trivia Game subgraph to The Graph Network.

## Prerequisites

1. **Node.js**: Version 16 or higher
2. **The Graph CLI**: `npm install -g @graphprotocol/graph-cli`
3. **The Graph Studio Account**: Sign up at [thegraph.com/studio](https://thegraph.com/studio/)
4. **Base Mainnet RPC**: Ensure you have access to Base RPC endpoint

## Step 1: Install Dependencies

```bash
cd subgraph
npm install
```

## Step 2: Create Subgraph on The Graph Studio

1. Visit [The Graph Studio](https://thegraph.com/studio/)
2. Connect your wallet
3. Click "Create a Subgraph"
4. Name it: "Zali Trivia Game" or "zali-trivia"
5. Select network: "Base"
6. Copy your **Deploy Key** and **Subgraph Slug**

## Step 3: Authenticate

```bash
graph auth --studio <YOUR_DEPLOY_KEY>
```

## Step 4: Generate Code

Generate TypeScript types from the GraphQL schema:

```bash
npm run codegen
```

This creates the `generated/` directory with types.

## Step 5: Build the Subgraph

```bash
npm run build
```

This compiles the subgraph to WebAssembly.

## Step 6: Deploy to The Graph Studio

```bash
npm run deploy
```

Or use the full command:

```bash
graph deploy --studio zali-trivia
```

Enter a version label when prompted (e.g., `v1.0.0`, `v1.0.1`, etc.)

## Step 7: Publish to The Graph Network (Optional)

After testing in Studio:

1. Go to your subgraph in The Graph Studio
2. Click "Publish"
3. Pay the publication fee in GRT
4. Your subgraph will be indexed on the decentralized network

## Step 8: Update Frontend Configuration

After deployment, you'll receive a query URL:

```
https://api.studio.thegraph.com/query/<YOUR_ID>/zali-trivia/<VERSION>
```

Update the frontend environment variable:

```bash
# frontend/.env.local
NEXT_PUBLIC_SUBGRAPH_URL=https://api.studio.thegraph.com/query/<YOUR_ID>/zali-trivia/v1.0.0
```

## Step 9: Install Frontend Dependencies

```bash
cd ../frontend
npm install @apollo/client graphql
```

## Step 10: Integrate Subgraph Provider

Update `frontend/src/app/layout.tsx`:

```typescript
import { SubgraphProvider } from '@/providers/SubgraphProvider';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SubgraphProvider>
          {/* Other providers */}
          {children}
        </SubgraphProvider>
      </body>
    </html>
  );
}
```

## Step 11: Switch Leaderboard to Subgraph

Replace the leaderboard page content with the subgraph version:

```bash
# Backup old page
mv frontend/src/app/leaderboard/page.tsx frontend/src/app/leaderboard/page.old.tsx

# Use subgraph page
mv frontend/src/app/leaderboard/subgraph-page.tsx frontend/src/app/leaderboard/page.tsx
```

## Verification

### Check Subgraph Status

Visit The Graph Studio dashboard to monitor:
- Indexing progress
- Sync status
- Query count
- Error logs

### Test Queries

Use The Graph Studio Playground to test queries:

```graphql
{
  players(first: 5, orderBy: totalScore, orderDirection: desc) {
    address
    totalScore
    correctAnswers
  }
}
```

### Monitor Frontend

1. Run frontend: `npm run dev`
2. Navigate to `/leaderboard`
3. Check browser console for errors
4. Verify data loads correctly
5. Test real-time updates (data should refresh every 30s)

## Troubleshooting

### Subgraph Not Syncing

- Check if contract address is correct in `subgraph.yaml`
- Verify start block is not too old
- Check The Graph Studio logs for errors

### Frontend GraphQL Errors

- Verify `NEXT_PUBLIC_SUBGRAPH_URL` is set correctly
- Check browser console for CORS errors
- Ensure Apollo Client is properly initialized

### Data Not Updating

- Check if events are being emitted on-chain
- Verify subgraph is fully synced
- Test queries in The Graph Studio Playground

### Build Errors

```bash
# Clean and rebuild
rm -rf generated/ build/
npm run codegen
npm run build
```

## Updating the Subgraph

When you make changes:

1. Update schema, mappings, or manifest
2. Run codegen: `npm run codegen`
3. Build: `npm run build`
4. Deploy with new version: `npm run deploy`
5. Update frontend with new query URL if needed

## Local Development (Optional)

To run a local Graph Node:

1. Follow [Graph Node setup guide](https://github.com/graphprotocol/graph-node)
2. Start local Graph Node with Docker
3. Create local subgraph: `npm run create-local`
4. Deploy: `npm run deploy-local`

## Performance Metrics

Expected improvements over direct blockchain queries:

| Metric | Before (RPC) | After (Subgraph) |
|--------|--------------|------------------|
| Query Time | 2-5 seconds | 50-200ms |
| RPC Calls | 10-50 per page | 1 GraphQL query |
| Data Freshness | Real-time | ~10-30s delay |
| Filtering | Limited | Full GraphQL |
| Sorting | Manual | Built-in |
| Pagination | Complex | Simple |

## Costs

- **Deployment**: Free on The Graph Studio (up to 1000 queries/day)
- **Publishing**: Requires GRT tokens (one-time fee)
- **Queries**: Free on Studio, minimal cost on mainnet network

## Support

- [The Graph Discord](https://discord.gg/graphprotocol)
- [The Graph Docs](https://thegraph.com/docs/)
- [Subgraph GitHub Issues](https://github.com/graphprotocol/graph-node/issues)

## Next Steps

After successful deployment:

1. Monitor query performance
2. Add more complex queries as needed
3. Implement caching in frontend
4. Consider adding pagination
5. Add error boundaries for better UX
6. Monitor subgraph health in The Graph Studio
