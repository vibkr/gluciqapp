# GluciQ Logging System

## Overview

The GluciQ logging system provides comprehensive, configurable logging for the diabetes management app. It supports multiple log levels, environment-based configuration, and context-specific loggers for different modules.

## Configuration

Add these environment variables to your `.env.local` file:

```env
# Log levels: TRACE, DEBUG, INFO, WARN, ERROR, FATAL, OFF
EXPO_PUBLIC_LOG_LEVEL=DEBUG

# Console logging (default: true)
EXPO_PUBLIC_ENABLE_CONSOLE_LOGGING=true

# File logging (default: false - enable for debugging)
EXPO_PUBLIC_ENABLE_FILE_LOGGING=false

# Maximum log entries to store in memory (default: 1000)
EXPO_PUBLIC_MAX_LOG_ENTRIES=1000

# Include timestamps in logs (default: true)
EXPO_PUBLIC_INCLUDE_TIMESTAMP=true

# Include stack traces for errors (default: true in development)
EXPO_PUBLIC_INCLUDE_STACK_TRACE=true
```

## Usage

### Basic Logging

```typescript
import { logger } from '@/src/lib/utils/logger';

logger.debug('Debug message');
logger.info('Information message');
logger.warn('Warning message');
logger.error('Error message', new Error('Something went wrong'));
```

### Context-Specific Loggers

```typescript
import { userLogger, onboardingLogger, databaseLogger } from '@/src/lib/utils/logger';

// User-related operations
userLogger.info('User profile updated');
userLogger.error('Failed to update user', error);

// Onboarding flow
onboardingLogger.debug('Starting diabetes type selection');
onboardingLogger.warn('Incomplete profile data');

// Database operations
databaseLogger.info('Syncing with Supabase');
databaseLogger.error('Database connection failed', error);
```

### Available Context Loggers

- `userLogger` - User management and profile operations
- `onboardingLogger` - Onboarding flow and setup
- `databaseLogger` - Database operations and sync
- `authLogger` - Authentication and authorization
- `apiLogger` - API calls and responses
- `uiLogger` - UI interactions and state changes

### Custom Context Logger

```typescript
import { logger } from '@/src/lib/utils/logger';

const foodLogger = logger.createContextLogger('FOOD');
foodLogger.info('Food analysis started');
foodLogger.error('Failed to analyze food image', error);
```

## Log Levels

- **TRACE** (0): Most detailed information, typically only of interest when diagnosing problems
- **DEBUG** (1): Detailed information on the flow through the system
- **INFO** (2): Interesting runtime events (startup/shutdown)
- **WARN** (3): Runtime situations that are undesirable but not necessarily wrong
- **ERROR** (4): Runtime errors or unexpected conditions
- **FATAL** (5): Very severe error events that will presumably lead the application to abort
- **OFF** (6): Disable all logging

## Best Practices

1. **Use appropriate log levels**: Debug for development, Info for production events, Error for actual problems
2. **Use context loggers**: Prefer specific loggers (userLogger, databaseLogger) over the generic logger
3. **Include error objects**: Always pass the actual Error object when logging errors
4. **Avoid logging sensitive data**: Never log passwords, tokens, or personal health information
5. **Use structured logging**: Include relevant context in log messages

## Development vs Production

- **Development**: Default log level is DEBUG, includes stack traces
- **Production**: Default log level is INFO, minimal console output
- **Testing**: Use WARN or ERROR to reduce noise

## Log Storage

- Console logs are always available in development
- File logging can be enabled for debugging (stores in memory)
- Logs are automatically rotated when max entries limit is reached
- Use `logger.getLogEntries()` to retrieve stored logs
- Use `logger.clearLogs()` to clear stored logs

## Error Handling

The logging system is designed to never throw errors. If logging fails, it will silently continue without affecting the application flow.

## Performance

- Logging is lightweight and optimized for mobile performance
- Log level filtering happens before message formatting
- File logging is optional and disabled by default in production
- Memory usage is controlled by the max entries limit 