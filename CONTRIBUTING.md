# Contributing to Flight Booking System

Thank you for your interest in contributing! 🎉

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in [Issues](../../issues)
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots (if applicable)
   - Your environment (OS, Node version, Oracle version)

### Suggesting Features

1. Check [Issues](../../issues) to see if it's already suggested
2. Create a new issue with:
   - Clear feature description
   - Use case / benefit
   - Proposed implementation (optional)

### Pull Requests

1. **Fork the repository**
   ```bash
   git clone https://github.com/YOUR-USERNAME/flight-booking-system.git
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Write clean, readable code
   - Follow the existing code style
   - Add comments for complex logic
   - Update documentation if needed

4. **Test your changes**
   ```bash
   cd backend
   npm test
   ```

5. **Commit your changes**
   ```bash
   git add .
   git commit -m "Add: your feature description"
   ```

   Use these commit prefixes:
   - `Add:` - New feature
   - `Fix:` - Bug fix
   - `Update:` - Update existing feature
   - `Refactor:` - Code refactoring
   - `Docs:` - Documentation changes
   - `Test:` - Adding tests

6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Open a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your branch
   - Fill in the PR template

### Code Style

- Use 2 spaces for indentation
- Use semicolons
- Use single quotes for strings
- Add JSDoc comments for functions
- Keep lines under 100 characters when possible

Example:
```javascript
/**
 * Create a new booking
 * @param {Object} bookingData - Booking information
 * @returns {Promise<Object>} Created booking
 */
async function createBooking(bookingData) {
  // Implementation
}
```

### Database Changes

If your PR includes database schema changes:
1. Update `schema.sql`
2. Update `sample-data.sql` if needed
3. Document the changes in your PR description
4. Test with a fresh database setup

### Testing

- Add tests for new features
- Ensure all existing tests pass
- Test manually in the browser
- Test with sample data

### Documentation

Update documentation if you:
- Add new API endpoints
- Change existing functionality
- Add configuration options
- Modify database schema

## Code of Conduct

- Be respectful and constructive
- Welcome newcomers
- Focus on what is best for the project
- Show empathy towards others

## Questions?

Feel free to ask questions in:
- GitHub Issues
- Pull Request comments
- Discussions tab

Thank you for contributing! 🚀
