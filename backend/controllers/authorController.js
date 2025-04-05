const Author = require("../models/author");
const asyncHandler = require("express-async-handler");
// const Book = require("../models/book");
const { body, validationResult } = require("express-validator");

// Display list of all Authors.
exports.author_list = asyncHandler(async (req, res, next) => {
  const allAuthors = await Author.find().sort({ email: 1 }).exec();
  res.render("author_list", {
    title: "Author List",
    author_list: allAuthors,
  });
});


// Display detail page for a specific Author.
exports.author_detail = asyncHandler(async (req, res, next) => {
  // Get details of author and all their books (in parallel)
  const [author, allBooksByAuthor] = await Promise.all([
    Author.findById(req.params.id).exec(),
    Book.find({ author: req.params.id }, "title summary").exec(),
  ]);

  if (author === null) {
    // No results.
    const err = new Error("Author not found");
    err.status = 404;
    return next(err);
  }

  res.render("author_detail", {
    title: "Author Detail",
    author: author,
    author_books: allBooksByAuthor,
  });
});


// Display Author create form on GET.
exports.author_create_get = (req, res, next) => {
  res.render("author_form", { title: "Create Author" });
};


// Handle Author create on POST.
exports.author_create_post = [
  // Validate and sanitize fields.
  body("name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Name must be specified.")
    .isAlphanumeric("en-US", { ignore: " " })
    .withMessage("Name has non-alphanumeric characters."),
  body("email")
    .trim()
    .isEmail()
    .escape()
    .withMessage("A valid email must be specified."),
  body("summary")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Summary must be specified."),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    // Create Author object with escaped and trimmed data.
    const author = new Author({
      name: req.body.name,
      email: req.body.email,
      summary: req.body.summary,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/errors messages.
      res.status(400).json({ errors: errors.array() });
      return;
    }

    // Save author to the database.
    await author.save();
    res.status(201).json({ message: "Author created successfully", author });
  }),
];

// Display Author delete form on GET.
exports.author_delete_get = asyncHandler(async (req, res, next) => {
  // Get details of author and all their books (in parallel)
  const [author, allBooksByAuthor] = await Promise.all([
    Author.findById(req.params.id).exec(),
    Book.find({ author: req.params.id }, "title summary").exec(),
  ]);

  if (author === null) {
    // No results.
    res.redirect("/catalog/authors");
  }

  res.render("author_delete", {
    title: "Delete Author",
    author: author,
    author_books: allBooksByAuthor,
  });
});


// Handle Author delete on POST.
exports.author_delete_post = asyncHandler(async (req, res, next) => {
  // Get details of author and all their books (in parallel)
  const [author, allBooksByAuthor] = await Promise.all([
    Author.findById(req.params.id).exec(),
    Book.find({ author: req.params.id }, "title summary").exec(),
  ]);

  if (allBooksByAuthor.length > 0) {
    // Author has books. Render in same way as for GET route.
    res.render("author_delete", {
      title: "Delete Author",
      author: author,
      author_books: allBooksByAuthor,
    });
    return;
  } else {
    // Author has no books. Delete object and redirect to the list of authors.
    await Author.findByIdAndDelete(req.body.authorid);
    res.redirect("/catalog/authors");
  }
});


// Display Author update form on GET.
exports.author_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Author update GET");
});

// Handle Author update on POST.
exports.author_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Author update POST");
});

// Update the summary of an existing author by email
exports.author_update_summary = [
  // Validate and sanitize the summary and email fields.
  body("email")
    .trim()
    .isEmail()
    .escape()
    .withMessage("A valid email must be specified."),
  body("summary")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Summary must be specified."),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // There are errors. Return validation errors.
      res.status(400).json({ errors: errors.array() });
      return;
    }

    // Find the author by email and update the summary.
    const updatedAuthor = await Author.findOneAndUpdate(
      { email: req.body.email }, // Find by email
      { summary: req.body.summary }, // Update the summary field
      { new: true } // Return the updated document
    );

    if (!updatedAuthor) {
      // If the author is not found, return a 404 error.
      res.status(404).json({ message: "Author not found with the provided email" });
      return;
    }

    res.status(200).json({ message: "Summary updated successfully", updatedAuthor });
  }),
];
