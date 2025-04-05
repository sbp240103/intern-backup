const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const AuthorSchema = new Schema({
  
  name: { type: String, required: true, maxLength: 100},
  email: { type: String, required: true}, // Added email field
  
  summary: { type: String, required: true }
});

// Virtual for author's full name

// Virtual for author's URL
AuthorSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/catalog/author/${this._id}`;
});

// Export model
module.exports = mongoose.model("Author", AuthorSchema);
