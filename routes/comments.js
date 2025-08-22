const express = require('express');
const router = express.Router();

/* XSS Vulnerability Demo Route
 * WARNING: This route intentionally contains XSS vulnerabilities for educational purposes
 * DO NOT use this pattern in production code
 */

// Vulnerable comment display endpoint - stores comments in memory (for demo purposes)
let comments = [];

// GET /comments - Display comments page with form and existing comments
router.get('/', function(req, res, next) {
  res.render('comments', { 
    title: 'Comments - XSS Demo',
    comments: comments,
    message: req.query.message || ''
  });
});

// POST /comments - Accept new comment (vulnerable to XSS)
router.post('/', function(req, res, next) {
  const comment = req.body.comment;
  const author = req.body.author || 'Anonymous';
  
  if (comment) {
    // VULNERABILITY: Direct storage without sanitization
    comments.push({
      author: author,
      text: comment,
      timestamp: new Date().toLocaleString()
    });
  }
  
  // Redirect back to comments page with success message
  res.redirect('/comments?message=Comment added successfully!');
});

// GET /comments/search - Search comments (another XSS vector)
router.get('/search', function(req, res, next) {
  const searchTerm = req.query.q || '';
  
  // VULNERABILITY: Direct rendering of search term without escaping
  let filteredComments = comments;
  if (searchTerm) {
    filteredComments = comments.filter(comment => 
      comment.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.author.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  
  res.render('comments', { 
    title: 'Comments Search Results',
    comments: filteredComments,
    searchTerm: searchTerm, // VULNERABLE: Unescaped search term
    message: `Found ${filteredComments.length} comments matching "${searchTerm}"`
  });
});

module.exports = router;
