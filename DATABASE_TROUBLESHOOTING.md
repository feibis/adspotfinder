# Database Connection Troubleshooting

## ETIMEDOUT Error

The `ETIMEDOUT` error occurs when the database connection times out. Here's how to fix it:

### Quick Diagnosis
```bash
# Test your database connection
bun run db:test-connection
```

### Common Causes & Solutions

#### 1. Database Server Not Running
**Symptoms:** Connection timeout, can't reach database
**Solutions:**
```bash
# If using Docker
docker ps  # Check if database container is running
docker start your-db-container

# If using local database (PostgreSQL/MySQL)
sudo service postgresql start  # or mysql
# or
brew services start postgresql  # on macOS
```

#### 2. Wrong DATABASE_URL
**Symptoms:** Connection fails immediately
**Check:**
- Verify `.env` file exists in project root
- Check DATABASE_URL format:
  ```
  # PostgreSQL
  DATABASE_URL="postgresql://username:password@localhost:5432/database_name"

  # MySQL
  DATABASE_URL="mysql://username:password@localhost:3306/database_name"

  # SQLite (local development)
  DATABASE_URL="file:./dev.db"
  ```

#### 3. Database Needs Migration
**Symptoms:** Tables don't exist
**Solution:**
```bash
# Apply pending migrations
bun x prisma migrate deploy

# Or push schema to database
bun x prisma db push
```

#### 4. Connection Pool Exhausted
**Symptoms:** Works sometimes, fails with high load
**Solution:**
- Restart database service
- Check connection pool settings
- Close hanging connections

#### 5. Firewall/Network Issues
**Symptoms:** Can't connect from specific machines
**Check:**
- Firewall blocking port
- VPN interfering
- Network restrictions

## Testing Commands

```bash
# Test basic connection
bun run db:test-connection

# Generate Prisma client
bun x prisma generate

# Push schema to database
bun x prisma db push

# View database in browser
bun x prisma studio

# Reset everything (WARNING: deletes data)
bun run db:reset
```

## Environment-Specific Issues

### Development
- Use SQLite for simplicity: `DATABASE_URL="file:./dev.db"`
- Or local PostgreSQL/MySQL

### Production
- Use connection pooling (e.g., PgBouncer for PostgreSQL)
- Set appropriate timeouts
- Use environment variables, not hardcoded URLs

### Docker
```yaml
# docker-compose.yml
services:
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: myapp
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
```

## Connection String Examples

### PostgreSQL
```
DATABASE_URL="postgresql://user:password@localhost:5432/myapp?schema=public"
```

### MySQL
```
DATABASE_URL="mysql://user:password@localhost:3306/myapp"
```

### SQLite
```
DATABASE_URL="file:./dev.db"
```

### With SSL
```
DATABASE_URL="postgresql://user:password@host:5432/db?sslmode=require"
```

## Performance Tips

1. **Use connection pooling** in production
2. **Set appropriate timeouts** (connect_timeout, command_timeout)
3. **Use prepared statements** for repeated queries
4. **Close connections** when done
5. **Monitor connection count** and usage

## Getting Help

If issues persist:
1. Check Prisma logs: `DEBUG=* bun run your-command`
2. Test with a simple query
3. Verify database server logs
4. Check network connectivity: `ping your-db-host`
