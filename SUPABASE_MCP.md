# Supabase MCP Server for Claude Code

This project is configured with Supabase's official MCP (Model Context Protocol) server, enabling AI-friendly database operations directly through Claude Code.

## 🚀 Quick Setup

### 1. Get Your Credentials
From your Supabase dashboard:
- **Project Reference ID**: Project Settings > General > Reference ID
- **Access Token**: Account > Access Tokens > Create new token

### 2. Configure MCP Server
Run the setup script:
```bash
./scripts/setup-supabase-mcp.sh
```

Or manually update `.mcp.json` and `.env.local` with your credentials.

### 3. Restart Claude Code
After configuration, restart Claude Code to load the MCP server.

## 🛠️ Available MCP Tools

Once configured, Claude Code will have access to tools prefixed with `mcp__supabase__`:

### Database Schema Operations
- `mcp__supabase__list_tables` - List all tables in your database
- `mcp__supabase__describe_table` - Get table schema and column information
- `mcp__supabase__list_columns` - List columns for a specific table

### Data Operations
- `mcp__supabase__query_database` - Execute SELECT queries
- `mcp__supabase__insert_data` - Insert new records
- `mcp__supabase__update_data` - Update existing records
- `mcp__supabase__delete_data` - Delete records

### Advanced Operations
- `mcp__supabase__create_table` - Create new tables
- `mcp__supabase__alter_table` - Modify table structure
- `mcp__supabase__create_index` - Create database indexes
- `mcp__supabase__manage_rls` - Row Level Security operations

## 🔧 Configuration Files

### `.mcp.json` (Project MCP Configuration)
```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server-supabase",
        "--read-only",
        "--project-ref=YOUR_PROJECT_REF"
      ],
      "env": {
        "SUPABASE_ACCESS_TOKEN": "YOUR_ACCESS_TOKEN"
      }
    }
  }
}
```

### Environment Variables
Add to `.env.local`:
```bash
SUPABASE_ACCESS_TOKEN=your_supabase_access_token_here
```

## 🔒 Security Notes

- The MCP server is configured in `--read-only` mode by default
- Remove `--read-only` flag if you need write operations
- Access tokens should be kept secure and not committed to version control
- Use Row Level Security (RLS) policies for additional protection

## 💡 Usage Examples

### With Claude Code AI
Once the MCP server is active, you can ask Claude Code to:

- "Show me all tables in my database"
- "Create a users table with email and created_at columns"
- "Query the last 10 users from the users table"
- "Set up RLS policies for the posts table"
- "Create an index on the users.email column"

### Available Commands
- List available tools: Ask Claude to "show me all available Supabase MCP tools"
- Database exploration: "What tables exist in my database and what's their structure?"
- Data operations: "Insert a new user with email 'test@example.com'"

## 🐛 Troubleshooting

### MCP Server Not Loading
1. Check that `.mcp.json` is in your project root
2. Verify credentials in `.mcp.json` are correct
3. Restart Claude Code after making changes
4. Check Claude Code logs for MCP connection errors

### Permission Errors
1. Ensure your access token has the required permissions
2. Check your Supabase project's API settings
3. Verify RLS policies aren't blocking operations

### Connection Issues
1. Verify your Supabase project is active
2. Check your internet connection
3. Ensure the project reference ID is correct

## 📚 Resources

- [Supabase MCP Documentation](https://supabase.com/docs/guides/getting-started/mcp)
- [Claude Code MCP Guide](https://docs.anthropic.com/claude/docs/mcp)
- [Supabase Dashboard](https://supabase.com/dashboard)

## 🚀 Future Enhancements

The setup scripts in this project can be extended to:
- Automatically create and configure database schemas
- Set up authentication tables and policies
- Generate API routes based on database schema
- Create TypeScript types from database structure