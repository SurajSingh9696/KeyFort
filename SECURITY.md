# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability, please send an email to security@example.com. Do not open a public issue.

We take security seriously and will respond within 48 hours.

## Security Measures

### Data Protection
- All passwords are encrypted client-side using AES-256
- Master passwords are hashed with bcrypt (12 salt rounds)
- No plaintext passwords are stored in the database
- Sessions use HTTP-only cookies

### Authentication
- JWT-based authentication via NextAuth.js
- OAuth support (Google)
- CSRF protection enabled
- Rate limiting planned for authentication endpoints

### Database Security
- Parameterized queries via Prisma ORM
- SQL injection protection
- Regular backups recommended
- Row-level security policies recommended

### Best Practices
1. **Master Password**
   - Use a strong, unique master password
   - Never share your master password
   - Change it regularly (every 90 days recommended)

2. **2FA** (Coming Soon)
   - Enable two-factor authentication
   - Use authenticator apps (not SMS)

3. **Activity Monitoring**
   - Review activity log regularly
   - Report suspicious activity immediately

4. **Regular Updates**
   - Keep dependencies updated
   - Apply security patches promptly

## Vulnerability Disclosure Timeline

1. **Day 0**: Vulnerability reported
2. **Day 2**: Response sent to reporter
3. **Day 7**: Fix developed and tested
4. **Day 14**: Patch released
5. **Day 30**: Public disclosure (if appropriate)

## Security Checklist for Deployment

- [ ] Change all default credentials
- [ ] Use strong NEXTAUTH_SECRET (32+ characters)
- [ ] Enable HTTPS in production
- [ ] Set secure cookie flags
- [ ] Configure CORS properly
- [ ] Enable rate limiting
- [ ] Set up database backups
- [ ] Configure logging and monitoring
- [ ] Review and restrict API access
- [ ] Implement CSP headers

## Contact

For security concerns: security@example.com
For general issues: issues on GitHub
